# Hero redesign specification

Status: approved on 2026-11-01, including the final hover and responsive
clarifications. Supersedes the Hero presentation in the
2026-10-31 design; the existing Navbar and color-mode infrastructure remain.

Verification clarification: preserve the user's temporarily commented Navbar
navigation. Comment the associated navigation tests/assertions for restoration
alongside it; retain active branding, theme-control, landmark, and Hero tests.

## Intent and references

Replace the illustration-led Hero with the supplied typographic, two-column
composition and an interactive Joy Machine. Use `docs/design/mockups/hero_2.png`
for the default tilted state and `docs/design/mockups/hero.png` for the straight
hover state. Both references are light mode; derive dark mode from the existing
semantic theme contract rather than introducing a second UI implementation.

Match the supplied copy, bold sans-serif hierarchy, name line breaks, red
underline, outlined greeting pill, contact controls, card border, hard offset
shadow, dashed footer divider, and restrained corner radii. Remove the former
illustration, pink glow, and journey CTA from the Hero. Preserve the existing
navigation destinations and one main landmark.

## Approach and ownership

Recommended approach: keep all new presentation and interaction in the portfolio
app. Hero and JoyMachine each have their own folder beneath `src/components`.
Hooks live in `src/hooks`, including useJoyMachine, useExperienceHours, and the
existing useColorMode. Emoji keyframes stay in JoyMachine.css; entrance keyframes
stay in Hero.css. No global state or dependencies are required.

The user's correction requires the existing shared Button for all contact links
and the Joy Machine action. Its existing href API already preserves native anchor
semantics. Add a minimal filled-tone prop: primary (unchanged default), neutral,
and muted, keeping appearance CSS inside the library. Preserve all variants and
the custom-color/padding/radius APIs. Do not duplicate Button styles in the app.

Retain Title's existing `as`, `size`, and `children` API. Adapt its hero size to
the new bold heading and suppress its old glow for that size; keep the section
size's existing appearance. Hero owns the underline on the surname. Remove the
unused Alice font request only if no remaining consumer uses it.

## Layout, themes, and interaction states

- On desktop, place the introduction on the left and a roughly 500px-wide card
  on the right, matching the references' relative widths and generous gap.
- The card is fluid (`w-full` with a maximum width), not fixed-width. Preserve
  its proportions, internal spacing, content, and hard shadow at mobile widths.
- Below the desktop breakpoint, stack introduction and card in reading order.
  Let metadata and contact links wrap, reserve space for rotated corners and
  shadows, and allow vertical document growth on short viewports.
- Keep the supplied name on two lines. Use the current sans-serif foundation,
  approximately 64px desktop heading text, with responsive scaling on mobile.
- Keep that heading size unchanged while reducing all other left-column text:
  greeting at 11px, role/hours/contact controls at 14px, introductory copy at 16px.
  Reduce pill/button padding and vertical gaps. Use a thin, slightly upward-angled
  red underline matching the user's correction screenshot rather than a thick bar.
- Default rotations are approximately -8 degrees for the pill and +10 degrees
  for the card. Each has its own stable outer hover container. Hover anywhere
  within that container smoothly straightens its child to exactly zero; it stays
  straight until mouse leave, then smoothly returns to its default tilt.
- The Joy Machine aside owns the hover group and remains stable; only its inner
  card surface rotates. The surrounding Hero layout does not own this hover state.
- Use a single CSS transition for each state change, with Tailwind group-hover,
  rotate, transition-transform, and duration utilities. No JavaScript hover state,
  looping hover animation, or transform-dependent hit area. Focus must not affect
  rotation: even after button activation, mouse leave restores the default tilt.
  Preserve the shared Button's independent focus-visible feedback.
- Use background/foreground tokens for the page, card, border, hard shadow, and
  primary controls. Derive the LinkedIn control's gray fill with a mix of those
  tokens. Add only the required semantic red accent to design-tokens and its
  existing Tailwind adapter for the name underline, with readable light/dark
  values. Do not change existing token values or introduce a theme provider.
