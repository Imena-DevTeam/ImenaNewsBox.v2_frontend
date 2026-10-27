import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, TreeDeciduous } from "lucide-react";
import { endMemberSession } from "@/app/actions/session";
import { MEMBER } from "@/constants/member";
import { MEMBER_FOOTER_NAV, SUBFAMILY_LINKS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import {
  FAMILY_HERITAGE,
  FAMILY_MEMBER_COUNT,
  FAMILY_MOTTO,
  FAMILY_MOTTO_MEANING,
} from "@/constants/site";
import { BackToTop } from "./BackToTop";

/**
 * The close of every member page, written as the family's own sign-off
 * rather than a legal notice: who you are signed in as, the family's motto
 * and where it began, the three branches, the quick ways onwards, and the
 * way out.
 *
 * A frosted surface parted from the page by a soft gradient line instead of
 * a hard grey bar. The generous bottom padding on phones keeps everything
 * clear of the floating navigation dock.
 */
export function MemberFooter() {
  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <footer className="shadow-footer border-member-border/80 bg-surface/75 relative mt-16 w-full border-t pt-10 pb-28 backdrop-blur-md md:pb-10">
      {/* The gradient divider that replaces the old grey bar. */}
      <span
        aria-hidden
        className="via-brand/40 absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent to-transparent"
      />

      <div className="max-w-page mx-auto px-4 md:pr-8 md:pl-30">
        {/* Presence: who is here, and the state of the archive. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="border-member-border text-caption text-member-ink rounded-full border bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            Logged in as <span className="font-semibold">{MEMBER.name}</span>{" "}
            <span className="text-muted">•</span> {MEMBER.subfamily} Family
          </p>

          <p className="text-caption text-muted flex items-center gap-2">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>
              Family Archive Live • {FAMILY_MEMBER_COUNT} Members Connected
            </span>
          </p>
        </div>

        {/* The heart of it: the motto, its sense, and where it began. */}
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p
            lang="rw"
            className="font-member-serif text-h4-m md:text-h4 text-tagline-ink italic"
          >
            &ldquo;{FAMILY_MOTTO}&rdquo;
          </p>
          <p className="text-body-sm text-muted mt-2">{FAMILY_MOTTO_MEANING}</p>
          <p className="border-celebration-gold/50 bg-celebration-gold/10 text-caption text-member-ink mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-semibold">
            <TreeDeciduous aria-hidden className="text-brand size-3.5" />
            {FAMILY_HERITAGE}
          </p>
        </div>

        <span
          aria-hidden
          className="via-member-border mx-auto mt-10 block h-px max-w-3xl bg-gradient-to-r from-transparent to-transparent"
        />

        {/* Utilities: the branches, the quick links, the way out, the top. */}
        <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <nav
            aria-label="Family branches"
            className="flex flex-wrap justify-center gap-2"
          >
            {SUBFAMILY_LINKS.map((branch) => (
              <Link
                key={branch.label}
                href={branch.href}
                className="bg-member-tint text-brand text-caption hover:bg-brand hover:text-surface focus-visible:outline-brand rounded-full px-3 py-1.5 font-semibold transition-colors"
              >
                {branch.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Member quick links">
            <ul className="text-body-sm flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {MEMBER_FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-member-ink/80 hover:text-brand focus-visible:outline-brand transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-muted hover:text-danger focus-visible:outline-brand inline-flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut aria-hidden className="size-3.5" />
                    Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </nav>

          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
