"use client";

import { useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Eye, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BLOG_CATEGORIES, formatPostDate } from "@/features/blogs/data";
import { cn } from "@/lib/cn";
import { postSchema, type PostValues } from "../schemas";
import { reading } from "../writing";
import { PostPreview } from "./PostPreview";
import { UploadDropzone } from "./UploadDropzone";

const CATEGORIES = BLOG_CATEGORIES.filter((category) => category !== "All");

/** The schema's own cap, shown while the excerpt is being written. */
const EXCERPT_MAX = 240;

/** An existing post, opened for correction. */
export interface EditablePost {
  slug: string;
  title: string;
  category: PostValues["category"];
  excerpt: string;
  body: string;
  status: "draft" | "published";
  /** ISO, for the line in the rail saying where this post stands. */
  publishedOn: string;
  cover?: StaticImageData;
  coverAlt?: string;
}

type Outcome =
  | { kind: "draft" | "published"; title: string; on?: string }
  | { kind: "deleted"; title: string }
  | { kind: "needs-cover" };

/**
 * Write a post, or correct one already written.
 *
 * The page is a writing surface, not a form: the title and the body take the
 * width, and everything that is administration — the cover, the category,
 * the excerpt, the ways of leaving — sits in a rail beside them. The rail is
 * sticky, so Publish is reachable without scrolling back past a thousand
 * words.
 *
 * Two outcomes, not one: a draft is saved and goes to the attention queue, a
 * published post goes straight to the archive. Both run the same validation,
 * because a draft that cannot become a post is a trap.
 *
 * The body is a plain textarea. A rich editor is a large dependency and a
 * larger accessibility surface; paragraphs separated by blank lines match
 * what the blog renderer already does with contentParagraphs. **Preview** is
 * what makes that honest — it sets the words in the reading face, so she is
 * not publishing to the family unseen.
 *
 * Given a `post` it edits that one instead of starting a new one, and can
 * delete it.
 *
 * Three things here move, and all three are the page answering something:
 * the swap between writing and reading is the one orchestrated moment in the
 * studio, because it is the moment she is checking her own work; the reading
 * time dips and comes back when it crosses a minute, which is the only
 * change in that counter a writer cares about; and the Publish button pulses
 * once when a cover photograph arrives, because that is the thing that was
 * standing between her and publishing.
 */
