import type { StaticImageData } from "next/image";
import type { BlogCategory } from "./data";

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  subfamily: string;
  avatar: StaticImageData;
}

/**
 * One article, ready to read. `coverImage` is optional on purpose: a story
 * with no photograph shows the family crest in its place, so the page never
 * opens on an empty grey box.
 */
export interface BlogArticleDetail {
  slug: string;
  title: string;
  category: Exclude<BlogCategory, "All">;
  /** The small pill above the story, in the singular ("Activity"). */
  tag: string;
  publishedAt: string;
  readMinutes: number;
  author: BlogAuthor;
  coverImage?: StaticImageData;
  coverAlt: string;
  /** The lead: one editorial sentence that sets the story up. */
  excerpt: string;
  contentParagraphs: string[];
  secondaryImage: StaticImageData;
  secondaryImageAlt: string;
  secondaryImageCaption: string;
  /** How many paragraphs are read before the photograph appears. */
  secondaryImageAfter: number;
  likes: number;
  commentsCount: number;
}
