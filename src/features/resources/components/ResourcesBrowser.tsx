"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Download, LayoutGrid, List, Search, X } from "lucide-react";
import { EmptyTestimonial } from "@/components/ui/empty-testimonial";
import { RESOURCES_DATA } from "../data";
import type { ResourceCategory, ResourceItem } from "../types";
import { CategoryFilter } from "./CategoryFilter";
import { FeaturedResourceBanner } from "./FeaturedResourceBanner";
import { PaginationControls } from "./PaginationControls";
import { PdfViewerModal } from "./PdfViewerModal";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";

const ITEMS_PER_PAGE = 4;

export function ResourcesBrowser() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Pressing "/" focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName,
        )
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Identify the featured/popular resource
  const popularResource = useMemo(() => {
    return (
      RESOURCES_DATA.find((r) => r.isPopular) ||
      [...RESOURCES_DATA].sort(
        (a, b) => (b.viewsCount || 0) - (a.viewsCount || 0),
      )[0]
    );
  }, []);

  const isBannerShowing =
    !searchQuery && activeCategory === "All" && Boolean(popularResource);

  // Filtered resources based on category and search query
  const filteredResources = useMemo(() => {
    return RESOURCES_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Exclude featured banner item from list if banner is showing (deduplication)
  const displayResources = useMemo(() => {
    if (isBannerShowing && popularResource) {
      return filteredResources.filter((item) => item.id !== popularResource.id);
    }
    return filteredResources;
  }, [filteredResources, isBannerShowing, popularResource]);

  // Paginated resources slice
  const totalPages = Math.ceil(displayResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayResources.slice(start, start + ITEMS_PER_PAGE);
  }, [displayResources, currentPage]);

  const handleSelectCategory = (category: ResourceCategory) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleView = (resource: ResourceItem) => {
    setSelectedResource(resource);
  };

  const handleDownload = (resource: ResourceItem) => {
    const link = document.createElement("a");
    link.href = resource.pdfUrl;
    link.download = resource.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Downloading "${resource.fileName}"`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
      {/* Featured Spotlight Banner */}
      {isBannerShowing && popularResource && (
        <FeaturedResourceBanner
          resource={popularResource}
          onView={handleView}
          onDownload={handleDownload}
        />
      )}

      {/* Unified Toolbar: Categories Left, Search + View Mode Right */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Category Filter Pills */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Right: Search Input + View Toggle Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 md:w-72">
            <label htmlFor="resources-search" className="sr-only">
              Search documents
            </label>
            <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="size-4" />
            </div>
            <input
              ref={searchInputRef}
              id="resources-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search documents..."
              className="border-border bg-surface text-heading placeholder:text-muted focus:border-brand focus:ring-brand/20 min-h-[42px] w-full rounded-full border py-2 pr-9 pl-9 text-xs font-medium shadow-xs transition-colors focus:ring-2 focus:outline-hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search query"
                className="text-muted hover:text-heading absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="border-border bg-surface-elevated text-muted pointer-events-none absolute inset-y-0 right-0 my-auto mr-3 flex h-5 items-center rounded border px-1.5 font-mono text-[11px] font-medium">
                /
              </kbd>
            )}
          </div>

          {/* View Mode Toggle (Grid vs. List) */}
          <div
            role="group"
            aria-label="Document view mode"
            className="border-border bg-surface flex items-center rounded-full border p-0.5 shadow-xs"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`focus-visible:outline-brand flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-brand text-white shadow-xs"
                  : "text-muted hover:text-heading"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`focus-visible:outline-brand flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-brand text-white shadow-xs"
                  : "text-muted hover:text-heading"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Meta Bar */}
      <div
        ref={gridRef}
        className="border-border text-muted flex items-center justify-between border-b pb-3 text-xs"
      >
        <p>
          Showing{" "}
          <span className="text-heading font-semibold">
            {displayResources.length}
          </span>{" "}
          of {RESOURCES_DATA.length} documents
          {activeCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="text-brand font-medium">
                &ldquo;{activeCategory}&rdquo;
              </span>
            </span>
          )}
          {searchQuery && (
            <span>
              {" "}
              matching &ldquo;
              <span className="text-heading font-medium">{searchQuery}</span>
              &rdquo;
            </span>
          )}
        </p>

        {(activeCategory !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-brand cursor-pointer font-semibold transition-colors hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Resources Render: Grid View or List View */}
      {paginatedResources.length > 0 ? (
        <div className="space-y-8">
          {viewMode === "grid" ? (
            /* 2-Column Grid View */
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {paginatedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            /* Dense List / Row View */
            <div className="space-y-3">
              {paginatedResources.map((resource) => (
                <ResourceListItem
                  key={resource.id}
                  resource={resource}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayResources.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-4">
          <EmptyTestimonial
            titlePrefix="Family"
            titleHighlight="Resources"
            emoji="📂"
            message={
              searchQuery
                ? `Oops.. There are no resources for "${searchQuery}"`
                : `Oops.. There are no resources in "${activeCategory}"`
            }
            subMessage={
              searchQuery
                ? "We couldn't find any documents matching your search. Try another keyword or clear the search."
                : "No documents are currently available in this category. Check other categories or show all."
            }
            actionLabel={searchQuery ? "Clear Search" : "Show All Resources"}
            actionIcon="reset"
            onAction={handleResetFilters}
          />
        </div>
      )}

      {/* Slack-Style PDF Viewer Dialog */}
      <PdfViewerModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onDownload={handleDownload}
      />

      {/* Download Toast */}
      {toastMessage && typeof document !== "undefined"
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[110] flex items-center gap-2.5 rounded-2xl bg-neutral-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl"
            >
              <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="size-3 stroke-[3]" />
              </div>
              <span>{toastMessage}</span>
              <Download className="text-muted ml-1 size-3.5" />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
