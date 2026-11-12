"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderPlus, Images, MapPin, Search, Trash2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CONTROL, Picker } from "@/components/ui/Picker";
import { ROUTES } from "@/constants/routes";
import type { Album } from "@/features/gallery/data";
import { cn } from "@/lib/cn";
import { withViewTransition } from "@/lib/viewTransition";
import type { AlbumValues } from "../schemas";
import { AlbumPanel, type PhotoChanges } from "./AlbumPanel";

type Order = "newest" | "oldest" | "title";

/** Cards past this one arrive together. */
const STAGGER_CAP = 8;

/** Stored ISO, read US-ordered, the way every other date on the site is. */
function readDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The gallery's albums, and the work on them.
 *
 * Until this page existed `/admin/albums/new` could create an album and
 * nothing could open, rename or remove one: six albums with no way back to
 * them. It is a grid rather than a table because every row's most useful
 * column is the photograph, and a photograph does not fit in a cell.
 *
 * An album with no photographs is marked. A full album is the norm, and
 * marking the norm is noise — the same judgement the archive makes about
 * published posts.
 *
 * Nothing saves: the work runs over a copy of the list in state, and every
 * outcome says so.
 *
 * The cards arrive in order rather than as a wall of nine, and the cover of
 * the album being opened carries into the panel where the browser supports
 * it — which on this page is the whole point of the card, since the cover is
 * the only thing that tells two albums apart at a glance.
 */
