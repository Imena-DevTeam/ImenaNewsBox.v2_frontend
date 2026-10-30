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
      <p className="text-muted text-xs">
        Showing{" "}
        <span className="text-heading font-semibold">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="text-heading font-semibold">{totalItems}</span>{" "}
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
          className="border-border bg-surface text-muted hover:border-brand/40 hover:bg-surface-elevated hover:text-heading focus-visible:outline-brand flex size-9 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-40"
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
              className={`focus-visible:outline-brand flex size-9 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand text-white shadow-xs"
                  : "border-border bg-surface text-muted hover:border-brand/40 hover:bg-surface-elevated hover:text-heading border"
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
          className="border-border bg-surface text-muted hover:border-brand/40 hover:bg-surface-elevated hover:text-heading focus-visible:outline-brand flex size-9 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
