"use client";

import type { ComponentProps, PointerEvent, ReactNode } from "react";
import { m, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 260, damping: 24, mass: 0.5 };

/**
 * A card that tips toward the pointer in 3D.
 * The tilt is a few degrees at most: enough to feel the card answer the hand,
 * never enough to make the content hard to read.
 *
 * Mouse only, and no tilt for reduced motion.
 */
export function TiltCard({
  max = 6,
  className,
  children,
  ...props
}: {
  /* Largest tilt, in degrees. */
  max?: number;
  className?: string;
  children: ReactNode;
} & Omit<
  ComponentProps<typeof m.div>,
  "children" | "className" | "style" | "onPointerMove" | "onPointerLeave"
>) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    if (reduced) return;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set((0.5 - py) * 2 * max);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <m.div
      className={cn("relative", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      {...props}
    >
      {children}
    </m.div>
  );
}