- Preserve accessible, subtle focus-visible indicators. Native button activation
  supports keyboard and touch; hover is not required to use the Joy Machine.

## Copy and elapsed experience

Use the references' copy, including HELLO INTERNET!, FRONTEND ENGINEERING, the
introductory paragraph and emphasis, and the Joy Machine's title, description,
button, and copyright footer. Contact labels are Email, LinkedIn, and Download CV.

The user selected elapsed experience rather than fixed mockup text. Calculate
hours from **2020-10-01T00:00:00+02:00** (midnight in Europe/Madrid on 1 October
2020). Update every second and clear the interval on unmount. Display elapsed
hours with five decimal places and readable digit grouping; never display a
negative value. Keep the number out of live announcements so screen readers
are not interrupted every second. No click counter or joy-releases label.

## Contacts and CV

- Email: `mailto:abigail.info.tech@gmail.com`.
- LinkedIn: `https://www.linkedin.com/in/abigail-ojeda/`, with `target="_blank"`
  and `rel="noopener noreferrer"`.
- Download: `${import.meta.env.BASE_URL}cv/abigail-ojeda-cv.pdf`, with
  `download="Abigail-Ojeda-CV.pdf"`.
- The repository contains the real `public/cv/Abigail_CV_2026.pdf`. Rename it to
  the requested filename without changing its contents. Do not create a
  placeholder or alter the PDF.

## Entrance and Joy Machine animations

Use short CSS entrance animations with slight upward translation and opacity,
optionally staggered. They run once when Hero first appears, independently of
hover transitions. Put entrance animation on wrappers separate from the pill
and card rotations so completion preserves their tilted default states. Prefer
Tailwind utilities and keep only necessary keyframes beside Hero/JoyMachine.

Each Give me joy! activation appends a small burst of approximately six cheerful
emojis. Start them around the button and animate upward in a vertical trail,
with wider distributed horizontal origins, vertical-origin jitter, drift, delay,
duration, rotation, and size. Stagger the particles into a loose trail. Remove
rainbows and include pink hearts (💗 💖 💕 💞) alongside the cheerful emojis.
Repeated clicks append independent bursts; existing trails continue. The hook
assigns unique IDs and removes each burst after its longest animation finishes.
Clear all remaining cleanup timers on unmount, including React StrictMode cycles.

Emojis are decorative, aria-hidden, pointer-events-none, and not live content.
Bound their horizontal movement so they cannot cause page overflow. Under
reduced motion, omit entrance/hover motion and replace floating trails with
brief stationary fades; keep activation and item cleanup working. Do not disable
the button or require hover. No animation library, backend, or persistence.

## Implementation outline

1. Add focused tests for contact attributes, root/subpath CV URLs, elapsed hours
   and timer cleanup, repeated Joy Machine bursts, item expiration, keyboard
   activation, and unmount cleanup. Update integration assertions for the new
   heading and links, limiting navigation-target checks to the navigation region.
2. Implement Hero, adapt Title's hero presentation, and add JoyMachine plus its
   hook, minimal local animation CSS, the red accent, and the real CV rename.
3. Verify both reference states, independent hover/focus, touch-friendly use,
   light/dark themes, reduced motion, and narrow/short viewport behavior. Run
   `pnpm check` and Git whitespace checks. Run an independent final review.

## Acceptance and limits

All links have the requested targets and download semantics; the real CV is
served at root and subpath deployments. Both interaction states retain the hard
shadow, minimal border, dashed divider, and red underline. At 320 CSS pixels,
content remains readable and usable without clipping or horizontal scrolling.
Joy bursts append and expire without leaking timers or blocking controls.

No Navbar redesign, unrelated library restyling or refactoring, new sections,
dependencies, commits, or pushes. Preserve the user's current mockup updates,
illustration deletion, and PDF contents. Exact responsive gaps, timings, and
emoji choices remain implementation details to tune against the references.
