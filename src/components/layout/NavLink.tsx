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
        "text-ui relative flex flex-col items-center gap-1 transition-colors",
        active ? "text-surface" : "text-surface/70 hover:text-surface",
      )}
    >
      {label}
      {/* The active-page dot from the design. */}
      <span
        aria-hidden
        className={cn(
          "rounded-pill size-1",
          active ? "bg-surface" : "bg-transparent",
        )}
      />
    </Link>
  );
}
