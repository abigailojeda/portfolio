import { NavLink, type NavLinkProps } from "../../index";

// Compiled by the existing library type check; never imported into the bundle.
export function navLinkTypeChecks() {
  const props: NavLinkProps = { href: "/projects", children: "Projects" };
  const simple = <NavLink {...props} />;
  const accent = <NavLink {...props} color="#006c73" />;
  // @ts-expect-error Color accepts a CSS color, not a numeric value.
  const invalidColor = <NavLink {...props} color={123} />;
  const underline = (
    <NavLink {...props} variant="underline" aria-current="page" />
  );
  const anchorEvent = (
    <NavLink
      {...props}
      onClick={(event) => {
        const anchor: HTMLAnchorElement = event.currentTarget;
        return anchor.href;
      }}
    />
  );

  // @ts-expect-error Navigation links require a destination.
  const missingHref = <NavLink>Projects</NavLink>;
  // @ts-expect-error Only the two supported visual variants are available.
  const wrongVariant = <NavLink {...props} variant="pill" />;

  return [
    simple,
    accent,
    invalidColor,
    underline,
    anchorEvent,
    missingHref,
    wrongVariant,
  ];
}
