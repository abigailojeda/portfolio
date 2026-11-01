import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import "./NavLink.css";

export type NavLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "color"
> & {
  href: string;
  variant?: "simple" | "underline";
  /** Accent for hover/current text and underline; omit for semantic defaults. */
  color?: CSSProperties["color"];
};

export function NavLink({
  variant = "simple",
  className,
  children,
  color,
  style,
  ...props
}: NavLinkProps) {
  return (
    <a
      {...props}
      data-variant={variant}
      style={
        color === undefined
          ? style
          : ({ ...style, "--nav-link-color": color } as CSSProperties)
      }
      className={`ui-nav-link relative inline-flex min-h-11 min-w-0 max-w-full items-center rounded-sm py-2 text-sm wrap-anywhere text-muted-foreground no-underline outline-none transition-colors duration-150 motion-reduce:transition-none ${className ?? ""}`}
    >
      {children}
    </a>
  );
}
