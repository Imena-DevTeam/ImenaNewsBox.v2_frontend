"use client";

import { Search, X } from "lucide-react";
import { PROMOTIONS, type Promotion } from "@/features/tree/data";
import { cn } from "@/lib/cn";

export function TreeControls({
  query,
  onQuery,
  promotion,
  onPromotion,
  resultCount,
}: {
  query: string;
  onQuery: (value: string) => void;
  promotion: Promotion;
  onPromotion: (value: Promotion) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* The promotion was a line of text in the design, sitting where the
          filter belongs. It is the filter. */}
      <div
        role="group"
        aria-label="Promotion"
        className="border-border bg-surface rounded-pill flex flex-wrap justify-center gap-1 border p-1"
      >
        {PROMOTIONS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={p === promotion}
            onClick={() => onPromotion(p)}
            className={cn(
              "rounded-pill text-body-sm transition-fast px-4 py-2",
              p === promotion
                ? "bg-primary text-surface"
                : "text-muted hover:text-text",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <label htmlFor="tree-search" className="sr-only">
          Search the family by name, role or subfamily
        </label>
        <Search
          aria-hidden
          className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
        />
        <input
          id="tree-search"
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name, role or subfamily"
          className="border-border bg-surface text-body-sm h-control-md focus:border-primary rounded-pill w-full border pr-10 pl-11 outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear search"
            className="text-muted hover:text-text transition-fast absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Announced, so a screen reader hears the count change as you type. */}
      <p role="status" aria-live="polite" className="text-body-sm text-muted">
        {query
          ? `${resultCount} ${resultCount === 1 ? "person" : "people"} match “${query}”`
          : `${resultCount} people in ${promotion}`}
      </p>
    </div>
  );
}
