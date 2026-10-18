# Development instructions

Read [docs/project-overview.md](docs/project-overview.md) for product context,
verified implementation, the roadmap, and pending decisions. Inspect relevant
source, tests, and configuration before proposing changes; roadmap items are not
implemented requirements.

## Scope and engineering

- Prefer clean, simple, readable, maintainable, production-oriented solutions.
  Apply SOLID pragmatically and follow DRY, KISS, and YAGNI; avoid temporary
  workarounds, premature optimization, and unnecessary abstractions.
- Do not add dependencies, patterns, services, or architectural layers without
  concrete requirements and verified technical constraints.
- Preserve existing conventions and configuration unless a demonstrated need
  justifies changing them. Preserve React Compiler, Tailwind integration,
  workspace dependencies, testing, CI, and automated release behavior.
- Keep portfolio-specific components in `apps/portfolio`; keep reusable UI in
  the appropriate framework package. Use idiomatic React, Vue, or Angular and
  TypeScript with appropriate automated tests.
- Share the visual contract through `packages/design-tokens`; do not duplicate
  theme values across libraries. Treat accessibility and responsiveness as
  fundamental requirements.
- Write necessary code comments in English. Avoid unrelated refactoring,
  out-of-scope changes, and implementing future roadmap capabilities unasked.
- Ask for clarification when a decision materially affects architecture or
  expected behavior. Never silently change an approved architectural decision.

## Codex, Superpowers, and specification-driven development

- Follow installed Superpowers skills and their documented workflows where
  applicable; these instructions complement them rather than replace them.
- For nontrivial functionality: understand the request and inspect existing
  code/tests; brainstorm and clarify; produce a focused design specification;
  obtain design review and approval before implementation; then create a concrete
  plan of small, verifiable tasks.
- Treat the approved specification as the implementation reference. Implement
  incrementally, using test-driven development where appropriate; review quality
  and specification compliance, run relevant checks, and prepare for human review
  and integration. Do not skip design/planning for nontrivial work or generate
  detailed specifications for the entire roadmap in advance.
- Keep changes focused, avoid unnecessary assumptions, and communicate tradeoffs
  and unresolved questions. Use worktrees or isolated feature branches when
  appropriate. Respect the established `dev`/`main` workflow; releases run from
  `main`. Do not alter branch or release policy incidentally.
- Use the existing scripts in root `package.json`. Run relevant automated checks
  and `pnpm check` when appropriate; for documentation-only changes, check the
  affected Markdown formatting and diff. Verify evidence before claiming success
  and report checks not run. Preserve Husky and Conventional Commits conventions.
