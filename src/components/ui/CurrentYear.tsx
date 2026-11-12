"use client";

import { useSyncExternalStore } from "react";

/**
 * This year, and not the year the site was last built.
 *
 * The public footer is prerendered, so `new Date().getFullYear()` in it was
 * frozen at build time: the copyright line would have said 2026 all through
 * 2027 until somebody deployed. The server still renders the build year, so
 * the markup is right for a crawler and for anybody without JavaScript; the
 * browser corrects it on hydration, which for the one day a year it is wrong
 * is the whole of the fix.
 *
 * useSyncExternalStore rather than an effect: the server snapshot and the
 * client snapshot are each read once, and there is nothing to subscribe to —
 * which is exactly the shape this hook is for, and keeps it clear of the
 * set-state-in-effect rule.
 */
const subscribe = () => () => {};

export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );

  return <>{year}</>;
}
