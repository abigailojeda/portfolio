# SegmentedControl Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver a generic, controlled, accessible React SegmentedControl with
dynamic options, shared-token styling, tests, and working Storybook examples.

**Architecture:** One component maps consumer-provided options to native radio
inputs and labels, with an instance-specific name and controlled checked state.
Native browser behavior owns keyboard navigation and normal focus/scrolling;
only demonstrated gaps in the approved dynamic-focus contract justify small
local DOM handling. Tailwind and existing semantic tokens own appearance.

**Tech Stack:** Existing React 19, TypeScript 6, Tailwind CSS 4, Testing Library,
user-event, Vitest 4, Storybook 10, and pnpm workspace tooling. No additions.

**Spec:** [Approved design](../specs/2026-10-24-segmented-control-design.md).

**Status:** Approved by the user and implemented inline; verification is recorded below.

The approved extension below adds `color` and shared scrollbar styling to the
original scope. The subsequently approved
[readability refactor](2026-10-24-segmented-control-readability.md) supersedes this
plan's initial single-file organization: pointer handling and radio focus are
internal hooks, and tests are split into core, focus, and drag suites. Original
steps and historical verification below describe their respective stages.

**Execution:** The user approved inline execution followed by one independent final
review. These three tasks build on the same small component and were completed by the
primary implementer, followed by one independent final review. Keep changes reviewable on `feat/segmented-control`;
do not merge, publish, or push as part of implementation.

## Global Constraints

- The screenshot is visual guidance only. No option-count or instance-count limit.
- `options: readonly SegmentedControlOption<T>[]`, `T extends string`, controlled
  `value: NoInfer<T>`, and `onValueChange: (value: T) => void` are the approved API.
- Each option has `value`, a nonempty text `label`, optional `disabled`, and optional
  `onSelect: (value: T) => void`; values are unique and stable.
- Require exactly one of `aria-label` and `aria-labelledby`. Optional component
  props are `disabled`, `id`, and `className`; no appearance-selection props.
- `onValueChange` precedes `onSelect`, once each per changed user selection.
  Repeated selection, disabled interaction, focus entry, and prop-only updates
  invoke neither callback. State updates remain the consumer's responsibility.
- Use a named `radiogroup`, native radios, associated labels, and isolated native
  names. No custom arrow-key handler, roving tabindex, selection state, or toolbar
  mode. Native unchecked-group entry differences are acceptable.
- Empty options render nothing; missing values select nothing; disabled selected
  values remain selected; all-disabled controls have no tab stop.
- Focus recovery on removal/disabling and local visibility must meet the spec.
  Prefer native behavior first; add only evidence-based, narrowly scoped code.
- Keep component styling in `packages/ui-react`; inherit shared semantic tokens.
  Target at least 44 CSS pixels of segment height and a visible focus outline.
- No new dependencies, abstractions, token values without a demonstrated gap,
  visual-style selector, glass implementation, or story-owned theme definitions.
- No portfolio integration, persistence, application logic, new frameworks, form
  submission API, rich option content, or unrelated refactoring.
- Preserve React Compiler, Tailwind source scanning, workspace setup, CI,
  dependencies, release policy, and the existing component APIs.
- If a new branch becomes necessary, use `feat/segmented-control` or another
  appropriate Conventional Commit-style prefix, never `codex/`.

## Review Focus

1. Identical option values in two instances must not share native selection or
   callbacks; pin with the isolation test in Task 1.
2. A consumer declining an update must retain its checked value while receiving
   exactly one requested-selection notification; pin in Task 1.
3. Removing/disabling the focused option must recover focus without stealing it
   when the consumer is editing elsewhere; pin in Task 2.
4. Offscreen options and long labels at constrained widths must remain reachable
   without clipping focus or overflowing the page; verify in Task 2 and Task 3.
5. Labels/values containing punctuation and reordered data must preserve accessible
   labels and stable identity; pin in Task 1 without deriving selectors/IDs from
   unchecked consumer strings.

## File map

