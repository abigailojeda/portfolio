import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { JoyMachine } from "./JoyMachine";

describe("JoyMachine", () => {
  it("releases additional decorative bursts on repeated button clicks", async () => {
    const user = userEvent.setup();
    const { container } = render(<JoyMachine />);
    const button = screen.getByRole("button", { name: "Give me joy!" });

    await user.click(button);
    const firstBurst = container.querySelectorAll(".joy-emoji").length;
    expect(firstBurst).toBeGreaterThan(0);

    await user.click(button);
    expect(container.querySelectorAll(".joy-emoji").length).toBeGreaterThan(
      firstBurst,
    );
    expect(
      container.querySelector(".joy-emoji")?.closest('[aria-hidden="true"]'),
    ).toBeInTheDocument();
    expect(button).toHaveAccessibleName("Give me joy!");
  });

  it("supports keyboard activation", async () => {
    const user = userEvent.setup();
    const { container } = render(<JoyMachine />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Give me joy!" })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(container.querySelectorAll(".joy-emoji").length).toBeGreaterThan(0);
  });
});
