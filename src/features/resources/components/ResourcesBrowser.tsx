"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Download } from "lucide-react";
import { EmptyTestimonial } from "@/components/ui/EmptyTestimonial";
import { RESOURCES_DATA } from "../data";
import type { ResourceCategory, ResourceItem } from "../types";
import { CategoryFilter } from "./CategoryFilter";
import { PdfViewerModal } from "./PdfViewerModal";
import { ResourceCard } from "./ResourceCard";

/**
 * The register of family documents: a category filter, then every document in
 * it as a card. The design keeps it plain — no search, no view toggle, no
 * spotlight — so the browser does too.
 */
export function ResourcesBrowser() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("All");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    if (activeCategory === "All") return RESOURCES_DATA;
    return RESOURCES_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleView = (resource: ResourceItem) => {
    setSelectedResource(resource);
  };

  const handleOpen = (resource: ResourceItem) => {
    window.open(resource.pdfUrl, "_blank", "noopener,noreferrer");
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

  return (
    <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onView={handleView}
              onOpen={handleOpen}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="w-full py-4">
          <EmptyTestimonial
            titlePrefix="Family"
            titleHighlight="Resources"
            emoji="📂"
            message={`Oops.. There are no resources in "${activeCategory}"`}
            subMessage="No documents are currently available in this category. Check other categories or show all."
            actionLabel="Show All Resources"
            actionIcon="reset"
            onAction={() => setActiveCategory("All")}
          />
        </div>
      )}

      <PdfViewerModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onDownload={handleDownload}
      />

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
