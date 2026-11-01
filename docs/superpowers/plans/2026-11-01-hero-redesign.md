# Hero redesign implementation plan

> **For agentic workers:** Use superpowers:executing-plans inline, with focused
> test-first steps and one independent final review. Do not commit or push.

**Goal:** Implement the approved responsive typographic Hero and Joy Machine.

**Architecture:** Portfolio-owned Hero and JoyMachine consume the shared Button
with native link/button semantics; src/hooks/useJoyMachine owns transient state. Title keeps its API. Existing
theme tokens provide the foundation, with one new red accent for the underline.

**Tech stack:** Existing React, TypeScript, Tailwind, Vitest/Testing Library.

**Spec:** [Approved design](../specs/2026-11-01-hero-redesign.md).

## Global constraints

- Preserve Navbar, theme infrastructure, and user assets. Extend Button only with
  filled semantic tones; retain existing variants and native anchor support.
- Default card +10 degrees and pill -8 degrees, independent stable hover wrappers.
- Hover straightens once; mouse leave restores tilt even while a button has focus.
- Separate one-time entrance animations; reduced motion omits travel/transitions.
- Experience starts 2020-10-01T00:00:00+02:00 and updates every second.
- No dependencies, backend, persistence, click count, commits, or pushes.

## Review focus

- Rapid successive clicks retain earlier bursts and expire each independently.
- Unmount/StrictMode clear both emoji timeouts and experience intervals.
- BASE_URL prefixes the real CV correctly, including subpath deployment.
- Rotated mobile corners, shadows, and emoji travel do not widen the document.
- Hover hit areas remain stable; entrance completion retains default rotation.

## Task 1: Joy Machine state and rendering

**Files:** `apps/portfolio/src/hooks/useJoyMachine.ts` and its test;
`apps/portfolio/src/components/JoyMachine/` owns its component, styles, test,
and index export.

**Interface:** `useJoyMachine()` returns `emojis` and `releaseJoy()`. Each emoji
has a unique id, glyph, bounded origin/drift/rotation/size/delay/duration.
`JoyMachine()` renders the card, shared Button, footer, and decorative trail.

- [x] Write tests for generation, repeated clicks, independent expiration, unique
      IDs, bounded values, unmount timer cleanup, keyboard activation, and hidden
      non-intercepting decorative output. Run to establish missing-feature failures.
- [x] Implement six-item bursts and one cleanup timeout per burst; clear timers
      on unmount. Render the fluid card with stable hover wrappers.
- [x] Run the focused hook/component tests; expect all to pass.

## Task 2: Hero composition, contacts, and experience

**Files:** Modify Hero.tsx, Title.tsx, Title.css, LandingPage integration tests,
App.test.tsx, index.html, theme CSS and Tailwind adapter; create Hero.css,
Hero.test.tsx, and useExperienceHours.ts/useExperienceHours.test.tsx in src/hooks.
Rename the real public CV to `cv/abigail-ojeda-cv.pdf`, preserving its hash.

**Interfaces:** Hero consumes JoyMachine and Title's existing props.
`useExperienceHours()` returns formatted nonnegative elapsed hours, refreshed each
second with an interval that is cleared on unmount.

- [x] Write tests for hours/time progression/clamping/cleanup, exact contact
      destinations and security attributes, root/subpath CV URLs and download
      filename, and one main/h1. Scope navigation assertions to Navbar. Run RED.
- [x] Implement the two-column/stacked composition, independent pill wrapper,
      responsive bold heading and underline, shared Button controls, accent token,
      real CV rename, and once-only entrance/emoji keyframes with reduced motion.
- [x] Run the focused tests and the full test suite; expect all to pass.

## Task 3: Verification and review

**Files:** Update only relevant design/current-state documentation and plan status.

- [x] Inspect light/dark desktop and 320px layouts against both mockups, including
      stable independent hover, keyboard focus, burst repetition, and no overflow.
      Check reduced motion in a browser where available; explicitly report limits.
- [x] Run `pnpm check`, `git diff --check`, and `git diff --cached --check`.
- [x] Perform one independent read-only review against the complete approved
      specification, including untracked implementation files. Fix necessary
      findings and rerun affected verification.
