import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRANCH_THEME, ROLE_ICON, branchName } from "../branch";
import type { TreePerson } from "../types";

/**
 * One person in the hierarchy: a badge for their title, then a card in their
 * branch's colour with a portrait, their name, where they are and a line of
 * their story. "View story" opens the rest.
 *
 * `compact` is for the narrow branch columns; `showYear` is for lists that
 * mix promotions, where the year says which one this person leads.
 */
export function HierarchyRoleCard({
  person,
  onOpen,
  compact = false,
  showYear = false,
  className,
}: {
  person: TreePerson;
  onOpen: (person: TreePerson) => void;
  compact?: boolean;
  showYear?: boolean;
  className?: string;
}) {
  const theme = BRANCH_THEME[person.subfamily];
  const Icon = ROLE_ICON[person.role];
  /* Inside a branch panel the panel owns the h3, so the title sits under it. */
  const Heading = compact ? "h4" : "h3";

  return (
    <article className={cn("min-w-0", className)}>
      <Heading
        className={cn(
          "text-body mb-3 flex items-center gap-2 font-semibold",
          theme.heading,
        )}
      >
        <Icon aria-hidden className="size-4 shrink-0" />
        {person.roleLabel}
        {showYear ? (
          <span className="text-caption text-member-rail-ink font-normal">
            {person.promotionYear}
          </span>
        ) : null}
      </Heading>

      <div
        className={cn(
          "bg-surface/80 flex gap-4 rounded-2xl border p-4 shadow-sm transition-[background-color,box-shadow] duration-200 hover:shadow-md",
          theme.card,
        )}
      >
        <div
          className={cn(
            "bg-member-field relative shrink-0 overflow-hidden rounded-xl",
            compact ? "h-32 w-24" : "h-36 w-28 md:h-40 md:w-32",
          )}
        >
          <Image
            src={person.image}
            alt={`${person.name}, ${person.roleLabel}`}
            fill
            sizes="8rem"
            className="object-cover object-top"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="text-body text-text font-bold">{person.name}</p>
          <p
            className={cn(
              "text-caption mt-2 rounded-full border px-3 py-1",
              theme.chip,
            )}
          >
            {branchName(person.subfamily)}
          </p>
          {person.location ? (
            <p className="text-caption text-member-rail-ink mt-2 flex items-center gap-1 font-normal">
              <MapPin aria-hidden className="size-3.5 shrink-0" />
              {person.location}
            </p>
          ) : null}
          {compact ? null : (
            <p className="text-caption text-member-rail-ink mt-3 line-clamp-2 font-normal">
              {person.bio}
            </p>
          )}
          <button
            type="button"
            onClick={() => onOpen(person)}
            aria-label={`View the story of ${person.name}, ${person.roleLabel}`}
            className="text-caption text-brand focus-visible:outline-brand mt-auto pt-3 underline underline-offset-4"
          >
            View story
          </button>
        </div>
      </div>
    </article>
  );
}
