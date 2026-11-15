"use client";

import Image from "next/image";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import type { ResourceCategory, ResourceItem } from "../types";

interface ResourceListItemProps {
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

export function ResourceListItem({
  resource,
  onView,
  onDownload,
}: ResourceListItemProps) {
  const categoryStyle =
    CATEGORY_STYLES[resource.category] ?? CATEGORY_STYLES.Documents;

  return (
    <article className="border-border bg-surface shadow-subtle hover:border-brand/40 group flex flex-col gap-4 rounded-lg border p-4 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Left: Emblem + Info */}
      <div className="flex flex-1 items-start gap-4">
        {/* Emblem */}
        <div className="border-border bg-member-panel group-hover:bg-brand/10 group-hover:border-brand/40 flex size-12 shrink-0 items-center justify-center rounded-md border p-2 transition-colors">
          <Image
            src="/images/imena-crest.webp"
            alt=""
            width={28}
            height={28}
            className="h-auto w-auto object-contain"
          />
        </div>

        {/* Content Info */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-caption inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-semibold ${categoryStyle.badge}`}
            >
              <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
              <span>{resource.category}</span>
            </span>

            <span className="text-muted text-caption inline-flex items-center gap-1 font-mono">
              <FileText className="size-3" />
              <span>{resource.fileSize}</span>
            </span>

            {resource.viewsCount && (
              <span className="text-muted text-caption hidden items-center gap-1 sm:inline-flex">
                <Eye className="size-3" />
                <span>{resource.viewsCount.toLocaleString()} reads</span>
              </span>
            )}
          </div>

          <h3 className="text-heading group-hover:text-brand text-body line-clamp-1 font-serif font-bold transition-colors">
            {resource.title}
          </h3>

          <p className="text-body text-muted text-caption line-clamp-1">
            {resource.description}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onDownload(resource)}
          className="border-border bg-surface text-heading hover:bg-member-tint focus-visible:outline-brand text-caption inline-flex min-h-9.5 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 font-semibold shadow-xs transition-colors"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>

        <button
          type="button"
          onClick={() => onView(resource)}
          className="bg-brand hover:bg-brand/90 focus-visible:outline-brand text-surface text-caption inline-flex min-h-9.5 cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 font-semibold shadow-xs transition-all"
        >
          <ExternalLink className="size-3.5" />
          <span>View PDF</span>
        </button>
      </div>
    </article>
  );
}
