"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A frosted pill that glides the page back to the top. Smooth scrolling is
 * skipped for anyone who asked for reduced motion; they jump straight there.
 */
export function BackToTop({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className={cn(
        "group text-caption inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition-[translate,background-color] duration-200 ease-out hover:-translate-y-0.5",
        tone === "dark"
          ? "text-surface border-white/25 bg-white/10 hover:bg-white/20 focus-visible:outline-white"
          : "border-member-border text-member-ink focus-visible:outline-brand bg-white/70 backdrop-blur-md hover:bg-white",
      )}
    >
      <ArrowUp
        aria-hidden
        className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
      />
      Back to top
    </button>
  );
}
