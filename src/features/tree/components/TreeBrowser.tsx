"use client";

import { useState } from "react";
import {
  ALL_GENERATIONS,
  ALL_MEMBERS,
  DEFAULT_PROMOTION,
  PROMOTIONS,
} from "../promotions";
import type { TreePerson } from "../types";
import { HierarchyRoleCard } from "./HierarchyRoleCard";
import { PersonDialog } from "./PersonDialog";
import { PromotionSelector, type PromotionOption } from "./PromotionSelector";
import { TreeHierarchyGrid } from "./TreeHierarchyGrid";

const OPTIONS: PromotionOption[] = [
  ...PROMOTIONS.map((p) => ({
    value: p.year,
    label: p.year,
    count: p.memberCount,
  })),
  {
    value: ALL_GENERATIONS,
    label: "All generations",
    count: ALL_MEMBERS.length,
  },
];

function matches(person: TreePerson, needle: string): boolean {
  return [
    person.name,
    person.roleLabel,
    person.subfamily,
    person.location ?? "",
    person.promotionYear,
  ].some((field) => field.toLowerCase().includes(needle));
}

/**
 * The part of the page that changes. A promotion shows as a tree; "All
 * generations" and any search show a plain list across every promotion, so a
 * relative can be found without opening each year.
 */
export function TreeBrowser() {
  const [value, setValue] = useState<string>(DEFAULT_PROMOTION);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<TreePerson | null>(null);

  const needle = query.trim().toLowerCase();
  const promotion = PROMOTIONS.find((p) => p.year === value);
  const list = needle
    ? ALL_MEMBERS.filter((person) => matches(person, needle))
    : value === ALL_GENERATIONS || !promotion
      ? ALL_MEMBERS
      : null;

  const summary = needle
    ? `${list!.length} ${list!.length === 1 ? "result" : "results"} for “${query.trim()}”`
    : promotion && list === null
      ? promotion.label
      : "All generations";
  const count = `${list ? list.length : promotion!.memberCount} members`;

  return (
    <>
      <div className="mt-14 md:mt-20">
        <PromotionSelector
          options={OPTIONS}
          selected={value}
          onSelect={setValue}
          query={query}
          onQuery={setQuery}
          summary={summary}
          count={count}
        />
      </div>

      <div className="mt-10 md:mt-14">
        {list === null ? (
          <TreeHierarchyGrid promotion={promotion!} onOpen={setOpen} />
        ) : list.length === 0 ? (
          <p className="text-body text-member-rail-ink mx-auto max-w-md text-center font-normal">
            No one matches. Try a name, a branch such as Light, or a city such
            as Huye.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {list.map((person) => (
              <HierarchyRoleCard
                key={person.id}
                person={person}
                onOpen={setOpen}
                showYear
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-caption text-member-rail-ink mt-10 text-center font-normal">
        Names, places and biographies are samples until the family register is
        added.
      </p>

      <PersonDialog person={open} onClose={() => setOpen(null)} />
    </>
  );
}
