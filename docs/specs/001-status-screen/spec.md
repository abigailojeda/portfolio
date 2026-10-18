# 001 — Reusable Status Screen

Status: Approved by the user on 2026-10-19 for technical planning.

Phase: Specification complete; implementation requires plan review and execution-method selection.

## 1. Overview and motivation

Provide a reusable, presentational `StatusScreen` for temporary informational
pages. Its first consumer is the publicly accessible Coming Soon page in the
portfolio app, replacing the current placeholder while the landing page is
developed. Future consumers can supply maintenance or other temporary status
content without changing the shared component.

Success means that visitors can immediately read the status on small and large
screens, in light and dark themes, while the component remains independent of
portfolio content and infrastructure.

This document defines required outcomes, constraints, and review questions. It
does not define an implementation task sequence. User-confirmed decisions are
recorded in section 12; the user approved this specification as a whole on
2026-10-19. That approval permits technical planning, not implementation.

## 2. Verified repository context

The repository was inspected on 2026-10-18. The following describes existing
source and configuration, not completed feature behavior:

- The private pnpm workspace contains `apps/portfolio`, `packages/ui-react`, and
  `packages/design-tokens`. No existing specification directory, SDD template,
  or SDD tooling was found. This feature uses lightweight Markdown at the
  requested `docs/specs/001-status-screen/spec.md` location.
- The app uses React 19, TypeScript, Vite 8, Tailwind CSS 4, and React Compiler.
  `App.tsx` currently renders a `main`, a Portfolio heading, and the shared Button.
- The React library exports a Button and consumes shared Tailwind token mappings.
  The app also scans library source for Tailwind utilities.
- Shared CSS defines background, foreground, surface, primary, muted, and border
  roles. Light values apply at `:root` and `[data-theme="light"]`; dark values
  apply at `[data-theme="dark"]`. There is no `prefers-color-scheme` handling,
  theme selector, or preference persistence in the inspected application.
- Existing background/foreground values are `#ffffff`/`#171717` for light and
  `#111111`/`#f5f5f5` for dark. There are no blob-specific tokens or project font
  assets. The user has confirmed replacing the global background/foreground
  palette and adding global semantic colors for the decorative layers; these
  changes are specified here but not implemented.
- Vitest has app and React library projects using jsdom, React Testing Library,
  and jest-dom. Only the Button currently has tests. There is no configured
  browser visual or accessibility test runner.
- Root scripts provide formatting, lint, type checks, tests, build, and combined
  `pnpm check`. Husky enforces checks and Conventional Commits. CI targets `dev`
  and `main`; releases run from `main`. These workflows must remain intact.
- Both reference mockups exist under `docs/design/mockups/maintenance/`.
  The user subsequently supplied `rocket-laptop-editable.svg`, retained unchanged
  under `docs/design/artwork/`. This is the original asset previously described
  as `coming_soon_illustration.svg`; the React component remains named
  `ComingSoonIllustration`. `docs/design/DESIGN.md` now records confirmed
  decisions and distinguishes them from implemented behavior.

Context sources: [project overview](../../project-overview.md),
[workspace scripts](../../../package.json),
[current app](../../../apps/portfolio/src/App.tsx),
[token definitions](../../../packages/design-tokens/src/index.css),
[Tailwind mapping](../../../packages/design-tokens/src/tailwind.css), and
[test configuration](../../../vitest.config.ts).

## 3. Scope and non-goals

### In scope for the eventual feature

- A typed, reusable `StatusScreen` in `packages/ui-react`.
- Title, illustration, subtitle, and two decorative organic background shapes.
- Responsive layout, accessibility, shared semantic colors, and light/dark
  behavior that follows the system unless explicitly overridden.
- App-owned Coming Soon copy, a typed inline SVG illustration, and minimal app
  composition replacing the placeholder at the existing application entry point.
- Retention of the supplied original SVG as source artwork.
- Relevant automated checks, browser verification, and design documentation.

### Explicit non-goals

