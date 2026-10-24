# React Storybook integration

Status: Approved by the user on 2026-10-24 for planning and implementation.

## Intent and verified context

Provide a simple development environment for inspecting the existing React UI
library independently of the portfolio application. This is a small tooling
integration, scoped to React, TypeScript, and Vite in `apps/storybook`.

The private pnpm workspace already includes `apps/*` and `packages/*`.
`@portfolio/ui-react` exports TypeScript source and imports its Tailwind styles.
`@portfolio/design-tokens` exports token CSS and the shared Tailwind mapping.
The existing application uses React 19, TypeScript 6, Vite 8, and Tailwind 4.
Root scripts and CI already check formatting, lint, types, tests, and builds.

Button currently has one visual style and accepts native button attributes and
children. It has no `variant`, `size`, or loading API. Existing tests cover its
content and click handler. The stories must document supported behavior without
adding component capabilities or implying that unimplemented variants exist.

Confirmed by the user on 2026-10-24: document Button's current API only.

## Approach

Use a private workspace package in `apps/storybook`, with manually authored,
typed Storybook configuration and stories. Import Button through
`@portfolio/ui-react` and tokens through `@portfolio/design-tokens`, using
`workspace:^` dependencies as the other app does.

This is the straightforward approach within the requested scope. Putting stories
inside the library would couple its current source type checks to Storybook
dependencies. A generator would require removing sample components and optional
integrations. Keep stories and configuration together in the Storybook app and
add only the dependencies required for this integration.

## Required behavior

- Configure only `@storybook/react-vite`, using a stable Storybook release whose
  published peer requirements support the repository's existing runtime and
  tooling. Keep Storybook packages on matching versions; do not upgrade unrelated
  dependencies.
- Keep configuration in `apps/storybook/.storybook` and typed CSF stories in
  `apps/storybook/src`. Use the Vite builder's React support and the existing
  Tailwind Vite plugin. Do not import the portfolio app's configuration or add a
  second application entry point.
- Import global preview CSS from the preview configuration. Load the shared
  token definitions and Tailwind mapping, and ensure library utility classes are
  generated. Use shared background/foreground tokens for the preview canvas;
  do not copy palette values or component styles.
- Add Button stories for its default appearance and disabled state. Expose
  controls for its label, disabled property, and native `button`, `submit`, and
  `reset` types. Provide a click action so enabled and disabled behavior can be
  inspected. Native button types are functional options, not visual variants.
- Retain native keyboard behavior and inspect the shared styles in light and
  dark system preferences. Do not fabricate hover, focus, or loading styles that
  the component does not implement.
- Add root `storybook` and `build-storybook` commands that delegate to the
  workspace package. Development uses port 6006; static output goes to
  `apps/storybook/storybook-static`, which existing ignore rules already cover.
- Include the Storybook sources and configuration in root lint and type checks.
  Include its static build in root `build` so `pnpm check` and existing CI verify
  the integration. Preserve the current application/library checks and build
  order. No CI workflow or release-policy changes are required.
- Add concise usage documentation and update the project overview to describe
  the verified integration after implementation.

## Boundaries

Do not recreate or modify Button, other library components, token definitions,
the portfolio application, or its React Compiler configuration. Do not add
Storybook Composition, Angular/Vue support, providers, shared configuration
packages, theme persistence, hosting, deployment, or unrelated cleanup.

Use built-in Storybook controls/actions. Additional docs, theme, testing, or
visual-regression addons are outside this initial setup unless a verified
technical requirement makes one necessary and is reviewed first. Keep existing
Vitest projects; do not introduce a separate browser-test infrastructure solely
for this integration.

## Acceptance and verification

1. A frozen-lockfile install recognizes the new workspace package without
   unresolved peer incompatibilities introduced by Storybook.
2. `pnpm storybook` starts successfully from the repository root and discovers
   the Button stories without requiring a prebuilt component library.
3. Browser inspection confirms that stories render the imported Button with
   token-based Tailwind styles, controls update supported props, click actions
   work, and the disabled button does not invoke the handler. Inspect keyboard
   operation, narrow viewports, and both system color schemes where available.
4. `pnpm build-storybook` produces a static site with the expected story index
   and assets. Inspect the built preview as well as development mode.
5. `pnpm check` passes, including the new lint/type/build coverage. Run the
   existing dependency audit because dependencies are being added; report
   existing approved suppressions and any new failures accurately.
6. Review the final diff against this specification. Report checks that could
   not be run and distinguish existing limitations from integration regressions.

The implementer chooses compatible package versions and ordinary file-level
details during planning. Changes to this scope or to Button's public API require
user review. The user approved this specification and authorized implementation
on 2026-10-24, keeping Design System expansion for a separate iteration.
