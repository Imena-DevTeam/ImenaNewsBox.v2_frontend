"use client";

import { ArrowUp } from "lucide-react";

/**
 * A frosted pill that glides the page back to the top. Smooth scrolling is
 * skipped for anyone who asked for reduced motion; they jump straight there.
 */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="group border-member-border text-member-ink text-caption focus-visible:outline-brand inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 font-semibold shadow-sm backdrop-blur-md transition-[translate,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
    >
      <ArrowUp
        aria-hidden
        className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
      />
      Back to top
    </button>
  );
}