- Navigation, buttons, countdowns, email signup, contact links, or added content.
- Maintenance detection, feature flags, environment switches, backend services,
  authentication, routing infrastructure, or HTTP maintenance response handling.
- Theme-toggle UI, theme storage, a theme provider, or a general customization
  system. The overview's agreed future `localStorage` preference is preserved;
  persistence is not implemented or redesigned by this feature.
- Vue/Angular components, cross-framework integration, component explorers, or
  landing-page sections.
- New animation, translation infrastructure, fonts, dependencies, services, or
  architectural layers without a separately justified and approved requirement.
- Deployment, merging, release changes, or unrelated cleanup.

### Specification-phase boundary

Create and review this specification, retain the supplied source artwork, and
document confirmed decisions in `DESIGN.md`. Do not modify production code,
dependencies, or tooling; create a technical implementation plan; or deploy or
merge. Update `DESIGN.md` during implementation with the resulting design details
and verification evidence. Specification approval is required before planning
begins. The user granted that approval on 2026-10-19; technical planning may now
proceed. Production changes still await plan review and execution authorization.

## 4. User stories

- As a portfolio visitor, I can see that the site is coming soon and read the
  accompanying message without interpreting the illustration.
- As a visitor using a phone, zoom, or a short viewport, I can read all content
  without horizontal scrolling or clipped text.
- As a visitor with a light or dark preference, I see a readable presentation
  that follows that preference unless an explicit theme override is present.
- As a screen reader user, I can identify the page heading and read the message
  without hearing decorative artwork or duplicate content.
- As a React library consumer, I can reuse the same status layout with different
  copy and a different React illustration node without editing library internals.

## 5. Functional requirements

| ID    | Requirement                                                                                                                                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | Export `StatusScreen` and its named props type from `@portfolio/ui-react`. The required props are `title: string`, `illustration: ReactNode`, and `subtitle: string`. No additional required props may be introduced.                                                         |
| FR-02 | Render the supplied title above the illustration, and render the subtitle beneath the illustration in smaller, centered text. Preserve this order in the DOM as well as visually.                                                                                             |
| FR-03 | Render the supplied illustration node without substituting a built-in Coming Soon asset. The component must not interpret the node as a URL.                                                                                                                                  |
| FR-04 | Preserve actual newline characters in the subtitle as visible line breaks, including the initial two-line message. Permit normal wrapping within each line on narrow screens. Treat title and subtitle as text, not HTML.                                                     |
| FR-05 | Render two overlapping organic shapes behind the illustration. They belong to the reusable presentation, not the app-specific artwork, and must not obscure the title, subtitle, or illustration.                                                                             |
| FR-06 | Keep the component presentational: no navigation, fetching, timers, theme state management, storage access, or maintenance logic.                                                                                                                                             |
| FR-07 | The application entry page must compose `StatusScreen` with title `COMING SOON`, subtitle `Something awesome is in the works.\nCome back soon!`, and `ComingSoonIllustration`. In that notation, `\n` means a real line-feed character, not a visible backslash and letter n. |
| FR-08 | Replace the existing Portfolio heading and demo Button on the entry page. Visitors must not need authentication or additional navigation to view the Coming Soon content. This does not require a deployment in this phase.                                                   |
| FR-09 | Keep `App.tsx` limited to composition of app content and shared presentation; define neither the status layout nor inline SVG geometry there.                                                                                                                                 |

## 6. Design and responsive requirements

Reference artwork:

- [Light mockup](../../design/mockups/maintenance/maintenance_light_mode_mockup.png)
- [Dark mockup](../../design/mockups/maintenance/maintenance_dark_mode_mockup.png)

Despite their directory names, both mockups show Coming Soon content. They are
the visual references for this feature, not evidence of maintenance behavior.

