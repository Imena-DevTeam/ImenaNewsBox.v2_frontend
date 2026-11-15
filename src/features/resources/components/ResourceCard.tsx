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
    badge: "border-hope-edge/30 bg-hope-ink/10 text-hope-ink",
    dot: "bg-hope-ink",
  },
  Guides: {
    badge: "border-window-green/30 bg-window-green/10 text-window-green",
    dot: "bg-window-green",
  },
  "Family Resources": {
    badge: "border-brand/30 bg-brand/10 text-brand",
    dot: "bg-brand",
  },
  "Educational Materials": {
    badge: "border-light-ink/30 bg-celebration-gold/10 text-light-ink",
    dot: "bg-celebration-gold",
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
    <article className="border-border bg-surface shadow-subtle hover:border-brand/40 group relative flex h-full flex-col justify-between rounded-lg border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
      {/* Top Content Area */}
      <div className="flex flex-col items-center">
        {/* Top Metadata Badges */}
        <div className="text-caption mb-4 flex flex-wrap items-center justify-center gap-2 font-medium">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${categoryStyle.badge}`}
          >
            <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
            <span>{resource.category}</span>
          </span>

          <span className="border-border bg-member-panel text-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
            <FileText className="size-3" />
            <span>{resource.fileSize}</span>
          </span>

          {resource.viewsCount && (
            <span className="border-border bg-member-panel text-muted inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
              <Eye className="size-3" />
              <span>{resource.viewsCount.toLocaleString()}</span>
            </span>
          )}
        </div>

        {/* Document Icon / Emblem */}
        <div className="border-border bg-member-panel group-hover:bg-brand/10 group-hover:border-brand/40 mb-4 flex size-14 items-center justify-center rounded-lg border p-2 transition-colors sm:size-16">
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
        <p className="text-body text-muted text-caption sm:text-body-sm mt-2 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Publication Date */}
        <p className="text-muted text-caption mt-3 font-mono">
          Published {resource.publishedDate}
        </p>
      </div>

      {/* Bottom Action Buttons (Responsive & Compact on Mobile) */}
      <div className="border-border/60 mt-6 flex w-full flex-col gap-2.5 border-t pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(resource)}
            className="bg-brand hover:bg-brand/90 focus-visible:outline-brand text-surface text-caption flex min-h-10.5 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md font-semibold shadow-xs transition-all"
          >
            <ExternalLink className="size-3.5" />
            <span>View PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(resource)}
            title="Download document"
            className="border-border bg-surface text-heading hover:bg-member-tint focus-visible:outline-brand flex size-10.5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
