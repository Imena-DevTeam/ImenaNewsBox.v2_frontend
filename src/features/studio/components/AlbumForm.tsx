"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { albumSchema, type AlbumValues } from "../schemas";
import { UploadDropzone } from "./UploadDropzone";

const DESCRIPTION_MAX = 300;

/**
 * Create an album.
 *
 * The photographs are the album, so they take the width and the details sit
 * in a rail beside them — the same shape as the post editor, for the same
 * reason: this was five fields stacked in a narrow column with the dropzone
 * last and Create below it, which put the work of the page at the bottom of
 * it.
 *
 * The rail is sticky, so Create stays reachable while forty thumbnails
 * scroll past. It reports what it would save and stops; validation is the
 * shared Zod schema, so the same rules will hold on the server when the API
 * exists.
 */
export function AlbumForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [cover, setCover] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AlbumValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: { title: "", place: "", takenOn: "", description: "" },
  });

  const description = useWatch({ control, name: "description" }) ?? "";
  const over = description.length > DESCRIPTION_MAX;

  /* Chosen photographs live in the browser until the API exists, so closing
     the tab loses the choosing as well as the typing. */
  useEffect(() => {
    if (!isDirty && files.length === 0) return;
    if (saved) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty, files.length, saved]);

  // TODO: post to the albums service and upload through signed URLs.
  const onSubmit = handleSubmit((values) => setSaved(values.title));

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3"
    >
      {/* The photographs. */}
      <div className="min-w-0 lg:col-span-2">
        <p className="text-body-sm text-member-ink mb-2 block font-medium">
          Photographs
        </p>
        <UploadDropzone onFilesChange={setFiles} onCoverChange={setCover} />
      </div>

      {/* The details, beside them rather than above them. */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
        <div className="border-member-border bg-member-panel flex flex-col gap-3 rounded-md border p-5">
          <Button variant="brand" type="submit" disabled={isSubmitting}>
            Create album
          </Button>

          {saved ? (
            <p role="status" className="text-body-sm text-member-ink">
              &ldquo;{saved}&rdquo; is valid, with {files.length} photograph
              {files.length === 1 ? "" : "s"}
              {files.length > 0
                ? ` and ${files[cover]?.name ?? "the first one"} as the cover`
                : ""}
              . Saving arrives with the API.
            </p>
          ) : (
            <p className="text-caption text-muted">
              The album appears in the gallery as soon as it is created.
            </p>
          )}
        </div>

        <TextField
          label="Album title"
          placeholder="Fête memories, 2026"
          error={errors.title?.message}
          {...register("title")}
        />

        <TextField
          label="Where"
          placeholder="Kigali"
          error={errors.place?.message}
          {...register("place")}
        />

        <TextField
          label="When"
          type="date"
          error={errors.takenOn?.message}
          {...register("takenOn")}
        />

        <div>
          <TextField
            label="Description (optional)"
            placeholder="One line about the day"
            error={errors.description?.message}
            {...register("description")}
          />
          {/* The schema's own cap, visible before it is hit rather than
              reported after. */}
          <p
            className={cn(
              "text-caption mt-1.5 text-right tabular-nums",
              over ? "text-danger font-semibold" : "text-muted",
            )}
          >
            {description.length}/{DESCRIPTION_MAX}
          </p>
        </div>
      </aside>
    </form>
  );
}
