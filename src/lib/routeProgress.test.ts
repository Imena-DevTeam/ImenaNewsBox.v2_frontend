import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  finish,
  getServerSnapshot,
  getSnapshot,
  start,
  subscribe,
} from "./routeProgress";

/** Drain any pending trickle/hide timers so each test starts from hidden. */
function settle() {
  finish();
  vi.runOnlyPendingTimers();
}

describe("routeProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    settle();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts hidden on the server and before any navigation", () => {
    expect(getServerSnapshot()).toEqual({ width: 0, active: false });
    expect(getSnapshot()).toEqual({ width: 0, active: false });
  });

  it("shows and begins filling when a navigation starts", () => {
    start();
    expect(getSnapshot().active).toBe(true);
    expect(getSnapshot().width).toBeGreaterThan(0);
  });

  it("eases toward the end but never reaches 100 on its own", () => {
    start();
    vi.advanceTimersByTime(280 * 40);
    expect(getSnapshot().width).toBeGreaterThan(50);
    expect(getSnapshot().width).toBeLessThanOrEqual(90);
  });

  it("snaps to 100 and then hides when the page arrives", () => {
    start();
    finish();
    expect(getSnapshot()).toEqual({ width: 100, active: true });

    vi.advanceTimersByTime(280);
    expect(getSnapshot()).toEqual({ width: 0, active: false });
  });

  it("is a no-op to finish when nothing is navigating", () => {
    finish();
    expect(getSnapshot()).toEqual({ width: 0, active: false });
  });

  it("does not restart while already running", () => {
    start();
    vi.advanceTimersByTime(280 * 3);
    const midway = getSnapshot().width;
    start();
    // A second start must not reset the bar to its opening width.
    expect(getSnapshot().width).toBe(midway);
  });

  it("notifies subscribers as the bar changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    start();
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });
});
