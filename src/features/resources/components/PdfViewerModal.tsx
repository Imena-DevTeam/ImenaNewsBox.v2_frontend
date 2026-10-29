"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Minus,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ResourceItem } from "../types";

interface PdfViewerModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}

type Page = 1 | 2;

const TOTAL_PAGES = 2;
const ZOOM_MIN = 70;
const ZOOM_MAX = 145;
const ZOOM_STEP = 15;

const FOCUSABLE =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const DOCK_BUTTON =
  "flex size-7 cursor-pointer items-center justify-center rounded-full text-slate-300 hover:bg-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30";

/**
 * The file viewer, as Slack opens one: a self-contained container in front
 * of the page, not a takeover of it.
 *
 * It is mounted into document.body. The member pages enter with a transform
 * animation, and a `fixed` element inside a transformed ancestor is placed
 * against that ancestor rather than the window, which is what made the old
 * viewer sit behind the dock and clip. Out here nothing can contain it.
 */
export function PdfViewerModal({
  resource,
  onClose,
  onDownload,
}: PdfViewerModalProps) {
  if (!resource) return null;
  /* Keyed by file, so each opening starts on page 1 at 100% without an
     effect to reset it. */
  return createPortal(
    <PdfViewer
      key={resource.id}
      resource={resource}
      onClose={onClose}
      onDownload={onDownload}
    />,
    document.body,
  );
}

