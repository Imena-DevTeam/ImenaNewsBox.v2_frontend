import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import type { FeaturedPost as FeaturedPostData } from "../data";

/**
 * The article card the dashboard opens with. Two presentations of the same
 * record, because they are read differently:
 *
 *   default  the lead card — the cover across the top, then the story,
 *            with the counts and the violet action closing it in one row.
 *   compact  one card of several in the search grid. The whole card is the
 *            link — a grid of "View Blog" buttons is a wall of identical
 *            calls to attention, so here the card itself travels and the
 *            counts stay as quiet labels.
 *
 * Counts and the cover are the sample's own until the blog API arrives.
 */
export function FeaturedPost({
  post,
  className,
  compact = false,
}: {
  post: FeaturedPostData;
  className?: string;
  compact?: boolean;
}) {
  const meta = (
    <p className="text-caption text-brand">
      {post.tag.toUpperCase()}
      <span className="text-muted"> · {post.minutes} min read</span>
    </p>
  );

  const counts = (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-pill bg-member-tint text-body-sm flex items-center gap-2 px-4 py-2 font-semibold">
        <Heart aria-hidden className="text-member-heart size-4" />
        {post.likes}
        <span className="sr-only">family reactions</span>
      </span>

      <span className="rounded-pill bg-member-tint text-body-sm flex items-center gap-2 px-4 py-2 font-semibold">
        <MessageCircle aria-hidden className="text-brand size-4" />
        {post.comments}
        <span className="sr-only">family comments</span>
      </span>
    </div>
  );

  const cover = (
    <div className="relative aspect-16/9">
      <Image
        src={post.cover}
        alt={post.coverAlt}
        placeholder="blur"
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  if (compact) {
    return (
      <Link
        href={`${ROUTES.BLOGS}/${post.slug}`}
        className={cn(
          "border-member-border bg-surface shadow-member lift hover:border-brand flex flex-col overflow-hidden rounded-lg border",
          className,
        )}
      >
        {/* Cover first, so the photograph belongs to the card it heads
            rather than hanging off the foot of the text. */}
        <div className="relative aspect-16/9">
          <Image
            src={post.cover}
            alt=""
            placeholder="blur"
            fill
            sizes="(min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {meta}
          <h3 className="font-member-serif text-h4-m text-member-ink md:text-h4 mt-3">
            {post.title}
          </h3>
          <p className="text-body-sm text-muted mt-3 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-auto pt-5">{counts}</div>
        </div>
      </Link>
    );
  }

  return (
    <article
      aria-label={post.title}
      className={cn(
        "border-member-border bg-surface shadow-member overflow-hidden rounded-lg border",
        className,
      )}
    >
      {cover}

      <div className="p-5 sm:p-6 md:p-8">
        {meta}

        <h3 className="font-member-serif text-h3-m text-member-ink md:text-h2 mt-4">
          {post.title}
        </h3>

        <p className="text-body-sm text-muted mt-4">{post.excerpt}</p>

        {/* The action closes the card with the counts, rather than floating
            beside the title over an empty column. */}
        <div className="border-member-border mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          {counts}
          <ButtonLink
            href={`${ROUTES.BLOGS}/${post.slug}`}
            variant="brand"
            className="rounded-field"
          >
            View Blog
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
