import { Button } from "@portfolio/ui-react";
import type { CSSProperties } from "react";

import { useJoyMachine } from "../../hooks/useJoyMachine";

import "./JoyMachine.css";

export function JoyMachine() {
  const { emojis, releaseJoy } = useJoyMachine();

  return (
    <aside
      aria-labelledby="joy-machine-title"
      className="group/joy -mx-4 w-[calc(100%+2rem)] min-w-0 max-w-xl px-8 py-12 sm:mx-auto sm:w-full lg:relative lg:top-8"
    >
      <div className="flex aspect-29/20 min-h-80 w-full min-w-0 rotate-10 flex-col border-2 border-foreground bg-background px-5 pt-12 pb-8 text-foreground shadow-[6px_6px_0_var(--ds-color-foreground)] transition-transform duration-300 ease-out group-hover/joy:rotate-0 motion-reduce:transition-none">
        <div className="flex flex-1 flex-col items-center text-center">
          <h2
            id="joy-machine-title"
            className="text-xl leading-tight font-bold tracking-tight"
          >
            TRY THE <br />
            Joy machine!
          </h2>
          <p className="mt-4 text-base leading-5">
            get some easy happiness <br />
            just clicking
          </p>
          <div className="relative mt-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1/2 left-1/2 z-10 h-64 w-56 -translate-x-1/2"
            >
              {emojis.map((emoji) => (
                <span
                  key={emoji.id}
                  className="joy-emoji absolute bottom-0 left-1/2 select-none"
                  style={
                    {
                      "--joy-x": `${emoji.offsetX}px`,
                      "--joy-y": `${emoji.offsetY}px`,
                      "--joy-rise": `${emoji.rise}px`,
                      "--joy-drift": `${emoji.drift}px`,
                      "--joy-rotation": `${emoji.rotation}deg`,
                      fontSize: emoji.size,
                      animationDelay: `${emoji.delay}ms`,
                      animationDuration: `${emoji.duration}ms`,
                    } as CSSProperties
                  }
                >
                  {emoji.glyph}
                </span>
              ))}
            </div>
            <Button
              tone="neutral"
              onClick={releaseJoy}
              paddingX={20}
              paddingY={8}
              className="min-h-11 text-xl"
            >
              Give me joy!
            </Button>
          </div>
        </div>
        <footer className="mt-8 border-t border-dashed border-foreground pt-4 text-[0.6875rem]">
          © Abigail Ojeda .2026
        </footer>
      </div>
    </aside>
  );
}
