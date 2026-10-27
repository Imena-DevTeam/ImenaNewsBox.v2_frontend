"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { FEATURED_IMAGES } from "../data";

/* The five places the design draws, from the far left to the far right. */
const POSITIONS = [-2, -1, 0, 1, 2] as const;

const COUNT = FEATURED_IMAGES.length;

/**
 * The stage the gallery opens with: one photograph held large in the middle
 * with two narrower ones either side, in the design's proportions.
 *
 * The design draws no arrows, so there are none — the flanking photographs
 * are the control. Clicking or tabbing to one brings it to the middle, the
 * left and right keys turn the stage from anywhere inside it, and a pointer
 * gets a lift and a cursor so the photographs do not read as decoration.
 */
export function FeaturedImageCarousel() {
  const [index, setIndex] = useState(0);

  const turn = (by: number) =>
    setIndex((current) => (current + by + COUNT * 2) % COUNT);

  const imageAt = (offset: number) =>
    FEATURED_IMAGES[(index + offset + COUNT * 2) % COUNT];

  const centre = imageAt(0);
  if (!centre) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured family photographs"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") turn(-1);
        if (event.key === "ArrowRight") turn(1);
      }}
    >
      <div className="gallery-stage mx-auto w-full max-w-212">
        {POSITIONS.map((offset) => {
          const image = imageAt(offset);
          if (!image) return null;

          if (offset === 0) {
            return (
              <div
                key="centre"
                className="aspect-gallery-stage bg-member-field relative w-full overflow-hidden"
              >
                <Image
                  src={image.image}
                  alt={image.alt}
                  fill
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 436px, 100vw"
                  className="object-cover"
                />
              </div>
            );
          }

          const outer = Math.abs(offset) === 2;

          return (
            <button
              key={offset}
              type="button"
              data-stage="side"
              data-depth={outer ? "outer" : "mid"}
              onClick={() => turn(offset)}
              aria-label={`Bring ${image.title} to the middle`}
              className={cn(
                "bg-member-field lift focus-visible:outline-brand relative w-full cursor-pointer overflow-hidden",
                outer
                  ? "aspect-gallery-stage-side"
                  : "aspect-gallery-stage-mid",
              )}
            >
              <Image
                src={image.image}
                alt=""
                fill
                sizes="92px"
                className="transition-base object-cover brightness-95 hover:brightness-100"
              />
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {centre.title}. Photograph {index + 1} of {COUNT}.
      </p>
    </section>
  );
}
