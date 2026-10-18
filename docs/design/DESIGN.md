# Design decisions

This document records the implemented status page and its confirmed design
choices. The [specification](../specs/001-status-screen/spec.md) was approved
on 2026-10-19; the user subsequently requested its implementation without commits.
Verification limits are recorded below alongside the evidence.

## Design philosophy

The initial status page is minimal, modern, friendly, and slightly playful.
The [light](mockups/maintenance/maintenance_light_mode_mockup.png) and
[dark](mockups/maintenance/maintenance_dark_mode_mockup.png) mockups guide colors,
composition, proportions, and typography. Responsive reflow takes priority over
fixed mockup measurements. Their presentation margins are not a viewport frame.

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

The existing Tailwind sans-serif stack is unchanged. The heading uses
`text-3xl sm:text-4xl leading-tight font-bold`: 30px below 640px, 36px from
640px, weight 700, and 1.25 line height. The subtitle uses
`text-base leading-5`: 16px with 20px line height. Both inherit `foreground`.
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
