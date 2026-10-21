import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* Every font-size token in src/styles/globals.css.
   tailwind-merge only knows Tailwind's stock scale, so without this it reads
   a custom size such as text-h1 as a text *colour* and drops any real colour
   merged alongside it — cn("text-primary", "text-h1") would silently come out
   black. Add new --text-* tokens here when you add them to globals.css. */
const FONT_SIZES = [
  "display",
  "display-light",
  "display-light-m",
  "display-m",
  "h1",
  "h2",
  "h3",
  "h4",
  "h1-m",
  "h2-m",
  "h3-m",
  "h4-m",
  "body-lg",
  "body",
  "body-sm",
  "ui",
  "caption",
  "auth-title",
  "auth-display",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": FONT_SIZES.map((size) => `text-${size}`),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
