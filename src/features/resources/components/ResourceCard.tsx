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

export function ResourceCard({
  resource,
  onView,
  onDownload,
}: ResourceCardProps) {
  const categoryStyle =
    CATEGORY_STYLES[resource.category] ?? CATEGORY_STYLES.Documents;

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl sm:p-9 md:p-10">
      {/* Top Content Area */}
      <div className="flex flex-col items-center">
        {/* Top Metadata Badges */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ring-1 ${categoryStyle.badge}`}
          >
            <span className={`size-1.5 rounded-full ${categoryStyle.dot}`} />
            <span>{resource.category}</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
            <FileText className="size-3" />
            <span>{resource.fileSize}</span>
          </span>

          {resource.viewsCount && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
              <Eye className="size-3" />
              <span>{resource.viewsCount.toLocaleString()}</span>
            </span>
          )}
        </div>

        {/* Top Lavender Box with IMENA Crest */}
        <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#ede9fe] shadow-xs transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/images/imena-crest.webp"
            alt="IMENA Family Crest"
            width={44}
            height={44}
            className="object-contain"
          />
        </div>

        {/* Resource Title */}
        <h3 className="font-heading text-lg leading-snug font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#4828b8] md:text-xl">
          {resource.title}
        </h3>

        {/* Resource Description */}
        <p className="mt-3 line-clamp-3 max-w-md text-xs leading-relaxed text-slate-500 md:text-sm">
          {resource.description}
        </p>
      </div>

      {/* Bottom Actions Area (Equalized Across All Cards) */}
      <div className="mt-8 flex w-full flex-col gap-3 pt-2">
        {/* Primary View PDF Button with Brand Gradient */}
        <button
          type="button"
          onClick={() => onView(resource)}
          className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#4828b8] to-[#5b21b6] py-3.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:from-[#3e20a0] hover:to-[#4e1b9e] hover:shadow-md hover:shadow-[#4828b8]/20 active:scale-[0.99]"
        >
          <span>View PDF</span>
        </button>

        {/* Secondary Actions: Open and Download */}
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={() => onView(resource)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-[#4828b8]/40 hover:bg-violet-50/50 hover:text-[#4828b8] active:scale-95"
          >
            <ExternalLink className="size-3.5" />
            <span>Open</span>
          </button>

          <button
            type="button"
            onClick={() => onDownload(resource)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-[#4828b8]/40 hover:bg-violet-50/50 hover:text-[#4828b8] active:scale-95"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </article>
  );
}