| ID    | Requirement                                                                                                                                                                                                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DS-01 | Match the reference hierarchy: prominent centered heading, central rocket/laptop illustration, two overlapping organic shapes, and a smaller centered two-line message. Keep the style minimal, friendly, slightly playful, and visually balanced in both themes.                                                  |
| DS-02 | The back shape is larger, above and to the right of the smaller front shape. The smaller shape overlaps from the lower left; the illustration sits above both. Preserve the reference arrangement as the composition scales. Follow the mockup contours and proportions closely while allowing responsive scaling. |
| DS-03 | Fill at least the available viewport height with the themed background and center the content group horizontally and vertically when it fits. The mockups' presentation margins are not a required viewport border, frame, or fixed inset.                                                                         |
| DS-04 | On short viewports or when content grows, allow vertical scrolling so every line remains reachable. Do not enforce a fixed height that clips content. Maintain space between the content and viewport edges.                                                                                                       |
| DS-05 | Support widths down to 320 CSS pixels without horizontal scrolling, overlapping text, or cropped artwork for the initial content. Scale the illustration and shapes proportionally, preserve the SVG aspect ratio, and allow text to wrap.                                                                         |
| DS-06 | Longer titles and subtitles must expand the layout rather than overlap the artwork or each other. Do not truncate content or enforce a fixed line count.                                                                                                                                                           |
| DS-07 | Use existing Tailwind integration and semantic values owned by `packages/design-tokens`; do not scatter palette literals through app and library components. Typography and spacing should use existing utilities unless an approved requirement demonstrates a need for new shared tokens.                        |

Confirmed global semantic palette:

| Semantic role | Light value | Dark value |
| ------------- | ----------- | ---------- |
| Background    | `#F4F1ED`   | `#0C0F14`  |
| Foreground    | `#000000`   | `#F4F1ED`  |
| Blob back     | `#CBD1D8`   | `#202D3C`  |
| Blob front    | `#E1E8F0`   | `#2E3D4D`  |

The user confirmed these supplied colors as the global palette. Use the listed
values in `packages/design-tokens`, replacing the existing global background and
foreground values and adding global semantic roles for the two decorative
layers. Do not introduce status-scoped copies. Other semantic roles remain
unchanged unless a demonstrated contrast or consistency issue requires review.

Use the existing sans-serif font stack and no additional font dependencies.
Follow both mockups closely in colors, composition, spacing, proportions, and
typography hierarchy. Responsive behavior takes priority over strict pixel-perfect
measurements. Exact font sizes, spacing values, and organic contours are
implementation details constrained by these visual and responsive requirements;
they do not require a pixel-perfect sizing contract. The shapes are authored as
part of the reusable layout because they are absent from the supplied SVG.

## 7. Accessibility requirements

| ID    | Requirement                                                                                                                                                                                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AX-01 | The initial page must expose one main landmark and one level-one heading containing `COMING SOON`. The subtitle must be available as readable text in logical reading order after the heading. The application/page owns exactly one main landmark. StatusScreen must not render a main element or role="main". |
| AX-02 | Hide both background shapes from the accessibility tree and keep them out of keyboard navigation. The initial illustration is decorative because the adjacent text communicates the full status; hide it from assistive technology and keep it unfocusable.                                                     |
| AX-03 | A different caller may supply meaningful artwork. `StatusScreen` must not indiscriminately hide the entire illustration slot; the caller owns the supplied node's accessible name or decorative treatment.                                                                                                      |
| AX-04 | Text must have at least 4.5:1 contrast against its background, or at least 3:1 for large text (24 CSS pixels regular or approximately 18.7 CSS pixels bold). Verify final tokens in both themes. Decorative shapes need not independently communicate information.                                              |
| AX-05 | Content must remain readable at 200% browser zoom, and reflow at an effective viewport width of 320 CSS pixels without horizontal scrolling. Vertical scrolling is allowed.                                                                                                                                     |
| AX-06 | Do not add focusable elements, autofocus, focus traps, live regions, alerts, or animation to the static initial presentation. A consumer-supplied interactive node retains responsibility for its own accessibility.                                                                                            |

## 8. Light and dark theme behavior

Theme colors must resolve through the shared design-token layer. No separate
light and dark component trees or duplicated illustration assets are permitted.

