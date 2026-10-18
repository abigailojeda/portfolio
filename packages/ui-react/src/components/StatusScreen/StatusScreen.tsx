import type { ReactElement, ReactNode } from "react";

export type StatusScreenProps = {
  title: string;
  illustration: ReactNode;
  subtitle: string;
};

export function StatusScreen({
  title,
  illustration,
  subtitle,
}: StatusScreenProps): ReactElement {
  return (
    <div className="flex w-full min-w-0 flex-col items-center text-center text-foreground">
      <h1 className="relative z-10 max-w-full text-4xl leading-tight font-bold wrap-anywhere sm:text-6xl">
        {title}
      </h1>
      <div className="relative isolate aspect-[5/4] w-full max-w-80 shrink-0">
        <svg
          className="absolute -top-[12%] right-[7%] h-[108%] w-[88%] fill-blob-back"
          viewBox="0 0 280 280"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M140 4C215-2 275 56 277 132C280 211 225 276 144 278C62 281 4 228 3 151C2 80 61 10 140 4Z" />
        </svg>
        <svg
          className="absolute bottom-[2%] left-0 h-[67%] w-[59%] fill-blob-front"
          viewBox="0 0 190 180"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M89 3C135 1 168 31 183 70C199 111 172 152 132 171C91 190 38 177 13 144C-9 115 0 70 24 39C40 18 64 5 89 3Z" />
        </svg>
        <div className="relative flex h-full items-center justify-center pt-[8%] [&>svg]:h-auto [&>svg]:w-[64%]">
          {illustration}
        </div>
      </div>
      <p className="mt-6 max-w-lg text-lg leading-5 wrap-anywhere whitespace-pre-line">
        {subtitle}
      </p>
    </div>
  );
}
