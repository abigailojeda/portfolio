import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("provides the home landmark and a single level-one heading", () => {
    render(<LandingPage />);

    /* Temporarily disabled while Navbar navigation is commented out.
    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });

    for (const link of within(navigation).getAllByRole("link")) {
      const href = link.getAttribute("href");

      expect(href).toMatch(/^#/);
      expect(document.getElementById(href!.slice(1))).toBeInTheDocument();
    }
    */

    expect(screen.getByRole("main")).toHaveAttribute("id", "home");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("presents the introduction and Joy Machine inside the main landmark", () => {
    render(<LandingPage />);

    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { name: "Abigail Ojeda", level: 1 }),
    ).toBeInTheDocument();
    expect(
      main.getByRole("button", { name: "Boost your mood!" }),
    ).toBeInTheDocument();
  });
});
