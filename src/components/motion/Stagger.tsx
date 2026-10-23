"use client";

import type { ReactNode } from "react";
import { m, type Variants } from "motion/react";
import {
  DISTANCE,
  DURATION,
  EASE_OUT_SOFT,
  VIEWPORT,
  offset,
  type From,
} from "@/components/motion/tokens";

const CONTAINERS = {
  div: m.div,
  ul: m.ul,
  ol: m.ol,
  dl: m.dl,
} as const;

const ITEMS = {
  div: m.div,
  li: m.li,
} as const;

/**
 * A list whose children arrive one after another, each a beat behind the
 * last, instead of all at once. The children are StaggerItems; the container
 * only sets the timing, and each item says which side it comes in from.
 */
export function Stagger({
  as = "div",
  stagger = 0.12,
  delay = 0,
  onMount = false,
  className,
  children,
}: {
  as?: keyof typeof CONTAINERS;
  /* Seconds between one child and the next. */
  stagger?: number;
  delay?: number;
  onMount?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = CONTAINERS[as];
  const variants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      {...(onMount
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: VIEWPORT })}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  as = "div",
  from = "bottom",
  distance = DISTANCE,
  scale = 1,
  className,
  children,
}: {
  as?: keyof typeof ITEMS;
  from?: From;
  distance?: number;
  /* Starting scale, for items that should grow into place as they arrive. */
  scale?: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = ITEMS[as];
  const variants: Variants = {
    hidden: { opacity: 0, scale, ...offset(from, distance) },
    shown: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration: DURATION.slow, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <Tag data-motion className={className} variants={variants}>
      {children}
    </Tag>
  );
}
