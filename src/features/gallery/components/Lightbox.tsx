"use client";

import { type ImageSource, placeholderFor } from "@/types/media";

import Image from "next/image";
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
  image: ImageSource;
  alt: string;
  title?: string;
}

const ZOOMED = 2.5;
const MAX_ZOOM = 4;
/* How far a finger has to travel before a swipe counts. */
const SWIPE_PX = 60;
const CLOSE_PX = 110;

/**
 * The photo inspector: one photograph full screen over a blurred page, with
 * what is known about it — when, which gathering, where, and who is in it.
 *
 * A native <dialog> traps focus and closes on Escape; the arrow keys move
 * between photographs and + / − zoom. Zoom follows the pointer: click a
 * spot to look closer at it, move to look around, click again to step back.
 *
 * On a touch screen: swipe sideways between photographs, pinch to zoom, drag
 * to look around a zoomed one, and swipe down to close.
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

  /* Touch: the fingers on the photograph, where they started, and how far
     the picture is being dragged before it is let go. */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    x: number;
    y: number;
    pinch?: { distance: number; zoom: number };
    moved: boolean;
  } | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  /* A swipe ends in a click as well; this keeps that click from zooming. */
  const swiped = useRef(false);

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

  const spread = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    /* Keeps the gesture ours if the finger leaves the frame. A browser can
       refuse it for a pointer it no longer tracks; the gesture still works
       without it, so a refusal must not stop the handler. */
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* not captured */
    }
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 2) {
      gesture.current = {
        x: event.clientX,
        y: event.clientY,
        pinch: { distance: spread(), zoom },
        moved: true,
      };
    } else {
      gesture.current = { x: event.clientX, y: event.clientY, moved: false };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    if (!start || !pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (start.pinch && pointers.current.size === 2) {
      const next = (start.pinch.zoom * spread()) / start.pinch.distance;
      setZoom(Math.min(MAX_ZOOM, Math.max(1, next)));
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) start.moved = true;

    if (zoom > 1) {
      /* Zoomed: the finger moves the picture, so the focus point moves the
         other way. */
      aimAt(event);
      return;
    }
    setDrag({ x: dx, y: Math.max(0, dy) });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    pointers.current.delete(event.pointerId);
    if (!start || pointers.current.size > 0) return;
    gesture.current = null;
    swiped.current = start.moved;
    setDrag({ x: 0, y: 0 });
    if (zoom > 1 || start.pinch) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (dy > CLOSE_PX && dy > Math.abs(dx)) onClose();
    else if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

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
        "text-surface m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0",
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
              "absolute inset-4 touch-none overflow-hidden rounded-lg md:inset-10",
              zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
            style={{
              transform: `translate(${drag.x}px, ${drag.y}px)`,
              opacity: 1 - Math.min(drag.y / (CLOSE_PX * 3), 0.5),
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={(event) => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
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
              placeholder={placeholderFor(photo.image)}
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
                "border-surface/25 bg-surface/15 hover:bg-surface/30 focus-visible:outline-surface absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-md transition-colors",
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
              className="border-surface/25 bg-surface/15 hover:bg-surface/30 focus-visible:outline-surface grid size-11 place-items-center rounded-full border backdrop-blur-md"
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
              className="border-surface/25 bg-surface/15 hover:bg-surface/30 focus-visible:outline-surface grid size-11 place-items-center rounded-full border backdrop-blur-md"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        </div>

        {/* What is known about the photograph. */}
        <aside className="border-surface/15 bg-surface/5 px-6 py-5 backdrop-blur-md lg:w-80 lg:border-l lg:py-10">
          <p className="text-caption text-surface/60 tabular-nums">
            {index + 1} / {photos.length}
          </p>
          <h2 className="text-h3-m text-surface mt-2">
            {photo.title ?? photo.event}
          </h2>
          <p className="text-body-sm text-surface/70 mt-2">{photo.alt}</p>

          <dl className="text-body-sm mt-6 grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="flex items-start gap-3">
              <CalendarDays
                aria-hidden
                className="text-surface/60 mt-0.5 size-4 shrink-0"
              />
              <div>
                <dt className="sr-only">Date</dt>
                <dd>{formatPhotoDate(photo.date)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PartyPopper
                aria-hidden
                className="text-surface/60 mt-0.5 size-4 shrink-0"
              />
              <div>
                <dt className="sr-only">Event</dt>
                <dd>{photo.event}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden
                className="text-surface/60 mt-0.5 size-4 shrink-0"
              />
              <div>
                <dt className="sr-only">Location</dt>
                <dd>{photo.location}</dd>
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-3 lg:col-span-1">
              <Users
                aria-hidden
                className="text-surface/60 mt-0.5 size-4 shrink-0"
              />
              <div>
                <dt className="sr-only">Tagged</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {photo.tagged.map((name) => (
                    <span
                      key={name}
                      className="text-caption bg-surface/15 rounded-full px-2.5 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </dl>

          <p className="text-caption-sm text-surface/50 mt-6">
            <span className="hidden md:inline">
              ← → to move · + / − to zoom · Esc to close
            </span>
            <span className="md:hidden">
              Swipe to move · pinch to zoom · swipe down to close
            </span>
          </p>
        </aside>
      </div>
    </dialog>
  );
}
