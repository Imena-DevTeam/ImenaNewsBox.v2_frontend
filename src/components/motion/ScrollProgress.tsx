"use client";

import { m, useScroll, useSpring } from "motion/react";

/**
 * A hairline across the top of the window that fills as you read down the
 * page. It tells you how much is left without taking any space.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden
      className="bg-primary fixed inset-x-0 top-0 z-60 h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}
