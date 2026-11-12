import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { CONTACT_EMAIL_HREF } from "@/constants/site";
import { cn } from "@/lib/cn";

export const FOOTER_HEADING = "text-sm font-semibold text-surface";
export const FOOTER_LINK =
  "inline-block py-1 text-left text-sm text-celebration-gold transition-colors hover:text-surface focus-visible:outline-white";
export const FOOTER_LEGAL =
  "text-caption text-celebration-gold font-normal underline underline-offset-2 transition-colors hover:text-surface";

/** One column of links under a plain heading. */
export function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={heading} className="min-w-28">
      <h2 className={FOOTER_HEADING}>{heading}</h2>
      <ul className="mt-4 space-y-1.5">{children}</ul>
    </nav>
  );
}

export function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className={FOOTER_LINK}>
        {label}
      </Link>
    </li>
  );
}

/**
 * The close of every page: a deep-blue card holding the family's mark, a
 * line about the place and the ways to reach it on the left, the gold link
 * columns on the right, and a soft rule above the small print, which sits
 * centred along the bottom of the card. The family's
 * name sits huge and barely there along the very bottom of the page, half
 * tucked behind the card.
 */
export function FooterFrame({
  intro,
  columns,
  bottomStart,
  bottomEnd,
  className,
}: {
  intro: ReactNode;
  columns: ReactNode;
  bottomStart: ReactNode;
  bottomEnd?: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "relative mt-auto w-full overflow-hidden px-4 pt-16 pb-[clamp(2rem,6vw,5rem)] md:px-6",
        className,
      )}
    >
      <p
        aria-hidden
        className="font-heading pointer-events-none absolute inset-x-0 bottom-0 translate-y-[18%] text-center text-[clamp(5rem,22vw,18rem)] leading-[0.8] font-black tracking-tight text-black/[0.035] select-none"
      >
        IMENA
      </p>

      <div className="max-w-page relative z-10 mx-auto">
        <div className="bg-primary-deep text-surface rounded-[2rem] px-7 py-10 shadow-[0_24px_60px_rgba(7,15,107,0.22)] sm:px-12 sm:py-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div className="max-w-md">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-white"
              >
                <Image
                  src="/images/imena-crest.webp"
                  alt=""
                  width={28}
                  height={28}
                  className="size-7"
                />
                <span className="font-heading text-surface text-lg font-bold">
                  IMENA Family
                </span>
              </Link>
              <div className="text-surface/75 mt-5 space-y-3 text-sm leading-relaxed">
                {intro}
              </div>
              <div className="mt-5 flex items-center gap-1">
                <a
                  href={CONTACT_EMAIL_HREF}
                  aria-label="Email the IMENA family"
                  className="text-surface flex size-9 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus-visible:outline-white"
                >
                  <Mail aria-hidden className="size-[18px]" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  aria-label="IMENA family on LinkedIn"
                  className="text-surface flex size-9 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus-visible:outline-white"
                >
                  <LinkedInIcon className="size-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-14 gap-y-10 lg:gap-x-16">
              {columns}
            </div>
          </div>

          <span
            aria-hidden
            className="rounded-pill mt-12 block h-0.5 bg-white/15"
          />
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            {bottomEnd ? (
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {bottomEnd}
              </div>
            ) : null}
            <div className="text-caption text-surface/70 font-normal">
              {bottomStart}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** lucide-react no longer ships brand marks, so the glyph lives here. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.77-2.07c4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
    </svg>
  );
}
