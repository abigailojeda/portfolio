# SegmentedControl design

Status: implementation and readability refactor approved by the user on
2026-10-24. The delivered scope includes the native-radio API, callback contract,
opaque accent extension, shared scrollbars, and internal interaction hooks.
Minimal/Glass integration remains deferred. Changes are uncommitted for human review.

## Intent and confirmed scope

Add a generic, controlled single-selection component to `@portfolio/ui-react`.
Its behavior contract should be reusable across frameworks; this work implements
that contract in idiomatic React and TypeScript only.

The supplied screenshot is **visual guidance only**, not a functional
specification. It informs the outlined rounded container, individual segments,
inset highlighted selection, and restrained typography and spacing. It does not
specify option values, option count, instance count, or application behavior.

Each instance accepts a dynamic array of options with no hardcoded maximum.
Options can represent filters, categories, time periods, view modes, themes, or
other mutually exclusive choices. Every instance has its own controlled value,
callbacks, accessible name, and isolated native radio-group identity. Instances
must not share selection or interfere with each other's keyboard interaction.

The portfolio may later render two independent instances in its navbar: one for
color mode and another for visual style. Those are ordinary consumers of the
same generic component, not built-in modes, defaults, or specializations.

The component knows nothing about navigation, routing, theme selection,
application state, persistence, or storage. All option-specific work is supplied
by the consumer through callbacks.

## Existing architecture and constraints

- Reusable React components and their styling belong in `packages/ui-react`.
- Shared, framework-independent theme values belong in `packages/design-tokens`;
  Tailwind-specific mappings remain in its existing adapter.
- The current token package implements light/dark colors, system fallback, and
  nearest explicit `data-theme` scoping. Minimal/glass visual-style definitions
  and their selection mechanism are not implemented or approved yet.
- Storybook imports actual library exports and shared styles. Existing Tailwind
  source scanning must continue to include library components.
- Existing React Testing Library, user-event, Vitest, React Compiler, Tailwind 4,
  build configuration, CI, and release behavior are preserved.
- Add no dependencies, state library, headless component framework, generic
  selection engine, or framework-neutral runtime package.

## Approaches and recommendation

1. **Styled native radio inputs and labels — approved.**
   Native single-selection and keyboard behavior reduce custom event and focus
   handling. Labels provide the segmented appearance while the inputs retain
   semantics and focusability.
2. **Custom ARIA radio group.** This offers exact control over focus and keyboard
   behavior, but requires implementing and maintaining that behavior manually.
   No current requirement justifies that additional responsibility.

Tabs are not an alternative for this contract: tabs imply associated content
panels. Independent action buttons also do not express a mutually exclusive
selected value. The component is a choice control, not a tab-panel manager or a
general command toolbar.

The user approved the native-radio approach and confirmed that generic scope
must not be inferred from the screenshot's option or instance count.

## Approved public API

```tsx
export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
  onSelect?: (value: T) => void;
};

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

export type SegmentedControlProps<T extends string> = AccessibleName & {
  options: readonly SegmentedControlOption<T>[];
  value: NoInfer<T>;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  color?: React.CSSProperties["color"];
};
```

Export `SegmentedControl`, `SegmentedControlProps`, and
`SegmentedControlOption` from the package entry point and the component barrel.
Keep `AccessibleName` an implementation detail.

Approved API choices:

- Values are stable, unique string identifiers. Literal unions can express
  domain-specific allowed values without introducing domain-specific code.
  Numeric periods or categories can use string identifiers; object values and
  custom equality functions are outside this first API.
- Labels are nonempty text, used both visibly and as accessible names. Rich
  markup, icon-only options, tooltips, and nested interactive content are outside
  scope until a concrete use case requires them.
- `readonly` options support immutable consumer data. `NoInfer<T>` prevents the
  selected value from widening the option-value type during inference. Consumers
  can still supply an explicit string union when building options dynamically.
- One accessible naming method is required. `aria-labelledby` must reference
  existing visible text; `aria-label` must be meaningful and nonempty.
- `className` permits layout integration; supported appearance comes from
  component-owned styling and shared tokens, not consumer theme classes.
- There is no uncontrolled mode, default selection, theme prop, visual-style
  prop, fixed-size tuple, or exposed native radio name. Stable instance-specific
  names are generated internally using React's ID facilities.

Example with an arbitrary domain and three options:

```tsx
type Period = "week" | "month" | "year";

const periods: readonly SegmentedControlOption<Period>[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month", onSelect: handleMonthSelection },
  { value: "year", label: "Year", disabled: true },
];

<SegmentedControl
  aria-label="Reporting period"
  options={periods}
  value={period}
  onValueChange={setPeriod}
/>;
```

## Selection and callback contract

- `value` is the sole source of selected state. The component never optimistically
  updates selection or stores a competing selected value.
