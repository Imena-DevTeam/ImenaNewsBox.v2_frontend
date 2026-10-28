"use client";

import { Search, X } from "lucide-react";
import { useSearchQuery } from "@/hooks/useSearchQuery";

// TODO: when the blogs API exists, hand this over to TanStack Query.
/**
 * The grey pill in the dashboard's top bar. It filters the
 * articles below in real time — there is no submit button to make the
 * intent look like navigation when it is reading.
 *
 * `focus-visible:outline-none` is deliberately absent. The stylesheet gives
 * every focusable element the same visible outline so a keyboard user is
 * never lost, and this is the one control on the page they reach for first;
 * opting out here means tabbing into the search shows no focus at all.
 */
export function BlogSearch({ className }: { className?: string }) {
  const { query, onQuery } = useSearchQuery();

  return (
    <div className={className}>
      <label htmlFor="dashboard-search" className="sr-only">
        Search for blogs
      </label>
      <div className="bg-member-field rounded-pill relative flex h-12 w-full items-center lg:mx-auto lg:max-w-md">
        <Search aria-hidden className="text-muted ml-5 size-5" />
        <input
          id="dashboard-search"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search for Blogs ..."
          className="text-body text-text placeholder:text-muted h-full min-w-0 flex-1 bg-transparent px-4"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear blog search"
            className="text-muted hover:text-text focus-visible:outline-brand rounded-pill mr-2 grid size-9 shrink-0 place-items-center"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
