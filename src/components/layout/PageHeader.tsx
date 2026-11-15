"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { NotificationBell } from "./NotificationBell";
import { SearchButton } from "@/components/layout/SearchButton";
import { useSignedIn } from "./SignedIn";

/**
 * The one-word title every member page opens with, with the bell and the
 * portrait of whoever is signed in across from it. The subtitle is the small
 * line the blogs frame carries under its title; the gallery has none.
 *
 * The name comes from the session rather than from a constant, so the studio
 * does not greet the blogger as somebody else. The portrait is still the one
 * photograph the project ships: the register holds no portraits.
 */
export function PageHeader({
  title = "Gallery",
  subtitle,
  as: Component = "h1",
  badgeIcon,
  badgeLabel,
  rightActions,
}: {
  title?: string;
  subtitle?: string;
  as?: "h1" | "p";
  badgeIcon?: ReactNode;
  badgeLabel?: string;
  rightActions?: ReactNode;
}) {
  const person = useSignedIn();

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {badgeIcon ? (
          <div className="border-member-border/40 shadow-menu text-brand bg-surface hidden size-14 shrink-0 flex-col items-center justify-center rounded-full border p-1 sm:flex sm:size-16">
            <span className="text-brand flex items-center justify-center">
              {badgeIcon}
            </span>
            {badgeLabel ? (
              <span className="text-caption text-text leading-tight font-semibold">
                {badgeLabel}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="min-w-0">
          <Component className="text-page-title-m md:text-page-title text-text truncate font-extrabold tracking-tight uppercase">
            {title}
          </Component>
          {subtitle ? (
            <p className="text-member-ink text-caption mt-1">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-4 md:gap-8">
        {rightActions ?? (
          <>
            <SearchButton />
            <NotificationBell />

            <Link
              href={ROUTES.PROFILE}
              aria-label={`Open ${person.name}'s profile`}
              className="border-member-border bg-surface shadow-menu focus-visible:outline-brand group hover:border-brand relative flex size-10 items-center justify-center rounded-full border p-0.5 transition-all duration-200"
            >
              <div className="size-full overflow-hidden rounded-full">
                <Image
                  src={elder3}
                  alt={`Portrait of ${person.name}`}
                  width={36}
                  height={36}
                  className="size-full object-cover"
                />
              </div>

              {/* Hover tooltip showing member name and role */}
              <div
                role="tooltip"
                className="border-member-border/90 bg-surface/95 pointer-events-none absolute top-full right-0 z-50 mt-2 -translate-y-1 rounded-md border px-3 py-1.5 whitespace-nowrap opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >
                <p className="text-member-ink text-caption leading-tight font-bold">
                  {person.name}
                </p>
                <p className="text-caption text-muted leading-tight font-medium">
                  {person.role}
                </p>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
