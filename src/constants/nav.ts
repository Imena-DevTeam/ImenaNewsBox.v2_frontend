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

/** Columns and labels as they appear in the Figma footer. */
export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Home",
    items: [
      { label: "Benefits", href: ROUTES.OUR_STORY },
      { label: "Features", href: ROUTES.FAMILY_TREE },
    ],
  },
  {
    heading: "Platform",
    items: [
      { label: "Solution", href: ROUTES.FAMILY_TREE },
      { label: "Overview", href: ROUTES.OUR_STORY },
      { label: "Portfolio", href: ROUTES.GALLERY },
    ],
  },
  {
    heading: "About us",
    items: [
      { label: "Connectors", href: ROUTES.OUR_STORY },
      { label: "Security", href: ROUTES.OUR_STORY },
      { label: "Contact Us", href: ROUTES.OUR_STORY },
    ],
  },
];
