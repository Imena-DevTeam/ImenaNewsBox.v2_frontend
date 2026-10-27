import type { StaticImageData } from "next/image";
import {
  aboutFamily,
  blogReunion,
  dashboardFamilyGathering,
  handover1,
  handover2,
  handover3,
  heroFamily,
  storyCircle,
} from "@/lib/images";

/** The video carousel. The label is what the design's white pill holds. */
export const FEATURED_VIDEO_SLIDES = [
  {
    title: "Fete celebration",
    image: dashboardFamilyGathering,
    alt: "Family members gathered outside a brick school building",
  },
  {
    title: "The handover evening",
    image: handover2,
    alt: "Family members celebrating a handover together",
  },
  {
    title: "Reunion day",
    image: blogReunion,
    alt: "The extended family posing together at a reunion",
  },
] as const;

export interface AlbumPhoto {
  image: StaticImageData;
  alt: string;
}

export interface Album {
  slug: string;
  title: string;
  /** The card's photograph, and the first one inside the album. */
  image: StaticImageData;
  alt: string;
  photos: AlbumPhoto[];
}

/* TODO: the real albums. Until the gallery API exists these six are made of
   the photographs the site already ships, so every card and every album
   page has something true to show. */
const ALL_PHOTOS: AlbumPhoto[] = [
  { image: handover1, alt: "The family gathered at a handover celebration" },
  { image: handover2, alt: "Family elders seated together in white" },
  { image: handover3, alt: "The torch carried at a remembrance gathering" },
  { image: blogReunion, alt: "The extended family beneath green balloons" },
  { image: aboutFamily, alt: "The family outside the family house" },
  {
    image: dashboardFamilyGathering,
    alt: "Young family members outside a brick school building",
  },
  { image: heroFamily, alt: "Family members before a memorial flame" },
  { image: storyCircle, alt: "Family members laughing over a selfie" },
];

const photosFrom = (start: number, count: number): AlbumPhoto[] =>
  Array.from(
    { length: count },
    (_, index) => ALL_PHOTOS[(start + index) % ALL_PHOTOS.length]!,
  );

export const FEATURED_ALBUMS: Album[] = [
  {
    slug: "family-celebrations",
    title: "Family celebrations",
    image: handover1,
    alt: "The family gathered at a handover celebration",
    photos: photosFrom(0, 6),
  },
  {
    slug: "fete-memories",
    title: "Fete memories",
    image: handover2,
    alt: "Family elders seated together in white",
    photos: photosFrom(1, 5),
  },
  {
    slug: "family-handovers",
    title: "Family handovers",
    image: handover3,
    alt: "The torch carried at a remembrance gathering",
    photos: photosFrom(2, 7),
  },
  {
    slug: "reunion-moments",
    title: "Reunion moments",
    image: blogReunion,
    alt: "The extended family beneath green balloons",
    photos: photosFrom(3, 4),
  },
  {
    slug: "our-family-story",
    title: "Our family story",
    image: aboutFamily,
    alt: "The family outside the family house",
    photos: photosFrom(4, 6),
  },
  {
    slug: "gathered-together",
    title: "Gathered together",
    image: dashboardFamilyGathering,
    alt: "Young family members outside a brick school building",
    photos: photosFrom(5, 8),
  },
];

export function albumBySlug(slug: string): Album | undefined {
  return FEATURED_ALBUMS.find((album) => album.slug === slug);
}

/** The five the opening stage turns through. */
export const FEATURED_IMAGES = FEATURED_ALBUMS.slice(0, 5);
