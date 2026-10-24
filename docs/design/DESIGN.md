# Design decisions

This document records the monorepo's styling conventions and implemented design
decisions. The conventions below were requested by the user on 2026-10-24.
The status page's [specification](../specs/001-status-screen/spec.md) was approved
on 2026-10-19; its design details and dated verification evidence follow the
conventions. Historical verification does not establish coverage for later work.

## Styling and Design System conventions

### Ownership

| Location                 | Responsibility                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/design-tokens` | Shared colors, typography, spacing, border radii, and themes. Define framework-independent CSS custom properties; keep the existing Tailwind `@theme inline` mapping in `src/tailwind.css` as a separate adapter.                |
| `packages/ui-react`      | Reusable React components and their encapsulated styling. Expose genuinely reusable visual options through typed props when required. Components consume shared foundations and must not depend on portfolio pages or Storybook. |
| `apps/portfolio`         | Portfolio-specific composition, page/section layout, content, and styles that belong exclusively to those pages or sections.                                                                                                     |
| `apps/storybook`         | Documentation and examples consuming real library exports and shared foundations. Storybook is not the source of component styling or token values.                                                                              |

These are ownership rules, not instructions to create every category now.
The token package currently defines semantic colors and light/dark themes.
Typography, spacing, and radii currently use Tailwind's existing default scales.
Keep those defaults until actual shared design requirements justify project
tokens; then define their values once in `packages/design-tokens` and map them
for Tailwind consumption. One-off illustration proportions and page geometry do
not become shared tokens merely because they are numeric values.

### Choosing and locating styles

- Prefer Tailwind utilities directly in components for layout, spacing,
  flex/grid, alignment, responsiveness, and simple visual styling. Semantic
  utilities such as `bg-primary`, `text-foreground`, and `fill-blob-back` consume
  the shared token mapping; do not repeat palette literals in consumers.
- Keep a reusable component's visual styling inside that component. If a
  required appearance is a reusable variant, make it a typed prop implemented
  by the component rather than copying its markup or styling in a page. Use
  complete Tailwind class names for the supported cases. Add neither variants
  nor a variant-management dependency speculatively.
- When custom CSS is needed, colocate its stylesheet with the component and
  import it there. Scope selectors to that component. Utility-only components
  do not need an extra stylesheet. Keep page/section-only CSS within the owning
  page or section; do not move it into the UI library or a global stylesheet.
- Global stylesheets are entry points for token/theme imports, Tailwind setup,
  source scanning, and minimal document defaults. Do not accumulate unrelated
  component classes there. Avoid global selectors that change another
  component's internals.
- Reuse an existing component or token when its responsibility fits. Do not
  extract a component, CSS class, or shared configuration solely because two
  utility lists look alike. Apply KISS, DRY, and SOLID according to an actual
  responsibility, and add no dependency without demonstrated need.
- Preserve current appearance, interaction, theme scoping, accessibility, and
  responsive behavior when organizing styles. A conventions update is not
  authorization for a broad CSS refactor or a new Design System API.

### Focus styling

Across React, Vue, and Angular, buttons, inputs, switches, and other interactive
components should avoid default browser outlines and prominent CSS outline rings
unless explicitly requested. Prefer subtle, custom-designed focus indicators
that match the visual identity, using `:focus-visible` where appropriate to
distinguish keyboard focus from ordinary pointer interactions. By default retain
visible keyboard focus through accessible borders, box-shadows, or equivalent
styling. Do not add a global `outline: none` reset without replacement indication.

Explicit exception: the user subsequently requested no focus effect on
SegmentedControl, only hover styling. Its native keyboard behavior remains, but
it has no visible keyboard focus indicator. This is a visual accessibility gap,
not a convention to copy into future components.

### Storybook and shared styling

The existing [React Storybook](../../apps/storybook/README.md) imports components
from `@portfolio/ui-react`. Its preview imports `src/styles.css`, which loads
`@portfolio/design-tokens`, the shared Tailwind adapter, and Tailwind itself.
The Vite configuration uses the Tailwind plugin, and `@source` includes the
library's source so its utilities are generated. The library also imports its
own style entry. Keep this source-consumption contract working; no prebuilt
library is required for Storybook development.

Keep component-specific styles with their components, not in stories or preview
CSS. The preview's token-based body background/foreground are document defaults.
Do not duplicate theme values, component implementations, or app styles just to
make a story match the application.

Use typed stories for reusable components' supported variants, states, and usage
examples as their actual APIs evolve. Document foundations where that helps
consumers understand or use an existing foundation; do not create unused tokens
to populate documentation. Today Button has Default and Disabled stories with
native prop controls; it has no visual variant, size, or loading API. Additional
foundation coverage is future work. SegmentedControl now has typed controlled
stories for options, disabled states, callbacks, independent instances, dynamic
changes, narrow widths, and shared light/dark modes. This Storybook remains React-only;
Vue and Angular will have separate Storybooks, with no Composition added here.

### Existing gaps and follow-up work

The inspection on 2026-10-24 identified the following; this iteration changes
documentation only and does not resolve them through visual or API changes:

- Button's dark primary background (`#8b7cff`) and white text compute to 3.27:1
  contrast, below this project's 4.5:1 normal-text target. The light pair computes
  to 4.54:1. Review the dark primary text/background pairing in a design iteration.
