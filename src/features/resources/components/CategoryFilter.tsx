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
      <div className="bg-brand inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-xs">
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
            className={`focus-visible:outline-brand min-h-[38px] cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-brand text-white shadow-xs"
                : "border-border bg-surface-elevated text-muted hover:border-brand/40 hover:text-heading border"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
