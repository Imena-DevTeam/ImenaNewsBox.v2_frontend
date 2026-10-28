"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/* The arrows slide past each other, so both ride the overshooting spring and
   the dark circle that floods the button uses the longer soft ease-out. */
const ARROW = "absolute z-10 size-4 transition-all duration-800 ease-spring";

/**
 * A pill that, on hover, floods with ink from its centre while one arrow
 * leaves and another arrives, and the pill squares off into a rounded
 * rectangle. Presses sink slightly.
 *
 * It renders a link when given an `href`, so a navigation is a real anchor
 * rather than a button pretending to be one.
 */
export function FlowButton({
  text = "Modern Button",
  href,
  onClick,
}: {
  text?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "group border-text/40 text-text hover:text-surface relative inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-pill border-2 bg-transparent px-8 py-3 text-body-sm font-semibold transition-all duration-600 ease-out-soft hover:rounded-md hover:border-transparent active:scale-95 focus-visible:outline-brand";

  const inner = (
    <>
      <ArrowRight
        aria-hidden
        className={`${ARROW} -left-1/4 group-hover:left-4`}
      />

      <span className="relative z-1 -translate-x-3 transition-all duration-800 ease-out group-hover:translate-x-3">
        {text}
      </span>

      {/* The circle that grows to fill the button. */}
      <span
        aria-hidden
        className="bg-text ease-out-soft absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-800 group-hover:size-55 group-hover:opacity-100"
      />

      <ArrowRight
        aria-hidden
        className={`${ARROW} right-4 group-hover:-right-1/4`}
      />
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
