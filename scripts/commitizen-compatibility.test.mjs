import {
  mkdtempSync,
  mkdirSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { expect, it } from "vitest";

const require = createRequire(import.meta.url);
const commitizenDirectory = dirname(require.resolve("commitizen/package.json"));
const findup = require(
  join(commitizenDirectory, "dist/configLoader/findup.js"),
).default;

it("finds Commitizen configuration in a parent directory", () => {
  const directory = mkdtempSync(join(tmpdir(), "portfolio-commitizen-"));
  const nestedDirectory = join(directory, "nested");
  const configFile = join(directory, "commitizen-probe.json");

  try {
    mkdirSync(nestedDirectory);
    writeFileSync(configFile, "{}");

    expect(
      findup(["commitizen-probe.json"], { cwd: nestedDirectory }, () => true),
    ).toBe(configFile);
  } finally {
    rmSync(configFile, { force: true });
    rmdirSync(nestedDirectory);
    rmdirSync(directory);
  }
});