- Button has no explicit hover, focus-visible, or disabled appearance. Its native
  `className` prop replaces its default class list because props are spread after
  `className`. Define the intended styling/variant contract before expanding its
  API; keep native behavior and current appearance unchanged in this iteration.
- Typography, spacing, and radius foundations have no project-owned token
  definitions yet; components use Tailwind defaults. Evaluate shared requirements
  before introducing tokens. The status page's current sizes are documented
  below; this update corrects outdated prose without changing those sizes.
- Library and application/Storybook CSS entries each initialize Tailwind. The
  static Storybook build currently emits overlapping utility/preflight content
  in its preview and library CSS assets. Review CSS delivery when defining the
  library's distribution contract; do not remove required imports or scanning
  without validating consumers.
- The dark palette is repeated for explicit themes and system preference in the
  token package. Future consolidation must preserve explicit and nested theme
  precedence and system fallback.
- Storybook now documents Button, SegmentedControl, and shared scrollbars;
  StatusScreen still has no stories. Add useful coverage as those APIs and
  foundations are reviewed, without inventing new components or variants.

### Conventions verification — 2026-10-24

This update changes development documentation and agent instructions only.
No source, styling, configuration, or dependency change was needed to establish
the conventions. `pnpm check` passed formatting, lint, type checking, all 12
tests across four files, and the React library, portfolio, and Storybook builds.
`git diff --check` passed. Storybook retained its existing preview chunk-size
warning.

The running Storybook reloaded the imported Button with shared dark primary,
foreground, and canvas colors and no browser console errors. The available
browser has no system-color emulation; native light-mode and live system
switching were not retested. Existing theme/browser verification limits below
remain applicable.

## Design philosophy

### SegmentedControl — 2026-10-24

The [approved component design](../superpowers/specs/2026-10-24-segmented-control-design.md)
defines a generic controlled single-selection component, independent of portfolio
navigation or theme persistence. The reference screenshot informs its outlined
rounded track and inset selected pill only; option counts, values, and callbacks
are entirely supplied by each consumer.

Native radio inputs own selection semantics and keyboard navigation. Browser
inspection demonstrated that removing a focused radio drops
focus to the page body; a local recovery step selects a focus target (without
changing selection) only after removal/disabling. At 320px, native arrow focus
also left a long-label segment partly clipped. A nearest-aligned `scrollIntoView`
on focus addresses that browser-verified gap. The approved extension adds local
primary-mouse drag scrolling only when overflow exists, using a 6px threshold,
native pointer capture, and suppression of the drag's click. There are no custom
keyboard handlers, roving tabindex, global scroll listeners, or gesture library;
touch input keeps native panning.

