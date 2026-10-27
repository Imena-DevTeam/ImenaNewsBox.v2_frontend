import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { MEMBER } from "@/constants/member";

/**
 * The one-word title every member page opens with, with the bell and the
 * member's portrait across from it. The subtitle is the small line the
 * blogs frame carries under its title; the gallery has none.
 */
export function PageHeader({
  title = "Gallery",
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div>
        <h1 className="text-page-title-m md:text-page-title text-text uppercase">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-member-ink text-caption mt-1 text-center">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-6 md:gap-11">
        {/* Not a button: there is nowhere for it to lead until family
            updates are connected, so it says what it is and nothing more. */}
        <span className="text-member-rail-ink relative inline-flex">
          <Bell aria-hidden className="size-6" strokeWidth={1.7} />
          <span
            aria-hidden
            className="bg-member-dot rounded-pill absolute -top-0.5 -right-0.5 size-1.75"
          />
          <span className="sr-only">
            Family notifications, not connected yet
          </span>
        </span>

        <Link
          href={ROUTES.PROFILE}
          aria-label={`Open ${MEMBER.name}'s profile`}
          className="border-member-border shadow-menu focus-visible:outline-brand rounded-pill grid size-12 place-items-center border p-1"
        >
          <Image
            src={elder3}
            alt={`Portrait of ${MEMBER.name}`}
            width={40}
            height={40}
            className="rounded-pill size-10 object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
