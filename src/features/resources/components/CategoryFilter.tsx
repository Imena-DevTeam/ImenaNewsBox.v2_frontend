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
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#4828b8] px-4 py-2 text-xs font-semibold text-white shadow-xs">
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
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-[#4828b8] text-white shadow-xs"
                : "bg-[#ede9fe] text-[#5b21b6] hover:bg-[#ddd6fe] hover:text-[#4828b8]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
