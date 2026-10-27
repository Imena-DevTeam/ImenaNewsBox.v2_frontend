"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Quote, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  HOUSEHOLD_BY_ID,
  ancestorsOf,
  type Person,
} from "@/features/tree/data";
import { bioFor } from "@/features/tree/bios";

/**
 * A person's biography, sliding in from the right: their full title, oral
 * sayings, memories the family keeps of them, historical photographs and
 * the line they come from.
 *
 * It is not modal. The tree stays usable beside it — the lit lineage is the
 * point of opening it — so instead of trapping focus it takes focus when it
 * opens, closes on Escape, and hands focus back to whatever opened it.
 */
/* True once running in the browser, where document.body exists to portal
   into; false on the server, so nothing renders there. */
const noop = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function BioDrawer({
  person,
  householdId,
  onClose,
}: {
  person: Person | null;
  householdId: string | null;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const open = person !== null && householdId !== null;
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnTo.current?.focus({ preventScroll: true });
    };
  }, [open, person?.id, onClose]);

  const household = householdId ? HOUSEHOLD_BY_ID.get(householdId) : undefined;
  const bio = person && household ? bioFor(person, household.generation) : null;

  /* Root first, so it reads the way a lineage is spoken. */
  const lineage = householdId
    ? ancestorsOf(householdId)
        .slice(1)
        .reverse()
        .map((id) => HOUSEHOLD_BY_ID.get(id))
        .filter((h) => h !== undefined)
    : [];

  /* Portalled to <body>: a page's entrance animation can leave a transform
     on an ancestor, which would make it — not the viewport — the box a
     fixed drawer is laid out against. */
  if (!isClient) return null;

  return createPortal(
    <aside
      aria-label={person ? `About ${person.name}` : undefined}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col border-l border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl",
        "transition-transform duration-500 ease-out motion-reduce:transition-none",
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      {person && bio ? (
        <>
          <header className="relative">
            <div className="bg-tree-card relative h-56 overflow-hidden">
              <Image
                key={person.id}
                src={person.photo}
                alt={person.name}
                fill
                placeholder="blur"
                sizes="448px"
                className="stage-fade object-cover"
              />
              <span
                aria-hidden
                className="from-tree-ink/85 absolute inset-0 bg-gradient-to-t to-transparent"
              />
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Close biography"
              className="text-tree-ink absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-white/60 bg-white/80 backdrop-blur-md hover:bg-white focus-visible:outline-white"
            >
              <X aria-hidden className="size-5" />
            </button>
            <div className="text-surface absolute inset-x-0 bottom-0 p-6">
              <h2 className="text-h3-m">{person.name}</h2>
              <p className="text-body-sm text-surface/85 mt-1">{bio.title}</p>
            </div>
          </header>

          <div className="flex-1 space-y-7 overflow-y-auto p-6">
            <div className="flex flex-wrap gap-2">
              {[
                person.role,
                `${person.subfamily} branch`,
                household ? `Generation ${household.generation}` : null,
              ]
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="border-tree-edge/40 text-caption text-tree-role rounded-full border px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <section aria-labelledby="bio-quotes">
              <h3
                id="bio-quotes"
                className="text-caption text-tree-role tracking-widest uppercase"
              >
                In their words
              </h3>
              <ul className="mt-3 space-y-3">
                {bio.quotes.map((quote) => (
                  <li
                    key={quote}
                    className="bg-tree-card flex gap-3 rounded-2xl p-4"
                  >
                    <Quote
                      aria-hidden
                      className="text-tree-edge size-4 shrink-0"
                    />
                    <blockquote className="font-member-serif text-body text-tree-quote italic">
                      {quote}
                    </blockquote>
                  </li>
                ))}
              </ul>
            </section>

            {bio.memories.length > 0 ? (
              <section aria-labelledby="bio-memories">
                <h3
                  id="bio-memories"
                  className="text-caption text-tree-role tracking-widest uppercase"
                >
                  Memories
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {bio.memories.map((memory) => (
                    <li
                      key={memory}
                      className="text-body-sm text-tree-ink flex gap-2.5"
                    >
                      <Sparkles
                        aria-hidden
                        className="text-celebration-gold mt-0.5 size-4 shrink-0"
                      />
                      {memory}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="bio-photographs">
              <h3
                id="bio-photographs"
                className="text-caption text-tree-role tracking-widest uppercase"
              >
                Photographs
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {bio.photographs.map((photograph) => (
                  <li key={photograph.caption}>
                    <figure>
                      <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                        <Image
                          src={photograph.image}
                          alt={photograph.caption}
                          fill
                          placeholder="blur"
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="text-caption text-muted mt-1.5">
                        {photograph.caption}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>

            {lineage.length > 0 ? (
              <section aria-labelledby="bio-lineage">
                <h3
                  id="bio-lineage"
                  className="text-caption text-tree-role tracking-widest uppercase"
                >
                  Line to the first generation
                </h3>
                <ol className="mt-3 space-y-2">
                  {lineage.map((h) => (
                    <li
                      key={h.id}
                      className="text-body-sm text-tree-ink flex items-center gap-2"
                    >
                      <span className="bg-celebration-gold size-2 rounded-full" />
                      <span className="text-muted">
                        Generation {h.generation}:
                      </span>
                      {h.people.map((p) => p.name).join(" & ")}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <p className="text-caption text-muted border-border border-t pt-4">
              Sample biography, shown until the family register is filled in.
            </p>
          </div>
        </>
      ) : null}
    </aside>,
    document.body,
  );
}
