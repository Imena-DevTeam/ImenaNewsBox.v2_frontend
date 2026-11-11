import { ROUTES } from "@/constants/routes";
import { CONTACT_EMAIL_HREF } from "@/constants/site";

export interface NavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Our Story", href: ROUTES.OUR_STORY },
  { label: "Family Tree", href: ROUTES.FAMILY_TREE },
];

/**
 * The single navigation model shared by every member page, in the order the
 * design's rail lists it. The rail itself lifts whichever of these is the
 * open page to the top; see MemberSidebar.
 */
export const MEMBER_NAV: NavItem[] = [
  { label: "Home", href: ROUTES.DASHBOARD },
  { label: "Blogs", href: ROUTES.BLOGS },
  { label: "Tree", href: ROUTES.TREE },
  { label: "Gallery", href: ROUTES.GALLERY },
  { label: "Resources", href: ROUTES.RESOURCES },
  { label: "Birthdays", href: ROUTES.BIRTHDAYS },
  { label: "Profile", href: ROUTES.PROFILE },
];

/**
 * The one extra place an admin sees in the rail. Admins read the site as
 * everyone else does; this is the single door to the things only they can
 * do, and what is behind it is ADMIN_TOOLS.
 */
export const ADMIN_NAV: NavItem[] = [{ label: "Admin", href: ROUTES.ADMIN }];

/**
 * The blogger's one extra place, on the same terms as the admin's.
 *
 * She signs in at the member login like everybody else; the register says
 * she is the blogger, and this appears in her rail. An administrator sees it
 * too — they answer for what the family publishes.
 */
export const STUDIO_NAV: NavItem[] = [{ label: "Studio", href: ROUTES.STUDIO }];

/**
 * The administrator's two pages: what needs doing, and the people register.
 *
 * Posts and albums were here until 11 Nov 2026. They are the social media
 * manager's work, so they left the navigation; the pages themselves still
 * exist and still carry this row, which simply marks nothing while you are
 * on one of them.
 */
export const ADMIN_TABS: NavItem[] = [
  { label: "Overview", href: ROUTES.ADMIN },
  { label: "Members", href: ROUTES.ADMIN_MEMBERS },
];

/** The studio's three pages, the same row the admin area carries. */
export const STUDIO_TABS: NavItem[] = [
  { label: "Overview", href: ROUTES.STUDIO },
  { label: "Posts", href: ROUTES.STUDIO_POSTS },
  { label: "Albums", href: ROUTES.STUDIO_ALBUMS },
];

/** The member footer's link groups. "Archive" is the family blog. */
export const MEMBER_FOOTER_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The family",
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD },
      { label: "Family tree", href: ROUTES.TREE },
      { label: "Birthdays", href: ROUTES.BIRTHDAYS },
    ],
  },
  {
    heading: "Memories",
    items: [
      { label: "Gallery", href: ROUTES.GALLERY },
      { label: "Archive", href: ROUTES.BLOGS },
      { label: "Resources", href: ROUTES.RESOURCES },
    ],
  },
];

/** The footer columns. Every destination here is a page that exists. */
export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Explore",
    items: [
      { label: "Family Tree", href: ROUTES.FAMILY_TREE },
      { label: "Gallery", href: ROUTES.GALLERY },
      { label: "Blogs", href: ROUTES.BLOGS },
    ],
  },
  {
    heading: "The family",
    items: [
      { label: "Our Story", href: ROUTES.OUR_STORY },
      { label: "Core values", href: `${ROUTES.HOME}#values` },
    ],
  },
  {
    heading: "Members",
    items: [
      { label: "Join as a member", href: ROUTES.SIGNUP },
      { label: "Log in", href: ROUTES.LOGIN },
      { label: "Contact us", href: CONTACT_EMAIL_HREF },
    ],
  },
];
