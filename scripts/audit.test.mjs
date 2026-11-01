import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateAudit } from "./audit.mjs";

const suppressions = JSON.parse(
  readFileSync(new URL("../audit-suppressions.json", import.meta.url), "utf8"),
);

const advisory = {
  github_advisory_id: "GHSA-g3hv-75wg-m249",
  module_name: "minimatch",
  severity: "moderate",
  patched_versions: ">=11.0.1",
  findings: [{ version: "3.1.5" }, { version: "10.2.6" }],
};

const glob = {
  github_advisory_id: "GHSA-3g3m-2fjr-6pw4",
  module_name: "glob",
  severity: "moderate",
  patched_versions: ">=14.0.2",
  findings: [{ version: "13.0.6" }],
};

const braces = {
  github_advisory_id: "GHSA-vfj7-8cjw-p6xm",
  module_name: "braces",
  severity: "high",
  patched_versions: "<0.0.0",
  findings: [{ version: "3.0.3" }],
};

function report(advisories, vulnerabilities) {
  return {
    advisories,
    metadata: {
      vulnerabilities: {
        info: 0,
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0,
        ...vulnerabilities,
      },
    },
  };
}

describe("dependency audit", () => {
  it("accepts severity totals counting affected versions across advisories", () => {
    const result = evaluateAudit(
      report({ 1244012: advisory, 1244013: glob }, { moderate: 3 }),
      suppressions,
    );

    expect(result).toEqual({
      blocking: [],
      suppressed: [],
      warnings: [advisory, glob],
    });
  });

  it("accepts a clean report", () => {
    expect(evaluateAudit(report({}, {}), suppressions)).toEqual({
      blocking: [],
      suppressed: [],
      warnings: [],
    });
  });

  it("keeps the documented unpatched braces finding visible as suppressed", () => {
    expect(
      evaluateAudit(report({ 1: braces }, { high: 1 }), suppressions),
    ).toEqual({ blocking: [], suppressed: [braces], warnings: [] });
  });

  it.each([
    ["a published fix", { ...braces, patched_versions: ">=3.0.4" }],
    ["a different version", { ...braces, findings: [{ version: "3.0.2" }] }],
    [
      "a different advisory",
      { ...braces, github_advisory_id: "GHSA-g3hv-75wg-m249" },
    ],
    ["a different package", { ...braces, module_name: "other" }],
    [
      "an additional affected version",
      { ...braces, findings: [{ version: "3.0.3" }, { version: "3.0.2" }] },
    ],
  ])("blocks the high severity finding with %s", (_name, item) => {
    const result = evaluateAudit(
      report({ 1: item }, { high: item.findings.length }),
      suppressions,
    );

    expect(result.blocking).toEqual([item]);
    expect(result.suppressed).toEqual([]);
  });

  it.each(["high", "critical"])(
    "blocks unsuppressed %s advisories",
    (severity) => {
      const item = { ...advisory, severity };
      const result = evaluateAudit(
        report({ 1: item }, { [severity]: 2 }),
        suppressions,
      );

      expect(result.blocking).toEqual([item]);
    },
  );

  it("rejects totals inconsistent with the findings", () => {
    expect(() =>
      evaluateAudit(report({ 1: advisory }, { moderate: 1 }), suppressions),
    ).toThrow();
  });

  it.each([
    { error: { message: "registry failure" } },
    report({}, { high: -1 }),
    report({ 1: { ...braces, findings: [] } }, { high: 0 }),
  ])("rejects malformed or failed audit reports", (invalidReport) => {
    expect(() => evaluateAudit(invalidReport, suppressions)).toThrow();
  });
});
