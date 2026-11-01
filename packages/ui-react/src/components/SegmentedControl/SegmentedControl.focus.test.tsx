import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "../../index";
import { options } from "./SegmentedControl.test-helpers";

describe("SegmentedControl focus", () => {
  it.each(["removed", "disabled"])(
    "recovers to the selected enabled option when a focused choice is %s",
    (change) => {
      const notify = vi.fn();
      const { rerender } = render(
        <SegmentedControl
          aria-label="Period"
          options={options}
          value="year"
          onValueChange={notify}
        />,
      );

      screen.getByRole("radio", { name: "Month" }).focus();

      const next =
        change === "removed"
          ? [options[0], options[2]]
          : options.map((option) => ({
              ...option,
              disabled: option.value === "month",
            }));

      rerender(
        <SegmentedControl
          aria-label="Period"
          options={next}
          value="year"
          onValueChange={notify}
        />,
      );

      expect(screen.getByRole("radio", { name: "Year" })).toHaveFocus();
      expect(notify).not.toHaveBeenCalled();
    },
  );

  it("recovers to the first enabled option without choosing a missing value", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="Period"
        options={options}
        value="week"
        onValueChange={notify}
      />,
    );

    screen.getByRole("radio", { name: "Week" }).focus();

    rerender(
      <SegmentedControl
        aria-label="Period"
        options={[{ ...options[1], disabled: true }, options[2]]}
        value="week"
        onValueChange={notify}
      />,
    );

    expect(screen.getByRole("radio", { name: "Year" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Year" })).not.toBeChecked();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not steal focus after the user leaves the group", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <>
        <SegmentedControl
          aria-label="Period"
          options={options}
          value="week"
          onValueChange={notify}
        />
        <button>Outside</button>
      </>,
    );

    screen.getByRole("radio", { name: "Week" }).focus();
    screen.getByRole("button", { name: "Outside" }).focus();

    rerender(
      <>
        <SegmentedControl
          aria-label="Period"
          options={[options[1]]}
          value="week"
          onValueChange={notify}
        />
        <button>Outside</button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not trap focus when no enabled options remain", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="Period"
        options={options}
        value="week"
        onValueChange={notify}
      />,
    );

    screen.getByRole("radio", { name: "Week" }).focus();

    rerender(
      <SegmentedControl
        aria-label="Period"
        options={[{ ...options[1], disabled: true }]}
        value="week"
        onValueChange={notify}
      />,
    );

    expect(screen.getByRole("radio")).not.toHaveFocus();

    rerender(
      <SegmentedControl<string>
        aria-label="Period"
        options={[]}
        value="week"
        onValueChange={notify}
      />,
    );

    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(notify).not.toHaveBeenCalled();
  });

  it("preserves option identity when punctuation-containing values are reordered", () => {
    const special = [
      { value: 'a"]:#', label: "A / B" },
      { value: "period space", label: "Period & range" },
    ];
    const notify = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="Categories"
        options={special}
        value={special[0].value}
        onValueChange={notify}
      />,
    );
    const radio = screen.getByRole("radio", { name: "A / B" });

    radio.focus();

    rerender(
      <SegmentedControl
        aria-label="Categories"
        options={[...special].reverse()}
        value={special[0].value}
        onValueChange={notify}
      />,
    );

    expect(screen.getByRole("radio", { name: "A / B" })).toBe(radio);
    expect(radio).toHaveFocus();
    expect(radio).toBeChecked();
    expect(notify).not.toHaveBeenCalled();
  });
});
