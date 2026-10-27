"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group text-ui transition-fast relative flex flex-col items-center gap-1",
        active ? "text-surface" : "text-surface/70 hover:text-surface",
      )}
    >
      {label}
      {/* The active-page dot from the design. On hover it stretches into a
          short underline, and an inactive link grows one from nothing, so
          the dot and the hover mark read as the same object. It is a 16px
          bar squeezed to 4px rather than a width change, so it animates on
          the compositor. */}
      <span
        aria-hidden
        className={cn(
          "bg-surface rounded-pill transition-base h-1 w-4",
          active
            ? "scale-x-25 opacity-100 group-hover:scale-x-100"
            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100",
        )}
      />
    </Link>
  );
}
