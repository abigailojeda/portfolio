import { Navbar } from "../../components/Navbar";
import { Hero } from "../../components/Hero";

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar />
      <main
        id="home"
        className="flex w-full flex-1 flex-col px-6 py-8 sm:px-[8%] lg:px-20"
      >
        <Hero />
        <div id="journey" />
        <div id="stack" />
        <div id="contact" />
      </main>
    </div>
  );
}
