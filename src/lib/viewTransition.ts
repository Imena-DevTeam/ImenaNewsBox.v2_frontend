/**
 * A state change the browser is allowed to animate between.
 *
 * `view-transition-name` on its own does nothing to a React re-render: the
 * View Transitions API only captures a change made inside
 * `document.startViewTransition`, and React's updates are asynchronous, so
 * the callback has to flush them itself. That is the whole of this file —
 * three lines of plumbing so a row can carry its name into the dialog that
 * opens over it.
 *
 * Where it is used, two elements share one name across the change: the thing
 * clicked, in the state before, and the thing that opens, in the state
 * after. A name present twice at once cancels the transition, so whoever
 * calls this sets the outgoing name first (see `morph` in MembersTable).
 *
 * Everywhere the API is missing — Firefox today, and jsdom under the tests —
 * the update simply runs, which is the behaviour this code had before.
 */
import { flushSync } from "react-dom";

/** Whether the person reading has asked for less movement. */
export function motionWanted(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function withViewTransition(run: () => void): void {
  if (
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function" ||
    !motionWanted()
  ) {
    run();
    return;
  }

  document.startViewTransition(() => flushSync(run));
}
