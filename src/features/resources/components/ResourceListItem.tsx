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
    badge: "bg-blue-50 text-blue-700 ring-blue-200/70",
    dot: "bg-blue-500",
  },
  Guides: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
    dot: "bg-emerald-500",
  },
  "Family Resources": {
    badge: "bg-violet-50 text-[#4828b8] ring-violet-200/70",
    dot: "bg-[#4828b8]",
  },
  "Educational Materials": {
    badge: "bg-amber-50 text-amber-800 ring-amber-200/70",
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
    <article className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-violet-200 hover:shadow-md sm:flex-row sm:items-center sm:p-6">
      {/* Left: Crest & Title / Description */}
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {/* Crest Miniature */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#ede9fe] shadow-xs transition-transform duration-200 group-hover:scale-105">
          <Image
            src="/images/imena-crest.webp"
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        </div>

        <div className="min-w-0 space-y-1">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ring-1 ${categoryStyle.badge}`}
            >
              <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
              <span>{resource.category}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-slate-500">
              <FileText className="size-3" />
              <span>{resource.fileSize}</span>
            </span>

            {resource.publishedDate && (
              <span className="text-slate-400">• {resource.publishedDate}</span>
            )}

            {resource.viewsCount && (
              <span className="hidden items-center gap-1 text-slate-500 md:inline-flex">
                <Eye className="size-3 text-slate-400" />
                <span>{resource.viewsCount.toLocaleString()} reads</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-[#4828b8] sm:text-base">
            {resource.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-1 text-xs text-slate-500">
            {resource.description}
          </p>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex w-full shrink-0 items-center gap-2.5 sm:w-auto">
        <button
          type="button"
          onClick={() => onView(resource)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#4828b8] to-[#5b21b6] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:from-[#3e20a0] hover:to-[#4e1b9e] active:scale-95 sm:flex-initial"
        >
          <span>View PDF</span>
          <ExternalLink className="size-3" />
        </button>

        <button
          type="button"
          onClick={() => onDownload(resource)}
          aria-label={`Download ${resource.fileName}`}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-[#4828b8]/40 hover:bg-violet-50/50 hover:text-[#4828b8] active:scale-95"
        >
          <Download className="size-3.5" />
          <span className="hidden md:inline">Download</span>
        </button>
      </div>
    </article>
  );
}
