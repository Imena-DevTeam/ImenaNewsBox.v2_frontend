import type { ImageSource } from "@/types/media";
/**
 * Everything the dashboard knows until the backend exists. The member's
 * name arrives in the session later; for now it is a sample so the page is
 * honest about being sample content.
 */
import {
  blogReunion,
  dashboardFamilyGathering,
  heroFamily,
} from "@/lib/images";

export interface Slide {
  title: string;
  image: ImageSource;
  alt: string;
}

export const SLIDES: Slide[] = [
  {
    title: "Weekly Family Gathering: Reconnecting & Honoring Our Heritage",
    image: dashboardFamilyGathering,
    alt: "Young family members gathered outside a brick school building",
  },
  {
    title: "The Family Reunion: Gathering Around the Year That Was",
    image: blogReunion,
    alt: "The extended family posing together beneath green and white balloons",
  },
  {
    title: "Remembrance Day: Keeping the Flame of the Family Alive",
    image: heroFamily,
    alt: "Family members in white robes standing before a memorial flame",
  },
];
