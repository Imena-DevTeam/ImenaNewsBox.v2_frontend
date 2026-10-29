import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { MEMBER } from "@/constants/member";
import { NotificationBell } from "./NotificationBell";

/**
 * The one-word title every member page opens with, with the bell and the
 * member's portrait across from it. The subtitle is the small line the
 * blogs frame carries under its title; the gallery has none.
 */
export function PageHeader({
  title = "Gallery",
  subtitle,
  as: Component = "h1",
}: {
  title?: string;
  subtitle?: string;
  as?: "h1" | "p";
}) {
  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div>
        <Component className="text-page-title-m md:text-page-title text-text uppercase">
          {title}
        </Component>
        {subtitle ? (
          <p className="text-member-ink text-caption mt-1 text-center">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-4 md:gap-8">
        <NotificationBell />

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
