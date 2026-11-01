import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch, type SwitchProps } from "../../index";

const states = {
  uncheckedState: { label: "Off" },
  checkedState: { label: "On" },
};

function ControlledSwitch({
  checked: initialChecked,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [checked, setChecked] = useState(initialChecked);

  function handleCheckedChange(nextChecked: boolean) {
    onCheckedChange(nextChecked);
    setChecked(nextChecked);
  }

  return (
    <Switch
      {...props}
      checked={checked}
      onCheckedChange={handleCheckedChange}
    />
  );
}

describe("Switch", () => {
  it("toggles from either visual half, including the active half, once per click", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <ControlledSwitch
        {...states}
        aria-label="Notifications"
        checked={false}
        onCheckedChange={notify}
      />,
    );

    const control = screen.getByRole("switch", { name: "Notifications" });

    expect(control).not.toBeChecked();

    await user.click(screen.getByText("Off"));

    expect(control).toBeChecked();
    expect(notify).toHaveBeenNthCalledWith(1, true);

    await user.click(screen.getByText("On"));

    expect(control).not.toBeChecked();
    expect(notify).toHaveBeenNthCalledWith(2, false);
    expect(notify).toHaveBeenCalledTimes(2);
    expect(control).toHaveAccessibleName("Notifications");
  });

  it("keeps the input controlled when the parent declines an update", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <Switch
        {...states}
        aria-label="Notifications"
        checked={false}
        onCheckedChange={notify}
      />,
    );

    const control = screen.getByRole("switch");

    await user.click(control);

    expect(notify).toHaveBeenCalledExactlyOnceWith(true);
    expect(control).not.toBeChecked();
  });

  it("reflects parent updates without invoking the callback", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <Switch
        {...states}
        aria-label="Notifications"
        checked={false}
        onCheckedChange={notify}
      />,
    );

    rerender(
      <Switch
        {...states}
        aria-label="Notifications"
        checked
        onCheckedChange={notify}
      />,
    );

    expect(screen.getByRole("switch")).toBeChecked();
    expect(notify).not.toHaveBeenCalled();
  });

  it("has one tab stop, toggles with Space, and lets Tab leave", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <>
        <ControlledSwitch
          {...states}
          aria-label="Notifications"
          checked={false}
          onCheckedChange={notify}
        />
        <button>After</button>
      </>,
    );

    const control = screen.getByRole("switch");

    await user.tab();

    expect(control).toHaveFocus();
    expect(notify).not.toHaveBeenCalled();

    await user.keyboard(" ");

    expect(control).toBeChecked();
    expect(notify).toHaveBeenCalledExactlyOnceWith(true);

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it.each([false, true])(
    "preserves checked=%s while disabled and skips keyboard focus",
    async (checked) => {
      const user = userEvent.setup();
      const notify = vi.fn();

      render(
        <>
          <Switch
            {...states}
            aria-label="Notifications"
            checked={checked}
            onCheckedChange={notify}
            disabled
          />
          <button>After</button>
        </>,
      );

      const control = screen.getByRole("switch");

      expect(control).toBeDisabled();

      await user.click(screen.getByText("On"));
      await user.tab();

      expect(control).toHaveProperty("checked", checked);
      expect(notify).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    },
  );

  it("supports visible labels with independent optional decorative icons", () => {
    render(
      <Switch
        aria-label="Notifications"
        uncheckedState={{
          label: "Off",
          icon: (
            <svg
              data-testid="off-icon"
              role="img"
              aria-label="Decorative off"
            />
          ),
        }}
        checkedState={{ label: "On" }}
        presentation="icon-text"
        checked={false}
        onCheckedChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Off")).toBeVisible();
    expect(screen.getByText("On")).toBeVisible();
    expect(screen.getByTestId("off-icon")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAccessibleName("Notifications");
  });

  it("keeps icon-only switches named by external text without showing state labels", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <>
        <h2 id="notifications-label">Notifications</h2>
        <ControlledSwitch
          id="notifications"
          aria-labelledby="notifications-label"
          uncheckedState={{
            label: "Off",
            icon: <svg data-testid="off-icon" />,
          }}
          checkedState={{ label: "On", icon: <svg data-testid="on-icon" /> }}
          presentation="icon"
          checked={false}
          onCheckedChange={notify}
        />
      </>,
    );

    const control = screen.getByRole("switch", { name: "Notifications" });

    expect(control).toHaveAttribute("id", "notifications");
    expect(screen.queryByText("Off")).not.toBeInTheDocument();
    expect(screen.queryByText("On")).not.toBeInTheDocument();
    expect(screen.getByTestId("off-icon")).toBeInTheDocument();
    expect(screen.getByTestId("on-icon")).toBeInTheDocument();

    await user.click(control);

    expect(control).toBeChecked();
    expect(control).toHaveAccessibleName("Notifications");
  });

  it("keeps instances independent", async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();

    render(
      <>
        <ControlledSwitch
          {...states}
          aria-label="First"
          checked={false}
          onCheckedChange={first}
        />
        <ControlledSwitch
          {...states}
          aria-label="Second"
          checked={false}
          onCheckedChange={second}
        />
      </>,
    );

    await user.click(screen.getByRole("switch", { name: "First" }));

    expect(screen.getByRole("switch", { name: "First" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Second" })).not.toBeChecked();
    expect(first).toHaveBeenCalledExactlyOnceWith(true);
    expect(second).not.toHaveBeenCalled();
  });
});
