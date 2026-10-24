# ColorModeSwitch refactor design and implementation plan

**Status:** Implemented, verified, and independently reviewed.

**Goal:** Move color-mode responsibility out of Navbar and LandingPage while
preserving the current appearance, interactions, and theme behavior.

## Focused design

Create an app-owned component folder:

```text
apps/portfolio/src/components/ColorModeSwitch/
  ColorModeSwitch.tsx
  useColorMode.ts
  ColorModeSwitch.test.tsx
  index.ts
```

- **ColorModeSwitch:** no required props. Calls the private `useColorMode` hook
  and renders the actual library `Switch`. Owns `aria-label="Dark mode"`, icon-only
  presentation, Light/Dark state labels, and Heroicons SunIcon/MoonIcon imports.
  Icons continue using the existing Switch slots and inherited colors.
- **useColorMode:** colocated implementation detail, not a barrel/library export.
  Extract the existing state, initialization helpers, named change handler, and
  effect from LandingPage. Return `darkMode: boolean` and
  `onDarkModeChange: (darkMode: boolean) => void` for the wrapper to pass to Switch.
- **Navbar:** replace direct Switch/Heroicons usage with `<ColorModeSwitch />`
  inside its existing layout wrapper. Remove `darkMode`, `onDarkModeChange`, and
  the now-unused `NavbarProps` export. Keep branding, layout, and native hash-based
  link selection unchanged.
- **LandingPage:** remove all color-mode state, effects, helpers, and handler;
  render `<Navbar />` followed by the existing placeholder main container.

Resulting ownership:

```text
LandingPage → Navbar → ColorModeSwitch → library Switch
                            ↓
                       useColorMode
```

The component separates color-mode UI from page/navigation composition; its small
private hook separates the existing browser/theme synchronization from rendering.
Keeping all logic in the wrapper would save one file, but the hook gives the
requested responsibility a clear home without adding a provider or generic layer.
No shared UI-library changes or new public theme API are needed.

### Behavior to preserve exactly

- Respect a valid existing root `data-theme`; otherwise follow the system
  preference with light fallback. Follow system changes until explicitly chosen.
- Apply explicit choices through the existing root `data-theme`. Preserve media
  listener cleanup, StrictMode behavior, and session-only selection.
- Retain accessible naming, sun/moon icons, circular icon-only indicator,
  transitions, subtle keyboard focus, and current responsive layout.
- Keep Heroicons only in the portfolio app. Add no dependencies, persistence,
  router, theme provider, tokens, appearance props, or shared state infrastructure.
- Preserve the current single color-mode control in the page; no additional
  synchronization requirements or mounted controls are introduced by this refactor.

## Implementation plan

- [x] **Move the behavior tests with their responsibility.** Adapt the existing
      theme initialization, explicit-choice, system-update, and StrictMode-cleanup
      tests to `ColorModeSwitch.test.tsx`, rendering the new component. Keep the
      LandingPage landmark/anchor tests and Navbar navigation/composition tests;
      remove the obsolete controlled Navbar callback test. Do not duplicate hook
      tests for behavior already exercised through ColorModeSwitch.
- [x] **Extract and integrate.** Add the private hook, component, and component barrel;
      move existing logic and Switch/Heroicons composition without changing behavior.
      Simplify Navbar/LandingPage and remove obsolete Navbar prop typing/exports.
      Run focused tests and typecheck. No unrelated cleanup or styling changes.
- [x] **Verify and document.** Update current ownership descriptions in DESIGN.md,
      project-overview.md, and the original implementation plan. Check the actual
      Navbar, light/dark behavior, focus, and fragment selection. Run `pnpm check`,
      staged/unstaged whitespace checks, and one independent final review. Record
      actual evidence and limitations; do not commit or push.

The user approved this extraction and behavior preservation. No further approval
checkpoints or commits are part of execution.

## Verification

- Moved the seven existing theme cases into ColorModeSwitch tests. The new import
  failed before the wrapper existed, then all 15 portfolio tests and the complete
  TypeScript check passed after extraction. LandingPage retains its anchor test;
  Navbar retains composition/current-fragment coverage. The removed controlled
  Navbar callback test belongs to the obsolete prop API, not lost theme coverage.
- `pnpm check` passed formatting, lint, all TypeScript projects, 72 tests across
  12 files, and UI-library/portfolio/Storybook builds. Staged and unstaged
  whitespace checks passed. Storybook retains its existing large-chunk warning.
- Actual browser checks confirmed one mode control and one main, light/dark root
  attribute updates, preserved foreground/background colors, native fragment
  current-link updates, keyboard Space/focus, and no overflow at 320px. The icon
  indicator remains 44x44px. No console errors were reported; viewport overrides
  were reset. Runtime system-preference emulation and screen-reader speech were
  not manually repeated; preference/listener/StrictMode behavior is covered by
  the migrated tests.
- Independent read-only review found no Critical, Important, or Minor issues.
  The hook is exported only from its implementation module for the wrapper;
  the component barrel exports only ColorModeSwitch. NavbarProps no longer exists.
- No dependency, provider, persistence, shared theme system, library styling,
  navigation behavior, commit, or push was added by this extraction.
