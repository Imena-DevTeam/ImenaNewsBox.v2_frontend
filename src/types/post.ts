import type { RemoteImage } from "@/types/media";

/**
 * A story, as the API sends it.
 *
 * Note what is **not** here: `cover` is a `RemoteImage` rather than the
 * `StaticImageData` the fixtures use, and `likes`/`comments` are counts the
 * server owns rather than numbers written into a file. See `types/media.ts`
 * for why that distinction matters to `next/image`.
 */
export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** The body, paragraphs separated by blank lines — what the editor writes. */
  body: string;
  category: string;
  tag: string;
  status: PostStatus;
  /** ISO. For a draft this is when it was started. */
  publishedOn: string;
  /** Set when publication is scheduled rather than immediate. */
  publishOn?: string;
  cover?: RemoteImage;
  readingMinutes: number;
  likes: number;
  comments: number;
  authorId?: string;
}

/** What the editor sends to create or correct one. */
export interface PostInput {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  status: PostStatus;
  publishOn?: string;
  /** An id returned by the upload endpoint, not the file itself. */
  coverId?: string;
}
