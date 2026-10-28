import type { StaticImageData } from "next/image";

export type Subfamily = "Sanctuary" | "Light" | "Wihogora" | "Hope";

export type HierarchyRole =
  | "grand_pere"
  | "grand_mere"
  | "coordinator"
  | "vice_coordinator"
  | "pere_light"
  | "mere_light"
  | "pere_wihogora"
  | "mere_wihogora"
  | "pere_hope"
  | "mere_hope";

export interface TreePerson {
  id: string;
  name: string;
  role: HierarchyRole;
  /** The title as the family says it, e.g. "Grand Père", "Mère Light". */
  roleLabel: string;
  subfamily: Subfamily;
  image: StaticImageData;
  bio: string;
  quote?: string;
  /** Where they are now, e.g. "Kigali, Rwanda" or "Diaspora". */
  location?: string;
  /** The promotion they lead, e.g. "2019-2020". */
  promotionYear: string;
}

export interface PromotionRecord {
  id: string;
  /** "2019-2020" */
  year: string;
  /** "The 2019-2020 Promotion" */
  label: string;
  memberCount: number;
  members: TreePerson[];
}
