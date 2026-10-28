"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { SLIDES } from "../data";
import { cn } from "@/lib/cn";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";

const INTERVAL_MS = 7000;
const SWIPE_THRESHOLD_PX = 48;

/**
 * The carousel under the search bar, styled as the design's hero: one big
 * rounded photograph with the gathering's name in serif across its foot,
 * and the slide dots sitting inside the image.
 *
 * It advances on its own but never while someone is reading it — the timer
 * stops on hover, keyboard focus, a touch that is still down, and reduced
 * motion. It can also be moved by hand, because a control that only moves
 * itself is a photograph someone has to wait out: the dots, the arrow
 * buttons and a horizontal swipe all say the same thing, and every target
 * is big enough for a thumb.
 */
export function HeroSlides() {
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const slide = SLIDES[index] ?? SLIDES[0];
  /* A hidden tab clears the interval outright, so returning to the page
     never brings a burst of throttled ticks or a sudden jump. */
  const visible = useDocumentVisible();
  const paused = hoverPaused || focusPaused || manualPaused || !visible;

  const go = (delta: number) =>
    setIndex((value) => (value + delta + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(
      () => setIndex((value) => (value + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [paused]);

  /* With static data this cannot happen; the guard keeps the typing
     honest without reading into the array anywhere else. */
  if (!slide) return null;

  /* Only the active slide and the next one are mounted, so the first visit
     does not pay for every photograph at once. With the timer at seven
     seconds, the next picture has normally arrived long before it is
     needed; an older one is fetched on the rare backward step. */
  const mounted = new Set([index, (index + 1) % SLIDES.length]);

  const onTouchStart = (event: React.TouchEvent) => {
    const point = event.touches[0];
    if (point) swipeStart.current = point.clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = swipeStart.current;
    const end = event.changedTouches[0]?.clientX;
    swipeStart.current = null;

    if (start === null || end === undefined) return;
    const distance = end - start;
    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;
    go(distance < 0 ? 1 : -1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Family highlights"
      className="relative"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setFocusPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusPaused(false);
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* pan-y keeps a vertical scroll a scroll: the card listens for a
          horizontal gesture without claiming the whole touch. */}
      <div className="bg-member-night relative aspect-16/10 w-full touch-pan-y overflow-hidden rounded-lg md:aspect-9/4">
        {SLIDES.map(
          (s, i) =>
            mounted.has(i) && (
              <div
                key={s.title}
                aria-hidden={i !== index}
                className={cn(
                  "transition-base absolute inset-0",
                  i === index ? "hero-zoom opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={s.image}
                  alt={i === index ? s.alt : ""}
                  placeholder="blur"
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : i === index ? "eager" : "lazy"}
                  sizes="(min-width: 1280px) 1100px, 100vw"
                  className="object-cover"
                />
              </div>
            ),
        )}

        {/* A shade the title can sit on at any point of the photo. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
        />

        {/* Announced as one region, so a change of slide reads as a change
            of slide rather than a new <p> appearing elsewhere on the page. */}
        <div
          aria-live="polite"
          className="absolute inset-x-0 bottom-0 px-4 pt-16 pb-8 md:px-4 md:pb-8"
        >
          <p
            key={index}
            className="font-member-serif text-h3-m md:text-h3 text-surface page-enter max-w-2xl text-balance"
          >
            <span className="sr-only">
              Slide {index + 1} of {SLIDES.length}:{" "}
            </span>
            {slide.title}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-2 flex justify-center md:bottom-1">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className="transition-fast rounded-pill hover:bg-surface/20 focus-visible:outline-surface grid size-11 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "transition-base rounded-pill bg-surface",
                  i === index ? "h-1.5 w-10" : "size-1.5 opacity-60",
                )}
              />
            </button>
          ))}
        </div>

        <div className="absolute right-2 bottom-2 flex gap-1 md:right-3 md:bottom-2">
          <button
            type="button"
            onClick={() => setManualPaused((value) => !value)}
            aria-label={
              manualPaused ? "Resume slide rotation" : "Pause slide rotation"
            }
            aria-pressed={manualPaused}
            className="transition-fast rounded-pill bg-surface/25 text-surface hover:bg-surface/35 focus-visible:outline-surface grid size-11 place-items-center backdrop-blur-sm md:size-10"
          >
            {manualPaused ? (
              <Play aria-hidden className="size-4" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
          </button>
          {[
            { delta: -1, label: "Previous slide", Icon: ChevronLeft },
            { delta: 1, label: "Next slide", Icon: ChevronRight },
          ].map(({ delta, label, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => go(delta)}
              aria-label={label}
              className="transition-fast rounded-pill bg-surface/25 text-surface hover:bg-surface/35 focus-visible:outline-surface grid size-11 place-items-center backdrop-blur-sm md:size-10"
            >
              <Icon aria-hidden className="size-5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
