import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const result = spawnSync(
  process.execPath,
  [path.join(scriptDirectory, "generate.mjs"), "--check"],
  { stdio: "inherit" },
);

process.exitCode = result.status ?? 1;