| File                                                                               | Responsibility                                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `packages/ui-react/src/components/SegmentedControl/SegmentedControl.tsx`           | Public types, controlled radio rendering, component-owned Tailwind styles, and only necessary local focus recovery. |
| `packages/ui-react/src/components/SegmentedControl/SegmentedControl.test.tsx`      | Behavior and accessible interaction tests using existing test tooling.                                              |
| `packages/ui-react/src/components/SegmentedControl/SegmentedControl.typecheck.tsx` | Compile-time API checks; no exported production helpers or runtime registration.                                    |
| `packages/ui-react/src/components/SegmentedControl/index.ts`                       | Named component and public type exports.                                                                            |
| `packages/ui-react/src/index.ts`                                                   | Add the SegmentedControl export; leave unrelated existing exports alone.                                            |
| `apps/storybook/src/SegmentedControl.stories.tsx`                                  | Typed, interactive examples using real package exports and shared themes.                                           |
| `apps/storybook/README.md`                                                         | Update the documented component coverage and usage.                                                                 |
| `docs/project-overview.md` and `docs/design/DESIGN.md`                             | Record the actual delivered component, supported states, and remaining theme/browser limits.                        |

Use utilities in the TSX initially. Add a colocated `SegmentedControl.css` only
if a demonstrated styling need cannot be expressed readably with existing
Tailwind utilities. Do not create hook/helper/type files solely to split this
small component. No build/test/Storybook configuration change is expected.

## Task 1: Typed controlled native-radio component

**Files:** Create the component, test, typecheck fixture, and barrel files from
the map. Modify `packages/ui-react/src/index.ts`.

**Interfaces:** Consume existing React types/hooks and semantic Tailwind mappings.
Produce `SegmentedControl<T extends string>(props: SegmentedControlProps<T>)`,
`SegmentedControlProps<T>`, and `SegmentedControlOption<T>` exactly as specified.
Later tasks consume these exports without extending the API.

- [x] **1. Establish the baseline.** Inspect branch/status and existing instructions.
      Preserve any existing user changes. Use the current isolated feature branch;
      no additional checkout is needed when it is still `feat/segmented-control`.
      Run `pnpm check` and record failures before attributing them to this feature.
- [x] **2. Write a failing core test through the package export.** Import
      `SegmentedControl` from the library entry point. Use three arbitrary values
      (`week`, `month`, `year`), a named group, and parent-controlled selection.
      Assert group/radio names, checked state, changed selection, callback order,
      and no callbacks on repeated selection:

```tsx
expect(screen.getByRole("radiogroup", { name: "Period" })).toBeInTheDocument();
expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
await user.click(screen.getByRole("radio", { name: "Month" }));
expect(calls).toEqual(["change:month", "select:month"]);
expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
await user.click(screen.getByRole("radio", { name: "Month" }));
expect(calls).toEqual(["change:month", "select:month"]);
```

- [x] **3. Observe failure.** Run
      `pnpm exec vitest run packages/ui-react/src/components/SegmentedControl/SegmentedControl.test.tsx`.
      Expect the missing export/module failure before implementing the component.
- [x] **4. Implement the minimal core and exports.** Copy the approved type
      signatures. Generate an instance name with `useId`; key options by value.
      Use native `type="radio"`, controlled `checked`, effective `disabled`, and
      associated text labels. Dispatch callbacks only from the native change
      event for a different enabled value, in the specified order. Map data
      directly; do not query by interpolated option values, parse domain data,
      mirror `value` into state, or attach keyboard-selection handlers.
- [x] **5. Run the focused test green.** Use the same command; expect a passing
      core behavior test and a working public package import.
- [x] **6. Add behavior regression tests in small red/green increments.** Include
      `independent instances with overlapping values`, `declined controlled
update`, `prop changes do not notify`, `disabled option and group`,
      `selected disabled value`, `empty/single/many options`, `missing value`,
      `all disabled`, `labelledby naming`, and `punctuation/reordered options`.
      Generate 25 options as test data, not a supported-count boundary. Assert
      exact callback values/counts, no cross-instance unchecking, and unchanged
      selected state when the parent declines. Do not manufacture unavailable
      application behavior or check class-name strings as the behavior test.
