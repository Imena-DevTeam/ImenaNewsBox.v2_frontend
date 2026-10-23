"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_OUT_SOFT, VIEWPORT } from "@/components/motion/tokens";

/* The clip at the start of the reveal: everything cut away except a sliver
   at the side the image opens from. */
const HIDDEN = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  /* A circle rather than an inset, so a round photo opens as a growing
     circle instead of a square. */
  center: "circle(0% at 50% 50%)",
} as const;

/* Fully open. 71% of the box is the radius that reaches its corners. */
const SHOWN = (from: keyof typeof HIDDEN) =>
  from === "center" ? "circle(71% at 50% 50%)" : "inset(0% 0% 0% 0%)";

/**
 * Uncovers a photograph like a curtain drawing back, while the photo inside
 * settles from a slight zoom. `from` is the edge the opening starts at.
 *
 * Three layers, each with one job. The outer one is what the viewport watches
 * and takes the layout classes; it is never clipped, because a box clipped to
 * nothing never counts as on screen and the reveal would never start. The
 * middle one carries the clip, the inner one the zoom.
 */
export function MaskReveal({
  from = "bottom",
  delay = 0,
  duration = DURATION.cinematic + 0.3,
  onMount = false,
  className,
  children,
}: {
  from?: keyof typeof HIDDEN;
  delay?: number;
  duration?: number;
  onMount?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const transition = { duration, delay, ease: EASE_OUT_SOFT };
  const trigger = onMount
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: VIEWPORT };

  return (
    <m.div className={className} initial="hidden" {...trigger}>
      <m.div
        data-motion
        className="size-full"
        variants={{
          hidden: { clipPath: HIDDEN[from] },
          shown: { clipPath: SHOWN(from), transition },
        }}
      >
        <m.div
          data-motion
          className="size-full"
          variants={{
            hidden: { scale: 1.15 },
            shown: {
              scale: 1,
              transition: { ...transition, duration: duration + 0.3 },
            },
          }}
        >
          {children}
        </m.div>
      </m.div>
    </m.div>
  );
}
