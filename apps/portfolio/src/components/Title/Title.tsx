import type { ReactNode } from "react";

import "./Title.css";

type TitleProps = {
  as: "h1" | "h2" | "h3";
  size: "hero" | "section";
  children: ReactNode;
};

export function Title({ as: Heading, size, children }: TitleProps) {
  return (
    <Heading
      className={`portfolio-title relative isolate w-fit min-w-0 max-w-full wrap-anywhere text-foreground ${
        size === "hero"
          ? "text-[clamp(2.5rem,min(7.5vw,14svh),8.75rem)] leading-[1.1] tracking-tight"
          : "text-3xl leading-tight tracking-tight sm:text-5xl"
      }`}
    >
      {children}
    </Heading>
  );
}