export function AlbumsBoard({
  albums,
  openSlug,
}: {
  albums: Album[];
  /** An album a link came here to open — the attention queue sends one. */
  openSlug?: string;
}) {
  const [shelf, setShelf] = useState(albums);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order>("newest");
  const [emptyOnly, setEmptyOnly] = useState(false);
  const [editing, setEditing] = useState<Album | null>(
    () => albums.find((album) => album.slug === openSlug) ?? null,
  );
  const [removing, setRemoving] = useState<Album | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  /* The cover that travels into the panel. It is held for the frame before
     the panel opens, because a view transition needs the shared name in the
     old state and in the new one, and never in both at once. */
  const [morphing, setMorphing] = useState<string | null>(null);

  const edit = (album: Album) => {
    setMorphing(album.slug);
    withViewTransition(() => {
      setEditing(album);
      setMorphing(null);
    });
  };

  /* The search rebuilds every card, each with a photograph in it. The
     keystroke lands first and the grid catches up. */
  const typed = useDeferredValue(query);

  const shown = useMemo(() => {
    const needle = typed.trim().toLowerCase();

    const kept = shelf.filter((album) => {
      if (emptyOnly && album.photos.length > 0) return false;
      if (!needle) return true;
      return (
        album.title.toLowerCase().includes(needle) ||
        album.location.toLowerCase().includes(needle)
      );
    });

    return [...kept].sort((a, b) => {
      if (order === "title") return a.title.localeCompare(b.title);
      const run = a.date.localeCompare(b.date);
      return order === "newest" ? -run : run;
    });
  }, [shelf, typed, order, emptyOnly]);

  /* Cards replay their arrival when the grid becomes a different grid, and
     sit still when one album in it was renamed. */
  const listing = `${typed}|${order}|${emptyOnly}`;

  // TODO: post to the albums service, and upload through signed URLs.
  const save = (values: AlbumValues, photos: PhotoChanges) => {
    if (!editing) return;
    const was = editing;

    setShelf((shelf) =>
      shelf.map((album) =>
        album.slug === was.slug
          ? {
              ...album,
              title: values.title,
              location: values.place,
              date: values.takenOn,
              event: values.description || album.event,
              photos: photos.kept,
              /* The gallery shows the cover, so it has to be one of the
                 photographs that are still here. */
              image: photos.kept[photos.coverAt]?.image ?? album.image,
              alt: photos.kept[photos.coverAt]?.alt ?? album.alt,
            }
          : album,
      ),
    );

    const said: string[] = [];
    if (values.title !== was.title) {
      said.push(`be renamed to ${values.title}`);
    }
    const removed = was.photos.length - photos.kept.length;
    if (removed > 0) {
      said.push(`lose ${removed} photograph${removed === 1 ? "" : "s"}`);
    }
    if (photos.added.length > 0) {
      said.push(
        `gain ${photos.added.length} photograph${
          photos.added.length === 1 ? "" : "s"
        }`,
      );
    }

    setOutcome(
      `${was.title} would ${said.length > 0 ? said.join(", ") : "be saved unchanged"}. Nothing was stored: the albums service does not exist yet.`,
    );
    setEditing(null);
  };

  const remove = (album: Album) => {
    setShelf((shelf) => shelf.filter((one) => one.slug !== album.slug));
    setOutcome(
      `${album.title} and its ${album.photos.length} photographs would be removed. Nothing was stored: the albums service does not exist yet.`,
    );
    setRemoving(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor="albums-search" className="sr-only">
            Search albums
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
            />
            <input
              id="albums-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or place"
              className={cn(CONTROL, "w-full pl-11")}
            />
          </div>
        </div>

        <Picker
          id="albums-order"
          label="Order albums"
          value={order}
          onChange={(next) => setOrder(next as Order)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </Picker>

        <label className="text-body-sm text-muted hover:text-member-ink transition-fast flex h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={emptyOnly}
            onChange={() => setEmptyOnly((was) => !was)}
            className="accent-brand size-4"
          />
          With no photographs
        </label>

        <ButtonLink variant="brand" size="sm" href={ROUTES.STUDIO_ALBUM_NEW}>
          <FolderPlus aria-hidden className="size-4" />
          Create an album
        </ButtonLink>
      </div>

      <p role="status" aria-live="polite" className="text-body-sm text-muted">
        {shown.length} of {shelf.length} albums
        {outcome ? ` · ${outcome}` : ""}
      </p>

      {shown.length === 0 ? (
        <div className="border-member-border bg-member-panel rounded-md border">
          <EmptyState
            title="No albums match that."
            description="Try a different title or place, or clear the filters."
          />
        </div>
      ) : (
        <ul
          key={listing}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((album, index) => (
            <li
              key={album.slug}
              style={{ "--i": Math.min(index, STAGGER_CAP) } as CSSProperties}
              className="border-member-border bg-surface transition-fast hover:border-brand tile-in flex flex-col overflow-hidden rounded-md border"
            >
              <Link
                href={`${ROUTES.GALLERY}/${album.slug}`}
                className="focus-visible:outline-brand group relative block"
              >
                <Image
                  src={album.image}
                  alt={album.alt}
                  width={480}
                  height={300}
                  style={
                    album.slug === morphing
                      ? ({ viewTransitionName: "album-open" } as CSSProperties)
                      : undefined
                  }
                  className="h-40 w-full object-cover"
                />
                <span className="sr-only">Open {album.title}</span>
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-h4-m text-member-ink text-balance">
                  {album.title}
                </h3>

                <p className="text-body-sm text-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="flex items-center gap-1.5">
                    <Images aria-hidden className="size-4" />
                    {album.photos.length}
                    <span className="sr-only">photographs</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin aria-hidden className="size-4" />
                    {album.location}
                  </span>
                  <span className="tabular-nums">{readDate(album.date)}</span>
                  {album.photos.length === 0 ? (
                    <span className="text-caption bg-member-tint text-brand rounded-full px-2.5 py-1 font-semibold">
                      No photographs
                    </span>
                  ) : null}
                </p>

                <div className="mt-4 flex items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => edit(album)}
                    className="text-body-sm text-brand focus-visible:outline-brand hover:bg-member-tint rounded-pill px-3 py-2 font-semibold"
                  >
                    Edit
                    <span className="sr-only"> {album.title}</span>
                  </button>
                  <Link
                    href={`${ROUTES.GALLERY}/${album.slug}`}
                    className="text-body-sm text-muted hover:text-brand focus-visible:outline-brand rounded-pill px-3 py-2"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRemoving(album)}
                    aria-label={`Remove ${album.title}`}
                    className="text-muted hover:text-danger focus-visible:outline-brand transition-fast ml-auto flex size-10 items-center justify-center rounded-full"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlbumPanel
        open={editing !== null}
        album={editing}
        onSave={save}
        onClose={() => setEditing(null)}
      />

      <ConfirmDialog
        open={removing !== null}
        destructive
        title={removing ? `Remove ${removing.title}?` : "Remove this album?"}
        description={
          removing
            ? `Its ${removing.photos.length} photographs leave the gallery with it, and this cannot be undone.`
            : ""
        }
        confirmLabel="Remove the album"
        cancelLabel="Keep it"
        onCancel={() => setRemoving(null)}
        onConfirm={() => removing && remove(removing)}
      />
    </div>
  );
}
