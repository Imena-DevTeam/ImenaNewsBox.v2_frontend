"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * The member navigation, framed as the design draws it: one floating white
 * lozenge of a column, 100px wide, holding seven icon-and-label tiles, with
 * the open page filled in behind its tile and Profile sitting apart at the
 * foot.
 *
 * The open page is lifted to the top of the rail. Both member frames in the
 * design do this — Gallery leads the gallery rail, Blogs the blogs one — so
 * it is the rail's rule rather than one frame's accident. The order is
 * otherwise MEMBER_NAV's own, and `sort` is stable, so nothing else moves.
 *
 * The design draws it as a card that travels with the page rather than one
 * pinned to the viewport: it is 790px of rail against a 2470px page, and the
 * album grid below it runs into the gutter it leaves behind.
 *
 * On small screens a 100px column would eat the viewport, so it lies down
 * into a scrolling strip. aria-current marks the page so screen readers
 * announce what the violet tile shows.
 */
export function MemberSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const items = [...MEMBER_NAV].sort(
    (a, b) => Number(isActive(b.href)) - Number(isActive(a.href)),
  );

  return (
    <nav
      aria-label="Member"
      className={cn(
        "bg-surface shadow-menu rounded-member-rail relative z-10 w-full max-w-full self-start overflow-x-auto",
        "md:mt-14 md:w-25 md:shrink-0 md:overflow-visible",
      )}
    >
      <ul className="flex min-w-max flex-row gap-1 p-2 md:min-w-0 md:flex-col md:gap-6.5 md:px-3 md:pt-2 md:pb-11">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = ICONS[item.label as keyof typeof ICONS] ?? House;

          return (
            <li
              key={item.href}
              className={cn(
                "flex-none",
                /* The design sets Profile apart from the six above it. */
                item.label === "Profile" && "md:mt-15",
              )}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-member-rail-ink transition-fast flex w-20 flex-col items-center justify-center gap-1.5 rounded-lg py-3",
                  "md:h-18.5 md:w-full md:py-0",
                  active ? "bg-member-active" : "hover:bg-member-tint",
                )}
              >
                <Icon aria-hidden className="size-6" strokeWidth={1.7} />
                <span className="text-rail">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
