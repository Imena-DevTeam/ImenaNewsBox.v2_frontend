"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { FEATURED_IMAGES } from "../data";
import { Lightbox } from "./Lightbox";

/* The five places on the stage, from the far left to the far right. */
const POSITIONS = [-2, -1, 0, 1, 2] as const;

const COUNT = FEATURED_IMAGES.length;

/* How far a drag must travel, and how much of it the stage follows. */
const SWIPE_THRESHOLD_PX = 60;
const DRAG_FOLLOW = 0.4;
/* Below this the pointer is a click, not the start of a drag. */
const CLICK_SLOP_PX = 6;

/**
 * The stage the gallery opens with: a photograph held large in the middle
 * and 3:4 preview cards either side, turned slightly inwards and fading as
 * they step back.
 *
 * It plays on its own every five seconds. The progress bar under it is the
 * clock — its animation ending is what advances the slide — so pausing the
 * bar on hover, focus, touch or an open lightbox pauses the slide too, and
 * the active photograph's slow Ken Burns push pauses with them. Nothing
 * plays for someone who asked for reduced motion.
 *
 * It moves by hand in every way a person would try: the frosted chevrons,
 * the preview cards, the thumbnail track, a drag that the stage follows and
 * springs back from, and the arrow keys. The photograph in the middle opens
 * the lightbox.
 */