- A user selection of a different enabled option calls `onValueChange(nextValue)`
  first, followed by that option's optional `onSelect(nextValue)`, once each.
  This applies equally to pointer and keyboard selection.
- Re-activating the selected option does nothing. Plain focus and Tab entry do
  not invoke either callback.
- `onSelect` reports a user's requested selection. It does not wait for the parent
  to accept or render the value. The parent should use `onValueChange` for state;
  option callbacks are synchronous notifications, not async transactions.
- Disabled options invoke no callbacks. Component-level disabling disables all
  options. A selected disabled option stays visibly selected, but is not
  interactive.
- Parent-driven value changes, option reordering, addition, removal, and changes
  to disabled state never invoke selection callbacks.
- If the value is absent from the current options, no option is checked. Do not
  silently choose another option or emit a correction callback. An enabled
  choice remains reachable through normal native radio-group interaction.
- Empty options render nothing and invoke no callbacks. A single option is
  supported. An all-disabled group has no keyboard tab stop.
- Duplicate values and empty labels violate the documented consumer contract;
  do not invent value coercion or automatic deduplication.

Repeatable commands unrelated to a changed selection belong in another control.
Both this callback policy and string-only values were explicitly approved; they
are not requirements inferred from the screenshot.

## Accessibility and focus

Use a named `radiogroup` containing native radio inputs and associated labels.
Visually hidden inputs remain in the accessibility tree and keyboard interaction;
do not hide them with `display: none` or `visibility: hidden`.

- Assistive technology receives checked and disabled state from native inputs.
- Tab and Shift+Tab enter/leave the group using native radio behavior, normally
  reaching the selected enabled option. With no selected enabled option, preserve
  browser-native entry behavior rather than adding a custom roving-tabindex system.
- Arrow keys move among enabled options and select according to the native radio
  behavior; Space selects a focused enabled option. Disabled options are skipped.
- Labels provide pointer activation. Avoid custom keyboard handlers that duplicate
  native change events. Enter activation and custom Home/End behavior are not
  promised in this first API.
- Latest user amendment: remove all focus-specific visual effects, retaining
  hover styling only. Native focus/keyboard behavior remains, but focus is no
  longer visually distinguishable from selection. This explicitly supersedes
  the original visible-focus requirement and leaves a visual accessibility gap.
- If an option holding focus is removed or becomes disabled, restore focus to the
  selected enabled option, or the first enabled option if none is selected. Do
  not move focus on prop changes when focus is outside the control. If no enabled
  option remains, allow focus to leave normally; do not create a focus trap.
- Scroll a keyboard-focused segment into the local visible area without jumping
  the whole page unnecessarily.
- This component does not implement the special arrow-key behavior of a radio
  group inside an ARIA toolbar. Ordinary placement in a navbar does not require
  assigning the navbar a toolbar role.

Reference: [WAI radio-group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).
Browser-native differences, including entry into an unchecked group, are
acceptable when documented and checked in browser verification.

The user's planning clarification prioritizes KISS and native behavior for
keyboard navigation, focus, and scrolling. Start with browser behavior and CSS;
introduce narrowly scoped focus recovery or scrolling JavaScript only when
verification demonstrates it is necessary to satisfy the requirements above.
Do not introduce a custom keyboard-navigation or focus-management system.

## Appearance and responsive layout

Preserve the reference's visual direction without copying its option data or
pixel dimensions: a rounded outlined track, individual rounded segments, an
inset highlighted selected segment, and quiet unselected labels.

Use existing semantic surface, foreground, background, muted foreground, and
border tokens. A neutral foreground/background inversion is the initial selected
appearance, rather than the existing purple primary pairing. Do not copy palette
literals into the component or its stories. Use the existing Tailwind spacing,
typography, and radius scales; add shared tokens only if an actual missing role
is demonstrated and reviewed.

Use Tailwind utilities for layout and straightforward states. Colocate any
necessary custom CSS with `SegmentedControl`. The component owns hover,
focus-visible, selected, and disabled styling. Avoid a sliding selection
indicator and animation dependencies. Target at least 44 CSS pixels of segment
height, adequate text contrast, and an obvious selected/focus distinction.

The group is content-sized up to its available width. Keep a horizontal row;
constrained widths and larger option arrays use local horizontal scrolling,
without a fixed count breakpoint, page overflow, or compressed unusable targets.
Long labels may wrap within bounded segment widths rather than disappearing.
Do not virtualize options or impose a hardcoded maximum. Verify narrow layouts,
long/unbroken text, browser zoom, and keyboard access to initially offscreen
options. Application layout owns spacing between separate instances.

## Theme compatibility and delivery boundary

Color mode and visual style remain independent. The component must not inspect
option values for theme names, change document attributes, read storage, detect
application preferences, or receive appearance-selection props.

