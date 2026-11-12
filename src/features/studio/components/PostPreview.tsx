"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { reading } from "../writing";

/**
 * What the family will see.
 *
 * She writes in a plain textarea and splits paragraphs on blank lines, and
 * until 11 Nov 2026 she published to the whole family without ever seeing
 * the reading face. This is that face, set in the same type the blog sets,
 * from the words that are in the editor right now.
 *
 * It is deliberately not `ArticleDetailView`: that renders a published
 * article with its author, likes, comments and secondary photograph, none of
 * which exist while a post is being written. Showing them would preview a
 * post that is not this one.
 */
export function PostPreview({
  title,
  category,
  excerpt,
  body,
  cover,
  coverAlt,
}: {
  title: string;
  category: string;
  excerpt: string;
  body: string;
  /** An object URL for a chosen file, or the post's own cover. */
  cover?: string | StaticImageData;
  coverAlt?: string;
}) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const counted = reading(body);

  return (
    <article className="min-w-0">
      <p className="text-caption text-brand font-semibold tracking-[0.16em] uppercase">
        {category}
      </p>

      <h1 className="text-h2-m md:text-h2 text-member-ink mt-3 text-balance">
        {title || "Untitled"}
      </h1>

      <p className="text-caption text-muted mt-3">
        {counted.minutes > 0
          ? `${counted.minutes} min read`
          : "Nothing to read yet"}
      </p>

      {cover ? (
        <Image
          src={cover}
          alt={coverAlt ?? ""}
          width={960}
          height={540}
          /* A chosen file has no intrinsic size, so the height is set here
             and the optimiser is left out of it. */
          unoptimized={typeof cover === "string"}
          className="mt-6 h-64 w-full rounded-lg object-cover md:h-80"
        />
      ) : (
        <p className="border-member-border bg-member-panel text-body-sm text-muted mt-6 rounded-lg border border-dashed px-5 py-10 text-center">
          No cover photograph yet. The archive and the family&rsquo;s blog both
          lead with one.
        </p>
      )}

      {excerpt ? (
        <p className="text-body text-member-ink mt-6 max-w-prose font-medium italic">
          {excerpt}
        </p>
      ) : null}

      {paragraphs.length > 0 ? (
        <div className="mt-6 flex max-w-prose flex-col gap-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-body text-text leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-body text-muted mt-6">
          Nothing written yet. A blank line starts a new paragraph.
        </p>
      )}
    </article>
  );
}
