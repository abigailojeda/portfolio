# Portfolio Navbar and LandingPage design and implementation plan

> **Execution:** After one approval of this design and plan, use
> superpowers:executing-plans inline, then one independent final review.
> No commits or additional approval checkpoints for routine implementation.

**Status:** Implemented and independently reviewed with the approved Heroicons correction.

**Approved follow-up:** the [ColorModeSwitch refactor](2026-10-25-color-mode-switch-refactor.md)
extracts color-mode ownership into an app-owned wrapper and private hook. Current
ownership below reflects that extraction; earlier verification remains historical.

**Goal:** Replace the current Coming Soon app entry with the first minimal
portfolio page, reusing the existing NavLink, Switch, and shared theme tokens.

## Focused design

### App structure and responsibilities

- `App` renders `LandingPage` from `apps/portfolio/src/views/LandingPage/`.
  Keep existing StatusScreen and ComingSoonIllustration sources/tests intact.
- `LandingPage` composes the app-owned `Navbar` and exactly one `main` landmark
  with a visually hidden portfolio heading and an otherwise empty future-content
  container. Reserve `home`, `journey`, `stack`, and `contact` anchor targets
  without adding hero content or fabricated section copy.
- `Navbar` belongs in `apps/portfolio/src/components/Navbar/`. It owns branding,
  links, and layout and renders `<ColorModeSwitch />` without theme props.
- `ColorModeSwitch` belongs beside Navbar in its own component folder. It uses
  a private `useColorMode` hook for the existing theme state and effects, and
  composes the shared Switch with Heroicons. LandingPage owns composition only.

### Navbar appearance and interaction

- Display `ABIGAIL OJEDA` as text on the left, simple NavLinks for Home, Journey,
  Stack, and Contact in the middle, and the library Switch on the right.
  Use real fragment destinations and derive `aria-current="location"` from the
  current URL fragment, falling back to Home for an empty fragment. Subscribe
  to native hash changes so clicks, direct URLs, and browser history stay in sync.
  Links target future-content placeholders; no router, scrollspy, mobile menu,
  or duplicate current-section state is needed.
- ColorModeSwitch uses `Switch` with `presentation="icon"`, unchecked Light/sun and checked
  Dark/moon states, and the stable accessible name `Dark mode`. Import `SunIcon`
  and `MoonIcon` from `@heroicons/react/24/outline`; pass them through the existing
  Switch icon slots with inherited `currentColor`. Add Heroicons only to
  `apps/portfolio` dependencies. Do not create custom icon components. The user's
  subsequent visual correction makes Switch's icon-only positions square so its
  rounded-full moving highlight is circular; text presentations stay unchanged.
- Match the reference's restrained spacing and typography using existing scales:
  generous horizontal padding, a balanced desktop layout with centered links,
  and a subtle separator. At small widths, keep the name and Switch on the first
  row and allow navigation to occupy a wrapping second row. No page overflow.
- Use semantic `background`, `foreground`, and `border` tokens with a translucent
  background and backdrop blur on the Navbar. This is app-local styling, not a
  shared Glass implementation or new visual-style selection API.
- Reuse NavLink/Switch keyboard behavior and their subtle `:focus-visible`
  indicators unchanged. Keep the document and placeholder main responsive.

### Existing theme behavior

The inspected project has CSS system fallback and explicit/nested `data-theme`
scopes, but no JavaScript theme controller or persistence. Add only the small
app-level wiring needed for this requested control:

- Initially respect a valid existing root `data-theme`, otherwise the current
  `prefers-color-scheme` preference, with light fallback.
- Keep the Switch consistent with live system preference while no explicit
  app selection exists. An explicit selection takes precedence for this session.
- Apply explicit light/dark choices through the existing root `data-theme`
  attribute, so the page, Navbar, shared controls, and document share tokens.
- Keep this wiring in the private useColorMode hook with small named functions and cleaned-up
  media-query listeners. No provider, shared theme service, new theme tokens,
  further dependencies, or localStorage. The previously planned future persistence
  remains deferred, as explicitly requested for this iteration.

ColorModeSwitch encapsulates existing theme responsibility, leaving Navbar and
LandingPage focused on layout/composition. A library Navbar or generalized theme
layer remains unnecessary. No Storybook changes are needed for these app components.

## Implementation plan

### Task 1: Navbar and LandingPage

Files: create `components/Navbar/{Navbar.tsx,index.ts}` and
`views/LandingPage/{LandingPage.tsx,index.ts}` under `apps/portfolio/src/`.
Modify `apps/portfolio/src/App.tsx` and its composition test; colocate any further
necessary tests or CSS with their owning component/view. Add Heroicons to
`apps/portfolio/package.json` and update the workspace lockfile.

