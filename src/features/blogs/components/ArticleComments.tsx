"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useSignedIn } from "@/components/layout/SignedIn";
import { useStoredValue } from "@/hooks/useStoredValue";
import { cn } from "@/lib/cn";
import {
  commentSchema,
  commentsKey,
  parseComments,
  sampleComments,
  type BlogComment,
} from "../comments";
import { formatPostDate } from "../data";

/** Every comment a reader sees on a story: the samples, then their own. */
export function useArticleComments(slug: string) {
  const [raw, setRaw] = useStoredValue(commentsKey(slug), "[]");
  const mine = useMemo(() => parseComments(raw), [raw]);
  const all = useMemo(() => [...sampleComments(slug), ...mine], [slug, mine]);
  const add = (comment: BlogComment) =>
    setRaw(JSON.stringify([...mine, comment]));
  const remove = (id: string) =>
    setRaw(JSON.stringify(mine.filter((c) => c.id !== id)));
  return { all, mineIds: new Set(mine.map((c) => c.id)), add, remove };
}

/**
 * The conversation under a story. What a reader writes is kept on this
 * device until the blog has an endpoint, and the form says so.
 */
export function ArticleComments({ slug }: { slug: string }) {
  const person = useSignedIn();
  const { all, mineIds, add, remove } = useArticleComments(slug);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const fieldId = useId();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = commentSchema.safeParse({ body });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the comment");
      return;
    }
    add({
      id: `${slug}-${Date.now()}`,
      author: person.name,
      subfamily: person.subfamily,
      postedAt: new Date().toISOString(),
      body: parsed.data.body,
    });
    setBody("");
    setError("");
    setStatus("Comment posted. It is kept on this device for now.");
  };

  return (
    <section
      id="comments"
      aria-labelledby="comments-title"
      className="border-member-border mt-10 scroll-mt-24 border-t pt-8"
    >
      <h2 id="comments-title" className="text-h4-m md:text-h4 text-member-ink">
        Comments ({all.length})
      </h2>

      {all.length === 0 ? (
        <p className="text-body-sm text-muted mt-4">
          No comments yet. Be the first to add one.
        </p>
      ) : null}
      <ol className="mt-6 space-y-4">
        {all.map((comment) => (
          <li
            key={comment.id}
            className="border-member-border bg-member-panel rounded-md border p-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-body-sm text-member-ink font-semibold">
                {comment.author}
              </span>
              {comment.subfamily ? (
                <span className="text-caption text-muted">
                  {comment.subfamily}
                </span>
              ) : null}
              <time
                dateTime={comment.postedAt}
                className="text-caption text-muted ml-auto"
              >
                {formatPostDate(comment.postedAt.slice(0, 10))}
              </time>
            </div>
            <p className="text-body-sm text-text mt-2 whitespace-pre-line">
              {comment.body}
            </p>
            {mineIds.has(comment.id) ? (
              <button
                type="button"
                onClick={() => {
                  remove(comment.id);
                  setStatus("Comment removed.");
                }}
                className="text-caption text-muted hover:text-danger mt-2 underline-offset-2 hover:underline"
              >
                Delete
              </button>
            ) : null}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate className="mt-8">
        <label
          htmlFor={fieldId}
          className="text-body-sm text-member-ink font-semibold"
        >
          Add a comment as {person.name}
        </label>
        <textarea
          autoComplete="off"
          id={fieldId}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            if (error) setError("");
          }}
          rows={4}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            "border-field-border bg-surface text-body-sm text-text placeholder:text-field-placeholder rounded-field mt-2 block w-full resize-y border p-3",
            error && "border-danger",
          )}
          placeholder="Share a memory or a kind word"
        />
        {error ? (
          <p id={`${fieldId}-error`} className="text-caption text-danger mt-2">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-caption text-muted">
            {status}
          </p>
          <Button type="submit" variant="primary">
            Post comment
          </Button>
        </div>
      </form>
    </section>
  );
}
