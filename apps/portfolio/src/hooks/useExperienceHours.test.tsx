import { act, cleanup, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useExperienceHours } from "./useExperienceHours";

describe("useExperienceHours", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("calculates hours from midnight in Madrid and updates every second", () => {
    vi.setSystemTime(new Date("2020-09-30T23:00:00Z"));
    const { result } = renderHook(useExperienceHours);

    expect(result.current).toBe("1.00000");

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current).toBe("1.00028");
  });

  it("does not show negative elapsed hours", () => {
    vi.setSystemTime(new Date("2020-09-30T21:00:00Z"));
    const { result } = renderHook(useExperienceHours);

    expect(result.current).toBe("0.00000");
  });

  it("clears the refresh interval on unmount", () => {
    const { unmount } = renderHook(useExperienceHours, { wrapper: StrictMode });
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
