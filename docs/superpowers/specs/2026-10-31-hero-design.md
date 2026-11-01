# Hero design and implementation plan

## Design

Reproduce the supplied mockup below the existing Navbar: center the supplied
illustration above a left-aligned heading with a pink glow, followed by the
underlined journey link. Use “Abigail Ojeda” and “Frontend developer”, with
the mockup's contrasting sans-serif and Alice serif heading styles.
Fill the available screen below the Navbar, scaling the illustration and heading
with the viewport while allowing content to reflow and scroll on small screens.

`Title` is portfolio-owned and accepts `as` (`h1`, `h2`, `h3`), `size`
(`hero`, `section`), and children. Its large, blurred decorative glow moves slowly
across the first quarter of the title and stays static when reduced motion is
requested. `Hero` uses Title, the
existing SVG, the shared bottom-border Button, and a Heroicons arrow linking to
`#journey`.
The visible hero heading replaces the existing screen-reader-only heading.

Continue using semantic foreground and background tokens, and keep the pink
glow's styling local to Title.css. Keep the supplied SVG unchanged. Preserve the
existing Navbar, UI library, navigation targets, and theme behavior. Do not add
the decorative rule from the previous mockup.

## Implementation and verification

1. Add focused tests for Title's heading and sizes, Hero's content and journey
   link, and the LandingPage's single main and visible level-one heading.
2. Implement Title and Hero; integrate Hero in LandingPage using
   component-local styles for the glow and responsive composition.
3. Run the relevant tests and `pnpm check`; inspect the page against the mockup
   at desktop and narrow widths in both color modes, including reduced motion.
4. Perform one final review of the diff, accessibility, and test results. Do not
   commit or push.
