"use client";

import Image from "next/image";
import type { ResourceItem } from "../types";

interface ResourceCardProps {
  resource: ResourceItem;
  onView: (resource: ResourceItem) => void;
  onOpen: (resource: ResourceItem) => void;
  onDownload: (resource: ResourceItem) => void;
}

/**
 * The design draws the resource plainly: the family crest, the title and a
 * line about it, then the viewer, and below it the two ways to take it away.
 * No category tag, size or read count — the card is the document, not its
 * metadata.
 */
export function ResourceCard({
  resource,
  onView,
  onOpen,
  onDownload,
}: ResourceCardProps) {
  return (
    <article className="border-member-border bg-surface shadow-subtle flex h-full flex-col rounded-3xl border p-6 sm:p-8">
      {/* Crest emblem, centred */}
      <div className="mb-6 flex justify-center">
        <div className="bg-brand/10 flex size-16 items-center justify-center rounded-2xl">
          <Image
            src="/images/imena-crest.webp"
            alt=""
            width={34}
            height={34}
            className="h-auto w-auto object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-heading text-h4 leading-snug font-bold">
        {resource.title}
      </h3>

      {/* One line about it */}
      <p className="text-member-rail-ink mt-2 text-sm leading-relaxed">
        {resource.description}
      </p>

      {/* The viewer, then the two ways out */}
      <div className="mt-6 space-y-3 md:mt-8">
        <button
          type="button"
          onClick={() => onView(resource)}
          className="bg-brand hover:bg-brand/90 focus-visible:outline-brand flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold text-white shadow-xs transition-colors"
        >
          View PDF
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onOpen(resource)}
            className="border-member-border bg-surface text-heading hover:border-brand/50 hover:text-brand focus-visible:outline-brand flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition-colors"
          >
            Open
          </button>
          <button
            type="button"
            onClick={() => onDownload(resource)}
            className="border-member-border bg-surface text-heading hover:border-brand/50 hover:text-brand focus-visible:outline-brand flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </article>
  );
}
