"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { HierarchyRole, PromotionRecord, TreePerson } from "../types";

/* The three families, each a father and a mother side by side. */
const FAMILIES: [HierarchyRole, HierarchyRole][] = [
  ["pere_light", "mere_light"],
  ["pere_wihogora", "mere_wihogora"],
  ["pere_hope", "mere_hope"],
];

/* Sanity originals run to several thousand pixels and the image optimiser
   gives up on them; ask the CDN for a small square crop from the top. */
function portrait(src: TreePerson["image"]) {
  return typeof src === "string" && src.startsWith("https://cdn.sanity.io/")
    ? `${src}?w=320&h=320&fit=crop&crop=top`
    : src;
}

/** A short vertical line from one tier down to the next. */
function Drop() {
  return (
    <div aria-hidden className="border-tree-line mx-auto h-7 w-0 border-l-2" />
  );
}

/**
 * One person: a round portrait on a warm disc, half resting on a small white
 * card with their name under a hairline and their title beneath it. The whole
 * card opens their story.
 */
function PersonNode({
  person,
  onOpen,
}: {
  person: TreePerson;
  onOpen: (person: TreePerson) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(person)}
      aria-label={`View the story of ${person.name}, ${person.roleLabel}`}
      className="group focus-visible:outline-brand flex w-28 flex-col items-center rounded-md"
    >
      <span className="bg-tree-portrait ring-surface relative z-10 size-20 overflow-hidden rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-4 transition-transform duration-200 group-hover:scale-105">
        <Image
          src={portrait(person.image)}
          alt=""
          fill
          sizes="5rem"
          className="object-cover object-top"
        />
      </span>
      <span className="bg-surface -mt-10 flex w-full flex-1 flex-col items-center rounded-md px-2 pt-12 pb-3 shadow-[0_2px_10px_rgba(0,0,0,0.07)] transition-shadow duration-200 group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
        <span className="text-caption text-tree-label w-full border-t border-black/10 pt-2 text-center leading-snug font-semibold">
          {person.name}
        </span>
        <span className="text-caption text-muted mt-1 text-center font-normal">
          {person.roleLabel}
        </span>
      </span>
    </button>
  );
}

/** Two people who lead together, their cards set edge to edge like a couple. */
function Pair({
  people,
  onOpen,
}: {
  people: (TreePerson | undefined)[];
  onOpen: (person: TreePerson) => void;
}) {
  const present = people.filter((p): p is TreePerson => Boolean(p));
  if (present.length === 0) return null;
  return (
    <div className="flex items-stretch justify-center">
      {present.map((person) => (
        <PersonNode key={person.id} person={person} onOpen={onOpen} />
      ))}
    </div>
  );
}

/**
 * A promotion drawn as a family tree chart: the two elders at the top, the
 * coordinator and vice coordinator beneath them, then a bar that splits out
 * to the three families, a father and a mother each.
 *
 * The chart keeps its shape at every width; on a narrow screen it scrolls
 * sideways inside its own panel rather than stacking.
 */
export function TreeHierarchyGrid({
  promotion,
  onOpen,
}: {
  promotion: PromotionRecord;
  onOpen: (person: TreePerson) => void;
}) {
  const byRole = new Map(promotion.members.map((p) => [p.role, p]));
  const scroller = useRef<HTMLDivElement>(null);

  /* When the chart is wider than the screen, open it on its middle so the
     elders are in view rather than the first family. */
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [promotion]);

  return (
    <div ref={scroller} className="bg-tree-chart overflow-x-auto rounded-3xl">
      <div className="mx-auto w-max px-6 py-10 md:px-12 md:py-14">
        <Pair
          people={[byRole.get("grand_pere"), byRole.get("grand_mere")]}
          onOpen={onOpen}
        />
        <Drop />
        <Pair
          people={[byRole.get("coordinator"), byRole.get("vice_coordinator")]}
          onOpen={onOpen}
        />
        <Drop />

        <ul className="flex justify-center">
          {FAMILIES.map(([pere, mere]) => (
            <li
              key={pere}
              className={cn(
                "relative px-5 pt-7 md:px-8",
                /* the stub down to this family */
                "before:border-tree-line before:absolute before:top-0 before:left-1/2 before:h-7 before:-translate-x-1/2 before:border-l-2",
                /* its share of the bar that joins the families */
                "after:border-tree-line after:absolute after:top-0 after:right-0 after:left-0 after:border-t-2",
                /* the outer families turn down off the bar on a curve */
                "first:before:hidden first:after:left-1/2 first:after:-ml-px first:after:h-7 first:after:rounded-tl-2xl first:after:border-l-2",
                "last:before:hidden last:after:right-1/2 last:after:-mr-px last:after:h-7 last:after:rounded-tr-2xl last:after:border-r-2",
              )}
            >
              <Pair
                people={[byRole.get(pere), byRole.get(mere)]}
                onOpen={onOpen}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
