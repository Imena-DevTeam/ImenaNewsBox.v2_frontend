"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Undo2, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ToastOptions {
  message: string;
  /** One action, usually Undo. Running it closes the toast. */
  action?: { label: string; run: () => void };
  /** How long it stays. Longer by default when there is something to undo. */
  durationMs?: number;
}

type Toast = ToastOptions & { id: number };

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

/**
 * Announce how something ended: "Saved", "Removed — Undo". One toast at a
 * time, at the foot of the screen above the mobile dock, read out by screen
 * readers through a live region that is always in the page.
 *
 * It pauses while the pointer or keyboard focus is on it, so somebody
 * reaching for Undo is never beaten to it by the timer.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [paused, setPaused] = useState(false);
  const counter = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    counter.current += 1;
    setToast({ ...options, id: counter.current });
  }, []);

  useEffect(() => {
    if (!toast || paused) return;
    const ms = toast.durationMs ?? (toast.action ? 6000 : 3500);
    const timer = window.setTimeout(() => setToast(null), ms);
    return () => window.clearTimeout(timer);
  }, [toast, paused]);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        data-toaster
        className="pointer-events-none fixed inset-x-0 bottom-24 z-60 flex justify-center px-4 md:bottom-8"
      >
        {toast ? (
          <div
            key={toast.id}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={cn(
              "bg-member-ink text-surface shadow-menu pointer-events-auto flex max-w-md items-center gap-2 rounded-md py-2 pr-2 pl-4",
              "motion-safe:animate-dialog-pop",
            )}
          >
            <p className="text-body-sm py-1">{toast.message}</p>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  /* Closed first, so a toast the action itself raises
                     ("… is back") is the one left on screen. */
                  setToast(null);
                  toast.action?.run();
                }}
                className="text-body-sm hover:bg-surface/15 inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 font-semibold"
              >
                <Undo2 aria-hidden className="size-4" />
                {toast.action.label}
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setToast(null)}
              className="hover:bg-surface/15 grid size-9 shrink-0 place-items-center rounded-sm"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext>
  );
}

/** `toast({ message, action })` from anywhere under the provider. */
export function useToast() {
  return useContext(ToastContext);
}
