"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/constants/nav";
import { cn } from "@/lib/cn";

/**
 * The row of tabs a working area carries, so its pages are one place rather
 * than several dead ends.
 *
 * The first tab — the area's own root — matches exactly; the others match
 * their prefix, so /studio/posts/new keeps Posts marked. A nav with
 * aria-current is enough here: these are links, not a tab widget, and making
 * them one would cost keyboard semantics the browser already gives free.
 *
 * The open tab is marked by one underline that glides rather than snapping,
 * driven by a --i custom property — the same idea as the member rail's pill,
 * so every navigation in the member frames moves alike.
 *
 * The tabs are equal-width columns of a grid that hugs its content (w-fit +
 * auto-cols-fr), so each is as wide as the widest label and no wider. They
 * were flex-1 while the admin area had four of them, which at two tabs made
 * each a 700px hit area across a wide page. The indicator still needs them
 * equal, because a single translated element cannot track labels of
 * different widths.
 *
 * Do not put overflow-x:auto back on this nav: it makes the y-axis auto too,
 * and an indicator sitting a pixel below the border raises a vertical
 * scrollbar.
 *
 * It was AdminTabs until the studio needed the same row. One copy, so the
 * two scrollbar lessons above are only learned once.
 */
export function SectionTabs({
  label,
  tabs,
  rootHref,
}: {
  label: string;
  tabs: NavItem[];
  /** The tab that must match the path exactly rather than by prefix. */
  rootHref: string;
}) {
  const pathname = usePathname();

  const activeIndex = tabs.findIndex((tab) =>
    tab.href === rootHref
      ? pathname === tab.href
      : pathname.startsWith(tab.href),
  );

  return (
    <nav aria-label={label}>
      <ul
        className="border-member-border relative grid w-fit auto-cols-fr grid-flow-col border-b"
        style={
          {
            "--i": Math.max(activeIndex, 0),
            "--n": tabs.length,
          } as CSSProperties
        }
      >
        {activeIndex >= 0 ? (
          <li
            aria-hidden
            className={cn(
              "bg-brand ease-spring pointer-events-none absolute bottom-0 h-0.5",
              "w-[calc(100%/var(--n))] translate-x-[calc(var(--i)*100%)]",
              "transition-transform duration-400 motion-reduce:transition-none",
            )}
          />
        ) : null}

        {tabs.map((tab, index) => {
          const active = index === activeIndex;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-body-sm transition-fast flex min-w-28 items-center justify-center px-4 py-3 font-medium whitespace-nowrap sm:px-8",
                  active ? "text-brand" : "text-muted hover:text-member-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
