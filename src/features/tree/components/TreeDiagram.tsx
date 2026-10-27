"use client";

import {
  HeartsOrnament,
  HouseHeartOrnament,
  SunOrnament,
  TreeOrnament,
} from "@/components/ui/Ornaments";
import {
  BRANCH_EDGES,
  DIAGRAM,
  HOUSEHOLDS,
  TREE_BRANCHES,
  type Person,
} from "@/features/tree/data";
import { cn } from "@/lib/cn";

/**
 * The tree itself.
 *
 * One SVG rather than positioned markup, so the branches can be real curves
 * and the whole thing scales as a piece. Every circle is a person and every
 * card the household they belong to.
 *
 * Hidden from assistive technology: the same people are listed, in order and
 * properly nested, in the panel beside it, which is a far better thing to
 * navigate with a screen reader than thirteen absolutely positioned circles.
 */
export function TreeDiagram({
  selectedId,
  onSelect,
  litHouseholds,
  matches,
  dimOthers,
}: {
  selectedId: string | null;
  onSelect: (person: Person | null) => void;
  /** Households on the path from the selection back to the first generation. */
  litHouseholds: Set<string>;
  /** People matching the current search. */
  matches: Set<string>;
  dimOthers: boolean;
}) {
  return (
    <div className="tree-timeline relative">
      <SunOrnament className="absolute top-6 left-2 size-20 md:size-28" />
      <HouseHeartOrnament className="absolute top-[42%] left-2 hidden size-20 md:block md:size-28" />
      <TreeOrnament className="absolute right-2 bottom-28 hidden size-24 md:block md:size-32" />
      <HeartsOrnament className="absolute bottom-2 left-4 hidden w-20 md:block md:w-28" />

      <svg
        viewBox={`0 0 ${DIAGRAM.width} ${DIAGRAM.height}`}
        className="mx-auto block w-full max-w-5xl px-4"
        aria-hidden
        focusable="false"
      >
        <defs>
          {/* The card lift. A real shadow rather than a flat fill is most of
              what separates this from a wireframe. */}
          <filter
            id="tree-card-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="10"
              floodColor="#0d1aba"
              floodOpacity="0.10"
            />
          </filter>

          {HOUSEHOLDS.flatMap((h) =>
            h.people.map((p) => (
              <clipPath key={p.id} id={`clip-${p.id}`}>
                <circle cx={p.node.cx} cy={p.node.cy} r={p.node.r} />
              </clipPath>
            )),
          )}
        </defs>

        {/* Branches. Drawn first so the portraits sit over them. */}
        {/* stroke="currentColor" is what lets the colour classes below paint
            the strokes; without it the paths carry no stroke at all. */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className="text-text"
        >
          {TREE_BRANCHES.map((d, i) => {
            const [from, to] = BRANCH_EDGES[i] ?? [];
            const touches = (id?: string) => !!id && litHouseholds.has(id);
            const lit =
              litHouseholds.size > 0 &&
              (touches(from) || touches(to)) &&
              /* A sweep with one end in mid-air still counts, so a lit path
                 is not broken by the strokes that trail off. */
              (!from || !to || touches(from) === touches(to) || true);

            return (
              <path
                key={d}
                d={d}
                pathLength={1}
                className={cn(
                  "draw-in transition-base",
                  litHouseholds.size > 0 && !lit && "opacity-15",
                  lit && "text-heading",
                )}
                strokeWidth={lit ? 5 : 3}
              />
            );
          })}
        </g>

        {HOUSEHOLDS.map((household) => {
          const householdLit =
            litHouseholds.size === 0 || litHouseholds.has(household.id);

          return (
            <g
              key={household.id}
              className={cn(
                "transition-base",
                litHouseholds.size > 0 && !householdLit && "opacity-25",
              )}
            >
              <rect
                x={household.card.x}
                y={household.card.y}
                width={household.card.width}
                height={household.card.height}
                rx={20}
                filter="url(#tree-card-shadow)"
                className="fill-surface stroke-tree-edge/25"
                strokeWidth={2}
              />

              {household.people.map((person, i) => (
                <text
                  key={person.id}
                  x={household.card.x + 22}
                  y={
                    household.card.y +
                    (household.people.length === 1 ? 56 : 44) +
                    i * 34
                  }
                  className="fill-tree-ink text-[22px] font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {person.name}
                </text>
              ))}

              <text
                x={household.card.x + 22}
                y={household.card.y + household.card.height - 22}
                className="fill-tree-role text-[18px]"
              >
                {household.people[0]?.subfamily}
              </text>
            </g>
          );
        })}

        {/* Portraits last, so they sit above everything and can be hit. */}
        {HOUSEHOLDS.flatMap((household) =>
          household.people.map((person) => {
            const onPath =
              litHouseholds.size === 0 || litHouseholds.has(household.id);
            const matched = !dimOthers || matches.has(person.id);
            const faded = !onPath || !matched;
            const selected = selectedId === person.id;

            return (
              <g
                key={person.id}
                onClick={() => onSelect(selected ? null : person)}
                className={cn(
                  "transition-base cursor-pointer",
                  faded && "opacity-25",
                )}
              >
                <image
                  href={person.photo.src}
                  x={person.node.cx - person.node.r}
                  y={person.node.cy - person.node.r}
                  width={person.node.r * 2}
                  height={person.node.r * 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#clip-${person.id})`}
                />
                <circle
                  cx={person.node.cx}
                  cy={person.node.cy}
                  r={person.node.r}
                  fill="none"
                  strokeWidth={selected ? 8 : 3}
                  className={cn(
                    "transition-base",
                    selected ? "stroke-heading" : "stroke-surface",
                  )}
                />
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
