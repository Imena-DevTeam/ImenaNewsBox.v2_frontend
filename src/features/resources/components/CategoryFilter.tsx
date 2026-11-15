"use client";

import { RESOURCE_CATEGORIES } from "../data";
import type { ResourceCategory } from "../types";

interface CategoryFilterProps {
  activeCategory: ResourceCategory;
  onSelectCategory: (category: ResourceCategory) => void;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* Categories Badge Button */}
      <div className="bg-brand text-surface text-caption inline-flex min-h-9.5 items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold shadow-xs">
        <span>Categories</span>
        <span aria-hidden="true">&rarr;</span>
      </div>

      {/* Filter Pills Row */}
      {RESOURCE_CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`focus-visible:outline-brand text-caption min-h-9.5 cursor-pointer rounded-full px-4 py-1.5 font-semibold transition-all duration-150 ${
              isActive
                ? "bg-brand text-surface shadow-xs"
                : "border-border bg-member-panel text-muted hover:border-brand/40 hover:text-heading border"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
