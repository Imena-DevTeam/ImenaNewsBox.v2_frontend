"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Resources pagination"
      className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row"
    >
      {/* Range Counter */}
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
        resources
      </p>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#4828b8]/30 hover:bg-violet-50/50 hover:text-[#4828b8] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Numbered Pills */}
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#4828b8] text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#4828b8]/30 hover:bg-violet-50/50 hover:text-[#4828b8]"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#4828b8]/30 hover:bg-violet-50/50 hover:text-[#4828b8] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
