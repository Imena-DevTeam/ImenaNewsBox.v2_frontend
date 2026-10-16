import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Our Story", href: ROUTES.OUR_STORY },
  { label: "Family Tree", href: ROUTES.FAMILY_TREE },
];

export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Family",
    items: [
      { label: "Home", href: ROUTES.HOME },
      { label: "Our Story", href: ROUTES.OUR_STORY },
      { label: "Family Tree", href: ROUTES.FAMILY_TREE },
    ],
  },
  {
    heading: "Platform",
    items: [
      { label: "Gallery", href: ROUTES.GALLERY },
      { label: "Blogs and Posts", href: ROUTES.BLOGS },
      { label: "Join as a Member", href: ROUTES.SIGNUP },
    ],
  },
  {
    heading: "About us",
    items: [
      { label: "Our Values", href: `${ROUTES.OUR_STORY}#values` },
      { label: "Subfamilies", href: `${ROUTES.OUR_STORY}#subfamilies` },
      { label: "Contact Us", href: `${ROUTES.OUR_STORY}#contact` },
    ],
  },
];
