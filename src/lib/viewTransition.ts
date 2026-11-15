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

/**
 * Resolves once the address bar shows `path`, or after a short wait if it
 * never does, so a navigation the router abandons cannot freeze the page
 * inside a transition.
 */
function untilPath(path: string, limitMs = 1200): Promise<void> {
  const started = performance.now();
  return new Promise((resolve) => {
    const check = () => {
      if (
        window.location.pathname === path ||
        performance.now() - started > limitMs
      ) {
        requestAnimationFrame(() => resolve());
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

/**
 * A client navigation the browser animates between: the old page is
 * captured, the router pushes, and the new page is captured once it is on
 * screen. Returns false where the API is missing or motion is turned down,
 * so the caller lets the link navigate the ordinary way.
 */
export function navigateWithTransition(
  push: (href: string) => void,
  href: string,
): boolean {
  if (
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function" ||
    !motionWanted()
  ) {
    return false;
  }
  const path = new URL(href, window.location.href).pathname;
  const transition = document.startViewTransition(() => {
    push(href);
    return untilPath(path);
  });
  /* A slow page (a first compile in dev, a cold server) can outlast the
     browser's patience, which aborts the animation and rejects these. The
     navigation itself carries on regardless, so the rejection is expected
     and not an error. */
  const ignore = () => {};
  transition.ready.catch(ignore);
  transition.finished.catch(ignore);
  transition.updateCallbackDone.catch(ignore);
  return true;
}
