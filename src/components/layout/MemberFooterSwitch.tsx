"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants/routes";

/**
 * The design gives five member pages a bare footer — just the tagline and a
 * copyright line — while profile, admin and the studio keep the full one.
 *
 * Which page is open is a browser fact, so the choice is made here, in a
 * client component, from `usePathname`. Both footers are rendered on the
 * server and handed in as props, so this only picks between two ready-made
 * trees — the rich footer keeps its inline server action, because it is still
 * a server component, created in the layout and passed through untouched.
 */
const MINIMAL_ROUTES: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.BLOGS,
  ROUTES.GALLERY,
  ROUTES.RESOURCES,
  ROUTES.BIRTHDAYS,
];

export function MemberFooterSwitch({
  minimal,
  rich,
}: {
  minimal: ReactNode;
  rich: ReactNode;
}) {
  const pathname = usePathname();
  /* The five index pages only — a blog post or an album keeps the full
     footer, as those sub-pages are not what the design redraws. */
  const useMinimal = MINIMAL_ROUTES.includes(pathname);
  return <>{useMinimal ? minimal : rich}</>;
}
