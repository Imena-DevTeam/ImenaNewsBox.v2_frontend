import type { Subfamily } from "../data";

/**
 * The branch's motto, given the room the design gives a quote: the serif
 * face, the gold the celebrations use, and its English sense underneath so
 * the Kinyarwanda is never the only way in.
 */
export function SloganCallout({ family }: { family: Subfamily }) {
  return (
    <figure className="border-member-border bg-member-panel rounded-lg border px-5 py-8 text-center md:px-8 md:py-10">
      <blockquote>
        <p className="font-member-serif text-h3-m md:text-h2 text-celebration-gold italic">
          &ldquo;{family.motto}&rdquo;
        </p>
      </blockquote>
      <figcaption className="text-body text-member-ink mt-3">
        {family.mottoMeaning}
        <span className="text-caption text-muted mt-1 block">
          The {family.name} motto, kept since {family.founded}
        </span>
      </figcaption>
    </figure>
  );
}