- [x] **7. Add compile-time API fixtures.** In
      `SegmentedControl.typecheck.tsx`, export one uncalled fixture function with
      valid inferred/explicit union usages so noUnused rules remain satisfied.
      Use `@ts-expect-error` for an invalid selected value against `as const`
      options, missing/both naming methods, and a wrongly typed callback. Check
      public type imports. Do not add this fixture to production barrel exports.
      Run `pnpm --filter @portfolio/ui-react exec tsc -b`; require no diagnostics
      and no unused `@ts-expect-error` directives.
- [x] **8. Verify the deliverable.** Run focused tests, `pnpm lint`, and
      `pnpm typecheck`. Review the export diff and record the Task 1 result.
      Suggested review checkpoint: `feat(ui-react): add controlled segmented control`.

## Task 2: Token styling, native keyboard behavior, and responsive focus

**Files:** Modify the component and its behavior tests; create colocated CSS only
if necessary under the file-map rule.

**Interfaces:** Consume the Task 1 public API unchanged and existing
`background`, `foreground`, `surface`, `muted-foreground`, and `border` utilities.
Produce the approved visual states and usable constrained-width behavior.

- [x] **1. Add keyboard/focus tests before further behavior code.** Using
      user-event, test Tab entry, Space selection, arrow selection and skipping
      disabled options, Tab exit, and all-disabled groups. Assert callback counts
      and independent radio names. Preserve native unchecked-group differences;
      do not invent Enter/Home/End support to make tests uniform.
- [x] **2. Add component-owned styles.** Use an outlined rounded track with inset
      segments, neutral selected foreground/background inversion, hover, disabled,
      and focus-visible states. Keep native inputs focusable and nameable. Prefer
      an opacity-hidden input covering its own label's segment box, rather than
      placing every hidden input at the same offscreen coordinate; native focus
      scrolling should target the real segment. Keep visual text readable and
      pointer labels functional. Reuse Tailwind scales and set a 44px minimum
      segment height with the existing scale.
- [x] **3. Implement constrained layout with CSS.** Use content sizing,
      `max-width: 100%`, shrinking allowances at the group boundary, and local
      horizontal overflow. Keep segments readable and allow long/unbroken labels
      to wrap within available widths. Leave room for focus outlines at scroll
      edges. Avoid count-based widths, custom scrollbar widgets, equal-width
      arithmetic, ResizeObserver, scroll listeners, and imperative scrolling
      unless a real browser check proves it necessary.
- [x] **4. Test dynamic focus recovery.** Focus an option, then rerender with it
      removed or disabled: expect the selected enabled option, otherwise the first
      enabled option, to receive focus. Reorder without losing a still-enabled
      focused input. With an external button focused, update options and assert
      it retains focus. Include no remaining enabled options. Run tests red first;
      verify the native result in the browser before adding recovery logic.
- [x] **5. Add only necessary recovery.** If native behavior fails the approved
      removal/disabling cases, keep minimal refs and a local post-commit check to
      recover the previously focused input to the specified enabled replacement.
      Do not call focus during render, steal focus from outside the instance,
      change selection, or emit callbacks. Avoid a general focus manager, shared
      hook, stale saved tabindex list, or new public prop. If native scrolling
      fails, add only the local visibility correction demonstrated necessary;
      use immediate nearest scrolling and avoid page movement.
- [x] **6. Run focused tests and type/lint checks.** Require passing Task 1 and
      Task 2 cases; document which behavior is browser-native and which exceptional
      recovery, if any, required JavaScript. Suggested review checkpoint:
      `feat(ui-react): style segmented control and preserve accessible focus`.

## Task 3: Storybook documentation and final verification

**Files:** Create `apps/storybook/src/SegmentedControl.stories.tsx`. Update
`apps/storybook/README.md`, `docs/project-overview.md`, and
`docs/design/DESIGN.md`. Record actual verification in this plan.

**Interfaces:** Consume the actual Task 1 component and public types, existing
Storybook `Meta`/`StoryObj` and `storybook/test` helpers, and inherited shared theme
definitions. Stories own demo state only; they do not implement themes.

