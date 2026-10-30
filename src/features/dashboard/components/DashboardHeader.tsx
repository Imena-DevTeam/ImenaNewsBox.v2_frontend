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
          className="border-member-border bg-surface shadow-menu focus-visible:outline-brand group hover:border-brand relative flex size-10 items-center justify-center rounded-full border p-0.5 transition-all duration-200"
        >
          <div className="size-full overflow-hidden rounded-full">
            <Image
              src={AVATAR}
              alt={`Portrait of ${MEMBER.name}`}
              width={36}
              height={36}
              className="size-full object-cover"
            />
          </div>

          {/* Hover tooltip showing member name and role */}
          <div
            role="tooltip"
            className="pointer-events-none absolute top-full right-0 z-50 mt-2 -translate-y-1 rounded-xl border border-neutral-200/90 bg-white/95 px-3 py-1.5 whitespace-nowrap opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <p className="text-xs leading-tight font-bold text-neutral-900">
              {MEMBER.name}
            </p>
            <p className="text-[10px] leading-tight font-medium text-neutral-500">
              {MEMBER.role}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
