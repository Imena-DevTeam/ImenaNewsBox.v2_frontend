import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { MEMBER } from "@/constants/member";

const AVATAR = elder3;

/** The dashboard greeting, unavailable notification status and profile link. */
export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <h1 className="text-welcome-m lg:text-welcome min-w-0 leading-tight whitespace-nowrap uppercase max-sm:text-xl">
        Welcome <span className="text-brand">{MEMBER.name.toUpperCase()}.</span>
      </h1>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <span
          role="img"
          aria-label="Notifications unavailable until family updates are connected"
          title="Notifications unavailable until family updates are connected"
          className="text-muted flex size-8 items-center justify-center sm:size-10"
        >
          <Bell aria-hidden className="size-5" />
        </span>

        <Link
          href={ROUTES.PROFILE}
          aria-label={`Open ${MEMBER.name}'s profile`}
          className="border-member-border bg-surface shadow-menu transition-fast hover:border-brand rounded-pill flex items-center gap-0.5 border py-0 pr-1 pl-0.5 sm:gap-1 sm:pr-2 sm:pl-1"
        >
          <Image
            src={AVATAR}
            alt={`Portrait of ${MEMBER.name}`}
            width={32}
            height={32}
            className="rounded-pill size-7 shrink-0 object-cover sm:size-8"
          />
          <div className="text-caption max-sm:leading-tight">
            <p className="text-member-ink font-semibold">{MEMBER.name}</p>
            <p className="text-muted text-caption-sm">{MEMBER.role}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
