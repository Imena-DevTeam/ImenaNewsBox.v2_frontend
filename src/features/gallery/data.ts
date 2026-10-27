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

/** What the lightbox shows beside a photograph. */
export interface PhotoMeta {
  /** ISO date. */
  date: string;
  event: string;
  location: string;
  tagged: string[];
}

export interface AlbumPhoto extends PhotoMeta {
  image: StaticImageData;
  alt: string;
}

export interface Album extends PhotoMeta {
  slug: string;
  title: string;
  /** The card's photograph, and the first one inside the album. */
  image: StaticImageData;
  alt: string;
  photos: AlbumPhoto[];
}

/* TODO: the real albums. Until the gallery API exists these are made of the
   photographs the site already ships, with sample dates, places and names,
   so every card, album page and lightbox has something to show. */
const ALL_PHOTOS: AlbumPhoto[] = [
  {
    image: handover1,
    alt: "The family gathered at a handover celebration",
    date: "2025-12-20",
    event: "Year-end handover",
    location: "Kigali",
    tagged: ["Mukamana Esperance", "Habimana Jean"],
  },
  {
    image: handover2,
    alt: "Family elders seated together in white",
    date: "2025-12-20",
    event: "Fete celebration",
    location: "Kigali",
    tagged: ["Uwase Clarisse", "Mukasine Diane"],
  },
  {
    image: handover3,
    alt: "The torch carried at a remembrance gathering",
    date: "2025-04-07",
    event: "Kwibuka remembrance",
    location: "Nyanza",
    tagged: ["Niyonzima Eric"],
  },
  {
    image: blogReunion,
    alt: "The extended family beneath green balloons",
    date: "2025-08-16",
    event: "Family reunion",
    location: "Musanze",
    tagged: ["Bizimana Olivier", "Ingabire Aline", "Aganze"],
  },
  {
    image: aboutFamily,
    alt: "The family outside the family house",
    date: "2024-07-04",
    event: "Liberation Day visit",
    location: "Huye",
    tagged: ["Mukamana Esperance"],
  },
  {
    image: dashboardFamilyGathering,
    alt: "Young family members outside a brick school building",
    date: "2025-10-11",
    event: "Weekly family gathering",
    location: "Kigali",
    tagged: ["Aganze", "Bigwi"],
  },
  {
    image: heroFamily,
    alt: "Family members before a memorial flame",
    date: "2025-04-07",
    event: "Kwibuka remembrance",
    location: "Nyanza",
    tagged: ["Nshimiyimana Patrick", "Umutoni Sandrine"],
  },
  {
    image: storyCircle,
    alt: "Family members laughing over a selfie",
    date: "2025-10-11",
    event: "Weekly family gathering",
    location: "Kigali",
    tagged: ["Bigwi", "Aganze"],
  },
];

const photo = (index: number): AlbumPhoto =>
  ALL_PHOTOS[index % ALL_PHOTOS.length]!;

const photosFrom = (start: number, count: number): AlbumPhoto[] =>
  Array.from({ length: count }, (_, index) => photo(start + index));

const album = (
  slug: string,
  title: string,
  start: number,
  count: number,
): Album => {
  const cover = photo(start);
  return { ...cover, slug, title, photos: photosFrom(start, count) };
};

export const FEATURED_ALBUMS: Album[] = [
  album("family-celebrations", "Family celebrations", 0, 6),
  album("fete-memories", "Fete memories", 1, 5),
  album("family-handovers", "Family handovers", 2, 7),
  album("reunion-moments", "Reunion moments", 3, 4),
  album("our-family-story", "Our family story", 4, 6),
  album("gathered-together", "Gathered together", 5, 8),
];

export function albumBySlug(slug: string): Album | undefined {
  return FEATURED_ALBUMS.find((item) => item.slug === slug);
}

/** The photographs the opening stage turns through: every album's cover. */
export const FEATURED_IMAGES = FEATURED_ALBUMS;

export interface Moment {
  title: string;
  poster: StaticImageData;
  alt: string;
  /** A short reel; served from public/videos. */
  video: string;
  /** WebVTT captions for the reel. */
  captions: string;
  /** Running time, for the badge on the card. */
  duration: string;
}

/* TODO: the family's own video. Until the gallery API serves it, each moment
   is a short reel made from that gathering's photographs, so the player has
   something true to play. */
export const MOMENTS: Moment[] = [
  {
    title: "Weekly family gathering",
    poster: dashboardFamilyGathering,
    alt: "Family members gathered outside a brick school building",
    video: "/videos/weekly-gathering.webm",
    captions: "/videos/weekly-gathering.vtt",
    duration: "0:10",
  },
  {
    title: "The handover evening",
    poster: handover2,
    alt: "Family members celebrating a handover together",
    video: "/videos/handover-evening.webm",
    captions: "/videos/handover-evening.vtt",
    duration: "0:10",
  },
  {
    title: "Reunion day",
    poster: blogReunion,
    alt: "The extended family posing together at a reunion",
    video: "/videos/reunion-day.webm",
    captions: "/videos/reunion-day.vtt",
    duration: "0:10",
  },
];

/** "20 December 2025" */
export function formatPhotoDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
