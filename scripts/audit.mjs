import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const severities = ["info", "low", "moderate", "high", "critical"];
const advisoryId = /^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;
const nonempty = (value) =>
  typeof value === "string" && value.trim().length > 0;

export function evaluateAudit(report, suppressions) {
  if (!Array.isArray(suppressions)) {
    throw new Error("Audit suppressions must be an array.");
  }
  const seen = new Set();
  for (const entry of suppressions) {
    const date = entry?.reviewAfter;
    const key = `${entry?.advisory}:${entry?.package}:${entry?.version}`;
    if (
      !entry ||
      !advisoryId.test(entry.advisory) ||
      ![entry.package, entry.version, entry.reason, entry.issue].every(
        nonempty,
      ) ||
      !/^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/.test(entry.issue) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date ||
      seen.has(key)
    ) {
      throw new Error("Invalid or duplicate audit suppression.");
    }
    seen.add(key);
  }

  const counts = report?.metadata?.vulnerabilities;
  if (
    report?.error ||
    !report?.advisories ||
    typeof report.advisories !== "object" ||
    Array.isArray(report.advisories) ||
    !counts
  ) {
    throw new Error("Audit failed or returned an invalid report.");
  }
  const advisories = Object.values(report.advisories);
  for (const severity of severities) {
    if (
      !Number.isInteger(counts[severity]) ||
      counts[severity] < 0 ||
      counts[severity] !==
        advisories.filter((item) => item?.severity === severity).length
    ) {
      throw new Error("Audit severity totals do not match its advisories.");
    }
  }

  const result = { blocking: [], suppressed: [], warnings: [] };
  for (const item of advisories) {
    if (
      !item ||
      !advisoryId.test(item.github_advisory_id) ||
      !nonempty(item.module_name) ||
      !severities.includes(item.severity) ||
      !nonempty(item.patched_versions) ||
      !Array.isArray(item.findings) ||
      item.findings.length === 0 ||
      !item.findings.every((finding) => nonempty(finding?.version))
    ) {
      throw new Error("Audit returned a malformed advisory.");
    }
    const suppressed = suppressions.some(
      (entry) =>
        entry.advisory === item.github_advisory_id &&
        entry.package === item.module_name &&
        item.findings.every((finding) => finding.version === entry.version) &&
        item.patched_versions === "<0.0.0",
    );
    const category = suppressed
      ? "suppressed"
      : ["high", "critical"].includes(item.severity)
        ? "blocking"
        : "warnings";
    result[category].push(item);
  }
  return result;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const suppressions = JSON.parse(
      readFileSync(
        new URL("../audit-suppressions.json", import.meta.url),
        "utf8",
      ),
    );
    // The command is constant; a shell is required for pnpm.cmd on Windows.
    const audit = spawnSync("pnpm audit --json", {
      shell: true,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: 120_000,
    });
    if (audit.error || ![0, 1].includes(audit.status)) {
      throw new Error(
        `Unable to run dependency audit: ${audit.error?.message ?? audit.stderr}`,
      );
    }
    const result = evaluateAudit(JSON.parse(audit.stdout), suppressions);
    if (
      audit.status === 1 &&
      Object.values(result).every((items) => items.length === 0)
    ) {
      throw new Error("Audit failed without reporting any advisories.");
    }
    for (const [category, items] of Object.entries(result)) {
      for (const item of items) {
        console.log(
          `${category}: ${item.severity} ${item.module_name} ${item.github_advisory_id} — ${item.title}`,
        );
      }
    }
    for (const entry of suppressions) {
      if (entry.reviewAfter <= new Date().toISOString().slice(0, 10)) {
        console.warn(
          `Suppression review due: ${entry.advisory} — ${entry.issue}`,
        );
      }
    }
    console.log(
      `Audit: ${result.blocking.length} blocking, ${result.suppressed.length} suppressed, ${result.warnings.length} lower-severity findings.`,
    );
    process.exitCode = result.blocking.length > 0 ? 1 : 0;
  } catch (error) {
    console.error(`Dependency audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
