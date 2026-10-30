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
      className="border-border bg-surface shadow-subtle hover:border-brand/30 relative overflow-hidden rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 hover:shadow-md sm:p-7 md:p-8"
    >
      {/* Decorative Brand Tint Glow */}
      <div className="bg-brand/10 pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl" />
      <div className="bg-primary/10 pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4 sm:gap-5">
          {/* Lavender Crest Box */}
          <div className="bg-surface-elevated border-border flex size-14 shrink-0 items-center justify-center rounded-2xl border p-2 shadow-xs sm:size-16">
            <Image
              src="/images/imena-crest.webp"
              alt=""
              width={38}
              height={38}
              className="h-auto w-auto object-contain"
            />
          </div>

          <div className="space-y-2">
            {/* Spotlight Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/30">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span>Featured Archival Document</span>
              </span>

              {resource.viewsCount && (
                <span className="border-border bg-surface-elevated text-muted inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                  <Eye className="text-muted size-3" />
                  <span>{resource.viewsCount.toLocaleString()} reads</span>
                </span>
              )}

              <span className="border-brand/30 bg-brand/10 text-brand inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                <Sparkles className="size-3" />
                <span>{resource.category}</span>
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-h4 text-heading font-serif font-bold tracking-tight">
              {resource.title}
            </h2>
            <p className="text-body text-muted line-clamp-2 max-w-2xl text-xs sm:text-sm">
              {resource.description}
            </p>

            {/* File Meta */}
            <div className="text-muted flex items-center gap-3 pt-1 text-xs">
              <span className="font-mono text-[11px]">{resource.fileName}</span>
              <span>&bull;</span>
              <span>{resource.fileSize}</span>
              <span>&bull;</span>
              <span>Published {resource.publishedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onDownload(resource)}
            className="border-border bg-surface-elevated text-heading hover:bg-surface-tint focus-visible:outline-brand inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={() => onView(resource)}
            className="bg-brand hover:bg-brand/90 focus-visible:outline-brand inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <ExternalLink className="size-3.5" />
            <span>View PDF</span>
          </button>
        </div>
      </div>
    </section>
  );
}
