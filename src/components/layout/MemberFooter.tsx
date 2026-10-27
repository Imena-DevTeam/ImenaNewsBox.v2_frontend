import Link from "next/link";
import { redirect } from "next/navigation";
import { endMemberSession } from "@/app/actions/session";
import { MEMBER } from "@/constants/member";
import { MEMBER_FOOTER_GROUPS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import {
  FAMILY_FOUNDED,
  FAMILY_MEMBER_COUNT,
  FAMILY_MOTTO,
} from "@/constants/site";
import { BackToTop } from "./BackToTop";
import { FooterUpdates } from "./FooterUpdates";

const HEADING = "text-caption text-member-ink tracking-widest uppercase";
const LINK =
  "text-body text-member-rail-ink hover:text-brand text-left transition-colors focus-visible:outline-brand";

/**
 * The close of every member page: the family's name and what this place is
 * for, then three plain columns of where to go. The last is the signed-in
 * member's own: their profile, the updates they have not seen, and the way
 * out. Generous bottom padding on phones keeps it clear of the floating dock.
 */
export function MemberFooter() {
  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <footer className="bg-member-panel border-member-border mt-20 w-full border-t pb-28 md:pb-12">
      <div className="max-w-page mx-auto px-4 pt-14 md:pt-16 md:pr-8 md:pl-30">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div>
            <p className="text-h4-m md:text-h4 text-member-ink">
              IMENA{" "}
              <span className="font-member-serif font-normal italic">
                Family Times
              </span>
            </p>
            <p className="text-body text-member-rail-ink mt-5 max-w-md">
              A private archive for the Wihogora, Light and Hope families: the
              tree, the photographs, the birthdays and the stories, kept in one
              place for the people in them.
            </p>
            <p
              lang="rw"
              className="font-member-serif text-body text-member-rail-ink mt-5 max-w-md text-balance italic"
            >
              &ldquo;{FAMILY_MOTTO}&rdquo;
            </p>
          </div>

          {MEMBER_FOOTER_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className={HEADING}>{group.heading}</h2>
              <ul className="mt-5 space-y-3.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={LINK}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className={HEADING}>You</h2>
            <ul className="mt-5 space-y-3.5">
              <li>
                <Link href={ROUTES.PROFILE} className={LINK}>
                  {MEMBER.name}, {MEMBER.subfamily} family
                </Link>
              </li>
              <li>
                <FooterUpdates className={LINK} />
              </li>
              <li>
                <form action={signOut}>
                  <button type="submit" className={LINK}>
                    Sign out of this device
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-member-border mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <BackToTop />
          <p className="text-caption text-member-rail-ink font-normal">
            &copy; {new Date().getFullYear()} IMENA Family. Together since{" "}
            {FAMILY_FOUNDED}, more than {FAMILY_MEMBER_COUNT} of us.
          </p>
        </div>
      </div>
    </footer>
  );
}
