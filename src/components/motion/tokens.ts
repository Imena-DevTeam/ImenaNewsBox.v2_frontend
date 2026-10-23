/**
 * Motion tokens for JavaScript-driven animation. They mirror the CSS tokens
 * in src/styles/globals.css, so a Motion entrance and a CSS hover move with
 * the same character.
 */

/* --ease-out-soft: quick off the mark, a long settle at the end. */
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  /* Large reveals: the hero, section headings, photographs. */
  cinematic: 0.9,
} as const;

/* How far an element travels on its way in. Far enough to read as movement,
   short enough that nothing seems to fly across the page. */
export const DISTANCE = 40;

/* The side an element enters from. */
export type From = "bottom" | "top" | "left" | "right" | "none";

export function offset(from: From, distance: number = DISTANCE) {
  switch (from) {
    case "bottom":
      return { x: 0, y: distance };
    case "top":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

/* Shared viewport settings: play once, when a fifth of the element shows. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;
