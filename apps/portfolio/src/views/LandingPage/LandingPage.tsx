import { Navbar } from "../../components/Navbar";

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar />
      <main id="home" className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <h1 className="sr-only">Abigail Ojeda — portfolio</h1>
        <div id="journey" />
        <div id="stack" />
        <div id="contact" />
      </main>
    </div>
  );
}
