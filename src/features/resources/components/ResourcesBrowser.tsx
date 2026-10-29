"use client";

import { useMemo, useRef, useState } from "react";
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

  // Identify the most popular resource
  const popularResource = useMemo(() => {
    return (
      RESOURCES_DATA.find((r) => r.isPopular) ||
      [...RESOURCES_DATA].sort(
        (a, b) => (b.viewsCount || 0) - (a.viewsCount || 0),
      )[0]
    );
  }, []);

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

  // Paginated resources slice
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

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
      {/* Featured / Most Popular Resource Spotlight Banner */}
      {!searchQuery && activeCategory === "All" && popularResource && (
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
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="size-4" />
            </div>
            <input
              ref={searchInputRef}
              id="resources-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-full border border-slate-200 bg-white py-2 pr-9 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-colors placeholder:text-slate-400 focus:border-[#4828b8] focus:ring-2 focus:ring-[#4828b8]/15 focus:outline-hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute inset-y-0 right-0 my-auto mr-3 flex h-4 items-center rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                /
              </kbd>
            )}
          </div>

          {/* View Mode Toggle (Grid vs. List) */}
          <div
            role="group"
            aria-label="Document view mode"
            className="flex items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-xs"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-[#4828b8] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-[#4828b8] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
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
        className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-500"
      >
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredResources.length}
          </span>{" "}
          of {RESOURCES_DATA.length} documents
          {activeCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="font-medium text-[#4828b8]">
                &ldquo;{activeCategory}&rdquo;
              </span>
            </span>
          )}
          {searchQuery && (
            <span>
              {" "}
              matching &ldquo;
              <span className="font-medium text-slate-800">{searchQuery}</span>
              &rdquo;
            </span>
          )}
        </p>

        {(activeCategory !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="cursor-pointer font-semibold text-[#4828b8] transition-colors hover:text-[#3b1fa4] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Resources Render: Grid View or List View */}
      {paginatedResources.length > 0 ? (
        <div className="space-y-8">
          {viewMode === "grid" ? (
            /* 2-Column Grid View (Equalized Card Heights) */
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
            /* Dense List / Table View */
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
            totalItems={filteredResources.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        /* Empty State: Displays EmptyTestimonial when search has 0 results */
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

      {/* Portaled with the viewer, so it lands in front of it and is never
          positioned against the page transition. */}
      {toastMessage && typeof document !== "undefined"
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[110] flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl"
            >
              <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="size-3 stroke-[3]" />
              </div>
              <span>{toastMessage}</span>
              <Download className="ml-1 size-3.5 text-slate-400" />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
