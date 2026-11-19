"use client";

import Image from "next/image";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import { useStoredValue } from "@/hooks/useStoredValue";
import { cn } from "@/lib/cn";
import type { BlogArticleDetail } from "../types";
import { useArticleComments } from "./ArticleComments";

const BUTTON =
  "rounded-pill text-caption transition-fast focus-visible:outline-brand inline-flex items-center gap-1.5 px-3 py-2";
const IDLE = "bg-member-tint text-muted hover:bg-brand/15";

/**
 * Who wrote it and when, and what a reader can do about it: like, save,
 * comment, share. Likes, saves and comments are kept on this device until
 * the blog API exists.
 */
export function ArticleAuthorBar({ article }: { article: BlogArticleDetail }) {
  const { author, slug, title } = article;
  const [liked, setLiked] = useStoredValue(`imena.blog.liked.${slug}`, "0");
  const [saved, setSaved] = useStoredValue(`imena.blog.saved.${slug}`, "0");
  const { all: comments } = useArticleComments(slug);
  const toast = useToast();
  const tell = (message: string) => toast({ message });

  const share = async () => {
    const url = window.location.href;
    /* A phone has a share sheet worth opening. On a desktop browser a
       copied link is the better answer. */
    if (
      typeof navigator.share === "function" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      tell("Link copied");
    } catch {
      tell("Could not copy the link. Copy it from the address bar.");
    }
  };

  const isLiked = liked === "1";
  const isSaved = saved === "1";
  const likes = article.likes + (isLiked ? 1 : 0);

  return (
    <div className="border-member-border mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
      <div className="flex items-center gap-3">
        <Image
          src={author.avatar}
          alt={`Portrait of ${author.name}`}
          width={48}
          height={48}
          className="border-brand/20 size-12 rounded-full border object-cover object-top shadow-xs"
        />
        <div>
          <p className="text-body-sm text-member-ink flex flex-wrap items-center gap-2 font-bold tracking-wide uppercase">
            {author.name}
            <span className="bg-member-tint text-caption text-brand rounded-pill px-2.5 py-0.5 font-medium tracking-normal normal-case">
              {author.subfamily}
            </span>
          </p>
          <p className="text-caption text-muted mt-0.5">
            {article.publishedAt} &bull; {article.readMinutes} min read
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={isLiked}
          aria-label={`Like this story, ${likes} likes`}
          onClick={() => setLiked(isLiked ? "0" : "1")}
          className={cn(
            BUTTON,
            isLiked ? "bg-member-heart/15 text-member-ink" : IDLE,
          )}
        >
          <Heart
            aria-hidden
            className={cn(
              "text-member-heart size-4",
              isLiked && "fill-member-heart",
            )}
          />
          {likes}
        </button>

        <a
          href="#comments"
          aria-label={`${comments.length} comments, go to the comments`}
          className={cn(BUTTON, IDLE)}
        >
          <MessageCircle aria-hidden className="text-brand size-4" />
          {comments.length}
        </a>

        <button
          type="button"
          aria-pressed={isSaved}
          onClick={() => setSaved(isSaved ? "0" : "1")}
          className={cn(BUTTON, isSaved ? "bg-brand/15 text-brand" : IDLE)}
        >
          <Bookmark
            aria-hidden
            className={cn("size-4", isSaved && "fill-brand")}
          />
          {isSaved ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={share}
          aria-label="Share this story"
          className={cn(BUTTON, IDLE)}
        >
          <Share2 aria-hidden className="size-4" />
          Share
        </button>
      </div>
    </div>
  );
}
