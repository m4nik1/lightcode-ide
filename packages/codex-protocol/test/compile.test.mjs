import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const tscPath = require.resolve("typescript/bin/tsc");
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

for (const fixture of ["nodenext", "bundler"]) {
  test(`built package compiles with ${fixture} module resolution`, () => {
    const result = spawnSync(
      process.execPath,
      [tscPath, "--project", path.join(testDirectory, "fixtures", fixture)],
      { encoding: "utf8" },
    );

    assert.equal(
      result.status,
      0,
      `${result.stdout}\n${result.stderr}`.trim(),
    );
  });
}
