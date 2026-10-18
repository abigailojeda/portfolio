import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { StatusScreen, type StatusScreenProps } from "../../index";

describe("StatusScreen", () => {
  it("exposes exactly the three required public props", () => {
    expectTypeOf<StatusScreenProps>().toEqualTypeOf<{
      title: string;
      illustration: ReactNode;
      subtitle: string;
    }>();
  });

  it("renders supplied content in reading order and preserves subtitle newlines", () => {
    render(
      <StatusScreen
        title="Service update"
        illustration={<span>Artwork</span>}
        subtitle={"Line one\nLine two"}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Service update",
    });
    const artwork = screen.getByText("Artwork");
    const paragraph = screen.getByText(/Line one/);
    expect(paragraph.tagName).toBe("P");
    expect(paragraph.textContent).toBe("Line one\nLine two");
    expect(
      heading.compareDocumentPosition(artwork) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      artwork.compareDocumentPosition(paragraph) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(document.querySelector("main, [role='main']")).toBeNull();
  });

  it("supports alternate status content without portfolio defaults", () => {
    render(
      <StatusScreen
        title="Maintenance"
        illustration={<span>Repair tools</span>}
        subtitle="We will be back shortly."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Maintenance" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Repair tools")).toBeInTheDocument();
    expect(screen.getByText("We will be back shortly.")).toBeInTheDocument();
    expect(
      screen.queryByText(/coming soon|something awesome|come back soon/i),
    ).not.toBeInTheDocument();
  });

  it("renders markup-like strings literally and accepts null artwork", () => {
    render(
      <StatusScreen
        title="<b>Status</b>"
        illustration={null}
        subtitle="<em>Waiting</em>"
      />,
    );

    expect(screen.getByRole("heading").textContent).toBe("<b>Status</b>");
    expect(screen.getByText("<em>Waiting</em>")).toBeInTheDocument();
    expect(document.querySelector("b, em, main, [role='main']")).toBeNull();
  });

  it("accepts empty strings without fallback copy", () => {
    const { container } = render(
      <StatusScreen title="" illustration={null} subtitle="" />,
    );

    expect(screen.getByRole("heading").textContent).toBe("");
    expect(container.textContent).toBe("");
    expect(container.querySelector("p")?.textContent).toBe("");
  });

  it("preserves meaningful artwork accessibility while hiding only the blobs", () => {
    const { container } = render(
      <StatusScreen
        title="Status"
        illustration={<svg role="img" aria-label="Service state" />}
        subtitle="Please wait."
      />,
    );

    expect(
      screen.getByRole("img", { name: "Service state" }),
    ).toBeInTheDocument();
    const blobs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(blobs).toHaveLength(2);
    blobs.forEach((blob) => expect(blob).toHaveAttribute("focusable", "false"));
  });
});
