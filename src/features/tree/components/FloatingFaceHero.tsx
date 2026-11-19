import Image from "next/image";
import { cn } from "@/lib/cn";
import { branchName } from "../branch";
import { ALL_MEMBERS, PROMOTIONS } from "../promotions";
import type { TreePerson } from "../types";

/* One face from each promotion, newest first, then the rest up to ten. */
function faces(): TreePerson[] {
  const firsts = PROMOTIONS.map((promotion) => promotion.members[0]).filter(
    (person): person is TreePerson => Boolean(person),
  );
  const rest = ALL_MEMBERS.filter((person) => !firsts.includes(person));
  return [...firsts, ...rest].slice(0, 10);
}

/**
 * A row of the family's faces above the tree. Hover or focus one and it
 * names itself: who they are, their promotion and their branch. It used to
 * be a scattered, drifting cloud with hearts between the faces; a row reads
 * as people standing together, which is what a family tree opens on.
 */
export function FloatingFaceHero() {
  const people = faces();
  return (
    <ul className="mt-6 mb-10 flex flex-wrap justify-center -space-x-3 md:-space-x-4">
      {people.map((person, index) => (
        <li
          key={person.id}
          className="group relative focus-within:z-20 hover:z-20"
        >
          <button
            type="button"
            aria-label={`${person.name}, ${person.promotionYear} promotion, ${branchName(person.subfamily)}`}
            className="focus-visible:outline-brand ring-surface relative block size-14 overflow-hidden rounded-full ring-4 transition-transform duration-200 group-hover:-translate-y-1 md:size-18"
          >
            <Image
              src={person.image}
              alt=""
              fill
              sizes="4.5rem"
              className="object-cover object-top"
            />
          </button>
          <p
            role="tooltip"
            className={cn(
              "bg-member-ink text-surface text-caption absolute top-full z-30 mt-2 hidden w-max max-w-56 rounded-md px-3 py-2",
              "group-focus-within:block group-hover:block",
              index < 2
                ? "left-0"
                : index > people.length - 3
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2",
            )}
          >
            <span className="block font-semibold">{person.name}</span>
            {person.promotionYear} · {branchName(person.subfamily)}
          </p>
        </li>
      ))}
    </ul>
  );
}
