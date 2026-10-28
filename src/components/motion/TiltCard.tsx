"use client";

import type { ComponentProps, PointerEvent, ReactNode } from "react";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 260, damping: 24, mass: 0.5 };

/**
 * A card that tips toward the pointer in 3D and carries a soft spotlight
 * where the pointer is — after React Bits' TiltedCard and SpotlightCard.
 * The tilt is a few degrees at most: enough to feel the card answer the hand,
 * never enough to make the content hard to read.
 *
 * Mouse only, and no tilt for reduced motion; the spotlight still follows,
 * since it is a change of light rather than of position.
 */
export function TiltCard({
  max = 6,
  glow = true,
  className,
  children,
  ...props
}: {
  /* Largest tilt, in degrees. */
  max?: number;
  glow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<
  ComponentProps<typeof m.div>,
  "children" | "className" | "style" | "onPointerMove" | "onPointerLeave"
>) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useSpring(0, SPRING);
  const background = useMotionTemplate`radial-gradient(22rem circle at ${glowX}% ${glowY}%, color-mix(in oklab, var(--color-primary) 10%, transparent), transparent 70%)`;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    glowX.set(px * 100);
    glowY.set(py * 100);
    glowOpacity.set(1);
    if (reduced) return;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set((0.5 - py) * 2 * max);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
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
      {glow ? (
        <m.span
          aria-hidden
          className="rounded-inherit pointer-events-none absolute inset-0 z-10"
          style={{ background, opacity: glowOpacity }}
        />
      ) : null}
    </m.div>
  );
}
