# Dependency security

Security maintenance branches start from `dev`; releases remain on `main`.
Use the repository's pinned pnpm version and Node.js version from CI.

## October 18, 2026 remediation

The dependency audit in documentation-only PR #2 reported 35 findings already
present on `dev`. The targeted update leaves one high-severity finding:
`braces@3.0.3`, tracked in [issue #3](https://github.com/abigailojeda/portfolio/issues/3).
No patched braces release is available. Do not interpret pnpm's `<0.0.0`
patched-version sentinel as an installable release.

The secure resolutions are `fast-uri@3.1.8`, `brace-expansion@1.1.21` and
`5.0.12`, `source-map-js@1.2.2`, `ip-address@10.7.4`, `undici@7.30.1` and
`8.12.2`, and `basic-ftp@6.2.3`. Direct parent updates are `jsdom@30.1.3`
and `release-it@21.1.1`. Other direct dependencies retain their previous
requirements and resolutions.

## CI audit suppressions

Run `pnpm run audit` to use the same gate as CI. `audit-suppressions.json`
contains the one approved exception, matching its GHSA, package, and exact
resolved version. Each entry records the reason, tracking issue, and review date.
Only advisories reporting no published fix (`<0.0.0` in pnpm 9) qualify.
If a fix becomes available, the exception stops applying automatically.

Suppressed findings remain visible in command output. Other high and critical
findings block CI; lower-severity findings are printed for review. Invalid
reports, registry failures, and invalid suppression entries also block CI.
Review dates produce reminders rather than silently expiring approvals.
Remove stale entries when the affected dependency path disappears.

## Temporary security overrides

Overrides are a last resort. Before removing one, remove only that entry in an
isolated workspace, regenerate its lockfile, and inspect the controlling parent's
exact snapshot. A secure top-level report alone is insufficient.

### get-uri to basic-ftp

- Override: `get-uri@8.0.1>basic-ftp` to `6.2.3`.
- Path: release-it -> proxy-agent -> pac-proxy-agent -> get-uri -> basic-ftp.
- Without only this override, get-uri resolves `basic-ftp@5.3.1` again. The latest
  get-uri release is 8.0.1 and declares `basic-ftp: ^5.3.1`.
- [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r)
  affects versions through 6.2.0. Version 6.2.1 fixes the reported listing parser
  DoS; 6.2.2 and 6.2.3 include additional security fixes.
- [The changelog](https://github.com/patrickjuchli/basic-ftp/blob/master/CHANGELOG.md)
  documents a major-version change: separate transfer hosts are rejected by
  default. Transfer timeout behavior also changes. Node >=10 is supported;
  CI uses Node 24.18.0.
- Local protocol smoke tests passed FTP login, MDTM-based download, and
  machine-readable directory-list fallback through the installed get-uri.
  External proxy, FTP, and FTPS services were not tested.
- Remove this override when a supported get-uri/proxy-agent/release-it update
  selects basic-ftp 6.2.3 or a later secure compatible release without it.

### release-it to Undici

- Override: `release-it@21.1.1>undici` to `7.30.1`.
- Without only this override, release-it resolves its exact pin `7.29.1` again.
  The latest release-it release, 21.1.1, still pins that version.
- [Undici 7.30.1](https://github.com/nodejs/undici/releases/tag/v7.30.1)
  includes October 15 security fixes not included in the registry audit response,
  including TLS renegotiation DoS and dropped custom TLS verification callbacks.
  The earlier 7.29.1 fix therefore does not cover all current maintainer reports.
- The override retains Undici major 7; jsdom independently uses major 8.
  Undici 7 requires Node >=20.18.1. release-it 21.1.1 requires
  `^22.22.2 || ^24.15.0 || >=26.0.0`; CI's Node 24.18.0 meets both.
- Local smoke checks passed release-it CLI startup and an Agent/fetch HTTP
  request using release-it's exact resolved Undici instance.
- release-it 21.1 changes semver handling to verkit. An authenticated external
  GitHub release was not performed; release policy and configuration are unchanged.
- Remove this override when release-it selects Undici 7.30.1 or a later secure
  compatible release without it. Review both overrides on the next parent update.

## Verification and rollback

Run `pnpm install --frozen-lockfile`, `pnpm -r why fast-uri brace-expansion
source-map-js ip-address undici basic-ftp braces`, `pnpm audit --json`,
`pnpm run audit`, and `pnpm check`. An unfiltered audit must continue to disclose
the unpatched braces finding until the upstream fix or removal lands. Audit
counts alone do not prove that all recently published maintainer advisories have
reached the registry.

Revert `package.json` and `pnpm-lock.yaml` together if a compatibility regression
requires rollback, then reinstall with `pnpm install --frozen-lockfile`. That
rollback restores known vulnerable resolutions, so reassess security exposure
before using it for a release.