| Explicit effective `data-theme` | System preference            | Required result |
| ------------------------------- | ---------------------------- | --------------- |
| `light`                         | Light or dark                | Light           |
| `dark`                          | Light or dark                | Dark            |
| Absent                          | Light                        | Light           |
| Absent                          | Dark                         | Dark            |
| Absent                          | Unavailable or no preference | Light fallback  |

- TH-01: Preserve existing explicit `data-theme="light"` and `data-theme="dark"`
  overrides on the root or a themed ancestor. A nearer explicit theme scope must
  override inherited colors. System styles must not override an explicit scope.
- TH-02: Without an explicit override, changing the system color scheme while
  the page is open must update the colors without reloading or losing content.
- TH-03: Background, text, shapes, and illustration color roles must resolve
  consistently for the active theme; neither theme may leave invisible strokes
  or unintended solid fills in the illustration.
- TH-04: Do not add preference storage or a theme toggle. System fallback adds
  only the behavior needed here and does not constitute the future theming system.

An invalid or empty `data-theme` value is outside the supported override contract;
no theme validation or error-handling infrastructure is required by this feature.

## 9. Reusability, architecture, and SVG requirements

### Required separation of responsibilities

| Owner                    | Responsibility                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/design-tokens` | Global semantic palette, theme values, and existing Tailwind mapping. Use the confirmed global background/foreground and decorative-layer colors.                |
| `packages/ui-react`      | Exported `StatusScreen`, typed API, reusable layout, and decorative background shapes. No portfolio text, app imports, or Coming Soon geometry.                  |
| `apps/portfolio`         | Initial copy, `ComingSoonIllustration`, and entry-page composition with the single main landmark. Original source artwork is retained under docs/design/artwork. |
| `docs/design/DESIGN.md`  | Confirmed design decisions and rationale; update with actual details and verification during implementation.                                                     |

### Illustration contract

- SVG-01: Retain the supplied `rocket-laptop-editable.svg` unchanged as source
  artwork and implement `ComingSoonIllustration` as a typed
  React component containing inline SVG markup, not an external `img` or a raster
  replacement.
- SVG-02: Preserve the original geometry, view box, aspect ratio, path shapes,
  and meaningful fill/stroke distinctions. Syntax conversion for JSX and
  theme-aware color substitution must not change the drawing. Use the supplied
  artwork rather than tracing the mockup or inventing replacement artwork.
- SVG-03: Accept standard React SVG props, including `className` and accessibility
  attributes. Caller-provided props must reach the SVG with predictable behavior.
- SVG-04: Use `currentColor` for appropriate inherited ink roles and semantic CSS
  variables or Tailwind styling for other required color roles. Do not replace
  every fill and stroke with one color if that loses meaningful distinctions.
- SVG-05: Support decorative use with `aria-hidden` and no focusability. Keep a
  path for meaningful usage through standard accessible SVG props without
  introducing a separate illustration accessibility framework.
- SVG-06: Reusing the illustration on a page must not cause conflicting IDs or
  broken accessible-name references. The source uses static `title` and `desc`
  IDs with `aria-labelledby`; the React version must not duplicate those IDs
  across instances. Preserve the original source file independently of JSX
  accessibility adaptations.

### Verified source artwork

Source: [rocket-laptop-editable.svg](../../design/artwork/rocket-laptop-editable.svg),
provided from `C:/Users/abiga/Downloads/rocket-laptop-editable.svg`.

- Intrinsic size: 400×400; view box: `0 0 400 400`.
- One compound path with `fill="currentColor"` and `fill-rule="evenodd"`;
  there are no stroke attributes, separate color layers, masks, clips, or blobs.
  Preserve the compound path and transparent cutouts; do not convert cutouts
  into solid background-colored fills.
- The root has an inline `color: #222222` declaration. The React conversion must
  allow inherited theme foreground and caller styling instead of retaining that
  fixed default as an override. No extra illustration color roles are needed for
  this monochrome source.