- [x] **1. Add typed working stories.** Use `Components/SegmentedControl` with
      `Default`, `MultipleOptions`, `OptionActions`, `DisabledOption`, `Disabled`,
      `IndependentInstances`, `ConstrainedWidth`, and `ColorModes`. Use a small
      local controlled render function or Storybook args updates, keeping spies
      visible without replacing state updates. Do not force generic types with
      `any`; a story-local concrete string union or typed props is sufficient.
- [x] **2. Document the actual contract.** Explain values/labels, required group
      naming, callback order and repeat behavior, controlled acceptance, disabled
      states, missing/empty options, native keyboard behavior, and local overflow.
      `IndependentInstances` uses overlapping values with different consumer
      meanings and separate callbacks. `ConstrainedWidth` demonstrates 25 options
      and long/unbroken labels; this remains example data, not a product limit.
- [x] **3. Use real shared themes.** `ColorModes` scopes identical examples under
      existing `data-theme="light"` and `data-theme="dark"` wrappers. Wrappers may
      use shared background/text utilities and layout only. Do not add preview
      theme definitions, a theme toolbar/provider, or a glass simulation. Document
      deferred glass integration. Run `pnpm --filter @portfolio/storybook typecheck`
      and `pnpm build-storybook`; require successful type/build results.
- [x] **4. Verify real browser behavior.** Run `pnpm storybook` and inspect the
      actual stories. Check pointer/Tab/Space/arrows, skipped disabled choices,
      callback counts, declined parent updates, focus recovery, and independent
      instances. At 320px and desktop widths, inspect 1/3/25 options, long labels,
      focus visibility at both scroll edges, and no page horizontal overflow.
      Check native focus scrolling before introducing any scroll JavaScript.
      Check actual 200% zoom when browser tooling supports it; do not substitute
      a viewport resize and call it zoom verification.
- [x] **5. Verify shared styling and contrast.** Inspect explicit light/dark,
      nested opposite scopes, and system fallback where tooling permits. Require
      readable selected/unselected labels (4.5:1 normal-text target), visible focus
      (3:1 indicator target), and 44px minimum segment height. Inspect the built
      preview's generated styles without changing existing Tailwind imports or
      source scanning. Record any manual checks that could not be performed.
- [x] **6. Update project documentation accurately.** Add SegmentedControl to the
      verified inventory and Storybook coverage; record the approved neutral
      token-based styling, native behavior, and deferred glass boundary. Do not
      rewrite historical validation or resolve unrelated Button/theme gaps.
- [x] **7. Run final repository checks.** Run `pnpm check`, `pnpm run audit`, and
      `git diff --check`; require passing output. Inspect the diff for changes to
      dependencies, lockfile, CI, tokens, application code, or existing component
      behavior; none are expected. Check that every spec acceptance case is
      covered by tests or a recorded browser check/limitation.
- [x] **8. Request an independent final review.** Use the requesting-code-review
      workflow for the whole change against the approved spec and five review
      focus cases. Resolve material findings, rerun affected checks, and report
      remaining limitations. Leave reviewable changes on the feature branch;
      commits, if made during execution, use Conventional Commits and Husky.
      Suggested final checkpoint: `docs(storybook): document segmented control`.

## Planning self-review

- All design sections map to Tasks 1–3; no additional subsystem is planned.
- API names and signatures match the approved spec. Type fixtures use the
  existing `src` TypeScript inclusion; no new testing configuration is needed.
- Native radios own keyboard navigation, ordinary tab order, and normal scrolling.
  Exceptional focus recovery is a bounded requirement, not a new architecture.
- The five review focus conditions have explicit test/browser steps in their
  owning tasks. Browser-only claims are separated from jsdom assertions.
- The scope contains one component, adjacent tests/exports, stories, and relevant
  documentation. Glass and application integrations remain deferred.

## Verification record — 2026-10-24

- Baseline `pnpm check` passed: 12 tests and all three builds.
- Core missing-export test failed before implementation, then passed. The final
  component suite contains 19 behavior tests; compile-time fixtures verify the
  inferred/explicit API unions and rejected invalid props through existing tsc.
