"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PartyPopper,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPhotoDate, type PhotoMeta } from "../data";

export interface LightboxPhoto extends PhotoMeta {
  image: StaticImageData;
  alt: string;
  title?: string;
}

const ZOOMED = 2.5;

/**
 * The photo inspector: one photograph full screen over a blurred page, with
 * what is known about it — when, which gathering, where, and who is in it.
 *
 * A native <dialog> traps focus and closes on Escape; the arrow keys move
 * between photographs and + / − zoom. Zoom follows the pointer: click a
 * spot to look closer at it, move to look around, click again to step back.
 */
export function Lightbox({
  photos,
  index,
  open,
  onIndex,
  onClose,
}: {
  photos: LightboxPhoto[];
  index: number;
  open: boolean;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  /* Zoom belongs to one photograph at one opening: a view recorded for any
     other is simply not this one's, so every photograph opens at its own
     size without an effect resetting it. */
  const viewKey = `${index}:${open}`;
  const [view, setView] = useState({ key: "", zoom: 1, origin: "50% 50%" });
  const zoom = view.key === viewKey ? view.zoom : 1;
  const origin = view.key === viewKey ? view.origin : "50% 50%";
  const setZoom = (next: number | ((current: number) => number)) =>
    setView((current) => {
      const base =
        current.key === viewKey
          ? current
          : { key: viewKey, zoom: 1, origin: "50% 50%" };
      return {
        ...base,
        zoom: typeof next === "function" ? next(base.zoom) : next,
      };
    });
  const setOrigin = (next: string) =>
    setView((current) => {
      const base =
        current.key === viewKey
          ? current
          : { key: viewKey, zoom: 1, origin: "50% 50%" };
      return { ...base, origin: next };
    });

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const photo = photos[index];
  if (!photo) return null;

  const go = (by: number) =>
    onIndex((index + by + photos.length) % photos.length);

  const aimAt = (event: React.MouseEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  return (
    <dialog
      ref={dialog}
      aria-label={`${photo.title ?? photo.event}, photograph ${index + 1} of ${photos.length}`}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
        if (event.key === "+" || event.key === "=") setZoom(ZOOMED);
        if (event.key === "-") setZoom(1);
      }}
      className={cn(
        "m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white",
        "backdrop:bg-member-ink/85 backdrop:backdrop-blur-xl",
        "open:animate-dialog-pop motion-reduce:animate-none",
      )}
    >
      <div className="flex h-full flex-col lg:flex-row">
        <div className="relative min-h-0 flex-1">
          {/* The photograph. Overflow is clipped so a zoomed picture pans
              inside its frame instead of spilling over the controls. */}
          <div
            className={cn(
              "absolute inset-4 overflow-hidden rounded-2xl md:inset-10",
              zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
            onClick={(event) => {
              aimAt(event);
              setZoom((current) => (current > 1 ? 1 : ZOOMED));
            }}
            onMouseMove={(event) => {
              if (zoom > 1) aimAt(event);
            }}
          >
            <Image
              key={index}
              src={photo.image}
              alt={photo.alt}
              fill
              placeholder="blur"
              /* Zoomed, it asks for the largest rendition there is. */
              sizes={zoom > 1 ? "250vw" : "100vw"}
              className="stage-fade object-contain transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
            />
          </div>

          {[
            {
              by: -1,
              label: "Previous photograph",
              Icon: ChevronLeft,
              side: "left-4",
            },
            {
              by: 1,
              label: "Next photograph",
              Icon: ChevronRight,
              side: "right-4",
            },
          ].map(({ by, label, Icon, side }) => (
            <button
              key={label}
              type="button"
              onClick={() => go(by)}
              aria-label={label}
              className={cn(
                "absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md transition-colors hover:bg-white/30 focus-visible:outline-white",
                side,
              )}
            >
              <Icon aria-hidden className="size-6" />
            </button>
          ))}

          <div className="absolute top-4 right-4 flex gap-2 md:top-6 md:right-6">
            <button
              type="button"
              onClick={() => setZoom((current) => (current > 1 ? 1 : ZOOMED))}
              aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
              aria-pressed={zoom > 1}
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md hover:bg-white/30 focus-visible:outline-white"
            >
              {zoom > 1 ? (
                <ZoomOut aria-hidden className="size-5" />
              ) : (
                <ZoomIn aria-hidden className="size-5" />
              )}
            </button>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close"
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md hover:bg-white/30 focus-visible:outline-white"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        </div>

        {/* What is known about the photograph. */}
        <aside className="border-white/15 bg-white/5 px-6 py-5 backdrop-blur-md lg:w-80 lg:border-l lg:py-10">
          <p className="text-caption text-white/60 tabular-nums">
            {index + 1} / {photos.length}
          </p>
          <h2 className="text-h3-m mt-2 text-white">
            {photo.title ?? photo.event}
          </h2>
          <p className="text-body-sm mt-2 text-white/70">{photo.alt}</p>

          <dl className="text-body-sm mt-6 grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="flex items-start gap-3">
              <CalendarDays
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-white/60"
              />
              <div>
                <dt className="sr-only">Date</dt>
                <dd>{formatPhotoDate(photo.date)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PartyPopper
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-white/60"
              />
              <div>
                <dt className="sr-only">Event</dt>
                <dd>{photo.event}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-white/60"
              />
              <div>
                <dt className="sr-only">Location</dt>
                <dd>{photo.location}</dd>
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-3 lg:col-span-1">
              <Users
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-white/60"
              />
              <div>
                <dt className="sr-only">Tagged</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {photo.tagged.map((name) => (
                    <span
                      key={name}
                      className="text-caption rounded-full bg-white/15 px-2.5 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </dl>

          <p className="text-caption-sm mt-6 text-white/50">
            ← → to move · + / − to zoom · Esc to close
          </p>
        </aside>
      </div>
    </dialog>
  );
}