- [x] Add focused failing tests for page landmarks, branding, native destinations,
      library control composition, accessible icon-only Switch naming, and the
      controlled Navbar callback. Test app theme initialization/toggling and one
      system-preference update/explicit-choice precedence path with a small local
      media-query fixture. Do not duplicate the libraries' existing interaction tests.
- [x] Run the relevant portfolio tests and observe the expected failures for
      the new page/control contracts.
- [x] Implement the controlled Navbar with Heroicons, minimal LandingPage,
      root theme wiring, and updated App composition using existing utilities.
- [x] Rerun portfolio tests and `pnpm typecheck`; require passing results.

### Task 2: Verification, documentation, and review

- [x] Update the implemented-app inventory and current theme/structure notes in
      `docs/project-overview.md` and `docs/design/DESIGN.md`. Preserve historical
      verification records and future theming decisions.
- [x] Verify the actual page in light/dark and desktop/mobile widths: layout,
      icon-only control, keyboard focus, anchors, and root theme updates. Report any
      browser limitations instead of claiming an unexecuted check passed.
- [x] Run `pnpm check`, `git diff --check`, and staged whitespace checks. Check
      the diff for unrelated changes and preserve all quality/release configuration.
- [x] Perform one independent final review, fix necessary findings, rerun affected
      checks, and check off completed tasks. Leave changes uncommitted.

## Review focus

- Navbar consumes actual NavLink/Switch exports and remains app-owned.
- Initial system/explicit theme matches the Switch, and user selection wins.
- Media listeners are cleaned up and StrictMode does not break theme behavior.
- Small screens retain visible, accessible controls without overflow.
- The page has one main and one heading, real anchor targets, and no hero scope.

Use the existing clean `feat/landing-page-navbar` branch.

## Verification

- Baseline: 4 portfolio tests passed. New Navbar/LandingPage tests initially failed
  on missing imports, and the updated App test rejected the old Coming Soon view.
  After implementation all 14 portfolio tests and the complete typecheck passed.
- `pnpm check` passed formatting, lint, TypeScript, 71 tests across 11 files, and
  library, portfolio, and Storybook builds. `pnpm run audit` reported zero findings.
  Staged and unstaged `git diff --check` passed. The dependency/lockfile diff adds
  only Heroicons 2.2.0 in the portfolio importer; the UI library has no Heroicons.
- The initial full check flagged checkout-formatting in eight existing NavLink
  paths. Prettier normalization restored formatting without content/behavior
  changes. No quality configuration, hooks, dependencies other than the requested
  Heroicons, or existing library behavior were changed.
- Browser verification used the actual React Compiler-enabled Vite app at
  `http://127.0.0.1:5173/`. Initial system-dark state selected the moon. Explicit
  light/dark choices updated root data-theme and page token colors correctly.
  Heroicons inherited the library colors, header blur computed to 12px, and
  background opacity to 0.8. No browser console errors were reported.
- At 1440px the navigation center was 719.99px and header height 87px. At 320px
  and 390px, controls stayed visible with links on the second row and no horizontal
  overflow; header height was 139px. Contact/Home clicks used real native hashes
  and existing targets. The page had exactly one main and one heading.
- Keyboard checks confirmed the existing NavLink and Switch 1px focus shadows and
  Space activation. Live system changes, explicit precedence, and StrictMode-safe
  subscription cleanup are covered by the tests. Browser system-preference
  emulation and real screen-reader speech were not manually exercised.
- One independent final reviewer found no Critical/Important issues and one stale
  overview sentence denying Navbar integration. That prose was corrected; there
  are no remaining review findings. Documentation formatting was checked afterward.
- Storybook retains large-chunk/plugin-timing warnings. No Storybook stories,
  shared theme APIs, persistence, custom SVG icon components, commits, or pushes
  were introduced. Temporary browser viewport overrides were reset.

### Requested active-link and Switch-shape fixes

Navbar now subscribes to native hash changes and derives its current destination
from the URL fragment, with Home used only for an empty fragment. Clicks, initial
fragment URLs, and browser history update `aria-current` without duplicate state
or intercepted navigation. Two regression tests failed before this fix and pass
now. Icon-only Switch slots use 44px squares, giving the existing rounded-full
thumb a circular shape; text and icon-text spacing are unchanged.

The full `pnpm check` passed with 73 tests across 11 files and all builds. Both
whitespace checks passed. The browser confirmed current Journey after navigation
and Back, distinct current/muted colors, a 44x44px thumb, and a 98x54px pill track.
The independent follow-up review found no issues. No commits were made.
