"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import {
  DISTANCE,
  DURATION,
  EASE_OUT_SOFT,
  VIEWPORT,
  offset,
  type From,
} from "@/components/motion/tokens";

const TAGS = {
  div: m.div,
  li: m.li,
  p: m.p,
  span: m.span,
  figure: m.figure,
  header: m.header,
} as const;

/**
 * Fades an element in from one side, the first time it scrolls into view —
 * or straight away with `onMount`, for content already on screen at load.
 *
 * Every primitive in this folder carries data-motion, so the <noscript> rule
 * in the root layout can show the content when the script never runs.
 */
export function Reveal({
  as = "div",
  from = "bottom",
  distance = DISTANCE,
  delay = 0,
  duration = DURATION.slow,
  blur = false,
  onMount = false,
  className,
  children,
}: {
  as?: keyof typeof TAGS;
  from?: From;
  distance?: number;
  delay?: number;
  duration?: number;
  /* Comes in from soft focus, for headings and large type. */
  blur?: boolean;
  onMount?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const Tag = TAGS[as];
  const shown = { opacity: 1, x: 0, y: 0, filter: "blur(0px)" };

  return (
    <Tag
      data-motion
      className={className}
      initial={{
        opacity: 0,
        ...offset(from, distance),
        filter: blur ? "blur(8px)" : "blur(0px)",
      }}
      {...(onMount
        ? { animate: shown }
        : { whileInView: shown, viewport: VIEWPORT })}
      transition={{ duration, delay, ease: EASE_OUT_SOFT }}
    >
      {children}
    </Tag>
  );
}