- The source declares `role="img"`, `aria-labelledby="title desc"`, and static
  title/description IDs. The initial app usage must still be decorative; future
  meaningful usage and repeated instances must satisfy SVG-05 and SVG-06.
- SHA-256 of the retained original:
  `DF91DF4BCFB26C6550F4FCF826C456BB964F069F746D12AB30F86EA74A35D264`.

### Reusability boundaries

The required three props are the initial public contract. Do not add variants,
status enums, title-level configuration, action slots, or configuration engines
without an approved requirement. The consumer is responsible for supplying a
renderable, appropriately sized illustration. `StatusScreen` must render
alternative text and artwork without detecting specific strings or status types.

### Required design documentation during implementation

Keep `docs/design/DESIGN.md` current with the actual design philosophy,
semantic colors and theme precedence, typography, spacing and responsive layout,
component ownership, SVG conventions, accessibility guidelines, and a decision
log with rationale. Its initial specification-phase content records the user's
confirmed decisions, not a claim of implementation. Add actual implementation
details and verification outcomes as they become available. Significant future
design-system changes must update that document.

## 10. Acceptance criteria

These criteria apply to the eventual implementation, not this documentation-only
phase. Automated verification should use the existing Vitest/React Testing
Library and TypeScript setup; browser checks cover rendered CSS and SVG behavior
that jsdom cannot establish. No additional tooling is mandated.

| ID    | Objectively verifiable result                                                                                                                                                                                                                                       | Verification                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| AC-01 | The package entry point exposes the component and named props type; all three required props have the specified types. Missing required props and non-string title/subtitle values are rejected by TypeScript.                                                      | Type checking and public export inspection.                                                                     |
| AC-02 | Supplied title, illustration node, and subtitle render in order; a real newline produces two visible subtitle lines. Longer copy wraps without truncation.                                                                                                          | Component tests for text/node rendering and order; browser check for line breaks and wrapping.                  |
| AC-03 | Supplying a Maintenance title, different subtitle, and different illustration node renders that content with no Coming Soon text or asset introduced by the library.                                                                                                | Component test with alternate props.                                                                            |
| AC-04 | The entry page renders the exact initial copy and inline `ComingSoonIllustration`, replacing the previous placeholder heading and Button.                                                                                                                           | App composition test and browser inspection at the existing entry URL.                                          |
| AC-05 | The page owns exactly one main landmark; StatusScreen itself has no main element or main role. The page has one level-one heading, readable subtitle, and no decorative artwork in its accessibility tree or tab order.                                             | Semantic tests and browser accessibility/keyboard inspection.                                                   |
| AC-06 | All five theme-matrix rows pass, live system preference changes update the unoverridden page, and nested explicit light/dark scopes retain their colors under either system preference.                                                                             | Browser checks of computed colors and explicit scopes.                                                          |
| AC-07 | In both themes, colors match the global palette in section 6. Composition, spacing, proportions, and typography hierarchy closely follow the mockups using the existing sans-serif stack. Shapes overlap behind the illustration; the viewport has no mockup frame. | Side-by-side browser review against both mockups, prioritizing responsive reflow over pixel-perfect dimensions. |
| AC-08 | At 320×568, 390×844, 844×390, and 1440×900 CSS-pixel viewports, initial content is fully reachable with no horizontal overflow or unintended clipping. Short screens may scroll vertically.                                                                         | Browser inspection and scroll-width check.                                                                      |
| AC-09 | At 200% browser zoom and an effective 320 CSS-pixel width, text remains readable, content reflows, and nothing overlaps. A long title and several subtitle lines remain reachable.                                                                                  | Browser checks with initial and longer replacement copy.                                                        |
| AC-10 | Final title/subtitle colors meet AX-04 in both themes. No animation or focus behavior is added to the initial static screen.                                                                                                                                        | Contrast calculation using approved colors; rendered behavior inspection.                                       |
| AC-11 | The original SVG hash matches section 9. The React SVG preserves the view box, compound path, even-odd cutouts, and inherited currentColor, accepts standard props, and has no duplicate IDs across instances.                                                      | Source/hash comparison, prop test, and two-instance browser inspection.                                         |
| AC-12 | Production ownership follows section 9, colors are sourced from shared tokens, and no new dependencies or unrelated architectural changes are introduced.                                                                                                           | Diff and package/lockfile review.                                                                               |
| AC-13 | `docs/design/DESIGN.md` records actual choices and their rationale across all required topics.                                                                                                                                                                      | Documentation review against section 9.                                                                         |
| AC-14 | Relevant tests and the root `pnpm check` pass after implementation; the existing compiler, Tailwind integration, CI, release, and commit workflows remain configured.                                                                                               | Check output and configuration diff review.                                                                     |

