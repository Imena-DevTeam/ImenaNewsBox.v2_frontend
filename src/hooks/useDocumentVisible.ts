import { useSyncExternalStore } from "react";

/**
 * Whether this tab is the one being looked at. Anything that plays on its
 * own — the gallery stage, the dashboard slides — pauses while it is not,
 * so a visitor coming back finds the slide they left rather than a jump.
 */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => document.visibilityState === "visible",
    () => true,
  );
}
