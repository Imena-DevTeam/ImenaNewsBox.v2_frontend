"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { BRANCH_ICON, BRANCH_THEME } from "../branch";
import type {
  HierarchyRole,
  PromotionRecord,
  Subfamily,
  TreePerson,
} from "../types";
import { HierarchyRoleCard } from "./HierarchyRoleCard";
import { TreeConnectorLines } from "./TreeConnectorLines";

type Branch = Exclude<Subfamily, "Sanctuary">;

const BRANCHES: { branch: Branch; label: string; roles: HierarchyRole[] }[] = [
  {
    branch: "Light",
    label: "Light family",
    roles: ["pere_light", "mere_light"],
  },
  {
    branch: "Wihogora",
    label: "Wihogora family",
    roles: ["pere_wihogora", "mere_wihogora"],
  },
  { branch: "Hope", label: "Hope family", roles: ["pere_hope", "mere_hope"] },
];

/**
 * A promotion as a tree, in three layers joined by lines: the two elders,
 * the coordinator and vice coordinator beneath them, and the three families
 * with a father and a mother each.
 *
 * Below tablet width the lines drop away and everything stacks; a switch
 * lets a phone show one family at a time instead of all three in a row.
 */
export function TreeHierarchyGrid({
  promotion,
  onOpen,
}: {
  promotion: PromotionRecord;
  onOpen: (person: TreePerson) => void;
}) {
  const [shown, setShown] = useState<"All" | Branch>("All");
  const byRole = new Map(promotion.members.map((p) => [p.role, p]));
  const card = (role: HierarchyRole, compact = false) => {
    const person = byRole.get(role);
    return person ? (
      <HierarchyRoleCard person={person} onOpen={onOpen} compact={compact} />
    ) : null;
  };

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {card("grand_pere")}
        {card("grand_mere")}
      </div>

      <TreeConnectorLines kind="leadership" />

      <div className="mt-8 grid gap-6 md:mt-0 md:grid-cols-2 md:gap-8">
        {card("coordinator")}
        {card("vice_coordinator")}
      </div>

      <TreeConnectorLines kind="branches" />

      <div
        role="group"
        aria-label="Show a family"
        className="mt-10 flex flex-wrap justify-center gap-2 md:hidden"
      >
        {(["All", "Light", "Wihogora", "Hope"] as const).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={shown === name}
            onClick={() => setShown(name)}
            className={cn(
              "text-caption focus-visible:outline-brand rounded-full border px-4 py-2 transition-colors",
              shown === name
                ? "border-brand/40 bg-brand/10 text-brand font-bold"
                : "border-member-border bg-member-field/60 text-member-rail-ink",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:mt-10 lg:mt-0 lg:grid-cols-3 lg:gap-6">
        {BRANCHES.map(({ branch, label, roles }) => {
          const Icon = BRANCH_ICON[branch];
          const theme = BRANCH_THEME[branch];
          return (
            <section
              key={branch}
              aria-label={label}
              className={cn(
                "rounded-3xl border p-4 md:p-6",
                theme.panel,
                shown !== "All" && shown !== branch && "max-md:hidden",
              )}
            >
              <h3
                className={cn(
                  "text-h4-m md:text-h4 mb-5 flex items-center gap-2",
                  theme.heading,
                )}
              >
                <Icon aria-hidden className="size-5" />
                {label}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {roles.map((role) => (
                  <div key={role}>{card(role, true)}</div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
