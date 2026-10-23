"use client";

import { m } from "motion/react";
import { SplitText } from "@/components/motion/SplitText";
import { EASE_OUT_SOFT, VIEWPORT } from "@/components/motion/tokens";
import { cn } from "@/lib/cn";

export function SectionTitle({
  title,
  align = "center",
  className,
}: {
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <SplitText
        as="h2"
        lines={[[title]]}
        className="text-h3-m text-heading md:text-h2"
      />
      {/* The bar draws out from its anchor as the last word lands. */}
      <m.span
        data-motion
        className={cn(
          "accent-bar",
          align === "center" ? "origin-center" : "origin-left",
        )}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT_SOFT }}
      />
    </div>
  );
}
