"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Quote, X } from "lucide-react";
import { branchName } from "../branch";
import type { TreePerson } from "../types";

/**
 * A person's story in a modal dialog. The native element gives focus
 * trapping, Escape to close and focus back on the button that opened it.
 */
export function PersonDialog({
  person,
  onClose,
}: {
  person: TreePerson | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (person && !element.open) element.showModal();
    if (!person && element.open) element.close();
  }, [person]);

  if (!person) return <dialog ref={dialog} className="hidden" />;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="person-name"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      className="open:animate-dialog-pop backdrop:bg-member-ink/40 m-auto w-[min(100vw-2rem,34rem)] max-w-none rounded-3xl bg-transparent p-0 backdrop:backdrop-blur-sm motion-reduce:animate-none"
    >
      <div className="bg-surface shadow-menu relative overflow-hidden rounded-3xl">
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Close"
          className="bg-surface/90 focus-visible:outline-brand absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full"
        >
          <X aria-hidden className="size-5" />
        </button>

        <div className="bg-member-field relative h-64 w-full">
          <Image
            src={person.image}
            alt={`${person.name}, ${person.roleLabel}`}
            fill
            sizes="34rem"
            className="object-cover object-top"
          />
        </div>

        <div className="p-6 md:p-8">
          <p className="text-caption text-member-accent">
            {person.roleLabel}, {person.promotionYear} promotion
          </p>
          <h2 id="person-name" className="text-h4-m md:text-h4 mt-1">
            {person.name}
          </h2>
          <p className="text-body-sm text-member-rail-ink mt-1 font-normal">
            {branchName(person.subfamily)}
            {person.location ? ` · ${person.location}` : null}
          </p>

          <p className="text-body text-member-ink mt-5 font-normal">
            {person.bio}
          </p>

          {person.quote ? (
            <blockquote className="font-member-serif text-member-ink mt-5 flex gap-3 italic">
              <Quote
                aria-hidden
                className="text-member-active mt-1 size-5 shrink-0"
              />
              {person.quote}
            </blockquote>
          ) : null}

          <p className="text-caption text-member-rail-ink mt-6 font-normal">
            Sample biography, until the family register is added.
          </p>
        </div>
      </div>
    </dialog>
  );
}
