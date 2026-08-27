import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
      {...props}
    >
      {children}
    </button>
  )
}