export function FeaturedImageCarousel() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const drag = useRef<{ start: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const reducedMotion = useReducedMotion();

  /* A hidden tab pauses too, so coming back never lands mid-jump. */
  const visible = useDocumentVisible();
  const paused = hovered || focused || touching || lightboxOpen || !visible;

  const turn = (by: number) =>
    setIndex((current) => (current + by + COUNT * 2) % COUNT);

  const imageAt = (offset: number) =>
    FEATURED_IMAGES[(index + offset + COUNT * 2) % COUNT];

  const centre = imageAt(0);
  if (!centre) return null;

  /* A click that ended a drag is not a click. */
  const guarded = (action: () => void) => () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    action();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured family photographs"
      className="group/stage relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") turn(-1);
        if (event.key === "ArrowRight") turn(1);
      }}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-240 touch-pan-y select-none",
        )}
        /* A press on a photograph would otherwise start the browser's own
           image drag, which cancels the pointer stream mid-swipe. */
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          /* A new press clears any click left suppressed by the last drag,
             even one released where no photograph would have seen it. */
          suppressClick.current = false;
          drag.current = { start: event.clientX, moved: false };
          if (event.pointerType !== "mouse") setTouching(true);
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current) return;
          const distance = event.clientX - current.start;
          if (!current.moved && Math.abs(distance) < CLICK_SLOP_PX) return;
          if (!current.moved) {
            current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          setDragX(distance);
        }}
        onPointerUp={(event) => {
          const current = drag.current;
          drag.current = null;
          setTouching(false);
          if (!current?.moved) return;
          suppressClick.current = true;
          const distance = event.clientX - current.start;
          if (Math.abs(distance) >= SWIPE_THRESHOLD_PX)
            turn(distance < 0 ? 1 : -1);
          setDragX(0);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setTouching(false);
          setDragX(0);
        }}
      >
        <div
          className={cn(
            "gallery-stage w-full perspective-distant",
            /* Follows the finger while dragging; springs home on release. */
            dragX === 0 && "ease-spring transition-transform duration-500",
          )}
          style={{ transform: `translateX(${dragX * DRAG_FOLLOW}px)` }}
        >
          {POSITIONS.map((offset) => {
            const image = imageAt(offset);
            if (!image) return null;

            if (offset === 0) {
              return (
                <button
                  key="centre"
                  type="button"
                  onClick={guarded(() => setLightboxOpen(true))}
                  aria-label={`Open ${centre.title} full screen`}
                  className="group/centre aspect-gallery-stage bg-member-field focus-visible:outline-brand relative w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-xl"
                >
                  {/* Every cover is stacked here so a change of slide is a
                      cross-fade with a little depth, not a cut. */}
                  {FEATURED_IMAGES.map((item, itemIndex) => {
                    const active = item.slug === centre.slug;
                    return (
                      <span
                        key={item.slug}
                        aria-hidden={!active}
                        className={cn(
                          "absolute inset-0 transition-[opacity,transform] duration-700 ease-out",
                          active
                            ? "scale-100 opacity-100"
                            : "scale-97 opacity-0",
                        )}
                      >
                        <Image
                          key={active ? `${item.slug}-${index}` : item.slug}
                          src={item.image}
                          alt={active ? item.alt : ""}
                          fill
                          priority={itemIndex === 0}
                          placeholder="blur"
                          sizes="(min-width: 1024px) 460px, 100vw"
                          className={cn(
                            "object-cover",
                            /* Only the clock and this push pause; a photo
                               fading in must never freeze half-drawn. */
                            active && "ken-burns",
                            active && paused && "animations-paused",
                          )}
                        />
                      </span>
                    );
                  })}

                  <span className="text-member-ink absolute right-3 bottom-3 grid size-10 place-items-center rounded-full border border-white/60 bg-white/60 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/centre:opacity-100 group-focus-visible/centre:opacity-100">
                    <Expand aria-hidden className="size-4" />
                  </span>
                </button>
              );
            }

            const outer = Math.abs(offset) === 2;
            const left = offset < 0;

            return (
              <button
                key={offset}
                type="button"
                data-stage="side"
                data-depth={outer ? "outer" : "mid"}
                onClick={guarded(() => turn(offset))}
                aria-label={`Bring ${image.title} to the middle`}
                className={cn(
                  "bg-member-field transition-base focus-visible:outline-brand relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:opacity-100",
                  outer
                    ? "aspect-gallery-stage-side opacity-45"
                    : "aspect-gallery-stage-mid opacity-75",
                  /* Turned a little towards the middle, like cards on a
                     curved shelf. */
                  left ? "rotate-y-10" : "-rotate-y-10",
                )}
              >
                <Image
                  key={image.slug}
                  src={image.image}
                  alt=""
                  fill
                  sizes="160px"
                  className="stage-fade object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Frosted chevrons: there on touch screens, arriving with the
            pointer elsewhere. */}
        {[
          {
            by: -1,
            label: "Previous photograph",
            Icon: ChevronLeft,
            side: "left-2 md:-left-5",
          },
          {
            by: 1,
            label: "Next photograph",
            Icon: ChevronRight,
            side: "right-2 md:-right-5",
          },
        ].map(({ by, label, Icon, side }) => (
          <button
            key={label}
            type="button"
            onClick={() => turn(by)}
            aria-label={label}
            className={cn(
              "text-member-ink focus-visible:outline-brand absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/60 shadow-lg backdrop-blur-md transition-[opacity,background-color] duration-200 hover:bg-white/80",
              "opacity-100 md:opacity-0 md:group-focus-within/stage:opacity-100 md:group-hover/stage:opacity-100",
              side,
            )}
          >
            <Icon aria-hidden className="size-5" />
          </button>
        ))}
      </div>

      {/* The clock. Its animation ending advances the stage; keyed on the
          slide so every slide starts its own five seconds. */}
      {reducedMotion ? null : (
        <div
          aria-hidden
          className="bg-member-border mx-auto mt-6 h-0.75 w-full max-w-60 overflow-hidden rounded-full"
        >
          <span
            key={index}
            onAnimationEnd={() => turn(1)}
            className={cn(
              "bg-member-accent stage-progress block h-full w-full rounded-full",
              paused && "animations-paused",
            )}
          />
        </div>
      )}

      <p
        aria-live={paused || reducedMotion ? "polite" : "off"}
        className="border-member-border text-caption text-member-ink mx-auto mt-4 w-max rounded-full border bg-white/80 px-4 py-1.5 tabular-nums shadow-sm backdrop-blur"
      >
        <span className="font-semibold">
          {index + 1} / {COUNT}
        </span>
        <span aria-hidden className="text-muted mx-2">
          •
        </span>
        {centre.title}
      </p>

      <ul
        className="mt-5 flex flex-wrap justify-center gap-2"
        aria-label="All featured photographs"
      >
        {FEATURED_IMAGES.map((item, itemIndex) => (
          <li key={item.slug}>
            <button
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show ${item.title}`}
              aria-current={itemIndex === index}
              className={cn(
                "focus-visible:outline-brand relative block size-12 overflow-hidden rounded-xl transition-[opacity,box-shadow,transform] duration-200 hover:-translate-y-0.5",
                itemIndex === index
                  ? "ring-member-accent ring-2 ring-offset-2"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        photos={FEATURED_IMAGES}
        index={index}
        open={lightboxOpen}
        onIndex={setIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
