"use client";

import { Download, ExternalLink, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useModalDialog } from "@/components/ui/useModalDialog";
import type { ResourceItem } from "../types";

/**
 * Reading a document without leaving the archive.
 *
 * The file itself is shown, in the browser's own PDF reader, which already
 * pages, zooms, searches and prints. The viewer adds only what it lacks: the
 * title and details, Download, and a way out to a full tab. It used to draw
 * two invented pages of "certified" text in place of the file, which showed
 * the reader something the document does not say.
 *
 * A native <dialog>, like the others in this codebase: Escape, focus trapped
 * inside, the page behind inert, and focus back on the card that opened it.
 */
export function PdfViewerModal({
  resource,
  onClose,
  onDownload,
}: {
  resource: ResourceItem | null;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}) {
  const dialog = useModalDialog(resource !== null);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="pdf-viewer-title"
      className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/60 m-auto h-dvh max-h-dvh w-full max-w-none overflow-hidden p-0 shadow-2xl motion-reduce:animate-none sm:h-[min(90dvh,60rem)] sm:w-[min(64rem,calc(100vw-2rem))] sm:rounded-lg"
    >
      {resource ? (
        <div className="flex h-full flex-col">
          <header className="border-member-border flex shrink-0 items-center gap-3 border-b px-4 py-3 sm:px-6">
            <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
              <FileText aria-hidden className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="pdf-viewer-title"
                className="text-body text-member-ink truncate font-semibold"
              >
                {resource.title}
              </h2>
              <p className="text-caption text-muted truncate">
                {resource.category} · {resource.fileSize} ·{" "}
                {resource.publishedDate}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => onDownload(resource)}
            >
              <Download aria-hidden className="size-4" />
              Download
            </Button>
            <a
              href={resource.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in a new tab"
              className="text-member-ink hover:bg-member-tint grid size-10 shrink-0 place-items-center rounded-full"
            >
              <ExternalLink aria-hidden className="size-5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-member-ink hover:bg-member-tint grid size-10 shrink-0 place-items-center rounded-full"
            >
              <X aria-hidden className="size-5" />
            </button>
          </header>

          <iframe
            key={resource.id}
            src={resource.pdfUrl}
            title={`${resource.title}, the document`}
            className="bg-member-field min-h-0 w-full flex-1"
          />

          {/* Phones open PDFs outside the page, so the two actions that work
              everywhere are kept in reach of the thumb. */}
          <footer className="border-member-border flex shrink-0 gap-3 border-t p-3 sm:hidden">
            <Button className="flex-1" onClick={() => onDownload(resource)}>
              <Download aria-hidden className="size-4" />
              Download
            </Button>
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}
