"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Download, ExternalLink, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ResourceItem } from "../types";

const ZOOM_MIN = 70;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DOCK_BUTTON =
  "flex size-7 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function PdfViewerModal({
  resource,
  onClose,
  onDownload,
}: {
  resource: ResourceItem | null;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}) {
  const isMounted = useMounted();
  if (!resource || !isMounted) return null;

  return createPortal(
    <PdfViewerDialog
      key={resource.id}
      resource={resource}
      onClose={onClose}
      onDownload={onDownload}
    />,
    document.body,
  );
}

function PdfViewerDialog({
  resource,
  onClose,
  onDownload,
}: {
  resource: ResourceItem;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}) {
  const [page, setPage] = useState<1 | 2>(1);
  const [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Lock body scroll */
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
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
      {/* The scrim */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${resource.fileName}, file viewer`}
        className="relative flex h-[86vh] w-[92vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#404040] text-white shadow-2xl ring-1 ring-white/10 sm:w-[86vw]"
      >
        {/* Slack-style Dark Header Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#353535] px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 pr-4">
            <div className="border-border bg-surface-elevated flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border p-1">
              <Image
                src="/images/imena-crest.webp"
                alt=""
                width={26}
                height={26}
                className="h-auto w-auto object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white sm:text-sm">
                imena_archive
              </p>
              <p className="truncate text-[11px] text-neutral-300">
                Shared in{" "}
                <span className="font-semibold text-white">
                  #family-records
                </span>{" "}
                &bull; {resource.publishedDate}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(resource)}
              className="hidden min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:inline-flex"
            >
              <Download aria-hidden className="size-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer (Escape)"
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Left: Thumbnail Strip */}
          <nav
            aria-label="Document pages"
            className="flex w-36 shrink-0 flex-col gap-4 border-r border-white/10 bg-[#303030] p-4 sm:w-44"
          >
            <p className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Pages (2)
            </p>

            <button
              type="button"
              onClick={() => setPage(1)}
              aria-current={page === 1 ? "page" : undefined}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-lg bg-white p-2 text-left shadow-md transition-all focus:outline-none",
                page === 1
                  ? "ring-2 ring-red-500 ring-offset-2 ring-offset-[#303030]"
                  : "opacity-75 hover:opacity-100",
              )}
            >
              <div className="flex aspect-[8.5/11] flex-col justify-between overflow-hidden bg-white p-2 text-[6px] text-neutral-800">
                <div className="space-y-1">
                  <div className="h-1.5 w-3/4 rounded bg-neutral-900" />
                  <div className="h-1 w-full rounded bg-neutral-300" />
                  <div className="h-1 w-5/6 rounded bg-neutral-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="h-0.5 w-full bg-neutral-200" />
                  <div className="h-0.5 w-full bg-neutral-200" />
                  <div className="h-0.5 w-2/3 bg-neutral-200" />
                </div>
              </div>
              <span className="mt-1 block text-center text-[10px] font-medium text-neutral-300">
                Page 1
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPage(2)}
              aria-current={page === 2 ? "page" : undefined}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-lg bg-white p-2 text-left shadow-md transition-all focus:outline-none",
                page === 2
                  ? "ring-2 ring-red-500 ring-offset-2 ring-offset-[#303030]"
                  : "opacity-75 hover:opacity-100",
              )}
            >
              <div className="flex aspect-[8.5/11] flex-col justify-between overflow-hidden bg-white p-2 text-[6px] text-neutral-800">
                <div className="space-y-1">
                  <div className="h-1.5 w-1/2 rounded bg-neutral-900" />
                  <div className="h-1 w-full rounded bg-neutral-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="h-0.5 w-full bg-neutral-200" />
                  <div className="h-0.5 w-1/2 bg-neutral-200" />
                </div>
              </div>
              <span className="mt-1 block text-center text-[10px] font-medium text-neutral-300">
                Page 2
              </span>
            </button>
          </nav>

          {/* Center Document Stage */}
          <div className="relative flex-1 overflow-y-auto bg-[#404040] p-4 sm:p-8">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
              className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 text-neutral-900 shadow-2xl transition-transform duration-150 sm:p-10"
            >
              {page === 1 ? (
                <DocumentPageOne resource={resource} />
              ) : (
                <DocumentPageTwo resource={resource} />
              )}
            </div>
          </div>

          {/* Floating Zoom Bar */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-black/85 px-3 py-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
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
              className="text-xs font-semibold text-neutral-200 hover:text-white"
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

          {/* Bottom Right Floating Actions */}
          <div className="absolute right-4 bottom-4 z-10 flex items-center gap-1 rounded-xl bg-black/85 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => onDownload(resource)}
              title="Download file"
              aria-label="Download file"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Download aria-hidden className="size-4" />
            </button>
            <a
              href={resource.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              aria-label="Open in new tab"
              className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ExternalLink aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentPageOne({ resource }: { resource: ResourceItem }) {
  return (
    <div className="space-y-6">
      {/* Title & Archival Header */}
      <div className="space-y-2 border-b pb-4 text-center">
        <h1 className="font-serif text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          {resource.title}
        </h1>
        <p className="text-brand text-xs font-semibold tracking-wider uppercase">
          Official Archival Record &bull; {resource.category}
        </p>
      </div>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 text-xs text-neutral-600">
        <div>
          <span className="font-semibold text-neutral-900">Reference:</span>{" "}
          <span className="font-mono text-[11px]">{resource.fileName}</span>
        </div>
        <div>
          <span className="font-semibold text-neutral-900">File Size:</span>{" "}
          <span>{resource.fileSize}</span>
        </div>
        <div>
          <span className="font-semibold text-neutral-900">Date:</span>{" "}
          <span>{resource.publishedDate}</span>
        </div>
      </div>

      {/* Dynamic Body tailored to category */}
      <div className="space-y-4 text-xs leading-relaxed text-neutral-700 sm:text-sm">
        <section>
          <h2 className="font-serif font-bold text-neutral-900 sm:text-base">
            01. Executive Overview &amp; Archival Purpose
          </h2>
          <p className="mt-1">
            {resource.description} This document constitutes an authenticated
            record held by the IMENA Family Foundation, preserving historical
            decisions, solidarity benchmarks, and community stewardship
            principles.
          </p>
        </section>

        <section>
          <h2 className="font-serif font-bold text-neutral-900 sm:text-base">
            02. Key Guidelines &amp; Directives
          </h2>
          <p className="mt-1">
            All regional chapters, university representatives, and subfamily
            leadership councils (Sanctuary, Light, Wihogora, and Hope) are
            mandated to maintain alignment with the covenants established within
            this dossier.
          </p>
        </section>

        <section>
          <h2 className="font-serif font-bold text-neutral-900 sm:text-base">
            03. Community Stewardship &amp; Accountability
          </h2>
          <p className="mt-1">
            Annual reviews are conducted during the Kwibuka period and National
            Gatherings to ensure continuous integrity, mutual support, and
            transparent reporting across all graduating promotions.
          </p>
        </section>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4 text-[11px] text-neutral-400">
        <span>IMENA Family Times &bull; Foundation Archives</span>
        <span>Page 1 of 2</span>
      </div>
    </div>
  );
}

function DocumentPageTwo({ resource }: { resource: ResourceItem }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b pb-4 text-center">
        <h2 className="font-serif text-lg font-bold text-neutral-900 sm:text-xl">
          Section II &mdash; Verification &amp; Certification Schedule
        </h2>
        <p className="text-xs text-neutral-500">
          Appendix A &bull; Ratification Matrix for {resource.category}
        </p>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        <h3 className="font-semibold text-neutral-900">
          04. Subfamily Ratification Record:
        </h3>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="font-bold text-neutral-900">Sanctuary (Uruhisho)</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Verified by Elder Board Representatives &bull; Certified
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="font-bold text-neutral-900">Light (Umurinzi)</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Verified by Academic &amp; Student Liaisons &bull; Certified
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="font-bold text-neutral-900">Wihogora (Humura)</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Verified by Mutual Aid &amp; Family Council &bull; Certified
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="font-bold text-neutral-900">Hope (Icyizere)</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Verified by Youth &amp; Mentorship Directors &bull; Certified
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3 border-t pt-6 text-xs sm:text-sm">
        <p className="font-semibold text-neutral-900">
          05. Executive Sign-Off &amp; Seal:
        </p>
        <p className="text-neutral-600">
          Certified under the authority of the IMENA Family Times Executive
          Archival Secretariat. Unaltered reproduction is permitted for all
          registered members.
        </p>

        <div className="flex items-end justify-between pt-4">
          <div>
            <p className="font-serif text-neutral-800 italic">
              Executive Council Secretariat
            </p>
            <p className="text-xs font-semibold text-neutral-900">
              IMENA Family Foundation
            </p>
            <p className="text-[11px] text-neutral-500">
              Kigali &bull; Huye &bull; Diaspora
            </p>
          </div>
          <div className="rounded-md border-2 border-neutral-900 px-3.5 py-1 text-center font-mono text-[10px] font-bold tracking-wider text-neutral-900 uppercase">
            Official Seal &bull; Certified
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4 text-[11px] text-neutral-400">
        <span>IMENA Family Times &bull; Foundation Archives</span>
        <span>Page 2 of 2</span>
      </div>
    </div>
  );
}
