---
name: final-verify
description: Use when a completed feature in this repository needs final verification before committing or closing its iteration.
---

# Final verification

1. Read the approved design and implementation plan, `AGENTS.md`, and
   `docs/design/DESIGN.md`; consult `docs/project-overview.md` for product context.
   Inspect Git status, staged and unstaged diffs, and untracked implementation
   files. Preserve existing work and staging.
2. Review correctness, accessibility, readability, KISS/SOLID/DRY, and compliance
   with the established architecture and styling. Check for unnecessary
   abstractions, duplicated code, missing exports, incomplete documentation,
   unrelated changes, and gaps against the approved scope.
3. Run `pnpm check`, `git diff --check`, and `git diff --cached --check` from
   the repository root. Run other relevant existing checks when applicable,
   including `pnpm run audit` for dependency changes. Read outputs and exit codes;
   confirm tests, TypeScript, lint, formatting, and portfolio/UI-library/Storybook
   builds actually ran.
4. Fix necessary issues within the current scope without additional approval for
   routine fixes. Rerun affected checks and establish a passing final state.
   Treat skipped stages after a failed command as not executed. Never infer PASS
   from earlier runs, incomplete output, or a successful partial check.
5. Mark implementation-plan tasks complete only when their work and verification
   are complete. Keep documentation consistent with the actual implementation.
6. Perform one independent final review when an appropriate reviewer is available.
   Supply the approved scope and all relevant changes, including untracked files;
   keep the reviewer read-only and prohibit further reviewer delegation. Assess
   findings, fix necessary issues, and rerun affected checks. Otherwise report
   that independent review was unavailable; do not present self-review as independent.
7. Report browser verification only when actually performed. Distinguish manual
   checks from automated tests and disclose unexecuted or blocked checks.

Do not add features, refactor unrelated code, introduce unnecessary tooling or
dependencies, weaken or bypass quality checks, commit, or push.

Finish with a concise report containing:

- Checks executed with PASS/FAIL results; label skipped or blocked checks NOT RUN.
- Issues found and corrected.
- Remaining warnings or limitations, including independent-review availability.
- Whether the branch is ready to commit; identify any remaining blockers.
- A suggested Conventional Commit message matching the final changes.
