"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { cn } from "@/lib/cn";
import { shortMonth, type Celebrant } from "../data";
import { WishDialog, type WishTarget } from "./WishDialog";

const SENT_KEY = "imena:wishes-sent";

function parseSent(raw: string): Record<string, number> {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/* Each branch keeps the colour it has everywhere else on the site. */
const BRANCH_CHIP: Record<string, string> = {
  wihogora: "bg-wihogora-tint text-wihogora-ink",
  light: "bg-light-tint text-light-ink",
  hope: "bg-hope-tint text-hope-ink",
};

function branchChip(branch: string) {
  return BRANCH_CHIP[branch.toLowerCase()] ?? "bg-member-tint text-member-ink";
}

/** One date, drawn the same way for today and for the days to come. */
export function DateTile({
  month,
  day,
  strong = false,
}: {
  month: number;
  day: number;
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex w-12 shrink-0 flex-col items-center rounded-md py-1.5",
        strong ? "bg-brand text-surface" : "bg-member-tint text-member-ink",
      )}
    >
      <span className="text-caption-sm uppercase">{shortMonth(month)}</span>
      <span className="text-body leading-none font-bold">{day}</span>
    </span>
  );
}

/**
 * The celebration board of the dashboard: whoever's birthday it is today,
 * then the next few, all from the family register. Every name opens the
 * person's own page.
 */
export function BirthdaysPanel({
  today,
  upcoming,
  className,
}: {
  today: Celebrant[];
  upcoming: Celebrant[];
  className?: string;
}) {
  const [target, setTarget] = useState<WishTarget | null>(null);
  const [rawSent, setRawSent] = useStoredValue(SENT_KEY, "{}");
  const sent = useMemo(() => parseSent(rawSent), [rawSent]);

  const recordWish = (wished: WishTarget) => {
    setRawSent(
      JSON.stringify({ ...sent, [wished.name]: (sent[wished.name] ?? 0) + 1 }),
    );
  };

  const wish = (person: Celebrant) =>
    setTarget({ name: person.name, subfamily: person.branch });

  return (
    <aside
      aria-labelledby="family-birthdays"
      className={cn(
        "border-member-border bg-surface shadow-member rounded-lg border p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="bg-member-tint text-brand grid size-9 shrink-0 place-items-center rounded-md">
          <Calendar aria-hidden className="size-5" />
        </span>
        <h2
          id="family-birthdays"
          className="text-h4-m md:text-h4 text-member-ink"
        >
          Family birthdays
        </h2>
      </div>

      <section aria-label="Today's birthdays" className="mt-6 space-y-5">
        {today.length === 0 ? (
          <p className="text-body-sm text-muted">
            No birthdays today. The next ones are below.
          </p>
        ) : (
          today.map((person) => {
            const count = sent[person.name] ?? 0;
            return (
              <div key={person.id}>
                <div className="flex items-center gap-4">
                  <PersonAvatar
                    name={person.name}
                    photo={person.photo}
                    sizes="4.5rem"
                    className="text-h4 size-18 rounded-md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-caption text-brand font-semibold">
                      Birthday today
                    </p>
                    <Link
                      href={`${ROUTES.PEOPLE}/${person.id}`}
                      className="text-h4-m text-member-ink block truncate hover:underline"
                    >
                      {person.name}
                    </Link>
                    <p className="text-body-sm text-muted">
                      {person.branch} family
                    </p>
                  </div>
                  <DateTile month={person.month} day={person.day} strong />
                </div>
                <Button onClick={() => wish(person)} className="mt-4 w-full">
                  <Send aria-hidden className="size-4" />
                  {count > 0 ? "Send another wish" : "Send a warm family wish"}
                </Button>
              </div>
            );
          })
        )}
      </section>

      <h3 className="text-ui text-member-ink border-member-border mt-6 border-t pt-6">
        Upcoming birthdays
      </h3>

      {upcoming.length === 0 ? (
        <p className="text-body-sm text-muted mt-3">
          No birthdays in the register yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {upcoming.map((person) => (
            <li
              key={person.id}
              className="border-member-border flex items-center gap-3 rounded-md border p-3"
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
                <span
                  className={cn(
                    "text-caption-sm rounded-pill mt-0.5 inline-block px-2 py-0.5",
                    branchChip(person.branch),
                  )}
                >
                  {person.branch}
                </span>
              </div>
              <button
                type="button"
                onClick={() => wish(person)}
                aria-label={`Send a family wish for ${person.name}'s day`}
                className="text-brand hover:bg-member-tint grid size-10 shrink-0 place-items-center rounded-full transition-colors"
              >
                <Heart aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={ROUTES.BIRTHDAYS}
        className="text-body-sm text-brand hover:text-brand-hover mt-5 inline-flex items-center gap-1.5 font-semibold"
      >
        View all birthdays
        <ArrowRight aria-hidden className="size-4" />
      </Link>

      <WishDialog
        target={target}
        onClose={() => setTarget(null)}
        onSent={recordWish}
      />
    </aside>
  );
}
