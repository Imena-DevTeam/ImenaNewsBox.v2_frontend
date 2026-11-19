"use client";

import { type ImageSource, placeholderFor } from "@/types/media";

import Image from "next/image";
import { useRef } from "react";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A photograph set inside the story, with its caption. Click it, or press
 * Enter on it, to see it large over the page.
 */
export function ArticleMediaBlock({
  image,
  alt,
  caption,
}: {
  image: ImageSource;
  alt: string;
  caption: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <figure className="my-8 sm:my-10">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge photograph: ${alt}`}
        className="group border-member-border bg-member-tint shadow-member focus-visible:outline-brand relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg border sm:rounded-lg"
      >
        <Image
          src={image}
          alt={alt}
          fill
          placeholder={placeholderFor(image)}
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102 motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="bg-surface/85 text-member-ink absolute right-3 bottom-3 grid size-9 place-items-center rounded-full backdrop-blur-sm"
        >
          <Expand className="size-4" />
        </span>
      </button>
      <figcaption className="text-caption text-muted mt-3 text-center italic">
        {caption}
      </figcaption>

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className={cn(
          "m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0",
          "backdrop:bg-member-ink/85 backdrop:backdrop-blur-xl",
          "open:animate-dialog-pop motion-reduce:animate-none",
        )}
      >
        <div className="relative size-full p-4 md:p-10">
          <div className="relative size-full">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="border-surface/25 bg-surface/15 text-surface hover:bg-surface/30 focus-visible:outline-surface absolute top-4 right-4 grid size-11 place-items-center rounded-full border backdrop-blur-md md:top-6 md:right-6"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </dialog>
    </figure>
  );
}
