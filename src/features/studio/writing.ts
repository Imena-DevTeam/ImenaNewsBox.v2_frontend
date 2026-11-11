/** Words a minute, the figure the archive's "6 min read" is built on. */
const PACE = 200;

export interface Reading {
  words: number;
  minutes: number;
  paragraphs: number;
}

/**
 * What the writer has so far: words, paragraphs, and the reading time the
 * post will carry once it is published.
 *
 * The archive already shows "6 min read" against every entry, so showing it
 * while the post is being written closes the loop — the figure is not a new
 * invention, it is the one the reader will see.
 *
 * Paragraphs are split on blank lines, the same rule the blog renderer uses,
 * so the count here matches what will actually be rendered.
 */
export function reading(body: string): Reading {
  const text = body.trim();
  if (!text) return { words: 0, minutes: 0, paragraphs: 0 };

  const words = text.split(/\s+/).length;

  return {
    words,
    minutes: Math.max(1, Math.round(words / PACE)),
    paragraphs: text.split(/\n\s*\n/).filter((block) => block.trim()).length,
  };
}
