import { act, cleanup, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useJoyMachine } from "./useJoyMachine";

describe("useJoyMachine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("adds decorative emojis with bounded horizontal movement", () => {
    const { result } = renderHook(useJoyMachine);

    act(() => result.current.releaseJoy());

    expect(result.current.emojis.length).toBeGreaterThan(0);

    for (const emoji of result.current.emojis) {
      expect(emoji.glyph).not.toBe("");
      expect(Math.abs(emoji.offsetX)).toBeLessThanOrEqual(68);
      expect(Math.abs(emoji.drift)).toBeLessThanOrEqual(24);
      expect(emoji.duration).toBeGreaterThan(0);
    }

    const offsets = result.current.emojis.map((emoji) => emoji.offsetX);
    expect(Math.min(...offsets)).toBeLessThan(-40);
    expect(Math.max(...offsets)).toBeGreaterThan(40);

    const delays = result.current.emojis.map((emoji) => emoji.delay);
    expect(delays.at(-1)! - delays[0]).toBeGreaterThan(400);
  });

  it("offers pink hearts without rainbow emojis", () => {
    vi.mocked(Math.random).mockReturnValue(0.99);
    const { result } = renderHook(useJoyMachine);

    act(() => result.current.releaseJoy());

    expect(
      result.current.emojis.some((emoji) => /💗|💖|💕|💞/u.test(emoji.glyph)),
    ).toBe(true);
    expect(result.current.emojis.some((emoji) => emoji.glyph === "🌈")).toBe(
      false,
    );
  });

  it("retains successive bursts and expires them independently", () => {
    const { result } = renderHook(useJoyMachine);

    act(() => result.current.releaseJoy());
    const firstIds = result.current.emojis.map((emoji) => emoji.id);

    act(() => vi.advanceTimersByTime(1500));
    act(() => result.current.releaseJoy());

    const allIds = result.current.emojis.map((emoji) => emoji.id);
    expect(allIds.length).toBeGreaterThan(firstIds.length);
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(allIds).toEqual(expect.arrayContaining(firstIds));

    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.emojis.length).toBeGreaterThan(0);
    expect(result.current.emojis.map((emoji) => emoji.id)).not.toEqual(
      expect.arrayContaining(firstIds),
    );

    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.emojis).toEqual([]);
  });

  it("clears pending burst timers on unmount", () => {
    const { result, unmount } = renderHook(useJoyMachine, {
      wrapper: StrictMode,
    });

    act(() => result.current.releaseJoy());
    act(() => result.current.releaseJoy());
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
