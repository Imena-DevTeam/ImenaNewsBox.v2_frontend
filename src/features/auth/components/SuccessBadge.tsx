"use client";

import { AnimatePresence, m } from "motion/react";
import { badgePath } from "@/lib/badge-path";
import { cn } from "@/lib/cn";

const BADGE = badgePath(100);

/* When each beat starts, in seconds after the code is accepted. The rosette
   springs up, the ring ripples off it as it lands, and the tick draws once
   the rosette has settled, so the three read as one gesture. */
const BEAT = { ring: 0.12, tick: 0.32 };

/** How long the whole confirmation takes, so the caller can wait for it. */
export const SUCCESS_BADGE_DURATION_MS = 1100;

/**
 * The brand "verified" rosette, shown only once a code is accepted. It pops
 * out of nothing with a little overshoot, a soft ring ripples outward, and
 * the white tick draws itself on, after the iOS confirmation tick.
 *
 * The slot it fills is always reserved, so nothing below it moves when it
 * appears. It is decorative: the status line announces the success.
 */
export function SuccessBadge({
  show,
  className,
}: {
  show: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("relative size-16", className)}>
      <AnimatePresence>
        {show ? (
          <>
            {/* The ripple, from the rosette's edge outward. */}
            <m.span
              key="ring"
              className="border-brand rounded-pill absolute inset-0 border-2"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.9], opacity: [0, 0.5, 0] }}
              transition={{
                delay: BEAT.ring,
                duration: 0.7,
                ease: "easeOut",
                times: [0, 0.2, 1],
              }}
            />

            <m.svg
              key="badge"
              viewBox="0 0 100 100"
              className="text-brand relative size-full"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              /* Underdamped, so it overshoots a touch and settles, like
                 something set down with a little energy. */
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 14,
                mass: 0.8,
                opacity: { duration: 0.12 },
              }}
            >
              <path d={BADGE} fill="currentColor" />
              <m.path
                d="M31 51.5 44 64l25-27"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    delay: BEAT.tick,
                    duration: 0.45,
                    ease: [0.65, 0, 0.35, 1],
                  },
                  opacity: { delay: BEAT.tick, duration: 0.01 },
                }}
              />
            </m.svg>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
