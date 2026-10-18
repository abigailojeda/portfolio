import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("composes the Coming Soon page within one main landmark", () => {
    const { container } = render(<App />);

    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        name: "COMING SOON",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Something awesome is in the works\./).textContent,
    ).toBe("Something awesome is in the works.\nCome back soon!");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const decorativeArtwork = container.querySelectorAll("svg");
    expect(decorativeArtwork).toHaveLength(3);
    decorativeArtwork.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });
  });
});