Use inherited semantic tokens and framework-owned styling, preserving the
existing light/dark selectors and nested/system behavior. This delivers working
light/dark appearance with the shared definitions available today.

Actual minimal/glass adaptation and previews depend on the focused shared theming
specification. Do not invent a visual-style selector, provider, duplicated
component, story-only palette, or glass theme in this work. When those shared
definitions become available, this same component must consume them through its
library-owned styling without changing its selection API. Do not claim glass
appearance is implemented or validated before that integration exists.

The user explicitly approved this staged delivery boundary. Working glass
appearance and its shared theming contract remain deferred rather than silently
expanding this component's scope.

## Tests and Storybook acceptance

Automated tests must cover:

- Named radio semantics, labels, checked state, and the public package exports.
- One, three, and larger dynamically generated option sets, without count-specific
  behavior; empty options and all-disabled groups.
- Controlled rerendering, a parent that declines a requested value, and no callback
  on prop-only updates.
- Click and keyboard selection; callback arguments, order, and exactly-once
  behavior; no callback for repeated selection or disabled choices.
- Component-level disabling and preservation of a disabled selected value.
- Two instances with overlapping option values and independent state/callbacks;
  selecting in either must not uncheck the other instance.
- Dynamic option removal/reordering and focus recovery without stealing focus
  from elsewhere; missing selected values.
- Type checking for inferred/explicit value unions, invalid selected values, and
  callback types, without runtime test-only public APIs.

Use existing Testing Library/user-event/Vitest infrastructure. jsdom assertions
do not establish contrast, native browser keyboard behavior, layout, scrolling,
or zoom correctness; inspect those in a real browser.

Storybook must consume `@portfolio/ui-react` and document the actual props,
controlled usage, callback semantics, keyboard behavior, and consumer contracts.
Provide working controlled examples for default selection, three or more
options, per-option actions, individual disabling, whole-component disabling,
multiple independent instances, and many/long options in constrained widths.

Use the real shared `data-theme` scopes for light/dark previews. Any wrapper is
only a scope/layout fixture: it must not define theme values or restyle component
internals. Add minimal/glass previews only when real shared style definitions
exist. Stories may own example state but not portfolio state or persistence.

After implementation, run the existing `pnpm check`, `pnpm run audit`, and
`git diff --check`. Verify representative keyboard interactions, narrow layouts,
focus visibility, contrast, and actual shared light/dark rendering in the browser.
Record any unverified browser or future-theme cases honestly.

## Boundaries and approval

No portfolio navbar integration, theme persistence, new theme architecture,
Vue/Angular implementation, tabs, routing, form submission API, rich option
content, or unrelated component/CSS cleanup belongs to this change.

The user approved this design, the implementation plan, the extension, and the
subsequent readability refactor. Implementation preserves the generic scope,
native-radio API, callback behavior, and deferred glass integration. The plans
record the implementation, review findings, and verification limitations.

## Requested extension — global scrollbars, mouse dragging, and custom color

The user subsequently requested these three additions together on 2026-10-24.
They supersede the original no-additional-props/no-shared-style-changes boundary
only for the optional `color` prop and the shared scrollbar foundation described
here. Existing selection semantics, accessible names, instance isolation,
disabled states, and native keyboard/touch interaction remain requirements.
The user clarified that `color` supports opaque accents only, to keep the
implementation simple. The user approved this extension design and plan; this
focused extension was implemented inline and independently reviewed.

### Global scrollbar foundation

Define scrollbar rules once in a framework-independent stylesheet imported by
`packages/design-tokens/src/index.css`. The portfolio and Storybook previews
already import that shared entry point; component-local scrollbar copies are
not permitted. The Storybook manager is a tool-owned document, distinct from
the project preview iframe, and is not restyled by this foundation.

Use the existing semantic surface, muted foreground, foreground, and border tokens
for scrollbar track, thumb, hover, and optional track inset shading respectively,
with adequate thumb/track distinction in both modes; do not paste reference hex
values into consumers. Retain the reference's thin appearance, targeting an 8px
vertical scrollbar and 5px horizontal scrollbar where vendor APIs permit exact
dimensions. Firefox's standard `scrollbar-width: thin` leaves actual thickness
to the browser/platform; pixel-identical dimensions cannot be promised there.

Use supported standard scrollbar properties and a mutually exclusive WebKit
pseudo-element path so one mechanism does not silently override the other.
Keep native scrollbars available; do not hide them or replace them with markup.
Allow high-contrast/forced-color modes to retain native system styling. Leave
unrelated global foundations and component styles alone.

### Mouse drag-to-scroll

Add a local primary-mouse Pointer Events interaction to the existing scrolling
group. Register a candidate only when horizontal overflow exists and the press
is in content, not the native scrollbar. Starting over an option is supported.
Do not intercept touch or pen input or disable native touch panning.

