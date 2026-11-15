"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cake, Check, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { useToast } from "@/components/ui/Toaster";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { cn } from "@/lib/cn";
import { MONTH_NAMES, type Celebrant } from "../data";
import { DateTile } from "./BirthdaysPanel";
import { WishDialog, type WishTarget } from "./WishDialog";

/**
 * The birthdays page: whoever celebrates today first, then a month at a time,
 * everybody in the family register who has a date of birth.
 */
export function FamilyCelebrationsCalendar({
  celebrants,
  today,
  initialMonth,
}: {
  celebrants: Celebrant[];
  today: Celebrant[];
  /** 0 for January: the month the page opens on. */
  initialMonth: number;
}) {
  const toast = useToast();
  const [month, setMonth] = useState(initialMonth);
  const [target, setTarget] = useState<(WishTarget & { id: string }) | null>(
    null,
  );
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestDialog = useModalDialog(suggestOpen);
  const [suggestName, setSuggestName] = useState("");

  /* Who has been wished from this device. */
  const [wishedRaw, setWishedRaw] = useStoredValue(
    "imena:wished_celebrants",
    "[]",
  );
  const wishedIds = useMemo<Set<string>>(() => {
    try {
      const parsed = JSON.parse(wishedRaw);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }, [wishedRaw]);

  const markWished = (id?: string) => {
    if (!id) return;
    setWishedRaw(JSON.stringify([...wishedIds, id]));
  };

  const counts = useMemo(() => {
    const byMonth = Array.from({ length: 12 }, () => 0);
    for (const c of celebrants) byMonth[c.month] = (byMonth[c.month] ?? 0) + 1;
    return byMonth;
  }, [celebrants]);
  const inMonth = celebrants.filter((c) => c.month === month);
  const monthName = MONTH_NAMES[month] ?? "";
  const wish = (c: Celebrant) =>
    setTarget({ id: c.id, name: c.name, subfamily: c.branch });

  return (
    <div className="flex w-full flex-col gap-8">
      <p className="text-body text-muted max-w-2xl">
        Celebrating life, joy and the growth of our brothers and sisters across
        all subfamilies.
      </p>

      {today.map((person) => {
        const wished = wishedIds.has(person.id);
        return (
          <section
            key={person.id}
            aria-label={`${person.name}'s birthday today`}
            className="border-member-border bg-surface shadow-member flex flex-col gap-5 rounded-lg border p-5 sm:flex-row sm:items-center sm:p-6"
          >
            <PersonAvatar
              name={person.name}
              photo={person.photo}
              sizes="5rem"
              className="text-h3 size-20 rounded-md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-caption text-brand font-semibold">
                Birthday today · {MONTH_NAMES[person.month]} {person.day}
              </p>
              <Link
                href={`${ROUTES.PEOPLE}/${person.id}`}
                className="text-h3-m text-member-ink mt-1 block hover:underline"
              >
                {person.name}
              </Link>
              <p className="text-body-sm text-muted mt-1">
                {person.branch} family
              </p>
            </div>
            <Button
              variant={wished ? "outline" : "primary"}
              onClick={() => wish(person)}
            >
              {wished ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Send aria-hidden className="size-4" />
              )}
              {wished ? "Wish sent. Send another" : "Send a family wish"}
            </Button>
          </section>
        );
      })}

      <section aria-labelledby="by-month" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="by-month" className="text-h4-m md:text-h4 text-member-ink">
            Birthdays by month
          </h2>
          <p className="text-body-sm text-muted" aria-live="polite">
            {inMonth.length} in {monthName}
          </p>
        </div>

        <div
          role="group"
          aria-label="Month"
          className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1"
        >
          {MONTH_NAMES.map((name, index) => {
            const active = month === index;
            const count = counts[index] ?? 0;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                aria-label={`${name}, ${count} birthday${count === 1 ? "" : "s"}`}
                onClick={() => setMonth(index)}
                className={cn(
                  "text-body-sm rounded-pill transition-fast h-10 shrink-0 px-4 font-semibold",
                  active
                    ? "bg-brand text-surface"
                    : "bg-member-tint text-member-ink hover:bg-member-border",
                )}
              >
                {name.slice(0, 3)}
                {count > 0 ? (
                  <span className={active ? "text-surface/80" : "text-muted"}>
                    {" "}
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {inMonth.length === 0 ? (
          <div className="border-member-border bg-member-panel flex flex-col items-center gap-3 rounded-md border px-6 py-12 text-center">
            <Cake aria-hidden className="text-brand size-8" />
            <p className="text-body text-member-ink font-semibold">
              No birthdays in {monthName} yet
            </p>
            <p className="text-body-sm text-muted max-w-sm">
              Birthdays come from the family register. Know of one in{" "}
              {monthName} that is missing? Tell a coordinator.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSuggestName("");
                setSuggestOpen(true);
              }}
            >
              Tell a coordinator
            </Button>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {inMonth.map((person) => {
              const wished = wishedIds.has(person.id);
              return (
                <li
                  key={person.id}
                  className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-3"
                >
                  <DateTile month={person.month} day={person.day} />
                  <PersonAvatar
                    name={person.name}
                    photo={person.photo}
                    sizes="2.5rem"
                    className="text-caption size-10"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`${ROUTES.PEOPLE}/${person.id}`}
                      className="text-body-sm text-member-ink block truncate font-semibold hover:underline"
                    >
                      {person.name}
                    </Link>
                    <p className="text-caption text-muted truncate">
                      {person.branch} family
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => wish(person)}
                    aria-label={
                      wished
                        ? `Wish sent to ${person.name}. Send another`
                        : `Send a birthday wish to ${person.name}`
                    }
                    className="text-brand hover:bg-member-tint grid size-10 shrink-0 place-items-center rounded-full transition-colors"
                  >
                    <Heart
                      aria-hidden
                      className={cn(
                        "size-4",
                        wished && "fill-member-heart text-member-heart",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <WishDialog
        target={target}
        onClose={() => setTarget(null)}
        onSent={() => {
          markWished(target?.id);
          setTarget(null);
        }}
      />

      <dialog
        ref={suggestDialog}
        onClose={() => setSuggestOpen(false)}
        onCancel={() => setSuggestOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSuggestOpen(false);
        }}
        aria-labelledby="suggest-birthday-title"
        className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/40 m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg p-0 shadow-2xl motion-reduce:animate-none"
      >
        {suggestOpen ? (
          <form
            className="p-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (!suggestName.trim()) return;
              setSuggestOpen(false);
              toast({
                message: `The note about ${suggestName.trim()} would go to the coordinator. Nothing was sent yet.`,
              });
            }}
          >
            <h2
              id="suggest-birthday-title"
              className="text-h4-m text-member-ink"
            >
              Tell a coordinator
            </h2>
            <label
              htmlFor="suggest-name"
              className="text-body-sm text-member-ink mt-5 block font-semibold"
            >
              Their full name
            </label>
            <input
              id="suggest-name"
              type="text"
              autoComplete="off"
              required
              value={suggestName}
              onChange={(e) => setSuggestName(e.target.value)}
              className="border-field-border text-body mt-2 h-12 w-full rounded-sm border px-3"
            />
            <label
              htmlFor="suggest-when"
              className="text-body-sm text-member-ink mt-4 block font-semibold"
            >
              Month and day
            </label>
            <input
              id="suggest-when"
              type="text"
              autoComplete="off"
              defaultValue={`${monthName} `}
              className="border-field-border text-body mt-2 h-12 w-full rounded-sm border px-3"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSuggestOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send aria-hidden className="size-4" />
                Send note
              </Button>
            </div>
          </form>
        ) : null}
      </dialog>
    </div>
  );
}
