"use client";

import Image, { type StaticImageData } from "next/image";
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
  image: StaticImageData;
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
        className="group border-member-border bg-member-tint shadow-member focus-visible:outline-brand relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl border sm:rounded-3xl"
      >
        <Image
          src={image}
          alt={alt}
          fill
          placeholder="blur"
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
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md hover:bg-white/30 focus-visible:outline-white md:top-6 md:right-6"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </dialog>
    </figure>
  );
}