- Three dynamic-focus tests failed before the local recovery implementation and
  passed afterward. Real browser removal left BODY focused; recovery now focuses
  the selected enabled option or the first enabled option without selecting it.
  Disabling the focused selected Week retained its checked/disabled state and
  recovered focus to Month. Outside focus and stable reorder cases pass tests.
- Browser verification at 320px showed native arrows left a long segment at
  x=123.73..369.73 while its group occupied x=32..288. After the approved minimal
  nearest-aligned `scrollIntoView` on focus, the segment occupied x=37.73..283.73,
  with local scrollLeft=86 and page scroll remaining (0, 0). Native arrows remain
  responsible for selection; no custom keyboard or scrolling calculations exist.
- Inspected single, three, five, and 25-option stories, constrained and desktop
  widths, long/unbroken labels, native disabled-option skipping, independent
  instances with overlapping values, a parent declining changes, and visible
  in-canvas API usage. The 320px page remained 320px wide; controls stayed local.
- Native focus outlines measured 2px and used semantic foreground against the
  surface. Shared light mode selected text contrast was 18.65:1 and unselected
  5.36:1; dark mode selected was 17.05:1 and unselected 7.49:1. Normal segment
  heights measured 44px. Light inside dark and dark inside light retained the
  nearest explicit tokens. The default/system canvas used the actual dark system
  preference; live system switching was not emulated.
- The single independent final review found one material hover selector issue:
  the invisible input received hover while its sibling span did not. Browser
  RED showed transparent unselected background with input:hover=true; replacing
  span:hover with peer-hover produced the shared muted background (#242424 in
  dark mode), GREEN, while leaving controlled selection unchanged. No other
  material findings or deferred minor findings were reported.
- Final post-correction `pnpm check` passed formatting, lint, workspace type checks,
  all 31 tests across five files, and all three builds. `pnpm run audit` reported
  zero blocking, suppressed, or lower-severity findings. `git diff --check` passed.
  Storybook retains its existing chunk-size warning. No dependencies,
  lockfile, tokens, application logic, CI, or release configuration changed.
- Actual 200% browser zoom remains unverified: the supported shortcut did not
  change the measured 921px viewport or device-pixel ratio. Live system-preference
  switching and cross-browser/screen-reader testing also remain unverified. These
  are verification limits, not claims of completed coverage. Glass is deferred.
- No merge, push, publish, or deployment was performed. Changes remain reviewable
  on `feat/segmented-control`.

## Approved extension plan — inline implementation and one independent final review

The user's new request extends the existing iteration with shared scrollbar
foundations, mouse-only drag scrolling, and the optional `color` prop. Read the
extension section of the specification first. The user approved the design and
implementation plan, including opaque accents and native CSS fallbacks. Work is
authorized inline with one independent final review. Preserve all original public APIs except the requested
optional color prop, existing callbacks/accessibility, and the removal of
SingleOption. Do not commit or add dependencies.

### Extension task 1: Shared global scrollbar foundation

- [x] Create `packages/design-tokens/src/scrollbars.css` and import it once from
      `packages/design-tokens/src/index.css`; reuse existing semantic surface,
      muted-foreground, foreground, and border values without copying palettes.
- [x] Inspect the shared token/style entry and confirm portfolio and preview
      imports; add one shared scrollbar stylesheet and any necessary semantic
      token aliases in `packages/design-tokens` only.
- [x] Use standards/vendor mechanisms without conflicts, retain thin visible
      native scrollbars, and preserve system behavior in forced-color modes.
- [x] Verify separate horizontal/vertical scrollers in light/dark; record the
      Firefox/platform difference in exact thickness. No component overrides.

### Extension task 2: Minimal primary-mouse dragging

- [x] Add failing tests to `SegmentedControl.test.tsx` for fit/no-overflow,
      sub-6px normal clicks, real drags starting over options, left/right movement,
      no callbacks, release/cancel/lost-capture cleanup, subsequent ordinary clicks,
      disabled options, and preservation of touch/keyboard interactions.