## 11. Edge cases, assumptions, and dependencies

- Explicit subtitle line breaks and automatic wrapping must work together. A
  literal `\n` string is not an instruction to parse escape sequences; callers
  supply actual newline characters.
- Strings containing markup-like text render literally. Rich-text titles and
  subtitles are outside the specified API.
- Empty strings and `null` are allowed by the specified string/ReactNode types.
  Do not replace them with Coming Soon defaults or throw solely because they are
  empty. Product consumers supply meaningful copy; an empty title is not an
  accessible complete page. No runtime input-validation system is required.
- Large illustrations and longer copy may require vertical scrolling; the layout
  must not crop them to enforce the reference composition. Arbitrary interactive,
  fixed-width, or otherwise nonresponsive consumer nodes are not guaranteed to
  become responsive automatically.
- The supplied illustration is assumed to communicate no information absent from
  the text for the initial use case, so it is decorative. A future meaningful
  illustration needs caller-provided accessible treatment.
- The original SVG is now supplied and retained; artwork availability no longer
  blocks planning after specification approval. Its transparent negative space
  will reveal the decorative layers beneath it in either theme.
- Global palette scope, existing sans-serif typography, responsive visual
  precision, and app-owned landmark semantics are user-confirmed decisions.
  Final utility choices and contour details must follow those constraints.
- The page uses the existing app entry point. Public hosting configuration and
  deployed availability have not been verified and are outside this phase.

## 12. Confirmed decisions, rationale, and open questions

The following user-confirmed decisions are incorporated in this revision. The
user subsequently approved the complete specification on 2026-10-19.

| Decision                                                                                  | Rationale and effect                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Use the supplied colors globally.                                                         | One shared palette keeps token consumers visually consistent and avoids status-specific duplicates. Replacing global background/foreground values intentionally affects all consumers, not just `StatusScreen`. New decorative-layer colors also belong to the shared token package. |
| Keep the existing sans-serif font stack with no added font dependencies.                  | Preserve the existing typography foundation and dependency footprint while matching the mockups' hierarchy through sizing and weight.                                                                                                                                                |
| Follow mockups closely while prioritizing responsiveness over pixel-perfect measurements. | Preserve visual identity across screen sizes without fixed measurements that cause clipping or prevent text reflow. Blobs remain layout-owned; the supplied artwork contains none.                                                                                                   |
| The application/page owns `main`; `StatusScreen` must not render its own `main`.          | Landmark ownership stays with the page, allowing reuse without nested main elements. The composed initial page must expose exactly one main landmark and one level-one status heading.                                                                                               |
| Use the supplied `rocket-laptop-editable.svg` as the original artwork.                    | Preserve verified source geometry and its existing monochrome/transparent structure instead of reconstructing it from a raster mockup.                                                                                                                                               |

Open questions requiring clarification: none currently identified. Exact utility
selection, shared decorative-token names, and JSX conversion details belong to
technical planning within these constraints. If a new material design or
architecture decision emerges, raise it before changing the approved contract.

## 13. Approval boundary

The user approved this specification on 2026-10-19. Proceed to technical planning
using this document as the implementation reference. Present the completed plan
for review and execution-method selection before implementation. Record material
changes to the approved contract explicitly; approval does not authorize
deployment or merging.
