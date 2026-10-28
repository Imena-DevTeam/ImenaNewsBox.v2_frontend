"use client";

import { UserRound } from "lucide-react";
import { m, type Variants } from "motion/react";
import { EASE_OUT_SOFT } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

/* Each piece of the tree takes its place in turn: a person appears, the
   branch draws out from them, the next person appears at its end. `custom`
   is the piece's position in that order. */
const STEP = 0.11;

const grow = (axis: "x" | "y"): Variants => ({
  hidden: axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
  shown: (order: number) => ({
    ...(axis === "x" ? { scaleX: 1 } : { scaleY: 1 }),
    transition: { delay: order * STEP, duration: 0.35, ease: EASE_OUT_SOFT },
  }),
});

const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  shown: (order: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: order * STEP,
      type: "spring",
      stiffness: 420,
      damping: 18,
    },
  }),
};

/** The floating family-tree window that overlaps the hero photo. */
export function TreePreviewCard({
  buildDelay = 0,
  className,
}: {
  /* When the tree starts to grow, in seconds from mount. */
  buildDelay?: number;
  className?: string;
}) {
  return (
    <m.div
      aria-hidden
      data-motion
      initial="hidden"
      animate="shown"
      className={cn(
        "border-border bg-surface shadow-main rounded-md border",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="rounded-pill bg-window-red size-2" />
        <span className="rounded-pill bg-window-amber size-2" />
        <span className="rounded-pill bg-window-green size-2" />
      </div>

      {/* The build delay is folded into each piece's order, so the whole
          sequence runs off one clock. */}
      <div className="space-y-4 px-4 pt-2 pb-8">
        <Row offset="pl-0" start={buildDelay / STEP} />
        <m.div
          data-motion
          custom={buildDelay / STEP + 3}
          variants={grow("y")}
          className="bg-border ml-10 h-4 w-px origin-top"
        />
        <Row offset="pl-6" start={buildDelay / STEP + 4} />
        <m.div
          data-motion
          custom={buildDelay / STEP + 7}
          variants={grow("y")}
          className="bg-border ml-6 h-4 w-px origin-top"
        />
        <Node order={buildDelay / STEP + 8} />
      </div>
    </m.div>
  );
}

function Row({ offset, start }: { offset: string; start: number }) {
  return (
    <div className={cn("flex items-center", offset)}>
      <Node order={start} />
      <m.span
        data-motion
        custom={start + 1}
        variants={grow("x")}
        className="bg-border h-px flex-1 origin-left"
      />
      <Node muted order={start + 2} />
    </div>
  );
}

function Node({ muted = false, order }: { muted?: boolean; order: number }) {
  return (
    <m.span
      data-motion
      custom={order}
      variants={pop}
      className={cn(
        "rounded-pill bg-surface flex size-7 shrink-0 items-center justify-center border",
        muted ? "border-border text-muted" : "border-primary text-primary",
      )}
    >
      <UserRound className="size-3.5" />
    </m.span>
  );
}
