import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Hero } from "./Hero";

describe("Hero contacts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("provides the email and secure external LinkedIn destinations", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:abigail.info.tech@gmail.com",
    );
    const linkedIn = screen.getByRole("link", { name: "LinkedIn" });
    expect(linkedIn).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/abigail-ojeda/",
    );
    expect(linkedIn).toHaveAttribute("target", "_blank");
    expect(linkedIn).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each([
    ["/", "/cv/abigail-ojeda-cv.pdf"],
    ["/portfolio/", "/portfolio/cv/abigail-ojeda-cv.pdf"],
  ])("resolves the CV beneath deployment base %s", (baseUrl, expectedHref) => {
    vi.stubEnv("BASE_URL", baseUrl);
    render(<Hero />);

    const download = screen.getByRole("link", { name: "Download CV" });
    expect(download).toHaveAttribute("href", expectedHref);
    expect(download).toHaveAttribute("download", "Abigail-Ojeda-CV.pdf");
  });
});
