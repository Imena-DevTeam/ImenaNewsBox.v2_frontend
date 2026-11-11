import type { ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * The two bands of /admin — what is waiting, and what has been done — side
 * by side on a wide screen, stacked below 768px.
 *
 * A plain grid: the two cards end level with each other, sized by their
 * content, with no scrollbar inside either.
 *
 * `items-stretch` is what levels the pair: both cards take the height of the
 * taller, and each one's list fills it.
 */
export interface Band {
  id: string;
  heading: string;
  /** Read beside the heading — "3 waiting", not a label. */
  note?: string;
  body: ReactNode;
}

export function AdminBoard({ bands }: { bands: Band[] }) {
  return (
    <Stagger
      as="ul"
      onMount
      stagger={0.08}
      className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
    >
      {bands.map((band) => (
        <StaggerItem
          key={band.id}
          as="li"
          distance={16}
          className="border-member-border bg-member-panel flex min-w-0 flex-col overflow-hidden rounded-md border"
        >
          <div className="border-member-border flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-3.5">
            <h2 className="text-h3-m text-member-ink">{band.heading}</h2>
            {band.note ? (
              <p className="text-caption text-muted tracking-[0.14em] uppercase">
                {band.note}
              </p>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">{band.body}</div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
