"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Mail, PartyPopper } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CONTACT_EMAIL_HREF } from "@/constants/site";
import { cn } from "@/lib/cn";
import { TODAY, UPCOMING } from "../data";

/**
 * The right-hand column of the dashboard: who celebrates today and who is
 * next. There is no message service yet, so the actions open the member's
 * email application with a prepared wish instead of pretending to deliver or
 * archive a message from this page.
 */
export function BirthdaysPanel({ className }: { className?: string }) {
  const wishHref = (name: string) => {
    const subject = encodeURIComponent(`Warm family wish for ${name}`);
    const body = encodeURIComponent(
      `Hello IMENA family,\n\nI would like to send a warm family wish to ${name}.\n\n`,
    );
    return `${CONTACT_EMAIL_HREF}?subject=${subject}&body=${body}`;
  };

  return (
    <aside
      aria-labelledby="family-birthdays"
      className={cn(
        "border-member-border bg-member-tint shadow-member rounded-lg border p-5 sm:p-6",
        className,
      )}
    >
      <p className="text-brand text-caption mb-2 font-semibold tracking-[0.16em] uppercase">
        Celebration board
      </p>
      <h2
        id="family-birthdays"
        className="text-h2-m text-member-ink md:text-h2"
      >
        Family Birthdays
      </h2>
      <p className="text-body-sm text-muted mt-3">
        Celebrating life, joy, and the growth of our brothers and sisters across
        all subfamilies.
      </p>

      <article className="bg-member-night text-surface shadow-member mt-6 rounded-lg p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="bg-surface/10 rounded-pill text-caption flex items-center gap-2 px-4 py-1.5">
            <PartyPopper aria-hidden className="size-4" />
            Today&rsquo;s family birthday!
          </p>
          <p className="bg-member-chip text-caption rounded-pill px-3 py-1.5 text-white">
            {TODAY.date}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Image
            src={TODAY.avatar}
            alt={TODAY.avatarAlt}
            width={72}
            height={72}
            className="rounded-md object-cover"
          />
          <div>
            <p className="text-caption text-surface/70">{TODAY.nickname}</p>
            <p className="text-h4-m md:text-h4 font-semibold uppercase">
              {TODAY.name}
            </p>
            <p className="bg-surface/15 rounded-pill text-caption text-surface/85 mt-1.5 w-max px-3 py-1">
              {TODAY.subfamily} Family
            </p>
          </div>
        </div>

        <p className="text-body-sm mt-5 flex items-center gap-2 font-semibold">
          <Heart aria-hidden className="text-member-heart size-4" />
          {TODAY.wishes} family wishes sent
        </p>

        <ButtonLink
          href={wishHref(TODAY.name)}
          variant="light"
          className="rounded-field text-body-sm mt-5 w-full"
        >
          <Mail aria-hidden className="text-brand size-4" />
          Email a Warm Family Wish
        </ButtonLink>

        <p className="text-caption text-surface/70 mt-4 text-center">
          Opens your email app; nothing is sent by this page.
        </p>
      </article>

      <h3 className="text-h4-m md:text-h4 mt-8">Upcoming Birthdays</h3>

      <ul className="mt-4 space-y-2">
        {UPCOMING.map((birthday) => (
          <li
            key={birthday.name}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-3"
          >
            <p className="bg-member-chip text-caption flex flex-col items-center rounded-md px-2.5 py-2 text-white">
              <span>{birthday.month}</span>
              <span className="font-semibold">{birthday.day}</span>
            </p>

            <Image
              src={birthday.avatar}
              alt={birthday.avatarAlt}
              width={48}
              height={48}
              className="rounded-pill object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-body-sm flex flex-wrap items-center gap-2 font-semibold">
                {birthday.name}
                <span className="text-brand text-caption rounded-pill bg-member-tint px-2 py-0.5">
                  {birthday.subfamily}
                </span>
              </p>
              <p className="text-caption text-muted mt-1">
                Child of {birthday.parent}
              </p>
            </div>

            <Link
              href={wishHref(birthday.name)}
              aria-label={`Email a family wish for ${birthday.name}'s day`}
              className="transition-fast rounded-pill bg-member-tint text-muted hover:text-member-heart focus-visible:outline-brand inline-flex size-11 shrink-0 items-center justify-center"
            >
              <Mail aria-hidden className="size-4" />
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-caption text-muted mt-6 text-center">
        Sample records, shown until the family register is connected.
      </p>
    </aside>
  );
}
