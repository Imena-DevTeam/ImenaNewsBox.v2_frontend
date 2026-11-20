"use client";

import { placeholderFor, imageUrl } from "@/types/media";
import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { cn } from "@/lib/cn";
import { MOMENTS } from "../data";
import { CameraOrnament } from "@/components/ui/Ornaments";

/**
 * Featured videos: one wide frame at a time, with the marks along its foot to
 * move between them. Behind the frame sits an ambient glow — the same picture,
 * blurred and spread — so it seems lit by its own colour.
 */
export function FeaturedMoments() {
  const [index, setIndex] = useState(0);
  const moment = MOMENTS[index];

  const turn = (by: number) =>
    setIndex((current) => (current + by + MOMENTS.length) % MOMENTS.length);

  if (!moment) {
    return (
      <section aria-labelledby="featured-moments">
        <SectionHeading id="featured-moments">Featured Videos</SectionHeading>
        <p className="border-member-border bg-member-tint text-body text-muted mt-11 rounded-lg border px-6 py-16 text-center">
          No moments have been featured yet.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="featured-moments">
      <SectionHeading id="featured-moments" after={<CameraOrnament />}>
        Featured Videos
      </SectionHeading>

      <div
        aria-roledescription="carousel"
        aria-label="Featured videos"
        className="relative mx-auto mt-11 w-full max-w-200"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") turn(-1);
          if (event.key === "ArrowRight") turn(1);
        }}
      >
        {/* The ambient back-glow: the picture itself, blurred and spread
            beneath the frame. Decorative, so hidden from assistive tech. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 inset-y-8 -z-10 scale-105 opacity-70 blur-3xl saturate-150"
        >
          <Image
            key={index}
            src={moment.poster}
            alt=""
            fill
            sizes="400px"
            className="stage-fade object-cover"
          />
        </div>

        <div className="rounded-media aspect-gallery-video relative overflow-hidden shadow-2xl">
          <Image
            key={moment.title}
            src={moment.poster}
            alt={moment.alt}
            fill
            placeholder={placeholderFor(moment.poster)}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="stage-fade object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            {MOMENTS.map((item, itemIndex) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`Show ${item.title}`}
                aria-current={itemIndex === index}
                className="focus-visible:outline-surface relative z-10 grid h-11 place-items-center px-1"
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
      </div>
    </section>
  );
}
