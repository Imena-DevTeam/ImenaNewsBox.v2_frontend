import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

/* Where a value lives when localStorage refuses it, so it still lasts for
   the visit. */
const memory = new Map<string, string>();

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return memory.get(key) ?? fallback;
  }
}

/**
 * A string kept in localStorage, shared live between every component that
 * reads the same key — and with other tabs, through the storage event.
 *
 * For per-device conveniences only (what has been read, what was sent from
 * here). The server render sees `fallback`, so a prerendered page and the
 * first client render always agree. Storage that is blocked or full simply
 * falls back; nothing breaks.
 */
export function useStoredValue(
  key: string,
  fallback: string,
): [string, (next: string) => void] {
  const value = useSyncExternalStore(
    (onChange) => {
      const forKey = listeners.get(key) ?? new Set();
      forKey.add(onChange);
      listeners.set(key, forKey);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onChange();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        forKey.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => read(key, fallback),
    () => fallback,
  );

  const write = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        /* Private mode or full storage: the value lasts until reload. */
        memory.set(key, next);
      }
      listeners.get(key)?.forEach((notify) => notify());
    },
    [key],
  );

  return [value, write];
}
