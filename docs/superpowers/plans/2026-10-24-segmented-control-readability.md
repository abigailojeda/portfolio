# SegmentedControl readability refactor plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation; preserve behavior and leave changes uncommitted.

**Goal:** Apply the user's prescribed readability and responsibility boundaries without changing functionality.

**Architecture:** Extract internal `useHorizontalDragScroll` with its existing Pointer Events behavior. Extract component-local `useRadioGroupFocus` for radio focus recovery and nearest-scroll reveal. The drag hook's bubbling focus handler refreshes its pending scroll baseline after the focused child reveals itself; neither hook knows about the other.

**Tech stack:** Existing React, TypeScript, Tailwind, Vitest, Testing Library, Storybook.

**Spec:** The existing approved SegmentedControl design, including the opaque-color extension, plus the user's explicit behavior-preserving refactor request. No new functionality or public API is designed here.

## Constraints and review focus

- Preserve the six-pixel threshold, click suppression through normal lost capture, fresh-primary-press reset, and mouse-only interception.
- Preserve focus recovery, native radio selection, touch, and nearest-scroll reveal. Test focus-induced scroll before dragging, where extraction could lose coordination.
- No stylesheet, token, Storybook, package, or dependency changes are needed.
- All new hooks remain internal. Use named handlers, braces and logical whitespace.
- Keep all existing tests and TypeScript checks. Pure refactoring uses their existing green behavior coverage; do not introduce artificial failing assertions about implementation structure.
- Keep the existing feature branch and uncommitted changes. Do not commit.

## Task 1: Pin behavior and reorganize tests

- [x] Run the existing 32 component tests as the baseline.
- [x] Add a behavior test for focus revealing a segment before drag movement; expect the drag to start from the updated scroll position.
- [x] Move drag tests to `SegmentedControl.drag.test.tsx` and focus recovery/identity tests to `SegmentedControl.focus.test.tsx`.
- [x] Share only the small controlled fixture and options in `SegmentedControl.test-helpers.tsx`; retain core selection, disabled, naming and keyboard tests in the original file.
- [x] Add braces and whitespace throughout the affected tests; run all three suites. No direct hook tests are needed because observable behavior is covered through the component.

## Task 2: Extract focused interaction responsibilities

- [x] Create `packages/ui-react/src/hooks/useHorizontalDragScroll.ts`, returning named event handlers for the scrolling container; keep the existing state and algorithms.
- [x] Create component-local `useRadioGroupFocus.ts`, taking the group ref and returning input focus/blur handlers. Keep existing lifecycle behavior.
- [x] Replace inline meaningful JSX handlers with named handlers; retain the simple per-option selection binding and controlled callback order.
- [x] Run interaction suites and workspace type checks; inspect that public exports, CSS and Storybook remain unchanged.

## Task 3: Conventions and final verification

- [x] Add a brief monorepo readability section to `AGENTS.md`.
- [x] Run `pnpm check`, `pnpm run audit`, and `git diff --check`.
- [x] Verify real browser dragging, next click, keyboard reveal, and focus recovery after extraction.
- [x] Obtain one independent final review; fix material regressions and rerun affected checks.
- [x] Record results and remaining limits; leave work uncommitted.

## Execution record

- The user's detailed request prescribes this behavior-preserving extraction;
  the approved functional specification remains unchanged. No new functionality,
  API design, styles, exports, dependencies, or Storybook changes were introduced.
- Baseline: 32 component tests passed. Test reorganization initially exposed a
  missing `useState` import in the moved test setup; restoring the import made
  all 33 tests pass. Type checking also caught an unused drag-suite import,
  removed before final verification.
- The new focus-scroll baseline case passes both before and after extraction.
  This is characterization and refactoring of existing green behavior coverage,
  not a new feature or bug fix requiring an invented failing behavior.
- `useHorizontalDragScroll` owns Pointer Events, threshold, scroll/capture state,
  cursor attributes, drag-click suppression, and rebasing on bubbled child focus.
  `useRadioGroupFocus` owns radio focus tracking, removal/disable recovery, and
  nearest-scroll reveal. No coupling callback or orchestration layer was added.
- Component remains 98 lines, primarily types/rendering/selection. Tests are
  core (14 cases), focus (6), and drag (13), with a small shared controlled fixture.
  Existing API type checks stay unchanged. No direct hook suite was needed.
- Browser: dragging over a long unchecked option moved scrollLeft to 186.4 while
  selection stayed period-0; release cleared dragging and left page scroll (0,0).
  A subsequent click then native ArrowRight selected/focused period-2, completely
  within its group's bounds. Removing the focused selected Week recovered focus
  to Month without selecting a replacement, preserving controlled missing-value
  behavior.
- Independent review compared both hooks and markup with the saved original
  component: no material findings. One whitespace finding between tests was
  corrected as part of the requested readability conventions.
- First `pnpm check` passed all 45 tests across seven files and all builds.
  Audit reported zero findings; diff check passed. Post-cleanup checks follow.
- Remaining limits: real touch hardware, Firefox/Safari, forced colors,
  screen readers, and actual 200% zoom remain unverified. Styling/contrast and
  Storybook controls retain the prior iteration's contract and limits.
- No commits were made. Existing uncommitted iteration work remains intact.
- Final post-review `pnpm check` passed formatting, lint, workspace type checks,
  all 45 tests across seven files, and all builds. The existing Storybook
  chunk-size warning remains. `pnpm run audit` returned zero blocking,
  suppressed, and lower-severity findings. `git diff --check` passed.