function PdfViewer({
  resource,
  onClose,
  onDownload,
}: {
  resource: ResourceItem;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}) {
  const [page, setPage] = useState<Page>(1);
  const [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Hand focus back to whatever opened the viewer. */
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown" || event.key === "ArrowRight") setPage(2);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") setPage(1);
      if (event.key === "Tab" && dialog.current) {
        const items = [
          ...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ];
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* The scrim: dims the page, and a click on it closes the viewer. */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${resource.fileName}, file viewer`}
        className="relative flex h-[85vh] w-[92vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#404040] text-white shadow-2xl ring-1 ring-white/10 sm:w-[85vw]"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#353535] px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 pr-4">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#ede9fe]">
              <Image
                src="/images/imena-crest.webp"
                alt=""
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white sm:text-sm">
                imena_archive
              </p>
              <p className="truncate text-[11px] text-slate-300">
                Shared in{" "}
                <span className="font-semibold text-white"># resources</span> —{" "}
                {resource.fileName}
              </p>
            </div>
          </div>

          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Close viewer"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1">
          <nav
            aria-label="Pages"
            className="flex w-24 shrink-0 flex-col items-center gap-5 overflow-y-auto border-r border-white/10 bg-[#383838] p-3 sm:w-32 sm:p-4"
          >
            {([1, 2] as const).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-label={`Go to page ${number}`}
                aria-current={page === number ? "page" : undefined}
                className="relative flex w-full cursor-pointer flex-col items-center"
              >
                <span
                  className={cn(
                    "relative block aspect-[3/4] w-full overflow-hidden rounded-xs bg-white p-2 shadow-md transition-opacity",
                    page === number
                      ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-[#383838]"
                      : "opacity-80 hover:opacity-100",
                  )}
                >
                  <span className="block space-y-1.5 opacity-60">
                    <span className="mx-auto block h-2 w-3/4 rounded-xs bg-slate-800" />
                    <span className="block h-1 w-full rounded-xs bg-slate-300" />
                    <span className="block h-1 w-4/5 rounded-xs bg-slate-300" />
                    <span className="block h-1 w-full rounded-xs bg-slate-300" />
                    <span className="block h-6 rounded-xs border border-dashed border-slate-300 bg-slate-100" />
                  </span>
                  {page === number ? (
                    <span className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-center text-[9px] font-semibold text-white">
                      PDF Viewer
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 text-xs font-semibold text-slate-300">
                  {number}
                </span>
              </button>
            ))}
          </nav>

          {/* The document scrolls inside its own canvas; the page behind
              is left alone. */}
          <div className="min-w-0 flex-1 overflow-y-auto bg-[#424242] p-4 pb-24 sm:p-8 sm:pb-24">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
              className="mx-auto max-w-[820px] rounded-xs bg-white p-6 text-slate-900 shadow-xl ring-1 shadow-black/50 ring-black/10 transition-transform duration-150 sm:p-10 md:p-12"
            >
              {page === 1 ? <PageOne resource={resource} /> : <PageTwo />}
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/85 px-3 py-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-md sm:gap-2">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="Previous page"
              className={DOCK_BUTTON}
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <span className="text-xs font-semibold text-slate-200 select-none">
              {page} / {TOTAL_PAGES}
            </span>
            <button
              type="button"
              onClick={() => setPage(2)}
              disabled={page === 2}
              aria-label="Next page"
              className={DOCK_BUTTON}
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
            <span aria-hidden className="mx-1 h-3.5 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN))}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
              className={DOCK_BUTTON}
            >
              <Minus aria-hidden className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              aria-label="Reset zoom"
              className="text-xs font-semibold text-slate-200 hover:text-white"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX))}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
              className={DOCK_BUTTON}
            >
              <Plus aria-hidden className="size-3.5" />
            </button>
          </div>

          <div className="absolute right-4 bottom-4 z-10 flex items-center gap-1 rounded-xl bg-black/85 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => onDownload(resource)}
              title="Download"
              aria-label="Download file"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Download aria-hidden className="size-4" />
            </button>
            <a
              href={resource.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              aria-label="Open in new window"
              className="flex size-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ExternalLink aria-hidden className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => onDownload(resource)}
              title="More"
              aria-label="More actions"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <MoreHorizontal aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageOne({ resource }: { resource: ResourceItem }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-xl font-bold tracking-tight text-[#1a365d] sm:text-2xl md:text-3xl">
          {resource.title}
        </h1>
        <p className="text-xs font-medium tracking-wide text-slate-600 sm:text-sm">
          Part 01 | General Chapter Oversight &amp; Archival Standards —
          Documentation
        </p>
      </div>

      <div className="space-y-2 border-b border-slate-200 pb-6 text-xs text-slate-800 sm:text-sm">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-900">Archive Reference:</span>
          <span className="font-mono text-slate-600">{resource.fileName}</span>
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-900">Classification:</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#4828b8]">
            {resource.category}
          </span>
          <span aria-hidden className="text-slate-400">
            •
          </span>
          <span className="text-slate-500">File Size: {resource.fileSize}</span>
        </p>
      </div>

      <div className="space-y-6 text-xs leading-relaxed text-slate-800 sm:text-sm">
        <section>
          <h2 className="text-base font-bold text-slate-950 sm:text-lg">
            01. Executive Overview &amp; Legislative Purpose
          </h2>
          <p className="mt-1 text-slate-700">
            {resource.description}. In accordance with the national statutes
            governing the perpetual preservation of Genocide Memorial Sites in
            Rwanda, this resolution integrates certified documentation, buffer
            boundaries, and maintenance frameworks into the permanent national
            heritage register.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-slate-950 sm:text-lg">
            02. Oversight Protocols for Regional Chapters
          </h2>
          <p className="mt-1 text-slate-700">
            Regional chapter leaders and elder representatives are responsible
            for coordinating annual remembrance services (Kwibuka), verifying
            physical boundaries, and ensuring that survivor testimonies
            associated with each memorial site are accurately recorded and
            cataloged in the IMENA digital archive.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-slate-950 sm:text-lg">
            03. Structural Preservation Audits
          </h2>
          <p className="mt-1 text-slate-700">
            Mandatory quarterly audits must be executed by certified civil
            heritage preservation engineers. These audits evaluate soil
            stability, drainage, moisture control in crypts, and the security of
            physical memorial stones.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-slate-950 sm:text-lg">
            04. Public Access &amp; Educational Visitation
          </h2>
          <p className="mt-1 text-slate-700">
            Public and academic access is maintained through structured
            protocols that balance reverence with education. Guided educational
            tours for youth members must be booked at least fourteen days in
            advance.
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 text-[11px] text-slate-500">
        <span>AERG IMENA Family Foundation Archives</span>
        <span>Page 1 of 2</span>
      </div>
    </div>
  );
}

const SITES = [
  {
    name: "Site A — Western Sector",
    note: "Coordinates: 2°14′S, 29°21′E • Dedicated memorial garden and primary burial vault.",
  },
  {
    name: "Site B — Northern District",
    note: "Coordinates: 1°32′S, 29°58′E • Documentation hall, survivor names wall, and heritage museum.",
  },
  {
    name: "Site C — Eastern Province",
    note: "Coordinates: 2°02′S, 30°30′E • Historic sanctuary ground and youth reflection center.",
  },
  {
    name: "Site D — Southern Chapter",
    note: "Coordinates: 2°35′S, 29°44′E • Memorial grove, prayer chapel, and archive branch.",
  },
];

function PageTwo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-bold tracking-tight text-[#1a365d] sm:text-xl md:text-2xl">
          Section II — Site Registry &amp; Verification Schedule
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Appendix A | Certified Memorial Sites Designated to National Registry
        </p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm">
        <h2 className="font-bold text-slate-900">
          05. Verified Regional Memorial Sites:
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SITES.map((site) => (
            <div
              key={site.name}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-bold text-slate-900">{site.name}</p>
              <p className="mt-1 text-xs text-slate-600">{site.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-4 border-t border-slate-200 pt-8 text-xs sm:text-sm">
        <p className="font-semibold text-slate-900">
          06. Final Ratification &amp; Sign-off:
        </p>
        <p className="text-slate-700">
          This document has been reviewed and certified by the Executive
          Heritage Board. Any revisions must be lodged with the IMENA Archival
          Secretariat.
        </p>
        <div className="flex items-end justify-between pt-6">
          <div>
            <p className="font-serif text-slate-800 italic">
              Dr. Jean-Baptiste Habimana
            </p>
            <p className="text-xs font-semibold text-slate-900">
              Executive Director, Heritage Board
            </p>
            <p className="text-[11px] text-slate-500">
              AERG IMENA Family Times
            </p>
          </div>
          <div className="rounded-md border-2 border-slate-900 px-4 py-1.5 text-center text-[10px] font-bold tracking-wider text-slate-900 uppercase">
            Official Seal • Certified
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 text-[11px] text-slate-500">
        <span>AERG IMENA Family Foundation Archives</span>
        <span>Page 2 of 2</span>
      </div>
    </div>
  );
}
