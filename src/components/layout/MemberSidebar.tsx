"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Cake,
  CircleUserRound,
  Files,
  House,
  Image as ImageIcon,
  Network,
} from "lucide-react";
import { MEMBER_NAV } from "@/constants/nav";
import { cn } from "@/lib/cn";

const ICONS = {
  Home: House,
  Blogs: BookOpen,
  Tree: Network,
  Gallery: ImageIcon,
  Resources: Files,
  Birthdays: Cake,
  Profile: CircleUserRound,
} as const;

/**
 * The member navigation: a compact floating glass dock.
 *
 * Desktop — a 64px column pinned to the left edge and centred on the
 * viewport, so it never scrolls away and never needs a scrollbar of its own:
 * seven 48px targets make it 400px tall, and on screens under 32rem (512px)
 * the targets drop to 36px, making it 292px. Labels live in tooltips that
 * slide out to the right on hover and keyboard focus, keeping the footprint
 * small while every destination stays named.
 *
 * Mobile — the same seven targets as a floating dock along the bottom edge.
 *
 * The open page is marked by one pill that glides between items on a spring
 * rather than snapping, driven by a single --i custom property: its row on
 * desktop, its column on mobile. aria-current carries the same fact for
 * screen readers.
 */
export function MemberSidebar() {
  const pathname = usePathname();

  const activeIndex = MEMBER_NAV.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <nav
      aria-label="Member"
      className={cn(
        "fixed z-50 border backdrop-blur-xl",
        /* Mobile: the bottom dock. */
        "inset-x-4 bottom-4 mx-auto h-16 max-w-sm rounded-full border-white/40 bg-white/90 shadow-2xl",
        /* Desktop: the left dock, centred on the viewport. */
        "md:inset-x-auto md:top-1/2 md:bottom-auto md:left-6 md:mx-0 md:h-auto md:w-16 md:max-w-none md:-translate-y-1/2",
        "md:rounded-dock md:shadow-dock md:border-white/60 md:bg-white/80",
      )}
    >
      <ul
        className="md:short:gap-1 relative grid h-full grid-cols-7 items-center px-2 md:flex md:flex-col md:gap-2 md:px-2 md:py-2"
        style={{ "--i": Math.max(activeIndex, 0) } as CSSProperties}
      >
        {/* The gliding pill. One element, moved by transform, so the change
            of page reads as motion instead of two colours swapping. */}
        {activeIndex >= 0 ? (
          <li
            aria-hidden
            className={cn(
              "bg-member-active/70 ease-spring pointer-events-none absolute rounded-full transition-transform duration-500 motion-reduce:transition-none",
              /* Mobile: one seventh of the strip, stepping across. */
              "top-2 bottom-2 left-2 w-[calc((100%-1rem)/7)] translate-x-[calc(var(--i)*100%)]",
              /* Desktop: a 48px circle stepping down in 56px rows. */
              "md:top-2 md:bottom-auto md:left-2 md:size-12 md:translate-x-0 md:translate-y-[calc(var(--i)*3.5rem)]",
              /* Short screens: a 36px circle stepping down in 40px rows. */
              "md:short:left-3.5 md:short:size-9 md:short:translate-y-[calc(var(--i)*2.5rem)]",
            )}
          />
        ) : null}

        {MEMBER_NAV.map((item, index) => {
          const active = index === activeIndex;
          const Icon = ICONS[item.label as keyof typeof ICONS] ?? House;

          return (
            <li key={item.href} className="relative flex justify-center">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "group focus-visible:outline-brand md:short:size-9 relative grid size-11 place-items-center rounded-full md:size-12",
                  "transition-transform duration-150 active:scale-90",
                  active
                    ? "text-member-ink"
                    : "text-member-rail-ink/70 hover:text-member-ink",
                )}
              >
                <Icon
                  aria-hidden
                  className="size-5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
                  strokeWidth={active ? 2.1 : 1.8}
                />

                {/* The label, sliding in from the right with a pointer.
                    Desktop only: on the bottom dock a label would cover the
                    page, and aria-label already names each link. */}
                <span
                  role="tooltip"
                  className={cn(
                    "bg-member-ink text-surface text-caption shadow-menu pointer-events-none absolute top-1/2 left-full ml-4 hidden -translate-y-1/2 rounded-lg px-3 py-1.5 whitespace-nowrap md:block",
                    "translate-x-2 opacity-0 transition-[opacity,transform] duration-200 ease-out",
                    "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  )}
                >
                  <span
                    aria-hidden
                    className="bg-member-ink absolute top-1/2 -left-1 size-2 -translate-y-1/2 rotate-45"
                  />
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
