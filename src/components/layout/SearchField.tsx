"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/components/ui/CommandPalette";

/** The wide form of the search button, for a page with room for a field. */
export function SearchField() {
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      className="border-member-border bg-member-panel text-body-sm text-muted hover:border-brand hover:text-member-ink focus-visible:outline-brand transition-fast inline-flex h-10 w-full items-center gap-2 rounded-md border px-3.5"
    >
      <Search aria-hidden className="size-4" />
      Search people, stories, albums…
      <kbd className="text-caption border-member-border text-muted ml-auto hidden rounded-sm border px-1.5 py-0.5 font-sans sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}
