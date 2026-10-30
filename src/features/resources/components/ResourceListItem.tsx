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

export function ResourceListItem({
  resource,
  onView,
  onDownload,
}: ResourceListItemProps) {
  const categoryStyle =
    CATEGORY_STYLES[resource.category] ?? CATEGORY_STYLES.Documents;

  return (
    <article className="border-border bg-surface shadow-subtle hover:border-brand/40 group flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Left: Emblem + Info */}
      <div className="flex flex-1 items-start gap-4">
        {/* Emblem */}
        <div className="border-border bg-surface-elevated group-hover:bg-brand/10 group-hover:border-brand/40 flex size-12 shrink-0 items-center justify-center rounded-xl border p-2 transition-colors">
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
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryStyle.badge}`}
            >
              <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
              <span>{resource.category}</span>
            </span>

            <span className="text-muted inline-flex items-center gap-1 font-mono text-xs">
              <FileText className="size-3" />
              <span>{resource.fileSize}</span>
            </span>

            {resource.viewsCount && (
              <span className="text-muted hidden items-center gap-1 text-xs sm:inline-flex">
                <Eye className="size-3" />
                <span>{resource.viewsCount.toLocaleString()} reads</span>
              </span>
            )}
          </div>

          <h3 className="text-heading group-hover:text-brand line-clamp-1 font-serif text-base font-bold transition-colors">
            {resource.title}
          </h3>

          <p className="text-body text-muted line-clamp-1 text-xs">
            {resource.description}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onDownload(resource)}
          className="border-border bg-surface-elevated text-heading hover:bg-surface-tint focus-visible:outline-brand inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>

        <button
          type="button"
          onClick={() => onView(resource)}
          className="bg-brand hover:bg-brand/90 focus-visible:outline-brand inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all"
        >
          <ExternalLink className="size-3.5" />
          <span>View PDF</span>
        </button>
      </div>
    </article>
  );
}
