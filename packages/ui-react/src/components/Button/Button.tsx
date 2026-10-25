import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

import "./Button.css";

type ButtonAppearance = {
  variant?: "filled" | "outlined" | "bottom-border" | "text";
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  radius?: CSSProperties["borderRadius"];
  /** Opaque absolute CSS accent; unsupported engines retain semantic defaults. */
  color?: CSSProperties["color"];
  padding?: "normal" | "none";
  paddingX?: CSSProperties["paddingInline"];
  paddingY?: CSSProperties["paddingBlock"];
};

export type ButtonProps = ButtonAppearance &
  (
    | (Omit<ComponentPropsWithoutRef<"button">, "color"> & { href?: never })
    | (Omit<ComponentPropsWithoutRef<"a">, "color" | "href"> & { href: string })
  );

/** Icon-only controls must supply aria-label or aria-labelledby. */
export function Button({
  variant = "filled",
  icon,
  iconPosition = "start",
  radius,
  color,
  padding = "normal",
  paddingX,
  paddingY,
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const iconSlot =
    icon == null ? null : (
      <span
        aria-hidden="true"
        className="inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-full"
      >
        {icon}
      </span>
    );
  const content = (
    <>
      {iconPosition === "start" && iconSlot}
      {children != null && <span className="min-w-0">{children}</span>}
      {iconPosition === "end" && iconSlot}
    </>
  );
  const sharedProps = {
    className: `ui-button inline-flex min-w-0 max-w-full cursor-pointer items-center justify-center gap-2 font-medium text-center wrap-anywhere no-underline outline-none transition-colors duration-150 disabled:cursor-default motion-reduce:transition-none ${variant === "bottom-border" ? "rounded-none" : "rounded-lg"} ${padding === "normal" ? "px-4 py-2" : "p-0"} ${className ?? ""}`,
    "data-variant": variant,
    "data-padding": padding,
    "data-custom-color": color === undefined ? undefined : "",
    style: {
      ...style,
      ...(paddingX === undefined ? {} : { paddingInline: paddingX }),
      ...(paddingY === undefined ? {} : { paddingBlock: paddingY }),
      ...(radius === undefined ? {} : { borderRadius: radius }),
      ...(variant === "bottom-border" ? { borderRadius: 0 } : {}),
      ...(color === undefined ? {} : { "--button-color": color }),
    } as CSSProperties,
  };

  if (props.href !== undefined) {
    return (
      <a {...props} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button {...props} type={props.type ?? "button"} {...sharedProps}>
      {content}
    </button>
  );
}