The approved readability refactor keeps generic pointer handling in the internal
`useHorizontalDragScroll` hook and radio recovery/reveal in the component-local
`useRadioGroupFocus` hook. A bubbling group focus handler refreshes a pending
drag's scroll baseline after the input reveals itself. The hooks have no public
exports, configuration layer, or application-specific behavior. Selection,
callback dispatch, public types, and rendering remain in SegmentedControl.

Component-owned Tailwind styles consume existing semantic tokens. The selected
segment inverts foreground/background; the track uses surface and border roles,
and unselected text uses muted foreground. Segment height is at least 44px;
horizontal overflow stays within the control, and long labels can wrap. Selected,
hover, and disabled appearance stay in the library without consumer appearance
classes or added palette values.

The optional `color` prop accepts opaque absolute CSS accents. Colocated component
CSS uses custom properties, native `contrast-color()` for selected text, and
`color-mix()` for hover states. Focus-specific visual styling was removed at the
user's explicit request; hover remains independent of keyboard focus.
Custom accents are guarded by CSS feature detection;
unsupported engines and omitted colors retain the original semantic pair.
Transparency, CSS-variable colors, JavaScript color resolution, and color libraries
are outside the approved scope. Actual contrast must be measured, not inferred
from feature detection alone.

Regular stories expose a Storybook-only Preview color mode control using an
inherited shared `data-theme` scope; the argument is never forwarded to the
component. Fixed side-by-side and nested comparisons remain useful independently
of that control. The SingleOption story was removed; the component still supports
single options without imposing a minimum.

Light/dark Storybook scopes use the actual shared themes. Glass appearance and
the visual-style selection mechanism remain deferred; this component adds no
theme prop, provider, selector, persistence, or new shared theme implementation.
See the [implementation plan](../superpowers/plans/2026-10-24-segmented-control.md)
for verification evidence and any remaining browser limitations.

### Switch

`packages/ui-react` exports the controlled binary `Switch`, `SwitchProps`, and
`SwitchState`. `checked` and `onCheckedChange` belong to the consumer; the
component uses one native checkbox with `role="switch"`. Clicking anywhere
toggles, Tab enters/leaves, and Space toggles using native browser behavior.
Provide exactly one stable `aria-label` or `aria-labelledby`; both visual state
contents are decorative to assistive technology.

`uncheckedState` and `checkedState` supply nonempty text labels and optional
ReactNode icons. `presentation` selects text (default), icon-text, or icon-only;
icon-only requires both icons through the public type. Supply noninteractive
icons using `currentColor`. No icon library, theme logic, persistence, or
application state is included.

An outlined rounded surface, equal-width positions, and a sliding highlight
reuse the SegmentedControl visual language and semantic tokens. Labels wrap
inside constrained widths. Native disabled behavior retains selection; subtle
hover and disabled appearance stay in the library. Keyboard focus uses a
component-local foreground border and 1px box-shadow, without a prominent outline.
Transitions respect reduced motion. The optional opaque absolute `color` accent
uses the same feature-detected CSS contrast/mixing contract and semantic fallback
as SegmentedControl. Shared light/dark scopes work unchanged; visual-style themes
remain deferred.

`Components/Switch` documents text, icon-text, icon-only, disabled, light/dark,
custom color, and constrained-width examples. Default covers text-only usage;
there is no duplicate TextOnly story. The Preview color mode control follows
the existing Storybook-only convention.

### Shared scrollbar foundation

`packages/design-tokens/src/scrollbars.css` is imported once by the shared CSS
entry point already consumed by the portfolio and Storybook previews. It applies
to ordinary overflow regions and UI components, with no component-specific copies.
Track, thumb, thumb hover, and inset shading use the existing semantic surface,
muted foreground, foreground, and border roles respectively, so nested shared
Light/Dark scopes adapt without new palettes.

The standards path uses `scrollbar-width: thin` and `scrollbar-color`; engines
supporting WebKit scrollbar pseudo-elements use a mutually exclusive 8px vertical
and 5px horizontal path. Native scrollbar visibility and scrolling remain intact.
Firefox/platform thickness and hover capabilities may differ; forced-color modes
retain native styling. OS overlay-scrollbar preferences can still govern when a
scrollbar is displayed. Storybook's tool-owned manager is outside the project
preview stylesheet; its own scrollbars are not overridden.

