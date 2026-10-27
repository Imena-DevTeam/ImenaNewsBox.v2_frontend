"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { DURATION, EASE_OUT_SOFT } from "@/components/motion/tokens";

/**
 * Loads Motion's animation features once for the whole app. `strict` makes
 * any stray full `motion.*` component throw, so nobody pulls the full bundle
 * back in by accident; use `m.*` instead.
 *
 * reducedMotion="user" drops every transform animation for someone who asked
 * the system for less motion. Opacity still fades, so content arrives softly
 * instead of popping.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: DURATION.slow, ease: EASE_OUT_SOFT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
