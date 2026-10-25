# React Storybook

Run these commands from the repository root after `pnpm install`:

```sh
pnpm storybook
pnpm build-storybook
```

Development runs at `http://localhost:6006`. The build produces a static site in
`apps/storybook/storybook-static`. Root `pnpm check` includes Storybook lint,
type checking, and the static build.

Stories import components directly from `@portfolio/ui-react`; no library build
is required for development. Preview CSS imports `@portfolio/design-tokens` and
its Tailwind mapping, and Vite compiles the shared library's utility classes.
Canvas colors follow the shared tokens, including the system color preference.

`Components/Button` has independent Filled, Outlined, BottomBorder, and Text
stories whose Controls update the real component. Color, labeled CSS radius
presets, text, icon selection/position, and disabled state are
editable. Radius is hidden for bottom-border, which always stays square.
`padding` retains normal/none presets; `paddingX` and `paddingY` accept independent
CSS values (for example `0`, `24px`, or `1rem`). Clear either field to restore its
preset default. The public API also accepts numeric pixel values.

Padding demonstrates no padding, horizontal only, vertical only, and both axes.
IconOnly and Disabled use the same live-args rendering as appearance stories.
Padding and ThemesAndStates forward shared customization to their actual buttons;
only controls for intentionally fixed content, spacing, or theme scopes are hidden.
Content and NativeLinks stories and the native form `type` control are omitted.
Preview color mode
uses the real shared light/dark tokens. Custom colors require consumer contrast
checks against the surrounding surface, including hover and meaningful borders.
Enabled clicks appear in the Actions panel. There is no size or loading API.

Button variant and radius choices use labeled radio controls, keeping every
option visible without the native select popups that rendered unreadably in the
desktop browser. No manager-wide select overrides are applied. Native button and
link semantics remain supported by the component API and library tests.

This app configures React only. Vue and Angular Storybooks and Design System
expansion are separate future work.

## SegmentedControl

`Components/SegmentedControl` documents a generic controlled radio group. Supply
any dynamic array of uniquely valued, nonempty text options; there is no fixed
option count. Each instance has its own selection, callbacks, and native group
name. The screenshot used during design guides appearance only.

```tsx
import { useState } from "react";
import {
  SegmentedControl,
  type SegmentedControlOption,
} from "@portfolio/ui-react";

type Period = "week" | "month" | "year";
const options: readonly SegmentedControlOption<Period>[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month", onSelect: (value) => console.log(value) },
  { value: "year", label: "Year", disabled: true },
];

function PeriodSelector() {
  const [value, setValue] = useState<Period>("week");
  return (
    <SegmentedControl
      aria-label="Reporting period"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  );
}
```

The package exports `SegmentedControlProps<T>` and `SegmentedControlOption<T>`
for string value unions. Supply exactly one group naming method: `aria-label`
or `aria-labelledby` referencing existing text. Other props are `options`,
`value`, `onValueChange`, and optional `disabled`, `id`, layout `className`, and
`color` (`CSSProperties["color"]`).
Options have `value`, `label`, optional `disabled`, and optional `onSelect`.

Changed user selections invoke `onValueChange(value)` and then the option's
`onSelect(value)`, once each. Re-selecting the current value does nothing. These
callbacks report a request: checked state changes only when the parent updates
`value`. Prop changes and focus entry do not invoke callbacks. Disabled options
cannot be activated; whole-component disabling preserves the displayed selection.
Empty arrays render nothing; an absent selected value leaves all options unchecked.

Tab enters/leaves the group; native arrow-key navigation skips disabled choices,
and Space selects the focused radio. Unchecked-group entry can differ by browser.
The component uses a small local focus-recovery step only when a focused option
is removed or disabled. Keyboard selection stays native; a nearest-aligned
`scrollIntoView` on focus reveals long segments that native arrows leave clipped.
Constrained widths scroll locally, with wrapping long labels. At the user's
request, SegmentedControl has no focus-specific visual effect, including for
keyboard interaction; only hover styling remains. The lack of a visible keyboard
focus indicator is a known accessibility gap.
Form submission and ARIA toolbar interaction are not supported APIs.

Overflowing controls also support primary-mouse drag scrolling, including gestures
that start over an option. Movement below 6px remains a normal click; a real drag
scrolls without selecting or invoking callbacks. Native scrollbars, touch panning,
and keyboard selection remain available. Fitting option sets retain normal input
behavior. Disabled options still cannot be selected, while their overflowing
content can be scrolled.

The **color** control is Storybook's built-in color picker and edits the actual
optional component prop. Use an opaque absolute CSS color, such as hexadecimal,
named, RGB, or HSL; transparency, CSS variables, and context-dependent colors are
outside this contract. Native `contrast-color()` chooses selected text and
`color-mix()` derives hover appearance. Browsers without those features retain the
semantic default pair rather than an accent with unverified text contrast. Clear
the color to restore the default appearance. Custom colors do not add a focus
effect.

Stories include in-canvas API usage, custom color, default/multiple options, option actions, individual and group
disabling, independent instances, constrained widths with 25 options, shared
light/dark color modes and nested scopes, a parent declining selection, and dynamic option changes.
Actions stories log callbacks, and controlled examples update their demo state.
The dynamic story schedules changes so keyboard focus can remain on the affected
option during inspection.

IndependentInstances and DynamicOptions are fixed behavior fixtures: their
selection/options are managed locally, and they do not consume all inherited
component controls, including `color`. Their Preview color mode wrapper still
works. Use Default, CustomColor, or ConstrainedWidth to explore component controls.

Regular SegmentedControl stories expose **Preview color mode** in the Controls
panel alongside the component controls. Choose **Light** (the initial preview)
or **Dark** to update a scoped `data-theme` wrapper using the actual shared tokens.
This is a Storybook-only argument, removed before props reach SegmentedControl;
it does not change the public component API or persist a theme preference.

ColorModes and NestedColorModes retain fixed light/dark scopes for comparison
and nesting checks, so they hide the single-mode control. Stories do not define
theme colors or visual-style selectors. Minimal and Glass previews remain
unimplemented; once the shared visual-style system exists, preview controls can
select visual style independently of color mode. No temporary styles or
application-specific values are built into the component.

`Foundations/Scrollbars` demonstrates horizontal and vertical overflow in shared
Light/Dark scopes using plain content. It consumes the same global foundation as
the portfolio and UI components; scrollbar CSS is not duplicated in stories.
See the [shared scrollbar design](../../docs/design/DESIGN.md#shared-scrollbar-foundation)
for platform behavior and compatibility.

## Authoring stories

Follow the [styling and Design System conventions](../../docs/design/DESIGN.md#styling-and-design-system-conventions).
Use typed stories to document existing reusable components, their supported
variants and states, and practical usage examples. Add foundation documentation
where it helps explain existing shared tokens.

Import the component from its library package and let it own its styling.
Keep preview CSS limited to the shared style setup and document defaults;
do not copy token values or component styles into stories. Page-only styling
belongs with the page, and undocumented future APIs must not be invented for
a story.
