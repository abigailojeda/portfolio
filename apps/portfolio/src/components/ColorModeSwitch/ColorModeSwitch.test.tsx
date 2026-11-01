import { StrictMode } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ColorModeSwitch } from "./ColorModeSwitch";

function mockSystemPreference(initialDark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const media = {
    matches: initialDark,
    addEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.add(listener),
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.delete(listener),
  };

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );

  function change(dark: boolean) {
    media.matches = dark;

    for (const listener of listeners) {
      listener({ matches: dark } as MediaQueryListEvent);
    }
  }

  return { listeners, change };
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});

describe("ColorModeSwitch", () => {
  it.each([false, true])(
    "reflects system dark=%s without forcing a root override",
    (dark) => {
      mockSystemPreference(dark);
      render(<ColorModeSwitch />);

      expect(screen.getByRole("switch", { name: "Dark mode" })).toHaveProperty(
        "checked",
        dark,
      );
      expect(document.documentElement).not.toHaveAttribute("data-theme");
    },
  );

  it.each(["light", "dark"] as const)(
    "respects an explicit root %s theme over system preference",
    (mode) => {
      mockSystemPreference(mode !== "dark");
      document.documentElement.dataset.theme = mode;

      render(<ColorModeSwitch />);

      expect(screen.getByRole("switch", { name: "Dark mode" })).toHaveProperty(
        "checked",
        mode === "dark",
      );
      expect(document.documentElement).toHaveAttribute("data-theme", mode);
    },
  );

  it("applies both explicit choices through the existing root theme attribute", async () => {
    const user = userEvent.setup();
    mockSystemPreference(false);
    render(<ColorModeSwitch />);

    const control = screen.getByRole("switch", { name: "Dark mode" });

    await user.click(control);

    expect(control).toBeChecked();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(control);

    expect(control).not.toBeChecked();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("follows live system changes until the user makes an explicit choice", async () => {
    const user = userEvent.setup();
    const preference = mockSystemPreference(false);
    render(<ColorModeSwitch />);
    const control = screen.getByRole("switch", { name: "Dark mode" });

    act(() => preference.change(true));

    expect(control).toBeChecked();

    await user.click(control);
    act(() => preference.change(true));

    expect(control).not.toBeChecked();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("keeps one system subscription in StrictMode and cleans up on unmount", () => {
    const preference = mockSystemPreference(false);
    const { unmount } = render(
      <StrictMode>
        <ColorModeSwitch />
      </StrictMode>,
    );

    expect(preference.listeners.size).toBe(1);

    unmount();

    expect(preference.listeners.size).toBe(0);
  });
});
