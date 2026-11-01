# React Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run and build a React-only Storybook for the existing Button from the
pnpm workspace root.

**Architecture:** A private `@portfolio/storybook` workspace app owns the
Storybook configuration and typed CSF stories. It consumes existing package
exports and token CSS directly, with Tailwind compiled by Vite. Root quality
scripts include the new app without changing CI or the release workflow.

**Tech Stack:** Storybook 10.6.3 (`storybook` and `@storybook/react-vite`, matching
versions), existing React 19, TypeScript 6, Vite 8, Tailwind 4, and pnpm 9.6.0.
Published peer requirements were checked against the registry on 2026-10-24.

**Spec:** [Approved design](../specs/2026-10-24-react-storybook-design.md).

**Execution:** Implement inline in this session, as authorized by the user's
instruction to proceed with implementation. Leave changes available for review;
do not merge, deploy, or publish.

## Global constraints

- React only; no Composition or Angular/Vue setup.
- Button's existing API only; no component or token changes.
- Use `workspace:^` for internal packages and existing tooling version ranges.
- No additional addons, generated sample components, or shared abstractions.
- Preserve portfolio React Compiler, existing tests, CI, and releases.

## Review focus

- Source imports resolve without prebuilding the library: exercise dev and static
  previews.
- The library's Tailwind styles resolve semantic tokens: inspect computed button
  and canvas colors in light/dark preferences.
- Disabled controls retain native behavior: click and keyboard checks must not
  emit actions for a disabled button.
- Controls handle label, disabled, and all three native button types: inspect
  the resulting element attributes and action output.
- Hidden `.storybook` configuration participates in quality checks: verify lint
  file inclusion and TypeScript's checked file list.

### Task 1: Workspace app and root integration

**Files:** Create `apps/storybook/package.json`, `tsconfig.json`,
`tsconfig.app.json`, `tsconfig.node.json`, `.storybook/main.ts`,
`.storybook/preview.ts`, `src/styles.css`, and `vite.config.ts`. Modify root
`package.json`, `eslint.config.js`, and `pnpm-lock.yaml`.

**Interfaces:** Consume `@portfolio/ui-react` and `@portfolio/design-tokens`
package exports. Produce root `storybook` (port 6006) and `build-storybook`
commands and app-local `dev`, `build`, and `typecheck` scripts.

- [x] Verify that the root Storybook command is absent before integration.
- [x] Create the private workspace manifest with Storybook 10.6.3 and existing
      React/Vite/Tailwind/TypeScript version ranges. Add no optional addons.
- [x] Add typed React/Vite configuration and preview CSS using shared tokens and
      library utility scanning. Use ordinary project-local Vite configuration.
- [x] Add app/node TypeScript configurations matching existing conventions;
      include `.storybook` files in the appropriate configurations.
- [x] Extend root scripts and ESLint coverage for the new app, retaining current
      build order. The app's build runs its type check before `storybook build`.
- [x] Install dependencies and inspect peer warnings and lockfile churn. Confirm
      `pnpm install --frozen-lockfile` accepts the resulting workspace.

### Task 2: Button stories, usage documentation, and verification

**Files:** Create `apps/storybook/src/Button.stories.tsx` and
`apps/storybook/README.md`. Update `docs/project-overview.md` and this plan's
verification record.

**Interfaces:** Import `Button` from `@portfolio/ui-react`, `Meta`/`StoryObj` from
`@storybook/react-vite`, and `fn` from `storybook/test`. Export `Default` and
`Disabled` stories. Configure text/boolean/select controls for `children`,
`disabled`, and `type`, with native type options `button`, `submit`, and `reset`.

- [x] Add the typed stories using `satisfies Meta<typeof Button>` and
      `StoryObj<typeof meta>`, with a shared click spy visible in Actions.
- [x] Document root usage, generated output, story scope, shared styling, and
      the current single-style Button API. Update the overview's verified inventory.
- [x] Run `pnpm check`, the dependency audit, and frozen-lockfile validation.
      Configuration-only changes use integration checks rather than artificial unit
      tests; existing component tests remain authoritative.
- [x] Start development Storybook and inspect the two stories, controls,
      enabled/disabled clicks, keyboard behavior, light/dark colors, and narrow
      viewport behavior. Inspect the static build and story index too.
- [x] Verify ESLint and TypeScript include `.storybook` configuration. Review
      the diff for spec compliance and unintended dependency changes.
- [x] Record actual results and remaining limitations, then present the changes
      for human review without merging or publishing.

## Verification record

- Baseline `pnpm storybook` failed with command not found before implementation.
- Baseline and final `pnpm test`: four files and 12 tests passed. The sandbox
  initially prevented temporary-file renames; running outside it passed.
- `pnpm install --frozen-lockfile --offline`: passed for all five workspace
  projects, with no peer warnings. Existing dependency resolutions were retained;
  new lockfile entries belong to Storybook and its dependency/peer graph.
- `pnpm check`: passed formatting, lint, type checking, all 12 tests, library and
  portfolio builds, and `build-storybook`. Storybook emitted Vite's standard
  warning about a preview runtime chunk exceeding 500 kB; no optimization or
  warning suppression was added for this development tool.
- ESLint debug output confirmed both `.storybook` files are linted; TypeScript's
  file lists confirmed preview, main configuration, Vite configuration, and
  stories are checked.
- Development and static previews rendered both stories. The generated index
  contains `components-button--default` and `components-button--disabled`, with
  `componentPath` pointing to the React library source.
- Browser checks verified label/type/disabled controls; mouse, Enter, and Space
  click actions; and no action from disabled buttons. The static preview fits a
  320-pixel viewport with a 320-pixel document width and no horizontal overflow.
- The available browser uses dark system preference: computed canvas background
  was `rgb(12, 15, 20)` and Button background was `rgb(139, 124, 255)`, matching
  shared tokens. This browser interface does not expose system-color emulation,
  so switching to light system preference was not browser-tested. Token files
  were not changed. No browser console errors occurred; Storybook itself logged
  deprecation warnings about its popover labeling and Story Store access.
- `pnpm run audit`: failed with two high and 11 lower-severity advisories. A
  separate audit of the original HEAD lockfile returned the same advisory IDs
  and severity totals; no advisory was introduced by this integration. The high
  findings concern existing Vite 8.2.2 and Zod 4.4.3. Leave remediation to a
  separate dependency-maintenance change; no suppressions or overrides changed.

- Independent read-only review found no Critical, Important, or Minor issues.
  The reviewer independently inspected workspace source imports, lockfile
  version preservation, generated story index, and lint/TypeScript inclusion.
  No Storybook-specific fixes are required. Existing dependency advisories were
  left outside this approved integration's scope; they still block the CI audit
  gate. Changes remain uncommitted on `feat/react-storybook` for human review.