export function PostEditor({ post }: { post?: EditablePost }) {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [preview, setPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /* A chosen file, held as an object URL so the preview can show it. The
     post's own cover stands in until she replaces it. */
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      category: post?.category ?? CATEGORIES[0],
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      publishOn: "",
    },
  });

  const title = useWatch({ control, name: "title" }) ?? "";
  const category = useWatch({ control, name: "category" }) ?? CATEGORIES[0]!;
  const body = useWatch({ control, name: "body" }) ?? "";
  const excerpt = useWatch({ control, name: "excerpt" }) ?? "";
  const counted = reading(body);
  const over = excerpt.length > EXCERPT_MAX;

  const cover = coverUrl ?? post?.cover;
  const hasCover = Boolean(cover);

  /* What the rail says about where this post stands. The outcome wins over
     the record, because the last thing she did is more use to her than the
     state the page was loaded in. */
  const standing = (() => {
    if (outcome?.kind === "deleted") return "Deleted";
    if (outcome?.kind === "draft") return "Would move to the drafts";
    if (outcome?.kind === "published") {
      return outcome.on
        ? `Would publish on ${formatPostDate(outcome.on)}`
        : "Would publish now";
    }
    if (!post) return "Not written yet";
    return post.status === "published"
      ? `Published ${formatPostDate(post.publishedOn)}`
      : `Draft, started ${formatPostDate(post.publishedOn)}`;
  })();

  /* Closing the tab mid-story loses the story: nothing is saved anywhere
     until the API exists. The browser shows its own wording. */
  useEffect(() => {
    if (!isDirty || outcome) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty, outcome]);

  const pickCover = (files: File[]) => {
    const file = files[0] ?? null;
    setCoverFile(file);
    setCoverUrl((was) => {
      if (was) URL.revokeObjectURL(was);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  // TODO: post to the posts service once the API exists.
  const save = (kind: "draft" | "published") =>
    handleSubmit((values) => {
      /* The archive and the family's blog both lead with a photograph, so a
         post without one is published broken. A draft may wait for it. */
      if (kind === "published" && !hasCover) {
        setOutcome({ kind: "needs-cover" });
        return;
      }
      setOutcome({
        kind,
        title: values.title,
        on: values.publishOn || undefined,
      });
    });

  const field =
    "rounded-field bg-surface border-field-border text-text transition-fast w-full border px-4";

  return (
    <form
      noValidate
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3"
    >
      {/* Keyed on which face is showing, so React mounts the column afresh
          and the entrance animation runs on every swap rather than only the
          first. The reading face rises; the writing face only fades, because
          a textarea sliding under the cursor is unpleasant to write in. */}
      <div
        key={preview ? "reading" : "writing"}
        className={cn(
          "flex min-w-0 flex-col gap-6 lg:col-span-2",
          preview ? "preview-enter" : "writing-enter",
        )}
      >
        {preview ? (
          <PostPreview
            title={title}
            category={category}
            excerpt={excerpt}
            body={body}
            cover={cover}
            coverAlt={coverFile?.name ?? post?.coverAlt}
          />
        ) : (
          <>
            <div>
              <label htmlFor="post-title" className="sr-only">
                Title
              </label>
              {/* Set as a title rather than as a field: the top of the page
                  should look like the post being written, not like a form. */}
              <input
                id="post-title"
                placeholder="A heart-warming family reunion"
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? "post-title-error" : undefined}
                className={cn(
                  "text-h2-m text-member-ink placeholder:text-field-placeholder",
                  "transition-fast w-full border-b bg-transparent pb-3",
                  "focus-visible:border-brand focus-visible:outline-none",
                  errors.title ? "border-danger" : "border-member-border",
                )}
                {...register("title")}
              />
              {errors.title ? (
                <p
                  id="post-title-error"
                  role="alert"
                  className="text-danger mt-2 text-sm"
                >
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="post-body" className="sr-only">
                The post
              </label>
              <textarea
                id="post-body"
                placeholder="Leave a blank line between paragraphs."
                aria-invalid={errors.body ? true : undefined}
                aria-describedby={
                  errors.body ? "post-body-error" : "post-body-hint"
                }
                className={cn(
                  "text-body text-member-ink placeholder:text-field-placeholder",
                  "field-sizing-content min-h-96 w-full resize-none bg-transparent leading-relaxed",
                  "focus-visible:outline-none",
                )}
                {...register("body")}
              />

              <div className="border-member-border mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                {errors.body ? (
                  <p
                    id="post-body-error"
                    role="alert"
                    className="text-caption text-danger"
                  >
                    {errors.body.message}
                  </p>
                ) : (
                  <p id="post-body-hint" className="text-caption text-muted">
                    A blank line starts a new paragraph.
                  </p>
                )}

                {/* The reading time the archive will print, while it is still
                    being written. */}
                <p
                  role="status"
                  aria-live="polite"
                  className="text-caption text-muted"
                >
                  {counted.words === 0 ? (
                    "Nothing written yet"
                  ) : (
                    <>
                      {counted.words} words, {counted.paragraphs} paragraph
                      {counted.paragraphs === 1 ? "" : "s"},{" "}
                      {/* Keyed on the minute, so the figure dips and comes
                          back when it crosses one. The words tick up with
                          every keystroke and mean nothing on their own; the
                          reading time is the number she is writing towards. */}
                      <span key={counted.minutes} className="tick inline-block">
                        {counted.minutes} min read
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* The administration, beside the writing rather than under it. */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
        <div className="border-member-border bg-member-panel flex flex-col gap-3 rounded-md border p-5">
          {/* Where this post stands. It was prose describing the record as
              it was loaded, which stopped being true the moment she saved;
              it now follows what she has just done and is announced when it
              changes, so the rail reflects the publish rather than only
              describing the post. */}
          {standing ? (
            <p
              key={standing}
              role="status"
              aria-live="polite"
              className="text-caption text-muted tick"
            >
              {standing}
            </p>
          ) : null}

          {/* Keyed on whether a cover is held, so the button pulses once
              the moment one arrives: publishing goes from refused to
              possible, and nothing else on the page says so.

              It stays enabled without one on purpose. A disabled button
              cannot explain itself, and the refusal — which names the one
              thing missing — is worth more than a control that does
              nothing. */}
          <Button
            key={hasCover ? "ready" : "waiting"}
            variant="brand"
            type="submit"
            disabled={isSubmitting}
            aria-describedby={hasCover ? undefined : "post-cover-needed"}
            onClick={save("published")}
            className={hasCover ? "ready-pulse" : undefined}
          >
            {post?.status === "published" ? "Save changes" : "Publish"}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={save("draft")}
          >
            {post?.status === "published" ? "Move to drafts" : "Save as draft"}
          </Button>

          {/* Seeing it as the family will is one button, not a round trip
              through the published site. */}
          <Button
            variant="outline"
            type="button"
            aria-pressed={preview}
            onClick={() => setPreview((was) => !was)}
          >
            {preview ? (
              <>
                <PenLine aria-hidden className="size-4" />
                Back to writing
              </>
            ) : (
              <>
                <Eye aria-hidden className="size-4" />
                Preview
              </>
            )}
          </Button>

          <div role="status" aria-live="polite">
            {outcome?.kind === "needs-cover" ? (
              <p className="text-body-sm text-danger font-medium">
                A cover photograph is needed before publishing. Save it as a
                draft and come back with one.
              </p>
            ) : outcome?.kind === "deleted" ? (
              <p className="text-body-sm text-member-ink">
                &ldquo;{outcome.title}&rdquo; would be deleted. Nothing was
                removed: the posts service does not exist yet.
              </p>
            ) : outcome ? (
              <p className="text-body-sm text-member-ink">
                &ldquo;{outcome.title}&rdquo; is valid and would be{" "}
                {outcome.kind === "draft"
                  ? "moved to the drafts"
                  : outcome.on
                    ? `published on ${formatPostDate(outcome.on)}`
                    : post
                      ? "saved to the archive"
                      : "published to the archive"}
                . Saving arrives with the API.
              </p>
            ) : (
              <p className="text-caption text-muted">
                {post
                  ? "Corrections reach the archive as soon as they are saved."
                  : "A draft goes to the attention queue. Publishing sends it to the archive."}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-body-sm text-member-ink block font-medium">
              Cover photograph
            </p>
            {/* The refusal, said where it can be acted on. It used to appear
                only in the outcome line, after she had pressed Publish and
                been turned down — which is the wrong end of the sequence for
                something she can see is missing. */}
            {hasCover ? null : (
              <span
                id="post-cover-needed"
                className="text-caption text-muted font-medium"
              >
                Needed before publishing
              </span>
            )}
          </div>
          {/* One slot, replacing what it holds. The archive, the blog cards
              and the preview all lead with this photograph. */}
          <UploadDropzone
            id="post-cover"
            max={1}
            coverChoice={false}
            prompt={
              hasCover ? "Replace the cover" : "Choose a cover, or drop it here"
            }
            onFilesChange={pickCover}
          />
          {post?.cover && !coverFile ? (
            <p className="text-caption text-muted mt-2">
              Keeping the photograph this post already has.
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="post-category"
            className="text-body-sm text-member-ink mb-2 block font-medium"
          >
            Category
          </label>
          <div className="relative">
            <select
              id="post-category"
              aria-invalid={errors.category ? true : undefined}
              aria-describedby={
                errors.category ? "post-category-error" : undefined
              }
              className={cn(field, "h-12 appearance-none pr-11")}
              {...register("category")}
            >
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            />
          </div>
          {errors.category ? (
            <p
              id="post-category-error"
              role="alert"
              className="text-caption text-danger mt-2"
            >
              {errors.category.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="post-excerpt"
            className="text-body-sm text-member-ink mb-2 block font-medium"
          >
            Excerpt
          </label>
          <textarea
            id="post-excerpt"
            rows={3}
            placeholder="One sentence for the card and the preview"
            aria-invalid={errors.excerpt ? true : undefined}
            aria-describedby="post-excerpt-count"
            className={cn(field, "resize-none py-3 leading-relaxed")}
            {...register("excerpt")}
          />
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            {errors.excerpt ? (
              <p role="alert" className="text-caption text-danger">
                {errors.excerpt.message}
              </p>
            ) : (
              <span />
            )}
            {/* Counts up to the schema's own limit, so the cap is visible
                before it is hit rather than reported after. */}
            <p
              id="post-excerpt-count"
              className={cn(
                "text-caption tabular-nums",
                over ? "text-danger font-semibold" : "text-muted",
              )}
            >
              {excerpt.length}/{EXCERPT_MAX}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="post-publish-on"
            className="text-body-sm text-member-ink mb-2 block font-medium"
          >
            Publish on (optional)
          </label>
          <input
            id="post-publish-on"
            type="date"
            aria-describedby="post-publish-on-hint"
            className={cn(field, "h-12")}
            {...register("publishOn")}
          />
          <p id="post-publish-on-hint" className="text-caption text-muted mt-2">
            Leave it empty to publish straight away.
          </p>
        </div>

        {/* Deleting the post you are looking at belongs here, not only in
            the archive's bulk bar. */}
        {post ? (
          <Button
            variant="outline"
            type="button"
            className="border-danger text-danger"
            onClick={() => setConfirming(true)}
          >
            <Trash2 aria-hidden className="size-4" />
            Delete this post
          </Button>
        ) : null}
      </aside>

      {post ? (
        <ConfirmDialog
          open={confirming}
          destructive
          title={`Delete “${post.title}”?`}
          description="It leaves the family archive and the blog. This cannot be undone, and moving it to the drafts instead takes it off the blog while keeping the writing."
          confirmLabel="Delete the post"
          cancelLabel="Keep it"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            setOutcome({ kind: "deleted", title: post.title });
          }}
        />
      ) : null}
    </form>
  );
}
