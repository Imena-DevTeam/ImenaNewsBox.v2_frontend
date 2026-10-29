"use client";

import Image from "next/image";
import { Download, ExternalLink, Eye, Sparkles, Star } from "lucide-react";
import type { ResourceItem } from "../types";

interface FeaturedResourceBannerProps {
  resource: ResourceItem;
  onView: (resource: ResourceItem) => void;
  onDownload: (resource: ResourceItem) => void;
}

export function FeaturedResourceBanner({
  resource,
  onView,
  onDownload,
}: FeaturedResourceBannerProps) {
  return (
    <section
      aria-label="Featured archival resource"
      className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-r from-violet-50/90 via-white/95 to-purple-50/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md sm:p-7 md:p-8"
    >
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-violet-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-purple-200/25 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4 sm:gap-5">
          {/* Lavender Crest Box */}
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#ede9fe] shadow-xs sm:size-16">
            <Image
              src="/images/imena-crest.webp"
              alt=""
              width={38}
              height={38}
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            {/* Spotlight Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-300/70">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span>Featured Archival Document</span>
              </span>

              {resource.viewsCount && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-2xs ring-1 ring-slate-200/60">
                  <Eye className="size-3 text-slate-400" />
                  <span>{resource.viewsCount.toLocaleString()} reads</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100/70 px-2.5 py-0.5 text-xs font-semibold text-[#4828b8]">
                <Sparkles className="size-3" />
                <span>{resource.category}</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading text-base font-bold text-slate-900 sm:text-lg md:text-xl">
              {resource.title}
            </h3>

            {/* Description */}
            <p className="line-clamp-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              {resource.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-3 self-stretch sm:justify-end sm:self-auto">
          <button
            type="button"
            onClick={() => onView(resource)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4828b8] to-[#5b21b6] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:from-[#3e20a0] hover:to-[#4e1b9e] hover:shadow-md hover:shadow-[#4828b8]/20 active:scale-95 sm:flex-initial sm:text-sm"
          >
            <span>View PDF</span>
            <ExternalLink className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDownload(resource)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-[#4828b8]/40 hover:bg-violet-50/50 hover:text-[#4828b8] active:scale-95 sm:text-sm"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </section>
  );
}
