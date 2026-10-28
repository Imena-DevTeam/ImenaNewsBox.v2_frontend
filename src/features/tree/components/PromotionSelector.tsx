"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PromotionOption {
  value: string;
  label: string;
  count: number;
}

/** The pills, five to a row and the rest centred beneath, as designed. */
const FIRST_ROW = 5;

/**
 * Pick a promotion, or all of them, or skip the picking and search for a
 * relative by name, branch or city. Each pill carries how many people it
 * holds.
 */
export function PromotionSelector({
  options,
  selected,
  onSelect,
  query,
  onQuery,
  summary,
  count,
}: {
  options: PromotionOption[];
  selected: string;
  onSelect: (value: string) => void;
  query: string;
  onQuery: (query: string) => void;
  summary: string;
  count: string;
}) {
  const rows = [options.slice(0, FIRST_ROW), options.slice(FIRST_ROW)];

  return (
    <section aria-labelledby="promotion-label" className="text-center">
      <h2
        id="promotion-label"
        className="text-caption text-text/70 font-bold tracking-widest uppercase"
      >
        IMENA Family Tree
      </h2>

      <div
        role="group"
        aria-labelledby="promotion-label"
        className="mt-8 flex flex-col items-center gap-3"
      >
        {rows.map((row, index) => (
          <div key={index} className="flex flex-wrap justify-center gap-3">
            {row.map((option) => {
              const active = !query && option.value === selected;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    onQuery("");
                    onSelect(option.value);
                  }}
                  className={cn(
                    "text-caption focus-visible:outline-brand inline-flex items-center gap-2 rounded-full border px-5 py-2.5 transition-colors",
                    active
                      ? "border-brand/40 bg-brand/10 text-brand ring-brand/20 font-bold shadow-sm ring-2"
                      : "border-member-border bg-member-field/60 text-member-rail-ink hover:bg-member-field hover:text-member-ink",
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 tabular-nums",
                      active ? "bg-brand/15" : "bg-surface/70",
                    )}
                  >
                    {option.count}
                    <span className="sr-only"> members</span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-md">
        <label htmlFor="tree-search" className="sr-only">
          Search family members
        </label>
        <Search
          aria-hidden
          className="text-member-rail-ink pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
        />
        <input
          id="tree-search"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search by name, branch or city"
          autoComplete="off"
          className="border-member-border bg-member-field/60 text-body-sm text-member-ink placeholder:text-member-rail-ink focus-visible:outline-brand w-full rounded-full border py-3 pr-4 pl-11 font-normal"
        />
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-16">
        <p aria-live="polite" className="text-body text-member-ink font-medium">
          {summary}
        </p>
        <span className="bg-brand/10 text-brand text-caption rounded-full px-3 py-1">
          {count}
        </span>
      </div>
    </section>
  );
}
