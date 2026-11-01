import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Controlled, options } from "./SegmentedControl.test-helpers";

describe("SegmentedControl dragging", () => {
  function setupScrollableControl(overflow = true, disabled = false) {
    const notify = vi.fn();

    render(
      <Controlled
        aria-label="Period"
        options={options.map((option) => ({ ...option, onSelect: notify }))}
        value="week"
        disabled={disabled}
        onValueChange={notify}
      />,
    );

    const group = screen.getByRole("radiogroup");

    Object.defineProperties(group, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: overflow ? 800 : 200 },
      clientHeight: { configurable: true, value: 50 },
    });
    group.scrollLeft = 100;

    return {
      notify,
      group,
      month: screen.getByRole("radio", { name: "Month" }),
    };
  }

  it.each(["pointercancel", "lostpointercapture"])(
    "cleans up %s and preserves keyboard activation and subsequent clicks",
    async (eventType) => {
      const user = userEvent.setup();
      const { group, month, notify } = setupScrollableControl();
      const capture = vi.fn();

      Object.defineProperty(group, "setPointerCapture", {
        configurable: true,
        value: capture,
      });
      await user.pointer([
        {
          keys: "[MouseLeft>]",
          target: month,
          coords: { clientX: 100, clientY: 10 },
        },
        { target: month, coords: { clientX: 60, clientY: 10 } },
      ]);

      expect(group).toHaveAttribute("data-dragging");

      const pointerId = capture.mock.calls[0][0];

      fireEvent(
        group,
        Object.assign(new Event(eventType, { bubbles: true }), { pointerId }),
      );

      expect(group).not.toHaveAttribute("data-dragging");

      await user.pointer({ keys: "[/MouseLeft]", target: document.body });
      month.focus();
      await user.keyboard(" ");

      expect(notify.mock.calls).toEqual([["month"], ["month"]]);

      await user.click(screen.getByRole("radio", { name: "Year" }));

      expect(notify.mock.calls).toEqual([
        ["month"],
        ["month"],
        ["year"],
        ["year"],
      ]);
    },
  );

  it("allows a fresh touch tap after a mouse drag loses capture", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl();
    const capture = vi.fn();

    Object.defineProperty(group, "setPointerCapture", { value: capture });
    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 60, clientY: 10 } },
    ]);
    fireEvent(
      group,
      Object.assign(new Event("lostpointercapture", { bubbles: true }), {
        pointerId: capture.mock.calls[0][0],
      }),
    );
    await user.pointer({ keys: "[/MouseLeft]", target: document.body });

    expect(notify).not.toHaveBeenCalled();

    await user.pointer([
      { keys: "[TouchA>]", target: month },
      { keys: "[/TouchA]", target: month },
    ]);

    expect(month).toBeChecked();
    expect(notify.mock.calls).toEqual([["month"], ["month"]]);
  });

  it("does not intercept native scrollbar presses", async () => {
    const user = userEvent.setup();
    const { group, notify } = setupScrollableControl();

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: group,
        coords: { clientX: 100, clientY: 52 },
      },
      { target: group, coords: { clientX: 50, clientY: 52 } },
      { keys: "[/MouseLeft]", target: group },
    ]);

    expect(group.scrollLeft).toBe(100);
    expect(group).not.toHaveAttribute("data-dragging");
    expect(notify).not.toHaveBeenCalled();
  });

  it("starts from the scroll position after focus reveals an option", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl();

    Object.defineProperty(month, "scrollIntoView", {
      value: () => {
        group.scrollLeft = 160;
      },
    });

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 60, clientY: 10 } },
      { keys: "[/MouseLeft]", target: month },
    ]);

    expect(group.scrollLeft).toBe(200);
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(notify).not.toHaveBeenCalled();
  });

  it("starts dragging at the six-pixel threshold", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl();

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 94, clientY: 10 } },
      { keys: "[/MouseLeft]", target: month },
    ]);

    expect(group.scrollLeft).toBe(106);
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not treat the secondary mouse button as a drag", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl();

    await user.pointer([
      {
        keys: "[MouseRight>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 40, clientY: 10 } },
      { keys: "[/MouseRight]", target: month },
    ]);

    expect(group.scrollLeft).toBe(100);
    expect(notify).not.toHaveBeenCalled();
  });

  it.each([60, -60])(
    "scrolls by the mouse delta %s without selecting or notifying",
    async (delta) => {
      const user = userEvent.setup();
      const { group, month, notify } = setupScrollableControl();

      await user.pointer([
        {
          keys: "[MouseLeft>]",
          target: month,
          coords: { clientX: 100, clientY: 10 },
        },
        { target: month, coords: { clientX: 100 + delta, clientY: 10 } },
        {
          keys: "[/MouseLeft]",
          target: month,
          coords: { clientX: 100 + delta, clientY: 10 },
        },
      ]);

      expect(group.scrollLeft).toBe(100 - delta);
      expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
      expect(notify).not.toHaveBeenCalled();

      await user.click(month);

      expect(notify.mock.calls).toEqual([["month"], ["month"]]);
    },
  );

  it("preserves normal selection below the movement threshold", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl();

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 104, clientY: 10 } },
      {
        keys: "[/MouseLeft]",
        target: month,
        coords: { clientX: 104, clientY: 10 },
      },
    ]);

    expect(group.scrollLeft).toBe(100);
    expect(notify.mock.calls).toEqual([["month"], ["month"]]);
  });

  it("does not drag fitting option sets", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl(false);

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 40, clientY: 10 } },
      { keys: "[/MouseLeft]", target: month },
    ]);

    expect(group.scrollLeft).toBe(100);
    expect(notify.mock.calls).toEqual([["month"], ["month"]]);
  });

  it("leaves touch panning to the browser", async () => {
    const user = userEvent.setup();
    const { group, month } = setupScrollableControl();

    await user.pointer([
      {
        keys: "[TouchA>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      {
        pointerName: "TouchA",
        target: month,
        coords: { clientX: 40, clientY: 10 },
      },
      { keys: "[/TouchA]", target: month },
    ]);

    expect(group.scrollLeft).toBe(100);
    expect(group).not.toHaveAttribute("data-dragging");
  });

  it("allows scrolling disabled content without invoking callbacks", async () => {
    const user = userEvent.setup();
    const { group, month, notify } = setupScrollableControl(true, true);

    await user.pointer([
      {
        keys: "[MouseLeft>]",
        target: month,
        coords: { clientX: 100, clientY: 10 },
      },
      { target: month, coords: { clientX: 40, clientY: 10 } },
      { keys: "[/MouseLeft]", target: month },
    ]);

    expect(group.scrollLeft).toBe(160);
    expect(notify).not.toHaveBeenCalled();
  });
});
