import type { StaticImageData } from "next/image";
import {
  blogReunion,
  elder1,
  elder2,
  elder4,
  handover1,
  handover2,
  handover3,
  storyCircle,
  storyIntro,
} from "@/lib/images";

export interface Subfamily {
  /** The branch's own page lives at /families/<slug>. */
  slug: string;
  name: string;
  holds: string;
  /** The branch's motto, in Kinyarwanda with its English sense. */
  motto: string;
  mottoMeaning: string;
  /** Who leads the branch's current generation. */
  leader: string;
  leaderPortrait: StaticImageData;
  members: number;
  /** Generations counted from the branch's founding couple. */
  generations: number;
  founded: number;
  image: StaticImageData;
  /** Two or three paragraphs for the branch's own page. */
  story: string[];
  /** The photographs the branch's page shows under its story. */
  moments: { image: StaticImageData; caption: string }[];
}

/** The three subfamilies the design calls the trinity. Until each branch has
    its own artwork, each card carries a family photograph that suits what
    the branch holds. Mottos, leaders, counts and stories are samples too,
    until the family register is connected. */
export const TRINITY: Subfamily[] = [
  {
    slug: "wihogora",
    name: "Wihogora",
    holds: "Keeps the family's record and the yearly archive.",
    motto: "Twibuke, twubake",
    mottoMeaning: "We remember, we build",
    leader: "Niyonzima Eric",
    leaderPortrait: elder1,
    members: 18,
    generations: 4,
    founded: 1962,
    image: handover3,
    story: [
      "Wihogora is the branch that writes things down. Every handover, every name added to the tree and every photograph that reaches the family archive passes through someone in this house first.",
      "It is the smallest of the three branches and the oldest. What it lacks in number it holds in record: the earliest photographs the family still has were kept in a Wihogora cupboard through two moves and a war.",
      "The branch meets twice a year to read the archive aloud. Children who cannot yet read are given the photographs to hold.",
    ],
    moments: [
      { image: handover3, caption: "The 2024 handover, read from the record" },
      { image: handover1, caption: "Three generations at the family table" },
    ],
  },
  {
    slug: "light",
    name: "Light",
    holds:
      "The writers and singers — the branch that gives the family its voice.",
    motto: "Urumuri rwacu",
    mottoMeaning: "Our light, shared",
    leader: "Bizimana Olivier",
    leaderPortrait: elder2,
    members: 24,
    generations: 3,
    founded: 1971,
    image: blogReunion,
    story: [
      "Light is the branch you hear before you see. Most of the writing on this site, and nearly all of the singing at a gathering, comes from somewhere in this house.",
      "The branch takes its name from a lamp its founding couple kept lit for anyone arriving late. The lamp is gone; the habit is not.",
      "If a story in the blogs has no name on it, it is usually from Light.",
    ],
    moments: [
      { image: blogReunion, caption: "The reunion, and the singing after it" },
      { image: storyIntro, caption: "Writing the year's record together" },
    ],
  },
  {
    slug: "hope",
    name: "Hope",
    holds: "The youngest branch, and the one being raised fastest.",
    motto: "Ejo hazaza ni twe",
    mottoMeaning: "Tomorrow is us",
    leader: "Nshimiyimana Patrick",
    leaderPortrait: elder4,
    members: 31,
    generations: 3,
    founded: 1984,
    image: storyCircle,
    story: [
      "Hope is the largest branch and the newest. More than half of its members were born after 2000, which makes it the loudest house at any gathering and the one most likely to be late.",
      "It is also the branch carrying the family forward in number: of the eleven children added to the tree in the last five years, nine are from Hope.",
      "The motto was chosen by the children themselves, at a meeting the adults were asked to leave.",
    ],
    moments: [
      { image: storyCircle, caption: "The youngest reading the family circle" },
      { image: handover2, caption: "Carrying the record to the next house" },
    ],
  },
];

/** Every branch slug, for generateStaticParams. */
export const SUBFAMILY_SLUGS = TRINITY.map((family) => family.slug);

/** The branch at a slug, or undefined so the page can call notFound(). */
export function getSubfamilyBySlug(slug: string): Subfamily | undefined {
  return TRINITY.find((family) => family.slug === slug);
}
