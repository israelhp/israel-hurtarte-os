import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AppId } from "@/shared/app-ids";
import { initialState } from "./model";
import { useWm } from "./store";

const win = (id: AppId) => useWm.getState().wins[id];

beforeEach(() => {
  vi.useFakeTimers();
  useWm.getState().reset();
  useWm.setState({ ...initialState(), openTick: 0 });
});
afterEach(() => vi.useRealTimers());

describe("window store animation timers", () => {
  it("closes after the animation delay", () => {
    const { open, close } = useWm.getState();
    open("home");
    close("home");
    expect(win("home").anim).toBe("closing");
    vi.advanceTimersByTime(149);
    expect(win("home").open).toBe(true);
    vi.advanceTimersByTime(2);
    expect(win("home").open).toBe(false);
  });

  it("a window reopened while closing stays open", () => {
    const { open, close } = useWm.getState();
    open("home");
    close("home");
    vi.advanceTimersByTime(60);
    open("home");
    vi.advanceTimersByTime(500);
    expect(win("home")).toMatchObject({ open: true, anim: "" });
  });

  it("close, reopen, close again: the stale first timer must not cut the second animation short", () => {
    const { open, close } = useWm.getState();
    open("home");
    close("home"); // t=0, would finish at 150
    vi.advanceTimersByTime(50);
    open("home");
    vi.advanceTimersByTime(30);
    close("home"); // t=80, finishes at 230
    vi.advanceTimersByTime(100); // t=180: past the first timer
    expect(win("home")).toMatchObject({ open: true, anim: "closing" });
    vi.advanceTimersByTime(60); // t=240
    expect(win("home").open).toBe(false);
  });

  it("minimize hides after its delay and restore from the dock cancels a pending minimize", () => {
    const { open, minimize } = useWm.getState();
    open("about");
    minimize("about");
    vi.advanceTimersByTime(191);
    expect(win("about").min).toBe(true);
    open("about");
    expect(win("about").min).toBe(false);
    minimize("about");
    vi.advanceTimersByTime(100);
    open("about");
    vi.advanceTimersByTime(500);
    expect(win("about")).toMatchObject({ min: false, open: true });
  });

  it("reset cancels pending timers and closes everything", () => {
    const { open, close, reset } = useWm.getState();
    open("home");
    close("home");
    reset();
    open("home");
    vi.advanceTimersByTime(500);
    expect(win("home").open).toBe(true);
  });

  it("every explicit open bumps openTick (used to hand keyboard focus to the window)", () => {
    const { open } = useWm.getState();
    open("home");
    open("home");
    expect(useWm.getState().openTick).toBe(2);
  });
});
