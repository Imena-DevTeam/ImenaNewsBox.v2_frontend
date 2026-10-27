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
 *   default  the lead card — story on the left, the violet action on the
 *            right, the cover photograph running to the card's foot beneath
 *            both, as the design draws it.
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
    <div className="relative aspect-16/9 md:aspect-3/2">
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
          "border-member-border bg-surface shadow-member lift hover:border-brand overflow-hidden rounded-lg border",
          className,
        )}
      >
        <div className="p-5 sm:p-6">
          {meta}
          <h3 className="font-member-serif text-h4-m text-member-ink md:text-h3 mt-3">
            {post.title}
          </h3>
          <p className="text-body-sm text-muted mt-3 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-5">{counts}</div>
        </div>
        {/* The grid's cover is shorter than the lead card's, so a row of
            three cards lands on one baseline instead of staggered feet. */}
        <div className="relative aspect-4/3">
          <Image
            src={post.cover}
            alt=""
            placeholder="blur"
            fill
            sizes="(min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
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
      <div className="grid items-start gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
        <div>
          {meta}

          <h3 className="font-member-serif text-h3-m text-member-ink md:text-h2 mt-4">
            {post.title}
          </h3>

          <p className="text-body-sm text-muted mt-4">{post.excerpt}</p>

          <div className="mt-6">{counts}</div>
        </div>

        {/* The design's action sits alone on the right, full height. */}
        <ButtonLink
          href={`${ROUTES.BLOGS}/${post.slug}`}
          variant="brand"
          size="lg"
          className="rounded-field w-full md:w-max md:px-12"
        >
          View Blog
        </ButtonLink>
      </div>

      {cover}
    </article>
  );
}
