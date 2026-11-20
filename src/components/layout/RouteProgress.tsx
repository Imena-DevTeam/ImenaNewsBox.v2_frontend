"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  finish,
  getServerSnapshot,
  getSnapshot,
  start,
  subscribe,
} from "@/lib/routeProgress";

/**
 * A thin bar across the very top of the window that fills while the next page
 * is on its way — the dev-mode compile wait, and any slower navigation — so a
 * click never leaves you wondering whether anything is happening. It is the
 * YouTube/nprogress idea: it eases toward the end and snaps shut when the page
 * arrives. See @/lib/routeProgress for why the width is an honest fake.
 *
 * The state lives in that module, so these effects only *call* start/finish —
 * nothing sets React state from an effect, which this project forbids.
 */
export function RouteProgress() {
  const { width, active } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const pathname = usePathname();
  const settled = useRef(false);

  // The page has arrived when the path changes. Skip the first run: nothing
  // was navigating when the bar first mounted.
  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    finish();
  }, [pathname]);

  // Begin the bar the instant a navigation is asked for: a click on an
  // in-app link, the back/forward buttons, or a router.push/replace (which
  // go through the history API). start() is idempotent, so overlaps are fine.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.origin !== window.location.origin
      )
        return;

      // Same page (or just a #hash on it) does not navigate — do not start.
      const here = window.location.pathname + window.location.search;
      const there = anchor.pathname + anchor.search;
      if (there === here) return;

      start();
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", start);

    // router.push / router.replace reach the URL through the history API,
    // which the click listener never sees. Start only when the path really
    // changes, so the framework's same-URL replaces (scroll restoration and
    // the like) do not flash the bar.
    const startIfMoving = (url: unknown) => {
      if (typeof url !== "string" && !(url instanceof URL)) return;
      try {
        if (new URL(url, window.location.href).pathname !== location.pathname)
          start();
      } catch {
        /* an unparseable URL is not a navigation to show */
      }
    };

    const { pushState, replaceState } = window.history;
    window.history.pushState = function patchedPush(...args) {
      startIfMoving(args[2]);
      return pushState.apply(this, args);
    };
    window.history.replaceState = function patchedReplace(...args) {
      startIfMoving(args[2]);
      return replaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", start);
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="route-progress"
      data-active={active}
      style={{ transform: `scaleX(${width / 100})` }}
    />
  );
}
