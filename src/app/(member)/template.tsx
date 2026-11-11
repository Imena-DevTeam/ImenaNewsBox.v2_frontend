"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isAdminPath, isStudioPath } from "@/lib/session";

/**
 * A template, unlike a layout, mounts afresh on every navigation, so each
 * member page arrives with the same short entrance while the dock and footer
 * around it stay put. That continuity is what makes moving between pages
 * read as one app rather than a reload.
 *
 * Two entrances, not one. Reading pages get `route-enter` — 450ms of fade,
 * rise and the softest blur — because arriving at the gallery is an arrival.
 * The admin register and the studio get `section-enter`, 180ms of fade and
 * a few pixels, because moving between the tabs of one tool is not: the
 * blur-and-rise there reads as the page reloading under somebody who only
 * meant to look at the next tab, and it is the navigation they use most.
 *
 * Each working page's own root carries `section-enter` as well, and that is
 * the half that matters more: a template animates when the route mounts,
 * which is when the skeleton appears, not when the content replaces it. The
 * class on the page is what fades that handoff. Where there is no skeleton
 * to show the two simply compound, which reads as a slightly softer fade.
 */
export default function MemberTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const working = isAdminPath(pathname) || isStudioPath(pathname);

  return (
    <div className={working ? "section-enter" : "route-enter"}>{children}</div>
  );
}
