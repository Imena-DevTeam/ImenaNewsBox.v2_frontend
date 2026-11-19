"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigateWithTransition } from "@/lib/viewTransition";

/**
 * A `Link` whose navigation the browser animates with the View Transitions
 * API. A modified click (new tab, new window) and every browser without the
 * API keep the ordinary link behaviour.
 */
export function TransitionLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();

  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    if (navigateWithTransition(router.push, href)) event.preventDefault();
  };

  return <Link href={href} onClick={handle} {...props} />;
}
