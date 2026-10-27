"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { Bell, Cake, Images, ScrollText, X } from "lucide-react";
import {
  NOTIFICATIONS,
  NOTIFICATIONS_READ_KEY,
  parseRead,
  timeAgo,
  type NotificationKind,
} from "@/lib/notifications";
import { cn } from "@/lib/cn";
import { useNow } from "@/hooks/useNow";
import { useStoredValue } from "@/hooks/useStoredValue";

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  photos: Images,
  birthday: Cake,
  handover: ScrollText,
};

/** Dispatch this on window to open the drawer from anywhere on the page. */
export const OPEN_UPDATES_EVENT = "imena:open-updates";

/**
 * The bell, and the slide-over drawer of family updates it opens.
 *
 * The badge is a real count: how many updates this member has not opened,
 * gone once they are read. A native <dialog> does the hard parts — focus
 * moves in and is trapped, Escape closes it, focus returns to the bell —
 * and the panel slides in from the right.
 *
 * Which updates are read is a per-device convenience, kept in localStorage
 * until the family service can keep it per member.
 */
export function NotificationBell() {
  const dialog = useRef<HTMLDialogElement>(null);
  /* Read state and "time ago" depend on this device and this moment, so
     both come from external stores that the server renders as empty. */
  const [rawRead, setRawRead] = useStoredValue(NOTIFICATIONS_READ_KEY, "[]");
  const read = useMemo(() => parseRead(rawRead), [rawRead]);
  const now = useNow(60_000);

  /* Other parts of the page (the dashboard's updates pill) open it too. */
  useEffect(() => {
    const open = () => dialog.current?.showModal();
    window.addEventListener(OPEN_UPDATES_EVENT, open);
    return () => window.removeEventListener(OPEN_UPDATES_EVENT, open);
  }, []);

  const unread = NOTIFICATIONS.filter((item) => !read.has(item.id)).length;

  const markRead = (ids: string[]) => {
    setRawRead(JSON.stringify([...new Set([...read, ...ids])]));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        aria-label={
          unread
            ? `Family updates, ${unread} unread`
            : "Family updates, all read"
        }
        className="text-member-rail-ink hover:bg-member-tint focus-visible:outline-brand transition-fast relative grid size-11 place-items-center rounded-full"
      >
        <Bell aria-hidden className="size-6" strokeWidth={1.7} />
        {unread ? (
          <span
            aria-hidden
            className="bg-brand text-surface text-caption-sm ring-surface absolute top-1 right-1 grid min-w-4.5 place-items-center rounded-full px-1 leading-4.5 ring-2"
          >
            {unread}
          </span>
        ) : null}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="updates-title"
        onClick={(event) => {
          /* A click on the backdrop lands on the dialog itself. */
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className={cn(
          "m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-transparent p-0",
          "backdrop:bg-member-ink/30 backdrop:backdrop-blur-sm",
          "open:animate-drawer-in motion-reduce:animate-none",
        )}
      >
        <div className="bg-surface/95 flex h-full flex-col border-l border-white/60 shadow-2xl backdrop-blur-xl">
          <header className="border-member-border flex items-center justify-between gap-4 border-b px-6 py-5">
            <div>
              <h2 id="updates-title" className="text-h4 text-member-ink">
                Family updates
              </h2>
              <p className="text-caption text-muted mt-1">
                {unread ? `${unread} unread` : "You are all caught up"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unread ? (
                <button
                  type="button"
                  onClick={() => markRead(NOTIFICATIONS.map((item) => item.id))}
                  className="text-brand text-caption hover:bg-member-tint rounded-full px-3 py-2 font-semibold"
                >
                  Mark all read
                </button>
              ) : null}
              <button
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
                aria-label="Close family updates"
                className="text-member-ink hover:bg-member-tint grid size-10 place-items-center rounded-full"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
          </header>

          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            {NOTIFICATIONS.map((item) => {
              const Icon = KIND_ICON[item.kind];
              const isUnread = !read.has(item.id);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      markRead([item.id]);
                      dialog.current?.close();
                    }}
                    className={cn(
                      "hover:border-member-border hover:bg-member-panel flex gap-4 rounded-lg border border-transparent p-4 transition-colors",
                      isUnread && "bg-member-tint/60",
                    )}
                  >
                    <span className="bg-surface text-brand shadow-menu grid size-10 shrink-0 place-items-center rounded-full">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-body-sm text-member-ink flex items-start justify-between gap-3 font-semibold">
                        {item.title}
                        {isUnread ? (
                          <span className="bg-brand mt-1.5 size-2 shrink-0 rounded-full">
                            <span className="sr-only">Unread</span>
                          </span>
                        ) : null}
                      </span>
                      <span className="text-caption text-muted mt-1 block font-normal">
                        {item.detail}
                      </span>
                      <span className="text-caption-sm text-muted mt-2 block">
                        {now === null ? " " : timeAgo(item.at, now)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="text-caption text-muted border-member-border border-t px-6 py-4 text-center">
            Sample updates, shown until the family service is connected.
          </p>
        </div>
      </dialog>
    </>
  );
}
