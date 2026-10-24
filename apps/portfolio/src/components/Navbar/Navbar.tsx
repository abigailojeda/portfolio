import { NavLink } from "@portfolio/ui-react";
import { useSyncExternalStore } from "react";

import { ColorModeSwitch } from "../ColorModeSwitch";

const destinations = [
  { href: "#home", label: "Home" },
  { href: "#journey", label: "Journey" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

function subscribeToHashChange(onChange: () => void) {
  window.addEventListener("hashchange", onChange);

  return () => {
    window.removeEventListener("hashchange", onChange);
  };
}

function readCurrentDestination() {
  return window.location.hash || "#home";
}

export function Navbar() {
  const currentDestination = useSyncExternalStore(
    subscribeToHashChange,
    readCurrentDestination,
  );

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-6 py-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-20">
        <span className="order-1 min-w-0 text-sm font-semibold tracking-tight text-foreground sm:text-base">
          ABIGAIL OJEDA
        </span>
        <nav
          aria-label="Main navigation"
          className="order-3 col-span-2 flex min-w-0 flex-wrap items-center justify-center gap-x-6 gap-y-1 lg:order-2 lg:col-span-1"
        >
          {destinations.map((destination) => (
            <NavLink
              key={destination.href}
              href={destination.href}
              aria-current={
                destination.href === currentDestination ? "location" : undefined
              }
            >
              {destination.label}
            </NavLink>
          ))}
        </nav>
        <div className="order-2 justify-self-end lg:order-3">
          <ColorModeSwitch />
        </div>
      </div>
    </header>
  );
}