### Status page

The initial status page is minimal, modern, friendly, and slightly playful.
The [light](mockups/maintenance/maintenance_light_mode_mockup.png) and
[dark](mockups/maintenance/maintenance_dark_mode_mockup.png) mockups guide colors,
composition, proportions, and typography. Responsive reflow takes priority over
fixed mockup measurements. Their presentation margins are not a viewport frame.

## Planned theming architecture

The planned system has two independent customization dimensions:

- **Color mode:** light and dark.
- **Visual style:** minimal and glass initially, with more styles possible later.

Every combination must be supported: minimal-light, minimal-dark, glass-light,
and glass-dark. These names describe combinations, not proposed API values or
selectors. Each framework's UI library serves all combinations through the same
components; do not duplicate libraries or component implementations per theme.

Framework-independent foundations and shared theme values belong in
`packages/design-tokens`. Component styling and behavior belong in each
framework's UI library. When theming is implemented, shared components must
consume semantic tokens and adapt through their library-owned styling to the
selected visual style. Consumers must not need to add appearance-specific CSS
classes manually. Component-specific variants remain separate from these theme
dimensions; this direction does not require a theme prop on every component.
Applications and Storybook consume the shared definitions without copying theme
values or recreating component appearance rules.

Preserve the existing `data-theme="light"` / `data-theme="dark"` behavior,
including system fallback and nearest explicit theme precedence. Do not overload
those values with visual styles or combined names. The final selection API,
style selectors, token coverage, composition mechanism, and any provider needs
remain undecided until a focused theming specification is approved.

This direction refines the overview's [progressive customization](../project-overview.md#progressive-customization).
The agreed future `localStorage` choice for the initial color-mode preference
remains intact. This documentation adds no themes, selectors, tokens, or runtime
behavior; the current light/dark implementation is described below.

## Semantic colors and themes

The supplied palette is global and owned by `packages/design-tokens`:

| Role       | Token                   | Light     | Dark      |
| ---------- | ----------------------- | --------- | --------- |
| Background | `--ds-color-background` | `#F4F1ED` | `#0C0F14` |
| Foreground | `--ds-color-foreground` | `#000000` | `#F4F1ED` |
| Blob back  | `--ds-color-blob-back`  | `#CBD1D8` | `#202D3C` |
| Blob front | `--ds-color-blob-front` | `#E1E8F0` | `#2E3D4D` |

The existing Tailwind mapping exposes `background`, `foreground`, `blob-back`,
and `blob-front` color utilities, including the layout's `fill-blob-back` and
`fill-blob-front`. Other semantic values are preserved. This intentionally
changes background/foreground for every token consumer without duplicating
palette literals in app or library components.

Light values apply at `:root` and `[data-theme="light"]`. The dark stylesheet
provides `[data-theme="dark"]` and an equivalent palette inside
`@media (prefers-color-scheme: dark)` limited to a root without a supported
explicit theme. System defaults stay on the root; nearer explicit scopes define
their own values instead of inheriting an ancestor's palette. All existing
semantic roles switch together. Default light declarations provide the
no-preference fallback. Native media queries provide live system switching;
the evidence below distinguishes implementation from browser verification.

This feature adds no toggle, provider, or storage. The agreed future
`localStorage` preference remains outside its scope.

## Typography

The existing Tailwind sans-serif stack is unchanged. The current heading uses
`text-4xl sm:text-6xl leading-tight font-bold`: 36px below 640px, 60px from
640px, weight 700, and 1.25 line height. The subtitle uses
`text-lg leading-5`: 18px with 20px line height. Both inherit `foreground`.
`whitespace-pre-line` preserves actual subtitle newlines alongside automatic
wrapping; `wrap-anywhere` on both text elements also breaks long unbroken words.
There is no HTML parsing, truncation, line clamp, or fallback copy.

## Spacing and responsive layout

The app's `main` uses `flex min-h-svh flex-col px-6 py-12`: at least 100svh,
24px horizontal and 48px vertical padding. Its wrapper uses `my-auto w-full`.
Automatic margins center content when it fits and yield to normal document
growth when it does not. The shared component fills available width, with
`min-w-0`, centered text, and normal heading/stage/paragraph flow.

