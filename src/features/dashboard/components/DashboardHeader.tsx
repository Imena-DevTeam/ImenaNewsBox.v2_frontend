"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { useSignedIn } from "@/components/layout/SignedIn";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { SearchButton } from "@/components/layout/SearchButton";
import { DashboardGreeting } from "./DashboardGreeting";

const AVATAR = elder3;

/**
 * The dashboard's top: the welcome line with the member's bell and profile
 * chip across from it, and the blog search on its own full-width row beneath —
 * the order the design sets it in.
 */
export function DashboardHeader({ search }: { search?: ReactNode }) {
  const person = useSignedIn();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <DashboardGreeting />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationBell />

          <Link
            href={ROUTES.PROFILE}
            aria-label={`Open ${person.name}'s profile`}
            className="border-member-border bg-surface shadow-menu focus-visible:outline-brand hover:border-brand flex items-center gap-2.5 rounded-full border py-1.5 pr-2 pl-1.5 transition-colors sm:pr-4"
          >
            <span className="size-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={AVATAR}
                alt={`Portrait of ${person.name}`}
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="text-member-ink block text-sm font-semibold">
                {person.name}
              </span>
              <span className="text-muted text-caption block">
                {person.role}
              </span>
            </span>
          </Link>
        </div>
      </div>

      {search ? <div className="w-full">{search}</div> : null}
    </div>
  );
}
