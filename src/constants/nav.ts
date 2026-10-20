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
