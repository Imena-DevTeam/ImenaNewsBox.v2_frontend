import type { ReactNode } from "react";

/**
 * "Featured Moments", "Featured Album": a violet line of type with a short
 * bar under it, centred. The id is the section's own, so each section can
 * be labelled by its heading.
 *
 * Decoration, when a section has any, sits either side of the heading
 * itself — anchored to the words it belongs to rather than floating loose
 * in the page's margins.
 */
export function SectionHeading({
  id,
  children,
  before,
  after,
}: {
  id: string;
  children: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-6">
        {before ? (
          <span aria-hidden className="text-gallery-ornament hidden lg:block">
            {before}
          </span>
        ) : null}
        <h2
          id={id}
          className="text-section-m md:text-section text-member-accent"
        >
          {children}
        </h2>
        {after ? (
          <span aria-hidden className="text-gallery-ornament hidden lg:block">
            {after}
          </span>
        ) : null}
      </div>
      <span
        aria-hidden
        className="bg-member-accent rounded-pill mx-auto mt-7 block h-1.25 w-13"
      />
    </div>
  );
}
