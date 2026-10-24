import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("provides a real target for each navigation link without adding landing content", () => {
    render(<LandingPage />);

    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href");

      expect(href).toMatch(/^#/);
      expect(document.getElementById(href!.slice(1))).toBeInTheDocument();
    }

    expect(screen.getByRole("main")).toHaveAttribute("id", "home");
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });
});
