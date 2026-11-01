import { Button } from "@portfolio/ui-react";

import { Title } from "../Title";
import { JoyMachine } from "../JoyMachine";
import { useExperienceHours } from "../../hooks/useExperienceHours";

import "./Hero.css";

export function Hero() {
  const hours = useExperienceHours();

  return (
    <section className="mx-auto grid w-full max-w-[84.5rem] flex-1 grid-cols-1 content-center items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 xl:gap-28">
      <div className="hero-enter min-w-0">
        <div className="group/hello -mx-2 -my-1 inline-block px-2 py-3">
          <p className="w-fit -rotate-8 rounded-md border border-foreground px-2.5 py-1.5 text-[0.6875rem] transition-transform duration-300 ease-out group-hover/hello:rotate-0 motion-reduce:transition-none">
            HELLO INTERNET!
          </p>
        </div>
        <div className="mt-3">
          <Title as="h1" size="hero">
            Abigail <br />
            <span className="relative inline-block after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:origin-left after:-rotate-3 after:bg-accent">
              Ojeda
            </span>
          </Title>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm leading-tight tracking-tight">
          <p className="font-bold">FRONTEND ENGINEERING</p>
          <p className="tabular-nums">Since {hours} hours</p>
        </div>
        <p className="mt-3 max-w-[41rem] text-base leading-5 tracking-tight">
          I build <strong>thoughtful digital products</strong>, scalable
          frontend systems, and every now and then{" "}
          <strong>something delightfully ridiculous with CSS.</strong>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            href="mailto:abigail.info.tech@gmail.com"
            tone="neutral"
            paddingX={12}
            paddingY={6}
            className="text-sm"
          >
            Email
          </Button>
          <Button
            href="https://www.linkedin.com/in/abigail-ojeda/"
            target="_blank"
            rel="noopener noreferrer"
            tone="muted"
            paddingX={12}
            paddingY={6}
            className="text-sm"
          >
            LinkedIn
          </Button>
          <Button
            href={`${import.meta.env.BASE_URL}cv/abigail-ojeda-cv.pdf`}
            download="Abigail-Ojeda-CV.pdf"
            variant="outlined"
            paddingX={12}
            paddingY={6}
            className="text-sm"
          >
            Download CV
          </Button>
        </div>
      </div>
      <div className="hero-enter min-w-0 [animation-delay:180ms]">
        <JoyMachine />
      </div>
    </section>
  );
}
