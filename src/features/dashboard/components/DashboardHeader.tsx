import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { MEMBER } from "@/constants/member";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { DashboardGreeting } from "./DashboardGreeting";

const AVATAR = elder3;

/**
 * The dashboard's top bar: the Kinyarwanda greeting with its Kigali time,
 * weather and updates pills, the blog search, and the member's bell and
 * profile chip. One row from `lg` up, aligned to the greeting's first line;
 * below `lg` the search drops to a full-width row of its own.
 */
export function DashboardHeader({ search }: { search?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
      <DashboardGreeting />

      {search ? (
        <div className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1">
          {search}
        </div>
      ) : null}

      <div className="order-2 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3 lg:order-3 lg:ml-0">
        <NotificationBell />

        <Link
          href={ROUTES.PROFILE}
          aria-label={`Open ${MEMBER.name}'s profile`}
          className="border-member-border bg-surface shadow-menu transition-fast hover:border-brand rounded-pill flex items-center gap-2 border py-1 pr-3 pl-1"
        >
          <Image
            src={AVATAR}
            alt={`Portrait of ${MEMBER.name}`}
            width={32}
            height={32}
            className="rounded-pill size-8 shrink-0 object-cover"
          />
          <div className="text-caption leading-tight">
            <p className="text-member-ink font-semibold">{MEMBER.name}</p>
            <p className="text-muted text-caption-sm">{MEMBER.role}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
