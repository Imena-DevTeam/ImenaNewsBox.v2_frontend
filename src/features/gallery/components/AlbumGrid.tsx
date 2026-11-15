"use client";

import { placeholderFor } from "@/types/media";
import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import type { AlbumPhoto } from "../data";
import { Lightbox } from "./Lightbox";

/** An album's photographs; any of them opens the lightbox at that photo. */
export function AlbumGrid({
  title,
  photos,
}: {
  title: string;
  photos: AlbumPhoto[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <p className="border-member-border bg-member-panel text-body text-muted mt-8 rounded-md border px-6 py-12 text-center">
        No photographs in this album yet. The family blogger adds them from the
        studio.
      </p>
    );
  }

  return (
    <>
      <ul className="reveal-stagger mt-8 grid gap-x-5 gap-y-13 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <li key={`${title}-${index}`}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`Open photograph ${index + 1}: ${photo.alt}`}
              className="group rounded-field aspect-gallery-album shadow-member focus-visible:outline-brand relative block w-full cursor-zoom-in overflow-hidden"
            >
              <Image
                src={photo.image}
                alt=""
                fill
                placeholder={placeholderFor(photo.image)}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="transition-base object-cover group-hover:scale-105"
              />
              <span className="text-member-ink border-surface/60 bg-surface/60 absolute right-3 bottom-3 grid size-10 place-items-center rounded-full border opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand aria-hidden className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        photos={photos.map((photo) => ({ ...photo, title }))}
        index={open ?? 0}
        open={open !== null}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
