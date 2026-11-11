import { z } from "zod";
import { BLOG_CATEGORIES } from "@/features/blogs/data";

/* What the blogger writes and arranges. These lived in features/admin until
   11 Nov 2026, when the studio took the work they validate. */

/** Create Album. The photographs themselves are handled by the dropzone. */
export const albumSchema = z.object({
  title: z.string().trim().min(1, "The album needs a title"),
  /* Somewhere and sometime, because an album nobody can place is hard to
     find again once there are fifty of them. */
  place: z.string().trim().min(1, "Where were these taken?"),
  takenOn: z.string().min(1, "When were these taken?"),
  description: z
    .string()
    .trim()
    .max(300, "Keep the description under 300 characters")
    .optional()
    .or(z.literal("")),
});

export type AlbumValues = z.infer<typeof albumSchema>;

const POST_CATEGORIES = BLOG_CATEGORIES.filter(
  (category) => category !== "All",
) as [string, ...string[]];

/** Write or edit a post. The body is plain paragraphs, split on blank lines. */
export const postSchema = z.object({
  title: z.string().trim().min(1, "The post needs a title"),
  category: z.enum(POST_CATEGORIES, { message: "Choose a category" }),
  excerpt: z
    .string()
    .trim()
    .min(1, "Write a sentence for the card and the preview")
    .max(240, "Keep the excerpt under 240 characters"),
  body: z.string().trim().min(1, "The post needs something to say"),
  /* Empty means now. A date is not validated against today: a family story
     written up three weeks late is dated when it happened. */
  publishOn: z.string(),
});

export type PostValues = z.infer<typeof postSchema>;