The stage uses `aspect-[5/4] w-full max-w-80 shrink-0` (at most 320×256px).
A supplied inline SVG scales to 64% of stage width with automatic height;
the slot has 8% top padding to place the drawing lower within the shapes.
The paragraph uses `mt-6 max-w-lg` (24px gap, at most 512px wide).

Only the two blob SVGs are positioned absolutely, inside an isolated stage.
Their organic contours are authored in `StatusScreen`: the back is 88% wide,
108% high, 7% from the right, and extends 12% above the stage; the front is
59% wide, 67% high, at the left and 2% above the bottom. The artwork is painted
over both; the heading's stacking level preserves its visibility. Relative
proportions scale with the stage. The page has no viewport frame or fixed height,
and allows vertical scrolling rather than clipping longer content.

## Component architecture

- `packages/design-tokens` owns semantic colors and theme definitions.
- `packages/ui-react` exports `StatusScreen` and `StatusScreenProps`. The exact
  required API is `title: string`, `illustration: ReactNode`, and
  `subtitle: string`. It owns layout and decorative shapes, with no portfolio
  copy, app imports, status enums, or maintenance infrastructure.
- `apps/portfolio` owns the initial copy, `ComingSoonIllustration`, and page
  composition. `App.tsx` supplies the single `main`; the shared component
  renders no main element or main role. Page-owned landmarks support reuse
  inside different shells without nested main regions.

## Illustration and SVG conventions

The supplied [original artwork](artwork/rocket-laptop-editable.svg) is retained
unchanged. Its original filename is `rocket-laptop-editable.svg`; it fulfills the
source-artwork requirement previously named `coming_soon_illustration.svg`.
It has a 400×400 view box, one compound path using `currentColor`, and even-odd
transparent cutouts. It contains no background blobs or separate stroke/color
layers. Blobs remain in the shared layout.

`ComingSoonIllustration(props: SVGProps<SVGSVGElement>): ReactElement` preserves
that compound path and view box. Standard props are spread after intrinsic
400×400 dimensions so callers can override dimensions, styles, classes, and
accessibility attributes. SVG's default aspect-ratio preservation remains in
effect. Removing the source's fixed root color lets `currentColor` inherit the
page foreground or a caller's style.

The React version omits the source's `title`, `desc`, static IDs, and
`aria-labelledby`. Meaningful callers supply standard `role="img"` and
`aria-label`; decorative callers supply `aria-hidden="true"` and
`focusable="false"`. There are no internally generated IDs, so repeated
instances have no naming collisions. The source remains unchanged, and one
inline asset serves both themes.

## Accessibility guidelines

The page supplies one main landmark and one level-one heading. Reading order is
heading, illustration, subtitle. The initial illustration and both blobs are
hidden from assistive technology and unfocusable. A different consumer owns its
supplied illustration's accessibility; the shared slot does not hide meaningful
artwork. Both text elements wrap without truncation. No live announcements,
animation, autofocus, or other focus behavior is added to this static page.

## Implementation verification — 2026-10-19

The actual `pnpm start` server used `http://localhost:5175/` because earlier ports
were occupied. The in-app browser's native system preference was dark. Temporary
local fixtures exercised nested scopes, alternate component props, repeated SVGs,
and explicit themes around the actual app entry page in an iframe. The fixtures
and controls were removed after verification; no extra route or controls ship.

- Before implementation, the native dark system produced white background,
  `#171717` text, and absent blob tokens. Afterward, the unoverridden page used
  the approved dark palette.
- Under that dark system, all 11 semantic roles matched expected values for root
  system/light/dark settings, explicit light/dark scopes, dark inside light, and
  light inside dark (15 scope checks). Explicit light retained its light surface,
  primary, muted, border, foreground, and blob values.
- Both themes were inspected at 320×568, 390×844, 844×390, 1440×900, and the
  mockups' 921×573 CSS-pixel size. Computed text, artwork ink, and blob colors
  matched the table. Every case satisfied `scrollWidth <= clientWidth`.
  The 844×390 case grew to 461px document height; scrolling exposed the entire
  subtitle with bottom padding. Other initial-content cases fit vertically.
