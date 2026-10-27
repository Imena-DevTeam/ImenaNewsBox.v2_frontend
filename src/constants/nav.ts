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
  { label: "Tree", href: ROUTES.FAMILY_TREE },
  { label: "Gallery", href: ROUTES.GALLERY },
  { label: "Resources", href: ROUTES.RESOURCES },
  { label: "Birthdays", href: ROUTES.BIRTHDAYS },
  { label: "Profile", href: ROUTES.PROFILE },
];

/** The member footer's quick links. "Archive" is the family blog. */
export const MEMBER_FOOTER_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD },
  { label: "Archive", href: ROUTES.BLOGS },
  { label: "Tree", href: ROUTES.FAMILY_TREE },
  { label: "Birthdays", href: ROUTES.BIRTHDAYS },
  { label: "Profile", href: ROUTES.PROFILE },
];

/** The three branches, as the footer's chips link to them. */
export const SUBFAMILY_LINKS: NavItem[] = ["Wihogora", "Light", "Hope"].map(
  (name) => ({ label: name, href: `${ROUTES.FAMILY_TREE}#family-tree` }),
);

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
