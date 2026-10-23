"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_OUT_SOFT, VIEWPORT } from "@/components/motion/tokens";

/**
 * Draws an element out along one axis from its transform origin — for bands,
 * rules and bars that should read as being laid down rather than faded in.
 * Set the origin with a class (origin-left, origin-top, origin-center).
 */
export function Grow({
  axis = "x",
  delay = 0,
  duration = DURATION.cinematic,
  onMount = false,
  className,
  children,
  "aria-hidden": ariaHidden,
}: {
  axis?: "x" | "y";
  delay?: number;
  duration?: number;
  onMount?: boolean;
  className?: string;
  children?: ReactNode;
  "aria-hidden"?: boolean;
}) {
  const shown = axis === "x" ? { scaleX: 1 } : { scaleY: 1 };

  return (
    <m.div
      data-motion
      aria-hidden={ariaHidden}
      className={className}
      initial={axis === "x" ? { scaleX: 0 } : { scaleY: 0 }}
      {...(onMount
        ? { animate: shown }
        : { whileInView: shown, viewport: VIEWPORT })}
      transition={{ duration, delay, ease: EASE_OUT_SOFT }}
    >
      {children}
    </m.div>
  );
}
