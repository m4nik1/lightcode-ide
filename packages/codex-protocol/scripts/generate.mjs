import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PINNED_CODEX_VERSION = "0.140.0";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.dirname(scriptDirectory);
const generatedDirectory = path.join(packageDirectory, "src", "generated");
const versionFile = path.join(packageDirectory, "src", "version.ts");
const require = createRequire(import.meta.url);

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath, base)));
    } else if (entry.isFile()) {
      files.push(path.relative(base, entryPath));
    }
  }

  return files.sort();
}

async function normalizeGeneratedImports(directory) {
  for (const relativePath of await listFiles(directory)) {
    if (!relativePath.endsWith(".ts")) {
      continue;
    }

    const filePath = path.join(directory, relativePath);
    const source = await readFile(filePath, "utf8");
    const replacements = [];
    for (const match of source.matchAll(
      /(from\s+["'])(\.\.?\/[^"']+)(["'])/g,
    )) {
      const [fullMatch, prefix, specifier, suffix] = match;
      if (path.extname(specifier)) {
        continue;
      }

      const resolvedPath = path.resolve(path.dirname(filePath), specifier);
      const isDirectoryExport = await stat(path.join(resolvedPath, "index.ts"))
        .then(() => true)
        .catch(() => false);
      replacements.push({
        from: fullMatch,
        to: `${prefix}${specifier}${isDirectoryExport ? "/index.js" : ".js"}${suffix}`,
      });
    }

    let output = source;
    for (const replacement of replacements) {
      output = output.replace(replacement.from, replacement.to);
    }

    if (output !== source) {
      await writeFile(filePath, output);
    }
  }
}

async function resolveCodexCli() {
  const packageJsonPath = require.resolve("@openai/codex/package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

  if (packageJson.version !== PINNED_CODEX_VERSION) {
    throw new Error(
      `Expected @openai/codex ${PINNED_CODEX_VERSION}, found ${packageJson.version}.`,
    );
  }

  return path.join(path.dirname(packageJsonPath), packageJson.bin.codex);
}

async function generateInto(directory) {
  const cliPath = await resolveCodexCli();
  const result = spawnSync(
    process.execPath,
    [cliPath, "app-server", "generate-ts", "--out", directory],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  if (result.status !== 0) {
    throw new Error(
      `Codex protocol generation failed.\n${result.stdout}${result.stderr}`,
    );
  }

  await normalizeGeneratedImports(directory);
}

async function compareDirectories(expectedDirectory, actualDirectory) {
  const expectedFiles = await listFiles(expectedDirectory);
  const actualFiles = await listFiles(actualDirectory).catch(() => []);
  const differences = [];
  const allFiles = [...new Set([...expectedFiles, ...actualFiles])].sort();

  for (const relativePath of allFiles) {
    if (!expectedFiles.includes(relativePath)) {
      differences.push(`unexpected: ${relativePath}`);
      continue;
    }
    if (!actualFiles.includes(relativePath)) {
      differences.push(`missing: ${relativePath}`);
      continue;
    }

    const [expected, actual] = await Promise.all([
      readFile(path.join(expectedDirectory, relativePath)),
      readFile(path.join(actualDirectory, relativePath)),
    ]);
    if (!expected.equals(actual)) {
      differences.push(`changed: ${relativePath}`);
    }
  }

  return differences;
}

async function replaceGeneratedDirectory(stagedDirectory) {
  const backupDirectory = `${generatedDirectory}.backup`;
  await rm(backupDirectory, { recursive: true, force: true });

  const generatedExists = await stat(generatedDirectory)
    .then(() => true)
    .catch(() => false);
  if (generatedExists) {
    await rename(generatedDirectory, backupDirectory);
  }

  try {
    await rename(stagedDirectory, generatedDirectory);
    await rm(backupDirectory, { recursive: true, force: true });
  } catch (error) {
    await rm(generatedDirectory, { recursive: true, force: true });
    if (generatedExists) {
      await rename(backupDirectory, generatedDirectory);
    }
    throw error;
  }
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const temporaryRoot = await mkdtemp(
    path.join(packageDirectory, ".protocol-generate-"),
  );
  const stagedDirectory = path.join(temporaryRoot, "generated");

  try {
    await generateInto(stagedDirectory);

    if (checkOnly) {
      const differences = await compareDirectories(
        stagedDirectory,
        generatedDirectory,
      );
      const expectedVersionSource =
        `// This file is maintained by scripts/generate.mjs.\n` +
        `export const CODEX_PROTOCOL_VERSION = "${PINNED_CODEX_VERSION}" as const;\n`;
      const actualVersionSource = await readFile(versionFile, "utf8").catch(
        () => "",
      );
      if (actualVersionSource !== expectedVersionSource) {
        differences.push("changed: src/version.ts");
      }

      if (differences.length > 0) {
        process.stderr.write(
          `Generated Codex protocol is stale:\n${differences
            .slice(0, 50)
            .map((difference) => `- ${difference}`)
            .join("\n")}\n`,
        );
        process.exitCode = 1;
        return;
      }

      process.stdout.write("Generated Codex protocol is up to date.\n");
      return;
    }

    await replaceGeneratedDirectory(stagedDirectory);
    await writeFile(
      versionFile,
      `// This file is maintained by scripts/generate.mjs.\n` +
        `export const CODEX_PROTOCOL_VERSION = "${PINNED_CODEX_VERSION}" as const;\n`,
    );
    process.stdout.write(
      `Generated stable Codex protocol ${PINNED_CODEX_VERSION}.\n`,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

await main();
