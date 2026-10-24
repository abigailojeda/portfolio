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

## Code readability

- Prefer readability over compressed code across React, Vue, Angular, TypeScript,
  components, and tests. Separate functions and logical blocks with blank lines.
- Keep functions small, focused, and clearly named. Always use braces around
  conditionals, including early returns; prefer guard clauses to deep nesting.
- Use named handlers for meaningful event logic. Keep rendering separate from
  complex behavior, extracting hooks or utilities only when a clear responsibility
  justifies them, using each framework's idioms.
- Organize tests by behavior and responsibility; use small setup helpers where
  they reduce meaningful duplication without adding testing infrastructure.
- Apply KISS and SOLID/DRY pragmatically; avoid speculative abstractions and
  unnecessary layers. Add short English comments only for non-obvious intent.

## Styling and Design System

Follow the [styling conventions](docs/design/DESIGN.md#styling-and-design-system-conventions).

- Keep shared colors, typography, spacing, border radii, and themes in
  `packages/design-tokens`. Token definitions must stay framework-independent;
  keep Tailwind-specific mappings in the existing adapter.
- Keep reusable UI and its styling in `packages/ui-react`. Expose required,
  reusable visual variants through typed props instead of restyling copies in
  consumers. Do not invent components, variants, or tokens without a use case.
- Follow the [planned theming architecture](docs/design/DESIGN.md#planned-theming-architecture):
  color mode (light/dark) and visual style (minimal/glass initially) are independent.
  Components must adapt through semantic tokens and framework-owned styling,
  without manual consumer appearance classes or duplicated UI libraries. Preserve
  existing `data-theme` light/dark behavior; leave the final theme API to its
  approved specification.
- Prefer Tailwind utilities in components for layout, spacing, flex/grid,
  alignment, and simple styling. Keep necessary custom CSS beside its component;
  keep page/section-only CSS with that page or section in `apps/portfolio`.
- Keep global CSS limited to shared foundations, Tailwind setup, and minimal
  document defaults. Reuse existing tokens/components; similar utility lists
  alone do not justify a reusable abstraction or dependency.
- Across React, Vue, and Angular, avoid default browser outlines and prominent
  CSS outline rings on interactive components unless explicitly requested.
  Prefer subtle, custom focus indicators that match the visual identity, using
  `:focus-visible` where appropriate to distinguish keyboard focus from pointer
  interactions. By default preserve visible keyboard focus with accessible borders,
  box-shadows, or equivalent styling; never add a global `outline: none` reset
  without replacement focus indication. Document explicit component-specific
  exceptions; SegmentedControl currently has no focus effect at the user's request.
- Document reusable components, supported variants, states, and usage in the
  React Storybook; add foundation documentation where useful. Consume actual
  library exports and shared styles, preserving the existing source scanning.
- Preserve appearance, behavior, accessibility, and responsive layouts. Follow
  the documented current gaps without silently expanding the Design System or
  undertaking a broad CSS refactor.

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
