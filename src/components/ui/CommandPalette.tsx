"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Command {
  id: string;
  label: string;
  /** The group it belongs to: Pages, People, Stories, Albums. */
  group: string;
  /** A second line searched as well: a branch, a category, a place. */
  hint?: string;
  href: string;
}

/** Any button on the page can open the palette by sending this event. */
export const OPEN_SEARCH_EVENT = "imena:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

/**
 * Find anything in the member area: Cmd K on a Mac, Ctrl K elsewhere, or
 * any button that calls `openSearch()`, so it is never keyboard-only. The
 * list is handed in, so this file knows nothing about people or posts.
 *
 * Built on the native <dialog> and showModal(), which gives Escape, focus
 * trapping, inertness and focus restoration from the browser. The list is a
 * listbox the input owns through aria-activedescendant, so arrow keys move
 * the selection while typing continues in the field.
 */
export function CommandPalette({ commands }: { commands: Command[] }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const found = needle
      ? commands.filter((command) =>
          `${command.label} ${command.hint ?? ""}`
            .toLowerCase()
            .includes(needle),
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
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
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
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        aria-label="Search the family site"
        className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/50 mx-auto mt-24 w-[min(34rem,calc(100vw-2rem))] rounded-lg p-0 shadow-2xl motion-reduce:animate-none"
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
            placeholder="Search people, stories, albums…"
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
            className="text-body h-12 w-full bg-transparent"
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
                  <span className="min-w-0">
                    <span className="text-body-sm block truncate font-medium">
                      {command.label}
                    </span>
                    {command.hint ? (
                      <span className="text-caption text-muted block truncate">
                        {command.hint}
                      </span>
                    ) : null}
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
