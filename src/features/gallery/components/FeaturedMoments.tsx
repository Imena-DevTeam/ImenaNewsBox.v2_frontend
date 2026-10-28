"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Clock, Play, X } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { cn } from "@/lib/cn";
import { MOMENTS } from "../data";
import { CameraOrnament, HeartsOrnament } from "./GalleryOrnaments";

/**
 * Gathering moments and their video highlights: one wide card at a time,
 * with the marks along its foot to move between them.
 *
 * Behind the card sits an ambient glow — the same poster, blurred and
 * spread — so the card seems lit by its own picture. The play button opens
 * the reel in a player with the browser's own controls (so keyboard, seek
 * and fullscreen all work as people expect) and captions on by default.
 */
export function FeaturedMoments() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const moment = MOMENTS[index];

  const turn = (by: number) =>
    setIndex((current) => (current + by + MOMENTS.length) % MOMENTS.length);

  if (!moment) {
    return (
      <section aria-labelledby="featured-moments">
        <SectionHeading id="featured-moments">
          Gathering Moments &amp; Video Highlights
        </SectionHeading>
        <p className="border-member-border bg-member-tint text-body text-muted mt-11 rounded-lg border px-6 py-16 text-center">
          No moments have been featured yet.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="featured-moments">
      <SectionHeading
        id="featured-moments"
        before={<HeartsOrnament />}
        after={<CameraOrnament />}
      >
        Gathering Moments &amp; Video Highlights
      </SectionHeading>

      <div
        aria-roledescription="carousel"
        aria-label="Gathering moments"
        className="relative mx-auto mt-11 w-full max-w-200"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") turn(-1);
          if (event.key === "ArrowRight") turn(1);
        }}
      >
        {/* The ambient back-glow: the poster itself, blurred and spread
            beneath the card. Decorative, so hidden from assistive tech. */}
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
            placeholder="blur"
            sizes="(min-width: 1024px) 800px, 100vw"
            className="stage-fade object-cover"
          />
          <div
            aria-hidden
            className="from-member-ink/55 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          />

          <p className="bg-surface text-member-ink text-caption rounded-pill absolute top-6 left-6 flex h-11 max-w-[60%] items-center px-5 md:top-10 md:left-10 md:h-13">
            <span className="truncate font-semibold">{moment.title}</span>
          </p>

          <p className="text-caption absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-white backdrop-blur-md md:top-10 md:right-10">
            <Clock aria-hidden className="size-3.5" />
            {moment.duration}
          </p>

          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${moment.title}, ${moment.duration}`}
            className="group/play focus-visible:outline-surface absolute inset-0 grid place-items-center"
          >
            <span className="relative grid size-20 place-items-center md:size-24">
              {/* A soft pulse behind the button, so it reads as live. */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-white/35 motion-safe:animate-ping"
              />
              <span className="text-brand relative grid size-full place-items-center rounded-full border border-white/70 bg-white/85 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out group-hover/play:scale-110">
                <Play
                  aria-hidden
                  className="ml-1 size-8 fill-current md:size-9"
                />
              </span>
            </span>
          </button>

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

      <p className="text-caption text-muted mt-4 text-center">
        Highlight reels made from each gathering&rsquo;s photographs, until the
        family&rsquo;s own video is uploaded.
      </p>

      <VideoPlayer
        open={playing}
        onClose={() => setPlaying(false)}
        title={moment.title}
        video={moment.video}
        captions={moment.captions}
        poster={moment.poster.src}
      />
    </section>
  );
}

function VideoPlayer({
  open,
  onClose,
  title,
  video,
  captions,
  poster,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  video: string;
  captions: string;
  poster: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      void player.current?.play().catch(() => {
        /* Autoplay can be refused; the controls are right there. */
      });
    }
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-label={`${title} — video`}
      onClose={() => {
        player.current?.pause();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      className={cn(
        "m-auto w-[min(100vw-2rem,64rem)] max-w-none bg-transparent p-0",
        "backdrop:bg-member-ink/85 backdrop:backdrop-blur-xl",
        "open:animate-dialog-pop motion-reduce:animate-none",
      )}
    >
      <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-5 py-3 text-white">
          <p className="text-body-sm font-semibold">{title}</p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close video"
            className="grid size-10 place-items-center rounded-full hover:bg-white/15 focus-visible:outline-white"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <video
          ref={player}
          key={video}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          className="aspect-video w-full bg-black"
        >
          <source src={video} type="video/webm" />
          <track
            kind="captions"
            src={captions}
            srcLang="en"
            label="English"
            default
          />
          Your browser cannot play this video.
        </video>
      </div>
    </dialog>
  );
}
