import { z } from "zod";

export interface BlogComment {
  id: string;
  author: string;
  subfamily?: string;
  /** ISO. */
  postedAt: string;
  body: string;
}

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(2, "Write a few words first")
    .max(1000, "Keep it under 1,000 characters"),
});

/** Where this device keeps the comments written on it, per story. */
export function commentsKey(slug: string): string {
  return `imena.blog.comments.${slug}`;
}

export function parseComments(raw: string): BlogComment[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? (value as BlogComment[]) : [];
  } catch {
    return [];
  }
}

const POOL: Omit<BlogComment, "id" | "postedAt">[] = [
  {
    author: "Muheto",
    subfamily: "Wihogora",
    body: "Reading this took me straight back to that afternoon. Thank you for writing it down.",
  },
  {
    author: "Bigwi",
    subfamily: "Light",
    body: "The photographs are lovely. Could we have the rest of them in the gallery?",
  },
  {
    author: "Shema",
    subfamily: "Hope",
    body: "This is exactly why we keep these stories. The younger ones need to read it.",
  },
  {
    author: "Ngabe",
    subfamily: "Wihogora",
    body: "So proud of everyone who made this happen.",
  },
];

/**
 * Sample comments, the same for a story on every visit: two or three from
 * the pool, chosen by the slug so different stories read differently.
 *
 * TODO: the blog service, once comments have an endpoint.
 */
export function sampleComments(slug: string): BlogComment[] {
  const seed = [...slug].reduce((n, c) => n + c.charCodeAt(0), 0);
  const count = 2 + (seed % 2);
  return Array.from({ length: count }, (_, i) => {
    const pick = POOL[(seed + i) % POOL.length]!;
    return {
      ...pick,
      id: `${slug}-sample-${i}`,
      postedAt: new Date(Date.UTC(2026, 4, 2 + i * 3, 9)).toISOString(),
    };
  });
}