- [x] Implement only local Pointer Events bookkeeping and native pointer capture
      after the threshold. Suppress only the drag's activation click; keep native
      scrollbar interaction, focus, and page position intact.
- [x] Verify real mouse dragging plus cursor feedback in ConstrainedWidth and
      fitting stories before declaring the behavior complete.

### Extension task 3: Custom color contract and Storybook

- [x] Resolve the color scope: the user chose opaque accents only. Transparency,
      CSS-variable references, and other context-dependent colors are excluded.
- [x] Obtain approval of the focused extension design, including native CSS
      contrast and older-browser semantic fallback, before implementation.
- [x] Add failing API, default-appearance, custom-color, callback, and contrast
      tests appropriate to that approved approach. Extend the existing typecheck
      fixture with the one optional color prop.
- [x] Add `color?: CSSProperties["color"]` to
      `SegmentedControl.tsx`, and add colocated `SegmentedControl.css` for
      accent/foreground/hover properties using native `contrast-color()` and
      `color-mix()`. Guard the accent branch with `@supports`; unsupported
      browsers and omitted colors keep the current semantic appearance.
      Do not add JavaScript color resolution, a library, or a theme API.
- [x] Verify light/dark/saturated/mid-tone opaque examples against 4.5:1 text
      and 3:1 focus targets in the browser. Treat a failed ratio as a finding;
      feature detection alone is not contrast verification. Record engine limits.
- [x] Add the native Storybook color picker beside Preview color mode. Verify
      independent updates in light/dark with light, dark, and saturated colors.
      Retain useful existing stories and do not simulate Minimal/Glass.

For implementation, the component/public-type changes remain in the existing
SegmentedControl TSX and typecheck fixture; tests stay in its existing test file.
The two new CSS files each have one responsibility: shared global scrollbars and
component accent states. Storybook changes stay in its existing story file.

### Extension task 4: Documentation, verification, and final review

- [x] Update Design System and Storybook documentation without copying token
      definitions or repeating the whole API in multiple places.
- [x] Run `pnpm check`, `pnpm run audit`, and `git diff --check` after focused
      red/green tests and browser verification.
- [x] Request one independent final review of the extension, resolve material
      findings, rerun affected checks, and report changed files and limitations.
      Leave all work uncommitted.

### Extension verification evidence — 2026-10-24

- User approved the extension specification and implementation plan, inline
  execution, and one independent review. No commits were made.
- Focused TDD began with four failing extension tests, passed 26 tests, then
  expanded to 31. Review regression coverage brings the component suite to 32.
- Chromium/IAB verified both mouse drag directions over unselected long options,
  unchanged selection during dragging, subsequent normal clicks, native arrows,
  and disabled overflowing content. Short option sets retain their semantic
  appearance; the group retains native `touch-action: auto`.
- Eight opaque accents in both modes (16 samples) measured selected text contrast
  from 4.65:1 to 19.77:1. Semantic focus outlines measured at least 15.46:1 against
  the surrounding surface. Light/Dark preview mode and accent controls update
  independently. No-color appearance retains the existing semantic pair.
- Plain horizontal and vertical regions in shared Light/Dark scopes use the
  global scrollbar foundation, measured 8px vertical / 5px horizontal in Chromium.
  The actual portfolio at 320px width with vertical overflow uses the same
  foundation without horizontal page overflow. No scrollbar CSS is copied.
- Independent final review found stale click suppression after lost mouse capture
  could swallow a later touch tap. A focused regression failed before moving the
  reset to fresh primary pointerdown, then passed; all 32 component tests pass.
- Minor deferred: IndependentInstances and DynamicOptions use fixed fixtures
  while inherited component controls remain visible; those fixtures do not apply
  all inherited args. Their preview color mode wrapper still works.
- Ruling: Keep the native Storybook picker and document opaque-only inputs; the
  installed control exposes no supported opacity-disable setting. Excluded alpha
  values can still be entered and remain unsupported.
- Remaining browser coverage limits: Firefox/Safari, actual touch hardware,
  forced colors, older engines without the CSS features, screen readers, actual
  200% zoom, and live system-preference changes were not exercised. CSS fallback
  is implemented but no unsupported engine was available to execute it.
