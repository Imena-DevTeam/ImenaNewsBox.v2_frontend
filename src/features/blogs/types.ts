import type { ImageSource } from "@/types/media";
import type { BlogCategory } from "./data";

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  subfamily: string;
  avatar: ImageSource;
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
  coverImage?: ImageSource;
  coverAlt: string;
  /** The lead: one editorial sentence that sets the story up. */
  excerpt: string;
  contentParagraphs: string[];
  secondaryImage: ImageSource;
  secondaryImageAlt: string;
  secondaryImageCaption: string;
  /** How many paragraphs are read before the photograph appears. */
  secondaryImageAfter: number;
  likes: number;
  commentsCount: number;
}
