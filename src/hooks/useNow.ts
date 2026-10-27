import { useSyncExternalStore } from "react";

/* One clock per interval, shared by every component that asks for it. */
function snapshot(intervalMs: number): number {
  return Math.floor(Date.now() / intervalMs) * intervalMs;
}

/**
 * The current time, to the nearest `intervalMs`, refreshing on that beat.
 *
 * It is null during the server render and hydration — a prerendered page
 * cannot know when it is being read — so callers render a neutral value
 * first and the real time arrives once the page is running, with nothing
 * for hydration to disagree about.
 */
export function useNow(intervalMs: number): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const timer = setInterval(onChange, Math.min(intervalMs, 15_000));
      return () => clearInterval(timer);
    },
    () => snapshot(intervalMs),
    () => null,
  );
}