- Minimal/Glass remain deferred; no dependencies or application logic were added.
- Final post-review `pnpm check` passed formatting, lint, workspace types, all
  44 tests across five files, and all builds. `pnpm run audit` reported zero
  blocking, suppressed, or lower-severity findings; `git diff --check` passed.
  Storybook retains its existing chunk-size warning.

## Iteration closure — 2026-10-24

The user approved the complete implementation and readability refactor. Final
review of tracked changes and every untracked source/test/story file found no
remaining material issue against the approved specification and both plans.

- [x] Generic dynamic options, typed public exports, controlled selection,
      instance isolation, optional per-option actions, and disabled states.
- [x] Native radio semantics/keyboard behavior, visible focus, local overflow,
      and bounded dynamic focus recovery without selection callbacks.
- [x] Mouse-only drag threshold/capture, no drag selection/callbacks, normal
      subsequent clicks, native touch path, and focus-scroll coordination.
- [x] Default semantic appearance, opaque accent prop with native CSS contrast
      and semantic fallback, Light/Dark support, and global shared scrollbars.
- [x] Actual API/state/interaction stories, independent preview mode and accent
      controls in regular prop-driven stories, and removal of SingleOption.
- [x] Internal focused hooks, organized behavior tests, unchanged API type
      checks, and concise monorepo readability conventions.
- [x] Documentation updated to the final structure and approved delivery boundary.
- [x] Scope inspection: no dependency/lockfile, application code, CI/release,
      build configuration, or unrelated component changes. The pre-existing
      duplicate Button export remains outside scope.

Verification limitations remain explicit: real touch hardware, Firefox/Safari,
forced colors, older engines' semantic fallback, screen readers, actual 200%
zoom, and live system-preference switching were not exercised. Chromium browser
checks and sampled contrast measurements are evidence for that environment,
not a guarantee for every browser/color. Minimal/Glass remain deferred.

The native Storybook picker cannot enforce the documented opaque-only contract;
alpha/context-dependent inputs remain unsupported. IndependentInstances and
DynamicOptions retain their documented fixed-fixture control limitation. These
are recorded non-material limitations, not new closure work.

No commit, merge, push, publication, or deployment is authorized by this closure.
The user will review and commit the complete feature.

### Final closure checks

- [x] Fresh `pnpm check`: formatting, lint, workspace type checks, 45 tests across
      seven files, and all library/portfolio/Storybook builds passed.
- [x] Fresh `pnpm run audit`: zero blocking, suppressed, or lower-severity findings.
- [x] `git diff --check`: passed, including final documentation edits.

Storybook retains its existing chunk-size warning. The limitations above remain
unchanged; the final checks do not imply unperformed browser/device coverage.
Suggested complete-feature commit: `feat(ui-react): add accessible segmented control`.
All work remains uncommitted for the user's final review and commit.

### Later user amendment — hover styling without a focus effect

The user explicitly replaced the subtle-keyboard-focus request with no focus
visual effect on SegmentedControl, only hover styling. This supersedes the
original visible-focus acceptance requirement for this component. Native radio
focus/keyboard behavior remains, but the missing visible keyboard focus indicator
is a documented visual accessibility gap. Future components retain the default
custom focus convention; no global outline reset was introduced.

- [x] Remove the component's outline and outline-offset classes without changing
      handlers, selection, callbacks, layout, hover, or color behavior.
- [x] Update AGENTS, Design System documentation, Storybook guidance, and the
      specification with the explicit component exception.
- [x] Chromium browser check: keyboard/pointer focus has no visual outline,
      shadow, or overlay across light/dark/yellow/blue accents in both modes;
      unselected hover still receives the accent-derived background.
- [x] `pnpm check`: formatting, lint, types, all 45 tests across seven files,
      and all builds passed. `git diff --check` passed. No commit was made.

Earlier visible-focus contrast measurements describe the former implementation;
they do not establish a visible focus indicator for the amended component.
Existing cross-browser/device verification limitations remain unchanged.
