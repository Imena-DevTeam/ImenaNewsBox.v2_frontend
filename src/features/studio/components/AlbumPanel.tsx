"use client";

import { useState, type CSSProperties } from "react";
import { useModalDialog } from "@/components/ui/useModalDialog";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { Album, AlbumPhoto } from "@/features/gallery/data";
import { cn } from "@/lib/cn";
import { albumSchema, type AlbumValues } from "../schemas";
import { UploadDropzone } from "./UploadDropzone";

/** What the panel hands back about the photographs themselves. */
export interface PhotoChanges {
  /** The photographs still in the album, in order. */
  kept: AlbumPhoto[];
  /** Which of `kept` the gallery shows, or -1 when none are left. */
  coverAt: number;
  /** Photographs chosen in the panel, not yet anywhere. */
  added: File[];
}

/**
 * One album, open for correction — its details **and its photographs**.
 *
 * It could only rename an album until 11 Nov 2026: the title, the place, the
 * date and the description. The photographs were untouchable, so the only
 * way to put a photograph into an album was to create another album, and the
 * studio's own attention queue said "Album has no photographs → Add
 * photographs" and linked here, where she could not.
 *
 * Nothing saves. Both halves report what they would do and stop.
 */
export function AlbumPanel({
  open,
  album,
  onSave,
  onClose,
}: {
  open: boolean;
  album: Album | null;
  onSave: (values: AlbumValues, photos: PhotoChanges) => void;
  onClose: () => void;
}) {
  const ref = useModalDialog(open);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="bg-surface open:animate-dialog-pop m-auto max-h-[calc(100dvh-4rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-lg p-0 shadow-xl backdrop:bg-black/50 motion-reduce:animate-none"
    >
      {open && album ? (
        <AlbumFields
          key={album.slug}
          album={album}
          onSave={onSave}
          onClose={onClose}
        />
      ) : null}
    </dialog>
  );
}

function AlbumFields({
  album,
  onSave,
  onClose,
}: {
  album: Album;
  onSave: (values: AlbumValues, photos: PhotoChanges) => void;
  onClose: () => void;
}) {
  const [kept, setKept] = useState<AlbumPhoto[]>(album.photos);
  const [added, setAdded] = useState<File[]>([]);
  /* The cover is one of the album's own photographs, found by matching the
     image it already shows. */
  const [coverAt, setCoverAt] = useState(() => {
    const at = album.photos.findIndex((photo) => photo.image === album.image);
    return at === -1 ? 0 : at;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AlbumValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: album.title,
      place: album.location,
      takenOn: album.date,
      description: album.event,
    },
  });

  const drop = (index: number) => {
    setKept((was) => was.filter((_, at) => at !== index));
    setCoverAt((was) => (index < was ? was - 1 : was === index ? 0 : was));
  };

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSave(values, { kept, coverAt: kept.length ? coverAt : -1, added }),
      )}
      noValidate
      className="p-6"
    >
      <h2 className="text-h4 text-member-ink font-semibold">{album.title}</h2>
      <p className="text-body-sm text-muted mt-1">
        {kept.length} photograph{kept.length === 1 ? "" : "s"} in the album
        {added.length > 0 ? `, ${added.length} waiting to be added` : ""}.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <TextField
          label="Album title"
          error={errors.title?.message}
          {...register("title")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Where"
            error={errors.place?.message}
            {...register("place")}
          />
          <TextField
            label="When"
            type="date"
            error={errors.takenOn?.message}
            {...register("takenOn")}
          />
        </div>
        <TextField
          label="Description (optional)"
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      <section className="mt-7">
        <h3 className="text-body-sm text-member-ink font-medium">
          Photographs
        </h3>

        {kept.length > 0 ? (
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {kept.map((photo, index) => (
              <li
                key={photo.alt + index}
                /* The cover carries in from the card that was clicked, where
                   the browser supports it: AlbumsBoard hands this name over
                   on the frame before the panel opens. Only the cover claims
                   it — a name may belong to one element at a time, and the
                   cover is the photograph the card was showing. */
                style={
                  index === coverAt
                    ? ({ viewTransitionName: "album-open" } as CSSProperties)
                    : undefined
                }
                className={cn(
                  "bg-member-panel relative overflow-hidden rounded-lg border",
                  index === coverAt ? "border-brand" : "border-member-border",
                )}
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={160}
                  height={112}
                  className="h-20 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => drop(index)}
                  aria-label={`Remove ${photo.alt}`}
                  className="bg-surface/90 text-muted hover:text-danger focus-visible:outline-brand transition-fast absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full"
                >
                  <X aria-hidden className="size-3.5" />
                </button>

                <label className="text-caption text-member-ink flex cursor-pointer items-center gap-1.5 px-2 py-1.5">
                  <input
                    type="radio"
                    name="album-cover"
                    checked={index === coverAt}
                    onChange={() => setCoverAt(index)}
                    className="accent-brand size-3.5"
                  />
                  {index === coverAt ? (
                    <span className="text-brand flex items-center gap-1 font-semibold">
                      <Star aria-hidden className="size-3" />
                      Cover
                    </span>
                  ) : (
                    "Cover"
                  )}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-muted mt-2">
            The album is empty. Nothing of it shows in the gallery until it has
            at least one photograph.
          </p>
        )}

        <div className="mt-4">
          <UploadDropzone
            id={`album-${album.slug}-photos`}
            coverChoice={false}
            onFilesChange={setAdded}
          />
        </div>
      </section>

      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="brand" size="sm" type="submit" disabled={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
