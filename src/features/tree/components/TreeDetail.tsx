"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  HOUSEHOLD_BY_ID,
  ancestorsOf,
  type Person,
} from "@/features/tree/data";

/**
 * The selected person.
 *
 * Shown in place rather than in a dialog: there is nothing here to confirm or
 * dismiss, and a panel keeps the tree beside it visible, with the path back
 * to the first generation lit.
 */
export function TreeDetail({
  person,
  householdId,
  onClose,
}: {
  person: Person;
  householdId: string;
  onClose: () => void;
}) {
  /* Root first, so it reads the way a lineage is spoken. */
  const lineage = ancestorsOf(householdId)
    .slice(1)
    .reverse()
    .map((id) => HOUSEHOLD_BY_ID.get(id))
    .filter((h) => h !== undefined);

  return (
    <aside
      aria-label={`About ${person.name}`}
      className="border-tree-edge/40 bg-tree-card shadow-main relative rounded-md border p-5 md:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-muted hover:text-text transition-fast absolute top-4 right-4"
      >
        <X className="size-5" />
      </button>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Image
          src={person.photo}
          alt={person.name}
          placeholder="blur"
          sizes="128px"
          className="w-28 shrink-0 rounded-md object-cover sm:w-32"
        />

        <div className="min-w-0">
          <h3 className="text-h4-m md:text-h4 text-tree-ink pr-8">
            {person.name}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="border-tree-edge/40 text-caption text-tree-role rounded-sm border px-2 py-1">
              {person.role}
            </span>
            <span className="border-tree-edge/40 text-caption text-tree-role rounded-sm border px-2 py-1">
              {person.subfamily}
            </span>
          </div>

          <blockquote className="border-border text-body-sm text-tree-quote mt-4 border-l-2 pl-3 italic">
            &ldquo;{person.saying}&rdquo;
          </blockquote>

          {lineage.length > 0 ? (
            <p className="text-body-sm text-muted mt-4">
              <span className="sr-only">Descended from </span>
              <span aria-hidden>Line: </span>
              {lineage.map((h, i) => (
                <span key={h.id}>
                  {i > 0 ? <span aria-hidden> › </span> : null}
                  {h.people.map((p) => p.name.split(" ")[0]).join(" & ")}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
