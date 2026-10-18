/// <reference types="node" />
import "@testing-library/jest-dom/vitest";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComingSoonIllustration } from "./ComingSoonIllustration";

describe("ComingSoonIllustration", () => {
  it("preserves the original compound path and transparent cutouts", () => {
    const sourcePath =
      "../../../../docs/design/artwork/rocket-laptop-editable.svg";
    const original = new DOMParser().parseFromString(
      readFileSync(new URL(sourcePath, import.meta.url), "utf8"),
      "image/svg+xml",
    );
    const { container } = render(<ComingSoonIllustration />);
    const svg = container.querySelector("svg")!;
    const path = svg.querySelector("path")!;

    expect(svg).toHaveAttribute(
      "viewBox",
      original.documentElement.getAttribute("viewBox"),
    );
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    for (const attribute of ["d", "fill", "fill-rule"]) {
      expect(path).toHaveAttribute(
        attribute,
        original.querySelector("path")!.getAttribute(attribute),
      );
    }
    expect(svg.style.color).toBe("");
    expect(container.querySelector("img")).toBeNull();
  });

  it("forwards caller dimensions, styling, and decorative accessibility props", () => {
    const { container } = render(
      <ComingSoonIllustration
        className="w-full"
        width={240}
        height={240}
        style={{ color: "rebeccapurple" }}
        aria-hidden="true"
        focusable="false"
      />,
    );
    const svg = container.querySelector("svg")!;

    expect(svg).toHaveClass("w-full");
    expect(svg).toHaveAttribute("width", "240");
    expect(svg).toHaveAttribute("height", "240");
    expect(svg.style.color).toBe("rebeccapurple");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("supports independently named instances without internal ID references", () => {
    const { container } = render(
      <>
        <ComingSoonIllustration role="img" aria-label="First launch" />
        <ComingSoonIllustration role="img" aria-label="Second launch" />
      </>,
    );

    expect(
      screen.getByRole("img", { name: "First launch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Second launch" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[id], [aria-labelledby]")).toHaveLength(
      0,
    );
  });
});
