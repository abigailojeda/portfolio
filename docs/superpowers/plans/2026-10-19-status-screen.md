# Status Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio placeholder with an accessible Coming Soon page composed from a reusable status layout and the supplied inline SVG.

**Architecture:** Shared global theme colors live in `packages/design-tokens`; `packages/ui-react` owns the presentational layout and its blobs. The app owns the inline SVG, initial copy, and single main landmark. Follow existing Tailwind and component export conventions without new dependencies.

**Tech Stack:** Existing React 19, TypeScript, Vite 8, React Compiler, Tailwind CSS 4, pnpm, Vitest, React Testing Library, and jsdom.

**Spec:** [Approved StatusScreen specification](../../specs/001-status-screen/spec.md), approved 2026-10-19. Read it alongside [design decisions](../../design/DESIGN.md).

**Status:** User authorized native execution on 2026-10-19 without commits.
Implementation, `pnpm check`, and a fresh read-only code review are complete.
The review found no actionable issues. All implementation changes remain uncommitted.
Native light/no-preference system checks, live system switching, the nested
matrix under a light system, and actual 200% zoom remain manual checks because
the available browser does not expose those controls. See
[verification evidence](../../design/DESIGN.md#implementation-verification--2026-10-19).
Checked steps containing commit instructions record verification only: all
commit substeps are intentionally omitted per the user's request.

## Global constraints

- Required `StatusScreen` props: `title: string`, `illustration: ReactNode`, and `subtitle: string`; no additional required props.
- Initial title: `COMING SOON`; subtitle: `Something awesome is in the works.\nCome back soon!`, where `\n` represents one actual newline.
- Global background/foreground: light `#F4F1ED`/`#000000`, dark `#0C0F14`/`#F4F1ED`.
- Global blob back/front: light `#CBD1D8`/`#E1E8F0`, dark `#202D3C`/`#2E3D4D`.
- Use the existing sans-serif font stack. Do not add font dependencies, runtime dependencies, a theme provider, storage, a toggle, routing, animation, or maintenance infrastructure.
- Explicit `data-theme="light"`/`data-theme="dark"` takes precedence over system preference; nearer explicit scopes override inherited colors. Without an override, follow live system preference and fall back to light.
- The application/page owns exactly one main landmark; `StatusScreen` renders neither `main` nor `role="main"`.
- Preserve the original SVG unchanged; React conversion preserves `viewBox="0 0 400 400"`, path geometry, `currentColor`, and even-odd transparent cutouts.
- Follow both mockups closely; responsive behavior takes priority over pixel-perfect dimensions. Support 320 CSS-pixel width, 200% zoom, and vertical scrolling when content grows.
- Preserve React Compiler, Tailwind source scanning, workspace dependencies, Husky, CI, `dev`/`main`, and release behavior. No deployment or merging.
- Current branch is `feat/maintenance-page`. Never create a branch with the `codex/` prefix. Recheck status before execution; preserve existing untracked design/specification assets.

## Review focus

1. A dark system with an explicit light ancestor, or nested opposite theme, must retain the nearest explicit palette (Task 1 browser matrix).
2. Literal markup, empty strings, and a null illustration must not trigger HTML parsing, fallback copy, or exceptions (Task 2 tests).
3. Meaningful consumer artwork must remain named in the accessibility tree even though the layout's blobs are decorative (Task 2 test).
4. Two inline SVG instances with different accessible names must not share internal IDs or broken references (Task 3 test).
5. Long copy at mobile width or 200% zoom must remain reachable without overlap or horizontal overflow (Task 4 browser checks).

## File map and execution order

Paths below are repository-relative. Tasks run in order; Tasks 2 and 3 consume Task 1's palette and meet in Task 4.

| Files                                                                                                               | Responsibility                                                                                    |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Modify `packages/design-tokens/src/themes/light.css`, `themes/dark.css`, and `src/tailwind.css` within that package | Global palette, system fallback, explicit scope precedence, and Tailwind blob utilities.          |
| Create `packages/ui-react/src/components/StatusScreen/StatusScreen.tsx`, `StatusScreen.test.tsx`, and `index.ts`    | Reusable typed layout and semantic/content tests.                                                 |
| Modify `packages/ui-react/src/index.ts`                                                                             | Add component/type exports without unrelated export cleanup.                                      |
| Create `apps/portfolio/src/components/ComingSoonIllustration.tsx` and `ComingSoonIllustration.test.tsx`             | Inline SVG and prop/geometry/accessibility verification.                                          |
| Modify `apps/portfolio/src/App.tsx`; create `App.test.tsx` beside it                                                | Single-main page composition and integration test.                                                |
| Update `docs/design/DESIGN.md` and `docs/project-overview.md`                                                       | Actual design choices, verification evidence, and accurate implemented inventory after execution. |
| Retain `docs/design/artwork/rocket-laptop-editable.svg` and both existing mockups                                   | Unchanged reference sources.                                                                      |

No build configuration or stylesheet integration change is expected. If a verified issue requires one, keep it targeted and record why; do not add infrastructure preemptively.

### Task 1: Global palette and theme precedence

**Interfaces:** Consumes existing semantic CSS and Tailwind mapping. Produces updated `--ds-color-background`/`--ds-color-foreground`, new `--ds-color-blob-back`/`--ds-color-blob-front`, and `bg-blob-back`/`bg-blob-front` utilities. Existing semantic roles remain available.

- [ ] **1. Establish failing browser evidence.** Run `pnpm start`, use the actual Vite URL, and inspect the current page with no override under light/dark system preferences. Record current computed background/foreground and missing blob variables. Confirm they do not yet match the approved palette/system behavior. Do not assert CSS rendering from jsdom.
- [x] **2. Update shared CSS.** Change only background/foreground values and add blob roles in the light/dark theme files. Map `--color-blob-back` and `--color-blob-front` to their `--ds-` variables in `src/tailwind.css`. Preserve other semantic values. Define system-dark defaults only on an unoverridden root; explicit light/dark selectors must continue to work on nested ancestors. Keep all palette definitions in this package; no JavaScript theme detection.
- [ ] **3. Verify the browser matrix.** Check all five specification theme rows and a live preference change without reload. In a temporary browser-only fixture, place light inside dark and dark inside light, under both system preferences. Assert each scope's computed four colors equals the global table; check other existing semantic roles resolve to the appropriate existing light/dark values too. Remove the fixture afterward. Record evidence in `DESIGN.md`.
- [x] **4. Check and commit.** Run `pnpm build` and `pnpm format:check`; expect both to pass and blob utilities to be available through the existing mapping. Review only Task 1 files and its evidence, then commit `feat(design-tokens): apply global status palette and system themes`. Preserve hooks.

### Task 2: Reusable StatusScreen

**Interfaces:** Consumes Task 1's semantic utilities. Produces named `StatusScreenProps` with exactly the three required fields and `StatusScreen(props: StatusScreenProps): ReactElement`, exported from `@portfolio/ui-react` through the component barrel and package entry point.

- [x] **1. Write failing component tests** in `StatusScreen.test.tsx` using existing RTL/Vitest conventions. Cover supplied heading, illustration node, and subtitle in DOM order; alternate Maintenance copy with no Coming Soon defaults; no main element/role; and these cases:

  ```tsx
  // Within separate tests, with render/screen/expect imports and local fixtures:
  expectTypeOf<StatusScreenProps>().toEqualTypeOf<{
    title: string;
    illustration: ReactNode;
    subtitle: string;
  }>();

  render(
    <StatusScreen title="<b>Status</b>" illustration={null} subtitle="" />,
  );
  expect(screen.getByRole("heading").textContent).toBe("<b>Status</b>");
  expect(document.querySelector("b")).toBeNull();
  expect(document.querySelector("main, [role='main']")).toBeNull();

  // A separate empty-input test must render title="", subtitle="", and
  // illustration={null} without throwing or introducing fallback copy.
  // For newline content, assert paragraph.textContent equals "Line one\nLine two".
  // For meaningful artwork supplied as <svg role="img" aria-label="Service state" />:
  expect(
    screen.getByRole("img", { name: "Service state" }),
  ).toBeInTheDocument();
  ```

  Check semantic reading order using DOM position, not CSS classes. The type assertion must be checked by TypeScript, not claimed as a Vitest runtime guarantee.

- [x] **2. Run the failing tests.** `pnpm test --project ui-react`; expect missing StatusScreen imports/exports or failed behavior assertions. Confirm the failure is caused by the unimplemented feature.
- [x] **3. Implement the component and exports.** Use a non-landmark container, an `h1`, one illustration stage, and a paragraph preserving newlines with wrapping. Use normal flow for text and the stage; position only the two decorative SVG blobs behind the supplied node. Hide blobs with `aria-hidden` and `focusable="false"`; leave the illustration slot's accessibility untouched. Use shared colors and existing spacing/type utilities. Keep contours inside this component; no extra blob library or status abstraction.
- [x] **4. Set responsive layout.** Let the component fill its parent's available width while constraining the central composition to the mockup proportions. Use a fluid stage with proportional SVG sizing and an upper width bound; shrink within 320px minus page padding. Do not impose a fixed viewport height or truncate text. Keep the larger blob above/right and the smaller blob lower/left. Initial desktop hierarchy should closely follow the mockups; choose utility sizes during browser comparison and record final choices.
- [x] **5. Verify and commit.** Run `pnpm test --project ui-react` and `pnpm typecheck`; expect all tests and the exact public type check to pass. Review the diff for app imports, hardcoded copy/colors, and accidental main landmarks. Commit only Task 2 files as `feat(ui-react): add reusable status screen`.

### Task 3: Typed inline ComingSoonIllustration

**Interfaces:** Consumes the retained source SVG and inherited foreground color. Produces named `ComingSoonIllustration(props: SVGProps<SVGSVGElement>): ReactElement` for app use. No shared-library imports of this asset.

- [x] **1. Write failing SVG tests** in `ComingSoonIllustration.test.tsx`. Parse the retained source using Node `readFileSync` with an import-relative URL and XML `DOMParser`; compare the React SVG's view box, single path `d`, `fill="currentColor"`, and `fill-rule="evenodd"` with the source, avoiding a copied path literal. Also cover:

  ```tsx
  render(
    <ComingSoonIllustration
      className="w-full"
      aria-hidden="true"
      focusable="false"
    />,
  );
  const svg = document.querySelector("svg")!;
  expect(svg).toHaveClass("w-full");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("focusable", "false");
  expect(svg.style.color).toBe("");
  expect(document.querySelector("img")).toBeNull();
  ```

  In another test render two instances with `role="img"` and distinct `aria-label` values; assert both are discoverable by name and there are no internally generated IDs or dangling `aria-labelledby` references. Verify caller width/height/style props are forwarded.

- [x] **2. Run failing tests.** `pnpm test --project portfolio`; expect a missing illustration module before implementation.
- [x] **3. Convert source markup to JSX.** Preserve the exact path and `0 0 400 400` view box; convert SVG attribute spelling as needed. Remove the fixed root color, source title/description elements, static IDs, and their `aria-labelledby` references from the React version only. Use standard caller-supplied `role`/`aria-label` for meaningful usage, and caller-supplied `aria-hidden`/`focusable` for decorative usage. No custom accessibility API or ID-generation layer is necessary. Spread standard props so the caller can override dimensions/style; preserve aspect ratio by default.
- [x] **4. Verify and commit.** Run `pnpm test --project portfolio` and `pnpm typecheck`; expect passing assertions. Recheck the original's SHA-256 against the specification and inspect two rendered instances in both themes for undistorted cutouts and inherited ink color. Commit only Task 3 files as `feat(portfolio): add inline coming soon illustration`.

### Task 4: Compose, verify, and document the page

**Interfaces:** Consumes Tasks 2 and 3 exports. Updates existing default `App(): ReactElement` to own the main landmark and supply exactly the approved copy.

- [x] **1. Write a failing app test** in `apps/portfolio/src/App.test.tsx`. Import jest-dom/Vitest types explicitly in new app tests if needed by the app's existing TypeScript configuration; avoid configuration changes just for ambient test globals. Assert:

  ```tsx
  render(<App />);
  expect(screen.getAllByRole("main")).toHaveLength(1);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(
    screen.getByRole("heading", { name: "COMING SOON", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Something awesome is in the works\./).textContent,
  ).toBe("Something awesome is in the works.\nCome back soon!");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  ```

  Inspect the inline illustration and decorative blob SVGs for hidden/unfocusable treatment. The heading must belong to the one main landmark.

- [x] **2. Run failing app tests.** `pnpm test --project portfolio`; expect the old Portfolio heading/Button to fail the integration assertions.
- [x] **3. Compose the page.** Replace the placeholder with app-owned `main`, `StatusScreen`, and `ComingSoonIllustration` passed with `aria-hidden="true"` and `focusable="false"`. Supply the exact title and real newline subtitle. Use `min-height` and safe automatic margins/padding for centering that permits vertical growth; theme the complete viewport through shared background/foreground utilities. Leave fonts, stylesheet imports, source scanning, and compiler configuration intact.
- [x] **4. Verify behavior in the browser.** At the actual `pnpm start` URL, check light/dark modes at 320×568, 390×844, 844×390, and 1440×900 CSS pixels. Compare against both mockups (also inspect near their 921×573 canvas size). Confirm title/illustration/message hierarchy, shape layering, text sizing/spacing, inherited SVG color, and absence of mockup framing. Assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth`; verify all content can be reached vertically.
- [ ] **5. Check stress cases and accessibility.** Through a temporary browser-only rendering of the shared component, test a long title and several subtitle lines, a long unbroken word, and null artwork at 320px; prevent text overflow through wrapping without truncation. Repeat at 200% actual browser zoom and effective 320px width. Inspect the accessibility tree and keyboard order: one page main, one h1, readable subtitle, no decorative image announcements or focus targets. Recheck explicit/nested themes and live system switching. Remove temporary fixtures; do not ship an extra route or controls.
- [x] **6. Verify contrast.** Calculate relative luminance contrast for each approved foreground/background pair; require at least 4.5:1 for subtitle text and the applicable AX-04 heading threshold. Check the actual rendered text uses these colors. Record calculated ratios and outcomes rather than adding test dependencies.
- [x] **7. Update actual design documentation.** In `DESIGN.md`, record final typography/spacing utilities, responsive sizing, blob treatment, semantic token names, SVG prop/name behavior, and browser/accessibility/contrast evidence. Update only the relevant implemented inventory and theming gap in `docs/project-overview.md`; do not label the future persistent theming/customization system implemented. Keep original artwork/mockups unchanged.
- [x] **8. Run final checks.** Run `pnpm check`; expect formatting, lint, both TypeScript projects, all tests, and both builds to pass. Run `git diff --check`, review package/lockfile/configuration diffs, and confirm source-artwork SHA-256 remains `DF91DF4BCFB26C6550F4FCF826C456BB964F069F746D12AB30F86EA74A35D264`. Report any checks that could not be run; browser claims require actual browser evidence.
- [x] **9. Review and commit.** Check specification compliance and maintainability, correct any findings with targeted re-verification, then commit Task 4 app/docs changes as `feat(portfolio): compose accessible coming soon page`. Use the execution method's review workflow for the whole branch before handing the result to the user. Do not deploy, merge, or trigger a release.

## Coverage and handoff

| Specification criteria                                             | Owner                                   |
| ------------------------------------------------------------------ | --------------------------------------- |
| AC-01–03: typed reusable contract, rendering, alternate content    | Task 2                                  |
| AC-04–05: app composition, single landmark, decorative treatment   | Tasks 2–4                               |
| AC-06: system/explicit/nested theme behavior                       | Task 1; rendered page recheck in Task 4 |
| AC-07–10: visual fidelity, reflow, zoom, contrast                  | Tasks 2 and 4 browser verification      |
| AC-11: original SVG, prop forwarding, no ID collisions             | Task 3                                  |
| AC-12–14: ownership, documentation, preserved workflows and checks | All tasks; final gate in Task 4         |

Readiness checks completed for this plan: specification coverage, exact interfaces,
step granularity, five review-focus cases, and scope/proportion self-review.
Checkboxes intentionally remain unchecked until execution produces evidence.

Execution method: **Native**, following the user's implementation request.
The four tasks were implemented in order with failing tests before production
code and one final fresh-context review. Commit steps were omitted as requested.
Unchecked browser steps retain the manual verification limits described above;
they do not imply missing production functionality.
