"use client";

import type { PointerEvent, ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

/**
 * Leans its child toward the pointer while the pointer is over it, and
 * springs back when it leaves — after React Bits' Magnet. For the few call
 * to action buttons only; on every button it would stop meaning anything.
 *
 * Mouse only: a touch has no hover to follow.
 */
export function Magnetic({
  strength = 0.3,
  className,
  children,
}: {
  /* How far it follows, as a share of the pointer's distance from centre. */
  strength?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}
