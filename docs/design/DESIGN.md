# Design decisions

This document records confirmed design decisions for the portfolio. The
[StatusScreen specification](../specs/001-status-screen/spec.md) was approved by
the user on 2026-10-19 for technical planning. These decisions are not a claim that the feature or theme
changes are implemented. Update this document with actual implementation details
and verification outcomes when that work is approved and completed.

## Design philosophy

The initial status page is minimal, modern, friendly, and slightly playful.
Follow the [light](mockups/maintenance/maintenance_light_mode_mockup.png) and
[dark](mockups/maintenance/maintenance_dark_mode_mockup.png) mockups closely in
colors, composition, spacing, proportions, and typography hierarchy. Prioritize
responsive behavior over strict pixel-perfect measurements. The presentation
margins in the mockups are not a viewport frame.

## Semantic colors and themes

The user confirmed the supplied palette as global, owned by
`packages/design-tokens`:

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#F4F1ED` | `#0C0F14` |
| Foreground | `#000000` | `#F4F1ED` |
| Blob back  | `#CBD1D8` | `#202D3C` |
| Blob front | `#E1E8F0` | `#2E3D4D` |

Replace the existing global background and foreground values during
implementation and introduce shared semantic roles for the decorative layers.
This intentionally affects other consumers of background/foreground. Keep color
values in the token package and expose them through the existing Tailwind
mapping; do not duplicate them in status-specific themes or component literals.
Unrelated semantic roles remain unchanged unless a demonstrated issue requires
review. Final decorative-token names belong to technical planning.

The specification requires system color-scheme preference as the default, with
light fallback when no preference is available. Explicit `data-theme="light"`
or `data-theme="dark"` on the root or a nearer theme scope takes precedence over
system preference and inherited colors. This behavior is not yet implemented.
This feature introduces neither a toggle nor preference storage; the agreed
future `localStorage` preference remains outside its scope.

## Typography

Use the existing sans-serif font stack. Do not add font dependencies or download
a replacement font. Match the mockups' hierarchy through a prominent title and
smaller centered subtitle using existing utilities. Preserve subtitle newlines
and allow normal wrapping. Exact sizes and weights will be recorded after
implementation rather than invented during specification.

## Spacing and responsive layout

Center the composition horizontally and vertically when it fits; permit vertical
scrolling on short screens and with longer copy. Support widths down to 320 CSS
pixels without horizontal overflow for the initial content. Preserve the
illustration's aspect ratio and the organic shapes' arrangement: larger back
shape above/right, smaller front shape overlapping from the lower left.

Responsive reflow and readable text take priority over fixed mockup measurements.
Use existing spacing and sizing utilities; record the selected values and
responsive behavior when implemented. Exact blob contours are constrained by
close visual matching, not a pixel-perfect source geometry requirement.

## Component architecture

- `packages/design-tokens` owns semantic colors and theme definitions.
- `packages/ui-react` owns the reusable presentational `StatusScreen`, including
  its decorative shapes. Its required API is `title: string`,
  `illustration: ReactNode`, and `subtitle: string`. It contains no Coming Soon
  copy, app imports, or maintenance infrastructure.
- `apps/portfolio` owns the initial copy, `ComingSoonIllustration`, and page
  composition. The application/page owns the single `main` landmark;
  `StatusScreen` must render neither a `main` element nor `role="main"`.
- `App.tsx` remains minimal composition. The initial page has one level-one status
  heading, and exactly one main landmark.

Page-owned landmarks avoid nested main regions and keep the shared presentation
usable within different page shells. No additional abstraction or required prop
is needed to express this boundary.

## Illustration and SVG conventions

The supplied [original artwork](artwork/rocket-laptop-editable.svg) is retained
unchanged. Its original filename is `rocket-laptop-editable.svg`; it fulfills the
source-artwork requirement previously named `coming_soon_illustration.svg`.
It has a 400×400 view box, one compound path using `currentColor`, and even-odd
transparent cutouts. It contains no background blobs or separate stroke/color
layers. Keep blobs in the shared layout rather than adding them to this artwork.

The planned React conversion must preserve geometry, aspect ratio, and cutouts,
accept standard SVG props and `className`, and inherit the themed foreground
instead of forcing the source's root `color: #222222`. It must adapt the source's
static `title`/`desc` IDs and naming references so repeated instances do not
conflict. The source remains unchanged independently of those JSX adaptations.
No duplicate assets for light and dark themes are needed.

## Accessibility guidelines

The page supplies the single main landmark. Preserve heading, illustration, and
subtitle reading order. The initial illustration and both background shapes are
decorative, hidden from assistive technology, and unfocusable. A future consumer
owns the accessibility of its supplied illustration node; the shared slot must
not hide meaningful artwork indiscriminately.

Meet the specification's text contrast targets in both themes, support 200% zoom
and reflow at an effective width of 320 CSS pixels, and avoid clipped or truncated
text. Do not add live announcements, animation, or focus behavior to this static
screen. Verification of these outcomes remains future implementation work.

## Decision log

The following decisions were explicitly confirmed by the user and incorporated
into the specification. The complete specification was approved on 2026-10-19;
implementation still awaits plan review and execution authorization.

| Decision                                                 | Rationale                                                                                                                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apply the supplied colors globally.                      | Establish one consistent visual contract across consumers without duplicating status-specific color values. Global background/foreground changes are intentional. |
| Keep the existing sans-serif font stack.                 | Preserve the current typography foundation and avoid additional font dependencies.                                                                                |
| Closely follow the mockups, prioritizing responsiveness. | Retain the visual identity while allowing content to reflow across viewports and zoom levels.                                                                     |
| Let the application/page own `main`.                     | Keep landmark semantics with the page and prevent nested main regions when reusing the component.                                                                 |
| Use and retain the supplied original SVG.                | Preserve source geometry and transparent details while allowing a typed, theme-aware inline React conversion.                                                     |

Significant future changes to the design system must update this document with
the decision, its rationale, and any effect on existing consumers.
