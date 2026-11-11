"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Folder, Heart, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CONTROL, Picker } from "@/components/ui/Picker";
import { ROUTES } from "@/constants/routes";
import { BLOG_CATEGORIES, type BlogPagePost } from "@/features/blogs/data";
import { cn } from "@/lib/cn";
import { entryDay } from "../archive";

type Order = "newest" | "oldest";
type Bulk = "publish" | "unpublish" | "delete";

/**
 * The family's written record, newest first, one card to an entry.
 *
 * This was a six-column table. The columns that carried no comparison are
 * gone: the date is the card's own left edge, and only the unfinished posts
 * are marked, because a published post is the norm and marking the norm is
 * noise — ten badges became three.
 *
 * The order is chronological either way round. There is no sort by title:
 * search finds a post by name, and the archive's own order is time.
 *
 * Search, both filters, bulk actions and the confirmation all stay.
 */

export function PostsArchive({ posts }: { posts: BlogPagePost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [order, setOrder] = useState<Order>("newest");
  const [picked, setPicked] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const kept = posts.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      if (status !== "all" && post.status !== status) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle)
      );
    });

    return [...kept].sort((a, b) => {
      const run = a.publishedOn.localeCompare(b.publishedOn);
      return order === "newest" ? -run : run;
    });
  }, [posts, query, category, status, order]);

  /* A post filtered out of view cannot stay selected, or a bulk action
     would reach posts the reader can no longer see. */
  const chosen = picked.filter((slug) =>
    shown.some((post) => post.slug === slug),
  );
  const allShown = shown.length > 0 && chosen.length === shown.length;

  const toggle = (slug: string) =>
    setPicked((was) =>
      was.includes(slug) ? was.filter((it) => it !== slug) : [...was, slug],
    );

  const apply = (what: Bulk) => {
    /* TODO: the posts service. Until it exists this reports what it would
       have done rather than pretending a change was saved. */
    const count = `${chosen.length} post${chosen.length === 1 ? "" : "s"}`;
    const verb = what === "delete" ? "deleted" : `${what}ed`;
    setOutcome(
      `${count} would be ${verb}. Nothing was saved: the posts service does not exist yet.`,
    );
    setPicked([]);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* The search takes its own line and the pickers sit under it. Five
          controls in one wrapping row left a single picker stranded on a line
          of its own at most widths. */}
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="posts-search" className="sr-only">
            Search posts
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
            />
            <input
              id="posts-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or excerpt"
              className={cn(CONTROL, "w-full pl-11")}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Picker
            id="posts-category"
            label="Filter by category"
            value={category}
            onChange={setCategory}
          >
            {BLOG_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All categories" : option}
              </option>
            ))}
          </Picker>

          <Picker
            id="posts-status"
            label="Filter by status"
            value={status}
            onChange={(next) => setStatus(next as typeof status)}
          >
            <option value="all">Any status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Picker>

          <Picker
            id="posts-order"
            label="Order posts"
            value={order}
            onChange={(next) => setOrder(next as Order)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Picker>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-body-sm text-muted">
          {shown.length} of {posts.length} posts
        </p>
        {shown.length > 0 ? (
          <label className="text-body-sm text-muted hover:text-member-ink transition-fast flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={allShown}
              onChange={() =>
                setPicked(allShown ? [] : shown.map((post) => post.slug))
              }
              className="accent-brand size-4"
            />
            Select all shown
          </label>
        ) : null}
      </div>

      {/* The verbs appear with a selection and not before, so the bar never
          offers an action that would apply to nothing. */}
      {chosen.length > 0 ? (
        <div className="border-member-border bg-member-tint motion-safe:animate-dialog-pop flex flex-wrap items-center gap-3 rounded-md border px-4 py-3">
          <p className="text-body-sm text-member-ink flex-1 font-medium">
            {chosen.length} selected
          </p>
          <Button variant="outline" size="sm" onClick={() => apply("publish")}>
            Publish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => apply("unpublish")}
          >
            Unpublish
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-danger text-danger"
            onClick={() => setConfirming(true)}
          >
            Delete
          </Button>
        </div>
      ) : null}

      {outcome ? (
        <p role="status" aria-live="polite" className="text-body-sm text-muted">
          {outcome}
        </p>
      ) : null}

      {shown.length === 0 ? (
        <div className="border-member-border bg-member-panel rounded-md border">
          <EmptyState
            title="No posts match that."
            description="Try a different search, or clear the filters."
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((post) => {
            const { day, month } = entryDay(post.publishedOn);
            const draft = post.status === "draft";

            return (
              <li
                key={post.slug}
                className={cn(
                  "border-member-border bg-surface transition-fast rounded-md border",
                  "hover:border-brand",
                  picked.includes(post.slug) && "border-brand bg-member-tint",
                )}
              >
                <div className="flex items-center gap-4 p-4">
                  <label
                    className="flex cursor-pointer items-center"
                    aria-label={`Select ${post.title}`}
                  >
                    <input
                      type="checkbox"
                      checked={picked.includes(post.slug)}
                      onChange={() => toggle(post.slug)}
                      className="accent-brand size-4"
                    />
                  </label>

                  <p className="w-10 shrink-0 text-center leading-tight">
                    <span className="text-h3-m text-member-ink block font-bold tabular-nums">
                      {day}
                    </span>
                    <span className="text-caption text-muted block tracking-[0.14em] uppercase">
                      {month}
                    </span>
                  </p>

                  <div className="border-member-border min-w-0 flex-1 self-stretch border-l pl-5">
                    {/* The title opens the post for correction rather than
                        leaving the admin area for the public page: this is
                        the archive's own tool, and "read it" is the small
                        link below. */}
                    <Link
                      href={`${ROUTES.STUDIO_POSTS}/${post.slug}/edit`}
                      className="focus-visible:outline-brand group"
                    >
                      <span className="text-h4-m text-member-ink group-hover:text-brand transition-fast block text-balance">
                        {post.title}
                      </span>
                    </Link>

                    <p className="text-body-sm text-muted mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <span className="flex items-center gap-1.5">
                        <Folder aria-hidden className="size-4" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock aria-hidden className="size-4" />
                        {post.minutes} min read
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart aria-hidden className="size-4" />
                        {post.likes}
                        <span className="sr-only">likes</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle aria-hidden className="size-4" />
                        {post.comments}
                        <span className="sr-only">comments</span>
                      </span>
                      {draft ? (
                        <span className="text-caption bg-member-tint text-brand rounded-full px-2.5 py-1 font-semibold">
                          Draft
                        </span>
                      ) : null}
                      <Link
                        href={`${ROUTES.BLOGS}/${post.slug}`}
                        className="text-caption text-brand hover:text-brand-hover focus-visible:outline-brand font-semibold"
                      >
                        Read it
                        <span className="sr-only"> on the family blog</span>
                      </Link>
                    </p>
                  </div>

                  <Image
                    src={post.cover}
                    alt=""
                    width={80}
                    height={80}
                    className={cn(
                      "hidden size-20 shrink-0 rounded-md object-cover sm:block",
                      draft && "opacity-60",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirming}
        destructive
        title={`Delete ${chosen.length} post${chosen.length === 1 ? "" : "s"}?`}
        description="Deleting a post removes it from the family archive. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep them"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          apply("delete");
        }}
      />
    </div>
  );
}
