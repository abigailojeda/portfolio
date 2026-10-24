import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NavLink } from "../../index";

describe("NavLink", () => {
  it("scopes an optional accent while preserving native styles and removing it when omitted", () => {
    const { rerender } = render(
      <NavLink
        href="/projects"
        color="#006c73"
        style={{ marginTop: 4 }}
        aria-current="page"
      >
        Projects
      </NavLink>,
    );
    const link = screen.getByRole("link", { name: "Projects" });

    expect(link.style.getPropertyValue("--nav-link-color")).toBe("#006c73");
    expect(link).toHaveStyle({ marginTop: "4px" });
    expect(link).not.toHaveAttribute("color");

    rerender(
      <NavLink href="/projects" style={{ marginTop: 4 }} aria-current="page">
        Projects
      </NavLink>,
    );

    expect(link.style.getPropertyValue("--nav-link-color")).toBe("");
    expect(link).toHaveStyle({ marginTop: "4px" });
  });

  it.each(["simple", "underline"] as const)(
    "renders a named native %s link and preserves anchor props",
    (variant) => {
      render(
        <NavLink
          href="/projects"
          variant={variant}
          target="_blank"
          rel="noreferrer"
          id="projects-link"
          className="consumer-layout"
        >
          Projects
        </NavLink>,
      );

      const link = screen.getByRole("link", { name: "Projects" });

      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/projects");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveAttribute("id", "projects-link");
      expect(link).toHaveClass("ui-nav-link", "consumer-layout");
    },
  );

  it("forwards clicks without taking ownership of the current destination", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <NavLink
        href="/projects"
        onClick={(event) => {
          event.preventDefault();
          notify(event.currentTarget.getAttribute("href"));
        }}
      >
        Projects
      </NavLink>,
    );

    const link = screen.getByRole("link", { name: "Projects" });

    await user.click(link);

    expect(notify).toHaveBeenCalledExactlyOnceWith("/projects");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("reflects native current-state props and parent updates without click callbacks", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <NavLink href="#home" aria-current="location" onClick={notify}>
        Home
      </NavLink>,
    );
    const link = screen.getByRole("link", {
      name: "Home",
      current: "location",
    });

    rerender(
      <NavLink href="/home" aria-current="page" onClick={notify}>
        Home
      </NavLink>,
    );

    expect(screen.getByRole("link", { current: "page" })).toBe(link);

    rerender(
      <NavLink href="/home" aria-current={false} onClick={notify}>
        Home
      </NavLink>,
    );

    expect(screen.getByRole("link", { current: false })).toBe(link);
    expect(link).toHaveAttribute("aria-current", "false");

    rerender(
      <NavLink href="/home" onClick={notify}>
        Home
      </NavLink>,
    );

    expect(link).not.toHaveAttribute("aria-current");
    expect(notify).not.toHaveBeenCalled();
  });

  it("keeps native keyboard activation available to the consumer", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <NavLink
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          notify();
        }}
      >
        Home
      </NavLink>,
    );

    await user.tab();

    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    expect(notify).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");

    expect(notify).toHaveBeenCalledOnce();
  });

  it("keeps the current state and click handlers independent between instances", async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();

    render(
      <>
        <NavLink
          href="#home"
          aria-current="location"
          onClick={(event) => {
            event.preventDefault();
            first();
          }}
        >
          Home
        </NavLink>
        <NavLink
          href="#journey"
          onClick={(event) => {
            event.preventDefault();
            second();
          }}
        >
          Journey
        </NavLink>
      </>,
    );

    await user.click(screen.getByRole("link", { name: "Journey" }));

    expect(second).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Journey" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
