"use client";

import Image from "next/image";
import { HOUSEHOLDS, type Household, type Person } from "@/features/tree/data";
import { cn } from "@/lib/cn";

/**
 * Every person, nested by generation.
 *
 * This is the tree on a phone, where a 1248-wide diagram shrinks the
 * portraits to 26px and the name cards to 73x32 — too small to read or to
 * hit. It is also how the tree is navigated without a mouse at any width,
 * which is why it is a real list rather than a decorative one.
 */
export function TreeList({
  selectedId,
  onSelect,
  matches,
  query,
}: {
  selectedId: string | null;
  onSelect: (person: Person | null) => void;
  matches: Set<string>;
  query: string;
}) {
  const generations = [...new Set(HOUSEHOLDS.map((h) => h.generation))].sort();

  const visible = (h: Household) => h.people.some((p) => matches.has(p.id));

  if (!HOUSEHOLDS.some(visible)) {
    return (
      <p className="text-body text-muted border-border bg-band rounded-md border px-6 py-10 text-center">
        Nobody matches &ldquo;{query}&rdquo;. Try a first name, a role such as
        Maman, or a subfamily.
      </p>
    );
  }

  return (
    <ol className="space-y-10">
      {generations.map((generation) => {
        const households = HOUSEHOLDS.filter(
          (h) => h.generation === generation && visible(h),
        );
        if (households.length === 0) return null;

        return (
          <li key={generation}>
            <h4 className="text-caption text-muted tracking-widest uppercase">
              Generation {generation}
            </h4>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {households.flatMap((household) =>
                household.people
                  .filter((p) => matches.has(p.id))
                  .map((person) => {
                    const selected = selectedId === person.id;

                    return (
                      <li key={person.id}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => onSelect(selected ? null : person)}
                          className={cn(
                            "border-border bg-surface transition-base flex w-full items-center gap-4 rounded-md border p-3 text-left",
                            "hover:border-tree-edge/50 hover:shadow-main",
                            selected && "border-heading shadow-main",
                          )}
                        >
                          <Image
                            src={person.photo}
                            alt=""
                            placeholder="blur"
                            sizes="56px"
                            className="rounded-pill size-14 shrink-0 object-cover"
                          />
                          <span className="min-w-0">
                            <span className="text-body text-tree-ink block truncate font-semibold">
                              {person.name}
                            </span>
                            <span className="text-body-sm text-muted block truncate">
                              {person.role} · {person.subfamily}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  }),
              )}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
