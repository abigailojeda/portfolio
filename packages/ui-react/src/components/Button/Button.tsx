import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button data-ui-source="@portfolio/ui-react" {...props}>
      UI React: {children}
    </button>
  );
}
