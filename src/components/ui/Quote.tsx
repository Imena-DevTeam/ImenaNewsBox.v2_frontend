import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const SIZE = {
  sm: "text-body",
  md: "text-body-lg",
  lg: "text-h3-m md:text-h2",
} as const;

/**
 * Every motto, saying and quote on the site, drawn one way: the serif face in
 * italics, inside curly quotation marks, with its English sense underneath
 * when it has one and who said it under that. Mottos and quotes used to come
 * in five styles (gold, ink, plain, with a rule, without), which made the
 * family's words look like they came from different places.
 */
export function Quote({
  children,
  meaning,
  cite,
  size = "sm",
  align = "left",
  tone = "ink",
  className,
}: {
  children: ReactNode;
  /** The English sense of a Kinyarwanda line. */
  meaning?: ReactNode;
  /** Who said it, or where it comes from. */
  cite?: ReactNode;
  size?: keyof typeof SIZE;
  align?: "left" | "center";
  /** `light` on a photograph or a dark band. */
  tone?: "ink" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <figure
      className={cn(
        align === "center" ? "text-center" : "text-left",
        align === "left" && "border-brand border-l-2 pl-4",
        light && align === "left" && "border-surface/60",
        className,
      )}
    >
      <blockquote
        className={cn(
          "font-member-serif text-balance italic",
          SIZE[size],
          light ? "text-surface" : "text-member-ink",
        )}
      >
        &ldquo;{children}&rdquo;
      </blockquote>
      {meaning || cite ? (
        <figcaption
          className={cn(
            "text-body-sm mt-1.5",
            light ? "text-surface/75" : "text-muted",
          )}
        >
          {meaning}
          {cite ? (
            <span className={cn("text-caption block", meaning && "mt-1")}>
              {cite}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
