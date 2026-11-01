import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "../../index";
import { Controlled, options } from "./SegmentedControl.test-helpers";

describe("SegmentedControl", () => {
  it("accepts an opaque accent without changing callbacks and removes it when omitted", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="Period"
        options={options}
        value="week"
        color="#ffcc00"
        onValueChange={notify}
      />,
    );
    const group = screen.getByRole("radiogroup");

    expect(group.style.getPropertyValue("--segmented-control-color")).toBe(
      "#ffcc00",
    );

    await user.click(screen.getByRole("radio", { name: "Month" }));

    expect(notify).toHaveBeenCalledExactlyOnceWith("month");

    rerender(
      <SegmentedControl
        aria-label="Period"
        options={options}
        value="week"
        onValueChange={notify}
      />,
    );

    expect(group.style.getPropertyValue("--segmented-control-color")).toBe("");
    expect(group).not.toHaveAttribute("data-custom-color");
  });

  it("renders a named controlled group and notifies changed selections in order", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];

    function Example() {
      const [value, setValue] = useState<"week" | "month" | "year">("week");

      function handleValueChange(nextValue: "week" | "month" | "year") {
        calls.push(`change:${nextValue}`);
        setValue(nextValue);
      }

      return (
        <SegmentedControl
          aria-label="Period"
          options={[
            { value: "week", label: "Week" },
            {
              value: "month",
              label: "Month",
              onSelect: (next) => calls.push(`select:${next}`),
            },
            { value: "year", label: "Year" },
          ]}
          value={value}
          onValueChange={handleValueChange}
        />
      );
    }

    render(<Example />);

    expect(
      screen.getByRole("radiogroup", { name: "Period" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Month" }));

    expect(calls).toEqual(["change:month", "select:month"]);
    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Month" }));

    expect(calls).toEqual(["change:month", "select:month"]);
  });

  it("keeps selection controlled when the parent declines an update", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSelect = vi.fn();

    render(
      <SegmentedControl
        aria-label="Period"
        options={[options[0], { ...options[1], onSelect }]}
        value="week"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Month" }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("month");
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("month");
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Month" })).not.toBeChecked();
  });

  it("isolates native selection and callbacks between instances with overlapping values", async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();

    render(
      <>
        <Controlled
          aria-label="First"
          options={options}
          value="week"
          onValueChange={first}
        />
        <Controlled
          aria-label="Second"
          options={options}
          value="week"
          onValueChange={second}
        />
      </>,
    );

    const firstGroup = within(
      screen.getByRole("radiogroup", { name: "First" }),
    );
    const secondGroup = within(
      screen.getByRole("radiogroup", { name: "Second" }),
    );

    expect(
      firstGroup.getByRole("radio", { name: "Week" }).getAttribute("name"),
    ).not.toBe(
      secondGroup.getByRole("radio", { name: "Week" }).getAttribute("name"),
    );

    await user.click(firstGroup.getByRole("radio", { name: "Month" }));

    expect(firstGroup.getByRole("radio", { name: "Month" })).toBeChecked();
    expect(secondGroup.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(first).toHaveBeenCalledExactlyOnceWith("month");
    expect(second).not.toHaveBeenCalled();

    await user.click(secondGroup.getByRole("radio", { name: "Year" }));

    expect(second).toHaveBeenCalledExactlyOnceWith("year");
    expect(first).toHaveBeenCalledTimes(1);
    expect(firstGroup.getByRole("radio", { name: "Month" })).toBeChecked();
  });

  it("supports naming by visible text and consumer IDs", () => {
    render(
      <>
        <h2 id="period-label">Reporting period</h2>
        <SegmentedControl
          id="period"
          aria-labelledby="period-label"
          options={options}
          value="week"
          onValueChange={vi.fn()}
        />
      </>,
    );

    expect(
      screen.getByRole("radiogroup", { name: "Reporting period" }),
    ).toHaveAttribute("id", "period");
  });

  it("updates controlled props without invoking callbacks", () => {
    const onValueChange = vi.fn();
    const onSelect = vi.fn();
    const initial = [{ ...options[0], onSelect }, options[1]];
    const { rerender } = render(
      <SegmentedControl
        aria-label="Period"
        options={initial}
        value="week"
        onValueChange={onValueChange}
      />,
    );

    rerender(
      <SegmentedControl
        aria-label="Period"
        options={[options[1], { ...options[0], onSelect }, options[2]]}
        value="month"
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("disables individual options without blocking the others", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSelect = vi.fn();

    render(
      <Controlled
        aria-label="Period"
        options={[
          options[0],
          { ...options[1], disabled: true, onSelect },
          options[2],
        ]}
        value="week"
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("radio", { name: "Month" })).toBeDisabled();

    await user.click(screen.getByText("Month"));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByText("Year"));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("year");
  });

  it("disables the component while preserving its selected option", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <SegmentedControl
        aria-label="Period"
        options={options.map((option) => ({ ...option, onSelect: notify }))}
        value="month"
        onValueChange={notify}
        disabled
      />,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }

    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();

    await user.click(screen.getByText("Year"));
    await user.tab();

    expect(screen.getByRole("radiogroup")).not.toContainElement(
      document.activeElement as HTMLElement,
    );
    expect(notify).not.toHaveBeenCalled();
  });

  it("preserves an individually disabled selection", () => {
    render(
      <SegmentedControl
        aria-label="Period"
        options={[{ ...options[0], disabled: true }, options[1]]}
        value="week"
        onValueChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Week" })).toBeDisabled();
  });

  it("renders nothing for empty options and supports one or many options", () => {
    const notify = vi.fn();
    const { rerender } = render(
      <SegmentedControl<string>
        aria-label="Choices"
        options={[]}
        value="missing"
        onValueChange={notify}
      />,
    );

    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();

    rerender(
      <SegmentedControl
        aria-label="Choices"
        options={[options[0]]}
        value="week"
        onValueChange={notify}
      />,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(1);

    const many = Array.from({ length: 25 }, (_, index) => ({
      value: `period-${index}`,
      label: `Period ${index}`,
    }));

    rerender(
      <SegmentedControl
        aria-label="Choices"
        options={many}
        value="period-24"
        onValueChange={notify}
      />,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(25);
    expect(screen.getByRole("radio", { name: "Period 24" })).toBeChecked();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not replace a missing selected value", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <SegmentedControl<string>
        aria-label="Period"
        options={options}
        value="missing"
        onValueChange={notify}
      />,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toBeChecked();
    }

    expect(notify).not.toHaveBeenCalled();

    await user.click(screen.getByRole("radio", { name: "Year" }));

    expect(notify).toHaveBeenCalledExactlyOnceWith("year");
  });

  it("uses native keyboard selection, skips disabled options, and exits with Tab", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();
    const action = vi.fn();

    render(
      <>
        <Controlled
          aria-label="Period"
          options={[
            options[0],
            { ...options[1], disabled: true },
            { ...options[2], onSelect: action },
          ]}
          value="week"
          onValueChange={notify}
        />
        <button>After</button>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("radio", { name: "Week" })).toHaveFocus();
    expect(notify).not.toHaveBeenCalled();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Year" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Year" })).toBeChecked();
    expect(notify).toHaveBeenCalledExactlyOnceWith("year");
    expect(action).toHaveBeenCalledExactlyOnceWith("year");

    await user.keyboard(" ");

    expect(notify).toHaveBeenCalledTimes(1);

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();

    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("radio", { name: "Year" })).toBeChecked();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("selects a focused unchecked radio with Space", async () => {
    const user = userEvent.setup();
    const notify = vi.fn();

    render(
      <Controlled
        aria-label="Period"
        options={options}
        value="week"
        onValueChange={notify}
      />,
    );

    screen.getByRole("radio", { name: "Month" }).focus();

    expect(notify).not.toHaveBeenCalled();

    await user.keyboard(" ");

    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
    expect(notify).toHaveBeenCalledExactlyOnceWith("month");
  });

  it("skips an all-disabled group during keyboard traversal", async () => {
    const user = userEvent.setup();

    render(
      <>
        <SegmentedControl
          aria-label="Period"
          options={options.map((option) => ({ ...option, disabled: true }))}
          value="week"
          onValueChange={vi.fn()}
        />
        <button>After</button>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });
});
