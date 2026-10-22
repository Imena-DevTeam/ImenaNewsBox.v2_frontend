import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

type AuthShellProps = {
  /** Heading lines, each on its own line. */
  title: string[];
  children: ReactNode;
};

/**
 * Login page layout: a white page with the form column on the left and a
 * blob-cut family photo near the top right. The photo and the lavender
 * hearts and house outlines only show on desktop.
 */
export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-6 sm:px-10 lg:p-11.25">
      <div aria-hidden="true" className="pointer-events-none hidden lg:block">
        <Image
          src="/images/auth-blob.png"
          alt=""
          width={1036}
          height={1008}
          priority
          draggable={false}
          className="auth-blob select-none"
        />
        <Image
          src="/images/hearts.svg"
          alt=""
          width={90}
          height={81}
          className="auth-hearts"
        />
        <div className="auth-house">
          <Image src="/images/house.svg" alt="" width={149} height={155} />
        </div>
      </div>

      <Link
        href={ROUTES.HOME}
        className="group rounded-pill border-text bg-surface text-text transition-base hover:bg-text hover:text-surface relative z-10 inline-flex h-12 items-center gap-3 self-start border px-5.5 text-xl"
      >
        <Image
          src="/icons/arrow-back.svg"
          alt=""
          width={14}
          height={14}
          className="group-hover:invert"
        />
        Back To Home
      </Link>

      <div className="lg:pl-auth-inset relative flex flex-1 items-center py-10 lg:py-6">
        <div className="max-w-auth-form page-enter mx-auto w-full lg:mx-0">
          <h1 className="font-auth-heading text-auth-title">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
