"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ADMIN_TABS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { FAMILY_REGISTER } from "@/features/members/data";
import { cn } from "@/lib/cn";

interface Command {
  id: string;
  label: string;
  /** The group heading it sits under. */
  group: string;
  href: string;
}

/**
 * Jump anywhere in the admin area from the keyboard: Cmd K on a Mac, Ctrl K
 * elsewhere. Opened by the button beside it, so it is not keyboard-only.
 *
 * Built on the native <dialog> and showModal(), which gives Escape, focus
 * trapping, inertness and focus restoration from the browser. The list is a
 * listbox the input owns through aria-activedescendant, so arrow keys move
 * the selection while typing continues in the field.
 */
export function CommandPalette() {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "new-member",
        label: "Add a member",
        group: "Create",
        href: ROUTES.ADMIN_MEMBER_NEW,
      },
      ...ADMIN_TABS.map((tab) => ({
        id: `go-${tab.label}`,
        label: tab.label,
        group: "Go to",
        href: tab.href,
      })),
      /* Find a person. This is what an administrator with seventy-three
         records opens a palette for; it carries the id rather than the
         address, and the page turns that back into a name. */
      ...FAMILY_REGISTER.map((person) => ({
        id: `person-${person.id}`,
        label: person.fullName,
        group: "People",
        href: `${ROUTES.ADMIN_MEMBERS}?find=${person.id}`,
      })),
    ],
    [],
  );

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const found = needle
      ? commands.filter((command) =>
          command.label.toLowerCase().includes(needle),
        )
      : commands;
    return found.slice(0, 8);
  }, [commands, query]);

  /* Cmd/Ctrl K from anywhere on the page. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      setOpen((wasOpen) => !wasOpen);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setQuery("");
      setCursor(0);
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const go = (command: Command | undefined) => {
    if (!command) return;
    setOpen(false);
    router.push(command.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-member-border bg-member-panel text-body-sm text-muted hover:border-brand hover:text-member-ink focus-visible:outline-brand transition-fast inline-flex h-10 items-center gap-2 rounded-lg border px-3.5"
      >
        <Search aria-hidden className="size-4" />
        Search or jump to…
        <kbd className="text-caption border-member-border text-muted ml-2 hidden rounded border px-1.5 py-0.5 font-sans sm:inline">
          Ctrl K
        </kbd>
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        aria-label="Search or jump to"
        className="bg-surface open:animate-dialog-pop mx-auto mt-24 w-[min(34rem,calc(100vw-2rem))] rounded-lg p-0 shadow-2xl backdrop:bg-black/50 motion-reduce:animate-none"
      >
        <div className="border-member-border flex items-center gap-2.5 border-b px-4">
          <Search aria-hidden className="text-muted size-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded
            aria-controls="palette-list"
            aria-activedescendant={matches[cursor]?.id}
            autoComplete="off"
            value={query}
            placeholder="Search or jump to…"
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((at) => (at + 1) % Math.max(matches.length, 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((at) =>
                  at === 0 ? Math.max(matches.length - 1, 0) : at - 1,
                );
              }
              if (event.key === "Enter") {
                event.preventDefault();
                go(matches[cursor]);
              }
            }}
            className="text-body h-12 w-full bg-transparent outline-none"
          />
        </div>

        <ul
          id="palette-list"
          role="listbox"
          className="max-h-80 overflow-y-auto p-2"
        >
          {matches.length === 0 ? (
            <li className="text-body-sm text-muted px-3 py-6 text-center">
              Nothing matches that.
            </li>
          ) : (
            matches.map((command, index) => (
              <li key={command.id}>
                <button
                  type="button"
                  id={command.id}
                  role="option"
                  aria-selected={index === cursor}
                  onClick={() => go(command)}
                  onMouseEnter={() => setCursor(index)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 text-left",
                    index === cursor
                      ? "bg-member-tint text-member-ink"
                      : "text-member-ink",
                  )}
                >
                  <span className="text-body-sm min-w-0 truncate font-medium">
                    {command.label}
                  </span>
                  <span className="text-caption text-muted shrink-0">
                    {command.group}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </dialog>
    </>
  );
}
