import type { ReactNode } from "react";

/**
 * "Featured Videos", "Featured Album": a violet line of type with a short
 * bar under it, centred. The id is the section's own, so each section can
 * be labelled by its heading.
 */
export function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="text-center">
      <h2 id={id} className="text-section-m md:text-section text-member-accent">
        {children}
      </h2>
      <span
        aria-hidden
        className="bg-member-accent rounded-pill mx-auto mt-7 block h-1.25 w-13"
      />
    </div>
  );
}