- At 320px outer width, long headings, six subtitle lines, 100-character unbroken
  headings, 150-character unbroken subtitles, and null artwork remained in flow
  in both themes. With a scrollbar the content viewport was 305px wide and still
  had no horizontal overflow. Document heights were 708px for long/null cases
  and 993px for the unbroken-word case. Scrolling reached the final subtitle line.
- The actual page's accessibility tree exposed the heading and readable subtitle
  without decorative artwork. DOM inspection found exactly one `main`, one
  `h1`, and no focus targets. Pressing Tab left document focus on `body`.
  Component tests separately verified meaningful consumer artwork remains named.
- Two inline instances were inspected in both themes: each remained square,
  inherited the correct ink, preserved visible cutouts, and had distinct supplied
  accessible names without internal IDs or naming references. The original
  artwork SHA-256 remained
  `DF91DF4BCFB26C6550F4FCF826C456BB964F069F746D12AB30F86EA74A35D264`.

Relative luminance uses the sRGB linearization threshold 0.04045, channel weights
0.2126/0.7152/0.0722, and `(Llighter + 0.05) / (Ldarker + 0.05)`:

| Theme | Text / background     | Contrast | Outcome                                |
| ----- | --------------------- | -------- | -------------------------------------- |
| Light | `#000000` / `#F4F1ED` | 18.65:1  | Passes 4.5:1 subtitle and 3:1 heading. |
| Dark  | `#F4F1ED` / `#0C0F14` | 17.05:1  | Passes 4.5:1 subtitle and 3:1 heading. |

Remaining manual browser checks: native light/no-preference system fallback,
live system preference changes, the nested-scope matrix under a light system,
and actual 200% browser zoom. The available browser exposes viewport resizing,
but no color-scheme or zoom emulation. Five zoom-in shortcuts left a 640px
viewport and device-pixel ratio unchanged, so that attempt is not counted as
zoom evidence. Reflow at 320 CSS pixels was verified independently. No claim of
complete AC-06/AC-09 browser verification is made.

Automated verification: `pnpm check` passed formatting, lint, both TypeScript
projects, all 12 tests across four files, and both production builds.
`git diff --check` passed. The sandbox's default temporary cache directory
initially caused a Vitest `EPERM`; checks passed with process-local `TEMP`/`TMP`
pointing at `node_modules/.cache/status-screen-temp`. No project configuration,
dependencies, lockfile, compiler, Tailwind integration, CI, or release workflow
was changed to accommodate verification.

A fresh, read-only review inspected tracked changes and all new implementation
and test files against the specification and the plan's five review focus cases.
It found no critical, important, or minor issues. The review retained the agreed
consumer-sizing responsibility for arbitrary artwork and the supported
light/dark override contract, and left the pre-existing duplicate Button export
outside this change. Manual browser checks above remain outstanding.

## Decision log

These decisions were confirmed in the specification; implementation was requested
on 2026-10-19 without commits.

| Decision                                              | Rationale                                                                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Apply the supplied colors globally.                   | Establish one visual contract across consumers without duplicating status-specific values.                                  |
| Keep the existing sans-serif font stack.              | Preserve the typography foundation and dependency footprint.                                                                |
| Follow mockups closely, prioritizing responsiveness.  | Retain the visual identity while allowing reflow across viewports and zoom levels.                                          |
| Let the application/page own `main`.                  | Keep landmark semantics with the page and avoid nested main regions.                                                        |
| Use and retain the supplied original SVG.             | Preserve geometry and transparent details while supporting a typed, theme-aware inline conversion.                          |
| Use native CSS media queries for system defaults.     | Add live preference handling without introducing JavaScript detection, a provider, or the future persistent theming system. |
| Use normal flow and automatic margins for the layout. | Center short content while keeping expanded copy and short viewports vertically reachable.                                  |

Significant future design-system changes must update this document with the
decision, its rationale, and its effect on existing consumers.
