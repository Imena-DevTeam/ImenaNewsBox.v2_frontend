"use client";

import Image from "next/image";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import type { ResourceCategory, ResourceItem } from "../types";

interface ResourceCardProps {
  resource: ResourceItem;
  onView: (resource: ResourceItem) => void;
  onDownload: (resource: ResourceItem) => void;
}

const CATEGORY_STYLES: Record<
  Exclude<ResourceCategory, "All">,
  { badge: string; dot: string }
> = {
  Documents: {
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-700",
    dot: "bg-blue-500",
  },
  Guides: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Family Resources": {
    badge: "border-brand/30 bg-brand/10 text-brand",
    dot: "bg-brand",
  },
  "Educational Materials": {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-800",
    dot: "bg-amber-500",
  },
};

export function ResourceCard({
  resource,
  onView,
  onDownload,
}: ResourceCardProps) {
  const categoryStyle =
    CATEGORY_STYLES[resource.category] ?? CATEGORY_STYLES.Documents;

  return (
    <article className="border-border bg-surface shadow-subtle hover:border-brand/40 group relative flex h-full flex-col justify-between rounded-3xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
      {/* Top Content Area */}
      <div className="flex flex-col items-center">
        {/* Top Metadata Badges */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${categoryStyle.badge}`}
          >
            <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
            <span>{resource.category}</span>
          </span>

          <span className="border-border bg-surface-elevated text-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
            <FileText className="size-3" />
            <span>{resource.fileSize}</span>
          </span>

          {resource.viewsCount && (
            <span className="border-border bg-surface-elevated text-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
              <Eye className="size-3" />
              <span>{resource.viewsCount.toLocaleString()}</span>
            </span>
          )}
        </div>

        {/* Document Icon / Emblem */}
        <div className="border-border bg-surface-elevated group-hover:bg-brand/10 group-hover:border-brand/40 mb-4 flex size-14 items-center justify-center rounded-2xl border p-2 transition-colors sm:size-16">
          <Image
            src="/images/imena-crest.webp"
            alt=""
            width={38}
            height={38}
            className="h-auto w-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="text-h4 text-heading group-hover:text-brand line-clamp-2 font-serif font-bold transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-body text-muted mt-2 line-clamp-3 text-xs leading-relaxed sm:text-sm">
          {resource.description}
        </p>

        {/* Publication Date */}
        <p className="text-muted mt-3 font-mono text-[11px]">
          Published {resource.publishedDate}
        </p>
      </div>

      {/* Bottom Action Buttons (Responsive & Compact on Mobile) */}
      <div className="border-border/60 mt-6 flex w-full flex-col gap-2.5 border-t pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(resource)}
            className="bg-brand hover:bg-brand/90 focus-visible:outline-brand flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-all"
          >
            <ExternalLink className="size-3.5" />
            <span>View PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(resource)}
            title="Download document"
            className="border-border bg-surface-elevated text-heading hover:bg-surface-tint focus-visible:outline-brand flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
