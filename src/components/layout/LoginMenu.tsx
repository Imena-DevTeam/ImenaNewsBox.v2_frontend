"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { LogIn } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { label: "As Admin", href: ROUTES.ADMIN_LOGIN },
  { label: "As a member", href: ROUTES.LOGIN },
];

/**
 * The navbar Login pill. Rather than going straight to a login page it opens
 * a small menu to pick the admin or the member login.
 *
 * `align` sets which edge the menu hangs from: "center" drops it from the
 * middle of the pill, as in the design; "start" keeps it inside the mobile
 * menu, where the pill sits at the left edge.
 */
export function LoginMenu({
  align = "center",
  className,
}: {
  align?: "center" | "start";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const menuId = useId();

  /* Close on a click outside. Focus leaving is handled by onBlur below. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const focusItem = (index: number) => {
    const count = OPTIONS.length;
    itemRefs.current[(index + count) % count]?.focus();
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      /* The items render hidden, so they can take focus straight away. */
      requestAnimationFrame(() =>
        focusItem(event.key === "ArrowDown" ? 0 : -1),
      );
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.indexOf(
      document.activeElement as HTMLAnchorElement,
    );
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(current - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKeyDown}
        className="rounded-pill bg-surface text-ui text-text h-control-sm transition-fast hover:bg-surface/90 inline-flex items-center justify-center px-5"
      >
        Login
      </button>

      {/* Kept mounted and hidden, so it can scale in when it opens. */}
      <div
        id={menuId}
        role="menu"
        aria-label="Log in"
        onKeyDown={onMenuKeyDown}
        className={cn(
          "bg-surface shadow-menu border-border transition-base absolute top-full z-10 mt-3 w-max min-w-40 origin-top rounded-md border p-2",
          /* Below xl the pill is near the viewport edge, so the menu lines up
             with its right side instead of overflowing the screen. */
          align === "center" ? "right-0 xl:right-auto xl:left-1/2" : "left-0",
          open
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        {OPTIONS.map((option, index) => (
          <Fragment key={option.href}>
            {index > 0 ? (
              <div role="separator" className="bg-border mx-1 my-1 h-px" />
            ) : null}
            <Link
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={option.href}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="text-body-lg text-text transition-fast hover:bg-band focus-visible:bg-band flex items-center gap-3 rounded-sm px-2 py-2"
            >
              <LogIn aria-hidden className="size-5 shrink-0" />
              {option.label}
            </Link>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
