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
        "text-ui transition-fast relative flex flex-col items-center gap-1",
        active ? "text-surface" : "text-surface/70 hover:text-surface",
      )}
    >
      {label}
      {/* The active-page dot from the design. It scales in rather than
          appearing, so moving between pages reads as one movement. */}
      <span
        aria-hidden
        className={cn(
          "bg-surface rounded-pill transition-base size-1",
          active ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      />
    </Link>
  );
}
