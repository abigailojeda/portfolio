import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Navbar } from "./Navbar";

afterEach(() => {
  window.history.replaceState(null, "", window.location.pathname);
});

describe("Navbar", () => {
  it("marks the clicked fragment as current instead of keeping Home active", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("link", { name: "Journey" }));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Journey" })).toHaveAttribute(
        "aria-current",
        "location",
      );
    });

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getAllByRole("link", { current: "location" })).toHaveLength(
      1,
    );
  });

  it("reads the initial fragment and responds to browser hash changes", () => {
    window.history.replaceState(null, "", "#stack");
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Stack" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    act(() => {
      window.history.replaceState(null, "", "#contact");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Stack" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("composes branding, native destinations, and an accessible icon-only theme control", () => {
    const { container } = render(<Navbar />);
    const navigation = within(
      screen.getByRole("navigation", { name: "Main navigation" }),
    );

    expect(screen.getByText("ABIGAIL OJEDA")).toBeVisible();

    for (const [label, href] of [
      ["Home", "#home"],
      ["Journey", "#journey"],
      ["Stack", "#stack"],
      ["Contact", "#contact"],
    ]) {
      expect(navigation.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }

    expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("switch", { name: "Dark mode" })).not.toBeChecked();
    expect(screen.queryByText("Light")).not.toBeInTheDocument();
    expect(screen.queryByText("Dark")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
});
