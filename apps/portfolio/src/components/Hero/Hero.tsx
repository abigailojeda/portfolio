import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@portfolio/ui-react";

import illustration from "../../assets/illustrations/hero_illustration.svg";
import { Title } from "../Title";

export function Hero() {
  return (
    <section className="flex flex-1 flex-col justify-center">
      <div className="mx-auto aspect-544/172 w-full max-w-[min(clamp(34rem,52vw,60rem),80svh)] overflow-hidden">
        <img src={illustration} alt="" className="block h-auto w-full" />
      </div>
      <div className="mt-6">
        <Title as="h1" size="hero">
          <span className="block">Abigail Ojeda</span>{" "}
          <span className="block">
            Frontend <span className="font-[Alice,serif]">developer</span>
          </span>
        </Title>
        <Button
          href="#journey"
          variant="bottom-border"
          icon={<ArrowRightIcon />}
          iconPosition="end"
          paddingX={0}
          paddingY="16px"
          className="mt-8 text-sm"
        >
          Explore my journey
        </Button>
      </div>
    </section>
  );
}
