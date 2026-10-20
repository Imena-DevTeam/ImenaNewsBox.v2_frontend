"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogIn } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

const CHOICES = [
  { label: "As Admin", href: `${ROUTES.LOGIN}?as=admin` },
  { label: "As a member", href: `${ROUTES.LOGIN}?as=member` },
];

/**
 * The Login button and the two ways in, as the design shows them.
 *
 * Closes on Escape and on a click outside, and the items are reachable by
 * keyboard, so the menu is not a mouse-only control.
 */
export function LoginMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="bg-surface text-primary hover:bg-surface/90 h-control-sm rounded-pill text-ui transition-fast inline-flex items-center justify-center px-5"
      >
        Login
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Login options"
          className="bg-surface shadow-main absolute top-full right-0 z-10 mt-3 w-44 overflow-hidden rounded-md py-2"
        >
          {CHOICES.map((choice) => (
            <Link
              key={choice.href}
              href={choice.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-body-sm text-text hover:bg-band transition-fast flex items-center gap-3 px-4 py-2"
            >
              <LogIn className="text-muted size-4" />
              {choice.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
