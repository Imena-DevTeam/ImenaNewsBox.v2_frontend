import Link from "next/link";
import { redirect } from "next/navigation";
import { endMemberSession } from "@/app/actions/session";
import { MEMBER_FOOTER_GROUPS } from "@/constants/nav";
import { SignedInName } from "./SignedInName";
import { ROUTES } from "@/constants/routes";
import {
  FAMILY_FOUNDED,
  FAMILY_MEMBER_COUNT,
  FAMILY_MOTTO,
} from "@/constants/site";
import { BackToTop } from "./BackToTop";
import { FooterUpdates } from "./FooterUpdates";
import {
  FOOTER_LINK,
  FooterColumn,
  FooterFrame,
  FooterLink,
} from "./FooterFrame";

/**
 * The close of every member page: the family's name and what this place is
 * for, then three plain columns of where to go. The last is the signed-in
 * member's own: their profile, the updates they have not seen, and the way
 * out. Generous bottom padding on phones keeps it clear of the floating dock,
 * and the left padding keeps it clear of the rail.
 */
export function MemberFooter() {
  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <FooterFrame
      className="max-md:pb-32 md:pr-8 md:pl-30"
      intro={
        <>
          <p>
            A private archive for the Wihogora, Light and Hope families: the
            tree, the photographs, the birthdays and the stories, kept in one
            place for the people in them.
          </p>
          <p lang="rw" className="font-member-serif text-balance italic">
            &ldquo;{FAMILY_MOTTO}&rdquo;
          </p>
        </>
      }
      columns={
        <>
          {MEMBER_FOOTER_GROUPS.map((group) => (
            <FooterColumn key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <FooterLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                />
              ))}
            </FooterColumn>
          ))}
          <FooterColumn heading="You">
            <li>
              <Link href={ROUTES.PROFILE} className={FOOTER_LINK}>
                <SignedInName />
              </Link>
            </li>
            <li>
              <FooterUpdates className={FOOTER_LINK} />
            </li>
            <li>
              <form action={signOut}>
                <button type="submit" className={FOOTER_LINK}>
                  Sign out of this device
                </button>
              </form>
            </li>
          </FooterColumn>
        </>
      }
      bottomStart={
        <p>
          &copy; {new Date().getFullYear()} IMENA Family. Together since{" "}
          {FAMILY_FOUNDED}, more than {FAMILY_MEMBER_COUNT} of us.
        </p>
      }
      bottomEnd={<BackToTop tone="dark" />}
    />
  );
}
