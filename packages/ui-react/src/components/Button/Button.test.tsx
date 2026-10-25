import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders its content", () => {
    render(<Button>Continue</Button>);

    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Continue</Button>);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("defaults to a non-submitting button and forwards explicit types", () => {
    const { rerender } = render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");

    rerender(
      <Button type="submit" name="action" value="save">
        Save
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    expect(screen.getByRole("button")).toHaveAttribute("name", "action");
    expect(screen.getByRole("button")).toHaveAttribute("value", "save");
  });

  it("renders a native link even for an empty href", () => {
    render(
      <Button href="" target="_blank" rel="noreferrer" download>
        Download
      </Button>,
    );

    const link = screen.getByText("Download").closest("a");

    expect(link).toHaveAttribute("href", "");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("download");
    expect(link).not.toHaveAttribute("type");
  });

  it("keeps disabled buttons inactive", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(["start", "end"] as const)(
    "places a decorative icon at the %s",
    (iconPosition) => {
      render(
        <Button
          icon={<svg aria-label="Decorative arrow" />}
          iconPosition={iconPosition}
        >
          Continue
        </Button>,
      );

      const button = screen.getByRole("button", { name: "Continue" });
      const icon = button.querySelector('[aria-hidden="true"]');

      expect(icon).toContainElement(button.querySelector("svg"));
      expect(
        iconPosition === "start"
          ? button.firstElementChild
          : button.lastElementChild,
      ).toBe(icon);
    },
  );

  it("supports named icon-only controls and external labels", () => {
    render(
      <>
        <Button icon={<svg />} aria-label="Close" />
        <span id="help-label">Help</span>
        <Button href="/help" icon={<svg />} aria-labelledby="help-label" />
      </>,
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute(
      "href",
      "/help",
    );
  });

  it.each(["filled", "outlined", "bottom-border", "text"] as const)(
    "applies independent padding overrides to %s buttons and icon-only links",
    (variant) => {
      const { rerender } = render(
        <Button variant={variant} paddingX="2rem">
          Save
        </Button>,
      );
      let control = screen.getByRole("button");

      expect(control.style.paddingInline).toBe("2rem");
      expect(control.style.paddingBlock).toBe("");
      expect(control).not.toHaveAttribute("paddingX");

      rerender(
        <Button variant={variant} paddingY={12}>
          Save
        </Button>,
      );
      control = screen.getByRole("button");

      expect(control.style.paddingInline).toBe("");
      expect(control.style.paddingBlock).toBe("12px");

      rerender(
        <Button
          href="/help"
          variant={variant}
          icon={<svg />}
          aria-label="Help"
          padding="none"
          paddingX={0}
          paddingY="0.75rem"
          style={{ paddingInline: 99, paddingBlock: 99, marginTop: 4 }}
        />,
      );
      control = screen.getByRole("link", { name: "Help" });

      expect(control.style.paddingInline).toBe("0px");
      expect(control.style.paddingBlock).toBe("0.75rem");
      expect(control.style.marginTop).toBe("4px");
      expect(control).not.toHaveAttribute("paddingY");
    },
  );

  it.each(["filled", "outlined", "bottom-border", "text"] as const)(
    "supports the %s appearance without leaking custom props",
    (variant) => {
      render(
        <Button
          variant={variant}
          color="#6750a4"
          radius="9999px"
          padding="none"
          className="consumer"
          style={{ marginTop: 4 }}
        >
          Save
        </Button>,
      );

      const button = screen.getByRole("button");

      expect(button).toHaveClass("ui-button", "consumer");
      expect(button).toHaveAttribute("data-variant", variant);
      expect(button).toHaveAttribute("data-padding", "none");
      expect(button.style.getPropertyValue("--button-color")).toBe("#6750a4");
      expect(button.style.borderRadius).toBe(
        variant === "bottom-border" ? "0px" : "9999px",
      );
      expect(button.style.marginTop).toBe("4px");
      expect(button).not.toHaveAttribute("iconPosition");
      expect(button).not.toHaveAttribute("radius");
    },
  );
});
