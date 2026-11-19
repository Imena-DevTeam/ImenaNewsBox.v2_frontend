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
    <div className="space-y-4">
      {/* Categories pill, on its own line */}
      <div className="bg-brand inline-flex min-h-10 items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-xs">
        <span>Categories</span>
        <span aria-hidden="true">&rarr;</span>
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {RESOURCE_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`focus-visible:outline-brand min-h-9 cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "bg-brand text-white shadow-xs"
                  : "bg-brand/10 text-brand hover:bg-brand/15"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
