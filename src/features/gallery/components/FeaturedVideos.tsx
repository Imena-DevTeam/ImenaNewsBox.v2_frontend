"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FEATURED_VIDEO_SLIDES } from "../data";
import { cn } from "@/lib/cn";

/**
 * One wide frame with the slide's name on a white pill in its corner, and
 * the slide marks along its foot — a long bar for the one on screen, a dot
 * for each of the others, which is all the design gives it to be moved by.
 * Each mark carries a tall enough hit area for a thumb.
 */
export function FeaturedVideos() {
  const [index, setIndex] = useState(0);
  const slide = FEATURED_VIDEO_SLIDES[index];

  const turn = (by: number) =>
    setIndex(
      (current) =>
        (current + by + FEATURED_VIDEO_SLIDES.length) %
        FEATURED_VIDEO_SLIDES.length,
    );

  if (!slide) {
    return (
      <section aria-labelledby="featured-videos">
        <SectionHeading id="featured-videos">Featured Videos</SectionHeading>
        <p className="border-member-border bg-member-tint text-body text-muted mt-11 rounded-lg border px-6 py-16 text-center">
          Nothing has been added to the family reel yet.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="featured-videos">
      <SectionHeading id="featured-videos">Featured Videos</SectionHeading>

      <div
        aria-roledescription="carousel"
        aria-label="Featured family videos"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") turn(-1);
          if (event.key === "ArrowRight") turn(1);
        }}
        className="rounded-media aspect-gallery-video relative mx-auto mt-11 w-full max-w-200 overflow-hidden"
      >
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          priority
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />

        <p className="bg-surface text-member-ink text-caption rounded-pill absolute top-6 left-6 flex h-11 w-40 items-center justify-center px-4 text-center md:top-16 md:left-16 md:h-15 md:w-50">
          <span className="truncate">{slide.title}</span>
        </p>

        <p aria-live="polite" className="sr-only">
          {slide.alt}. Video {index + 1} of {FEATURED_VIDEO_SLIDES.length}.
        </p>

        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          {FEATURED_VIDEO_SLIDES.map((item, itemIndex) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show ${item.title}`}
              aria-current={itemIndex === index}
              className="focus-visible:outline-surface grid h-11 place-items-center px-1"
            >
              <span
                aria-hidden
                className={cn(
                  "bg-surface rounded-pill transition-base",
                  itemIndex === index ? "h-2.5 w-17" : "size-2.5 opacity-80",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