The proposed threshold is 6 CSS pixels of horizontal movement. Below it, preserve
normal clicks and their existing focus/selection/callback behavior. After crossing
it, capture the pointer, update only the group's horizontal scroll position, and
prevent the gesture's subsequent click from activating an option. A real drag
must never call `onValueChange` or `onSelect`, even when it begins/ends over an
option or reaches a scroll boundary.

Handle release, pointer cancellation, and lost capture without leaving a stuck
drag state or suppressing a later ordinary click/keyboard activation. Avoid
selection of label text while dragging. Keep grab/grabbing cursor feedback local
to overflowing mouse-scrollable content; retain disabled-option semantics.
Do not add momentum, snapping, a gesture library, a generic drag framework, or a
shared hook without another concrete consumer.

### Optional custom color and Storybook

The only public API addition is `color?: React.CSSProperties["color"]`, using the
existing React CSS color type. It is an accent color, independent of color mode,
visual style, application state, and persistence. String format validity is still
a browser/runtime concern, not something TypeScript can fully prove.

When omitted, preserve the existing semantic-token appearance exactly. When
provided, use component-scoped CSS custom properties for selected background and
related interactive styling. The later user amendment removes visual focus
indication without changing keyboard behavior.
Selected normal-sized text must meet the 4.5:1 contrast target against its actual
rendered background. Hover treatment must remain readable and disabled options
must retain their existing behavior. Add no color-processing dependency.

The user chose **opaque accent colors only**. Supported inputs are absolute,
fully opaque CSS colors understood by the browser, including custom hexadecimal,
named, RGB, HSL, and supported modern color functions. Transparent/alpha colors,
`transparent`, CSS-variable references, `currentColor`, and CSS-wide keywords are
outside this API contract. Do not add a color parser or support framework for
those excluded inputs. The CSS property type remains the public TypeScript type;
it cannot prove opacity or runtime CSS support for arbitrary strings.

Approved approach: native CSS `contrast-color()` chooses selected text
against the custom accent, and `color-mix()` derives a subtle accent-related hover
background. Keep hover text on a contrasting semantic foreground and retain the
native focus behavior; the later user amendment removes visual focus effects. Put
component-specific CSS beside SegmentedControl; keep Tailwind layout utilities.
Setting `color` does not select a theme or visual style.

Gate custom accent styling with CSS feature detection for its required native
features. Browsers without that support retain the existing semantic-token
appearance; do not apply an arbitrary accent with an unverified foreground.
The no-color case always retains the existing appearance. No custom contrast
resolver, Canvas sampling, backdrop compositing, theme observer, or color library
is planned.

Alternative considered: resolving the rendered backdrop and color with JavaScript
to support transparency/context-dependent inputs and legacy-browser custom
accents. This adds resolution/update handling that the chosen opaque-only scope
does not need, so it is deferred.

The CSS specification permits a browser-defined contrast algorithm. Verify the
actual selected text against the 4.5:1 target with light, dark, saturated, and
mid-tone opaque examples in the available browser; do not claim that feature
support alone proves that ratio for every browser/version/color. A measured
failure is a design/implementation finding, not permission to lower the target;
resolve it before accepting custom-color support in that environment. Report
untested engines and the older-browser semantic fallback explicitly.

Expose the real `color` prop through Storybook's native color picker. Preserve
the separate Storybook-only Preview color mode control; the two controls must
operate independently. Keep ConstrainedWidth and useful interaction/comparison
stories; SingleOption remains removed. Minimal/Glass remain unimplemented until
the shared visual-style system exists.

The picker documents the opaque-only contract; where the installed native control
offers an opacity toggle, disable it. Do not build a replacement picker or claim
support for transparent values produced by an unsupported control configuration.

### Extension verification

Use focused red/green tests for fitting versus overflowing groups, below/above
threshold gestures, both drag directions, gestures over options, callback
suppression, release/cancel cleanup, subsequent clicks, disabled options, and
untouched touch/keyboard behavior. Add custom-color API/type/default tests and
contrast tests appropriate to the chosen color implementation.

In real browsers inspect global horizontal/vertical scrollbars in both shared
color modes and separate scrollable consumers; test mouse dragging, short and
long option sets, touch behavior where tooling permits, keyboard navigation,
disabled states, and constrained widths. Check light, dark, and saturated custom
colors and both selection text and focus contrast. Run `pnpm check`,
`pnpm run audit`, and `git diff --check`; perform one final independent review,
fix material findings, report verification limitations, and do not commit.

Primary compatibility references:
[CSS Scrollbars](https://www.w3.org/TR/css-scrollbars-1/),
[Pointer Events](https://www.w3.org/TR/pointerevents3/), and
[CSS contrast-color](https://www.w3.org/TR/css-color-5/#contrast-color).
