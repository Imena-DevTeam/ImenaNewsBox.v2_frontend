"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/components/ui/CommandPalette";

/** Opens the search palette; sits beside the bell in every member header. */
export function SearchButton() {
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-haspopup="dialog"
      aria-label="Search people, stories and albums"
      aria-keyshortcuts="Control+K Meta+K"
      className="text-member-rail-ink hover:bg-member-tint focus-visible:outline-brand transition-fast grid size-11 place-items-center rounded-full"
    >
      <Search aria-hidden className="size-6" strokeWidth={1.7} />
    </button>
  );
}