- [x] Record evidence and remaining limitations; leave changes uncommitted.

## Verification evidence — 2026-11-01

- pnpm check passed formatting, lint, all TypeScript projects, 101 tests across
  17 files, and portfolio/UI-library/Storybook builds. Both Git whitespace checks
  passed. Storybook retains its chunk-size warning.
- Browser inspected light/dark desktop and 320px/mobile layouts, independent
  hover/focus states, keyboard activation, rapid repeated bursts (12 particles),
  natural cleanup, and no horizontal overflow at 320/390/640/1024/1555px widths.
- Independent review found one P2: tilted corners extended beyond hover wrappers
  and could flicker. Full rotation/shadow gutters corrected it. A stationary
  pointer at the former corner now holds 0 degrees; leaving restores +10/-8.
  The full check passed again after this correction.
- Root and /portfolio/ CV URLs returned HTTP 200 application/pdf with %PDF
  signatures and unchanged file contents. SHA-256:
  FA6E36D195E590F20B1EB10000BDB12F23EB99BDB041E55F9F3F50A1E5B0B229.
- Reduced-motion rules were inspected: entrance travel and hover transitions are
  omitted, and emojis fade in place. Actual browser reduced-motion emulation was
  NOT RUN because the available browser exposes no media-emulation capability.
  Touch-friendly native activation was exercised at mobile widths; no physical
  touch-device test was performed.
- Changes remain uncommitted on the existing feat/hero branch.

## Requested corrections

- [x] Give components their own folders and move app hooks to src/hooks, updating
      imports and relocated test fixture paths.
- [x] Keep the heading size; compact supporting typography, pill, contacts, and
      spacing; make the underline thin and angled as in the correction screenshot.
- [x] Replace local button styling with shared Button and document its minimal
      neutral/muted filled tones in Storybook.
- [x] Remove focus-driven rotation and widen/stagger emoji origins, replacing
      rainbows with pink hearts. Preserve burst cleanup and repeated activation.
- [x] Verify focused-button mouse leave, both themes, active bursts at narrow
      widths, existing link/download behavior, and final project checks.
- [x] Complete one independent review of the corrections and record results.

Correction verification: `pnpm check` passed all stages with 104 tests across
17 files and all three builds. Both Git whitespace checks passed. Browser checks
confirmed the heading remains 64px at the reference desktop width, compact
supporting text and controls, correct light/dark Button tones, no overflow at
320/390/640/1024/1555px, and a 10-degree return after pointer leave while the Joy
button retains focus. Active, staggered heart bursts stayed inside the 320px page.
The independent correction review found no actionable issues. Storybook retains
its chunk-size and plugin-timing warnings. Reduced-motion browser emulation
remains unavailable; the existing CSS fallback behavior is preserved.

## Final verification of the current working tree

- Preserved the user's Navbar and Joy Machine edits. Applied only whitespace
  formatting to JoyMachine.tsx. Per the user's clarification, retained navigation
  tests/assertions as commented code for restoration with the temporarily hidden
  navigation; branding, theme-control, landmark, and Hero coverage remain active.
- `pnpm check` passed formatting, lint, all TypeScript projects, 102 active tests
  across 17 files, and the UI-library, portfolio, and Storybook builds. Storybook
  retains its non-blocking chunk-size warning.
- The independent read-only review found the temporary navigation/test mismatch
  and stale current-state documentation. Those findings were resolved according
  to the user's clarification; no other actionable implementation issues were found.
- Browser checks covered light/dark presentation and widths of 320, 390, 1024,
  and 1555px without horizontal overflow. The stable outer aside remains unrotated;
  clicking the Joy button straightens the card, and mouse leave restores 10 degrees
  while the button retains focus. The temporary viewport override was reset.
- Actual reduced-motion browser emulation remains NOT RUN: the available browser
  has no media-emulation capability. The inspected reduced-motion CSS remains
  unchanged. No physical touch-device test was performed.
- All applicable implementation and review tasks remain complete. Changes are
  uncommitted and nothing has been pushed.
