import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, MessageCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";
import type { BlogPagePost } from "../data";

export function BlogCard({ post }: { post: BlogPagePost }) {
  return (
    <article className="border-member-border bg-surface shadow-member overflow-hidden rounded-lg border">
      <Link
        href={`${ROUTES.BLOGS}/${post.slug}`}
        className="group focus-visible:outline-brand block"
      >
        <div className="relative aspect-[1.8] overflow-hidden">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-caption text-surface absolute bottom-3 left-3 flex items-center gap-1 drop-shadow-sm">
            <CalendarDays aria-hidden className="size-3" />
            {post.date}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-caption text-brand flex items-center gap-2 font-bold tracking-wide uppercase">
            {post.tag}
            <span className="text-muted normal-case">
              · {post.minutes} min read
            </span>
          </p>
          <h3 className="font-member-serif text-member-ink mt-3 text-xl leading-tight font-bold">
            {post.title}
          </h3>
          <p className="text-body-sm text-muted mt-3 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <span className="rounded-pill bg-member-tint text-caption text-muted flex items-center gap-1.5 px-2.5 py-1">
                <Heart aria-hidden className="text-member-heart size-3.5" />
                {post.likes}
              </span>
              <span className="rounded-pill bg-member-tint text-caption text-muted flex items-center gap-1.5 px-2.5 py-1">
                <MessageCircle aria-hidden className="text-brand size-3.5" />
                {post.comments}
              </span>
            </div>
            <span className={cn("text-caption text-primary font-bold")}>
              Read Full ›
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
