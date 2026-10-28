"use client";

import { useRef, type ReactNode } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Drifts its content against the scroll as it passes through the viewport,
 * so it reads as sitting on a different plane from the page. A positive
 * `distance` moves it down as you scroll down (it lags, as if further away);
 * a negative one moves it up (as if nearer).
 *
 * The scroll is read, never taken over: the page still scrolls natively.
 */
export function Parallax({
  distance = 60,
  className,
  children,
}: {
  distance?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  /* A light spring takes the edge off wheel steps without feeling laggy. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const y = useTransform(progress, [0, 1], [-distance, distance]);

  return (
    <m.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </m.div>
  );
}
