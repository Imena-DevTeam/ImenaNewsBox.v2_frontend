"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Picked {
  file: File;
  /** An object URL, so the photograph can be seen before it is uploaded. */
  url: string;
}

/** Thumbnails past this one arrive together: a stagger that runs the length
    of forty photographs reads as the browser struggling. */
const STAGGER_CAP = 8;

/**
 * Where the album's photographs are chosen.
 *
 * A real <input type="file"> does the work, kept visually hidden rather than
 * replaced, so the control is reachable by keyboard and announced properly;
 * the panel is its label. Dropping onto the panel is the shortcut, not the
 * only way in.
 *
 * It showed a list of file names until 11 Nov 2026, which asked somebody
 * choosing between forty photographs of the same afternoon to recognise
 * IMG_4471.jpg. They are thumbnails now, and the cover is chosen rather than
 * assumed to be the first — the cover is the one photograph the whole family
 * sees on the gallery.
 *
 * The id is a prop because it was hard-coded, which meant two of these on a
 * page shared one label. `max={1}` makes it a single slot that replaces what
 * it holds, which is what a post's cover photograph wants; `coverChoice`
 * turns the radios off for the one case where the cover is chosen elsewhere
 * — adding to an album that already has photographs.
 *
 * Forty photographs of one afternoon used to appear in one frame, which
 * gives no sense of how many landed or whether the browser is still reading
 * them. They arrive in order now, and the panel leans in while something is
 * being dragged over it — the drag is the one moment the control has to say
 * that it is the thing being aimed at.
 *
 * TODO: the files are only held here. Sending them needs the signed upload
 * URLs the structure document describes, which arrive with the API.
 */
export function UploadDropzone({
  id = "album-photos",
  max,
  coverChoice = true,
  prompt = "Choose photographs, or drop them here",
  onFilesChange,
  onCoverChange,
}: {
  id?: string;
  /** How many may be held at once. One replaces rather than appends, which
      is what a single cover photograph wants. */
  max?: number;
  /** Whether one of them is marked as the cover. Adding to an album that
      already has photographs chooses the cover beside them, not here. */
  coverChoice?: boolean;
  prompt?: string;
  onFilesChange?: (files: File[]) => void;
  onCoverChange?: (index: number) => void;
}) {
  const [picked, setPicked] = useState<Picked[]>([]);
  const [cover, setCover] = useState(0);
  const [dragging, setDragging] = useState(false);

  /* Object URLs are revoked by hand, and only when the component goes away:
     revoking on every change would blank the thumbnails still on screen. */
  const live = useRef<Picked[]>([]);
  useEffect(() => {
    live.current = picked;
  }, [picked]);
  useEffect(
    () => () => {
      for (const item of live.current) URL.revokeObjectURL(item.url);
    },
    [],
  );

  const update = (next: Picked[], nextCover = cover) => {
    setPicked(next);
    const safe = Math.min(nextCover, Math.max(next.length - 1, 0));
    setCover(safe);
    onFilesChange?.(next.map((item) => item.file));
    onCoverChange?.(safe);
  };

  const add = (incoming: FileList | null) => {
    if (!incoming) return;
    const images = Array.from(incoming)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (images.length === 0) return;

    /* A single slot replaces what is in it, and releases the URL it was
       holding, rather than growing a list of one. */
    if (max === 1) {
      for (const item of picked) URL.revokeObjectURL(item.url);
      update(images.slice(-1), 0);
      return;
    }

    const next = [...picked, ...images];
    update(max ? next.slice(0, max) : next);
  };

  const drop = (index: number) => {
    const going = picked[index];
    if (going) URL.revokeObjectURL(going.url);
    update(
      picked.filter((_, at) => at !== index),
      index < cover ? cover - 1 : cover,
    );
  };

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          add(event.dataTransfer.files);
        }}
        className={cn(
          "transition-base flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center",
          "focus-within:outline-brand focus-within:outline-2 focus-within:outline-offset-2",
          /* Scaled a touch under the pointer, so a drag that is over the
             panel is unmistakably over the panel. */
          dragging
            ? "border-brand bg-member-tint scale-101 border-solid motion-reduce:scale-100"
            : "border-member-border bg-member-panel hover:border-brand",
        )}
      >
        <ImagePlus
          aria-hidden
          className={cn(
            "text-brand transition-base size-6",
            dragging && "scale-110 motion-reduce:scale-100",
          )}
        />
        <span className="text-body-sm text-member-ink mt-3 font-medium">
          {prompt}
        </span>
        <span className="text-caption text-muted mt-1">JPEG or PNG</span>
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple={max !== 1}
          className="sr-only"
          onChange={(event) => add(event.target.files)}
        />
      </label>

      {picked.length > 0 ? (
        <>
          <p role="status" className="text-caption text-muted mt-4">
            {picked.length} photograph{picked.length === 1 ? "" : "s"} ready
            {coverChoice
              ? ". The one marked as the cover is what the gallery shows."
              : "."}
          </p>

          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {picked.map((item, index) => (
              <li
                key={item.url}
                style={{ "--i": Math.min(index, STAGGER_CAP) } as CSSProperties}
                className={cn(
                  "group bg-member-panel tile-in relative overflow-hidden rounded-lg border",
                  coverChoice && index === cover
                    ? "border-brand"
                    : "border-member-border",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element --
                    an object URL has no intrinsic size and never reaches the
                    image optimiser, so next/image cannot serve it. */}
                <img
                  src={item.url}
                  alt=""
                  className="h-28 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => drop(index)}
                  className="bg-surface/90 text-muted hover:text-danger focus-visible:outline-brand transition-fast absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full"
                >
                  <X aria-hidden className="size-3.5" />
                  <span className="sr-only">Remove {item.file.name}</span>
                </button>

                {coverChoice ? (
                  <label className="text-caption text-member-ink flex cursor-pointer items-center gap-2 px-2.5 py-2">
                    <input
                      type="radio"
                      name={`${id}-cover`}
                      checked={index === cover}
                      onChange={() => {
                        setCover(index);
                        onCoverChange?.(index);
                      }}
                      className="accent-brand size-3.5"
                    />
                    {index === cover ? "Cover" : "Use as cover"}
                  </label>
                ) : (
                  <p className="text-caption text-muted truncate px-2.5 py-2">
                    {item.file.name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
