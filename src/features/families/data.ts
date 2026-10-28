import type { StaticImageData } from "next/image";
import { blogReunion, handover3, storyCircle } from "@/lib/images";

export interface Subfamily {
  name: string;
  holds: string;
  /** The branch's motto, in Kinyarwanda with its English sense. */
  motto: string;
  mottoMeaning: string;
  /** Who leads the branch's current generation. */
  leader: string;
  members: number;
  image: StaticImageData;
}

/** The three subfamilies the design calls the trinity. Until each branch has
    its own artwork, each card carries a family photograph that suits what
    the branch holds. Mottos, leaders and counts are samples too, until the
    family register is connected. */
export const TRINITY: Subfamily[] = [
  {
    name: "Wihogora",
    holds: "Keeps the family's record and the yearly archive.",
    motto: "Twibuke, twubake",
    mottoMeaning: "We remember, we build",
    leader: "Niyonzima Eric",
    members: 18,
    image: handover3,
  },
  {
    name: "Light",
    holds:
      "The writers and singers — the branch that gives the family its voice.",
    motto: "Urumuri rwacu",
    mottoMeaning: "Our light, shared",
    leader: "Bizimana Olivier",
    members: 24,
    image: blogReunion,
  },
  {
    name: "Hope",
    holds: "The youngest branch, and the one being raised fastest.",
    motto: "Ejo hazaza ni twe",
    mottoMeaning: "Tomorrow is us",
    leader: "Nshimiyimana Patrick",
    members: 31,
    image: storyCircle,
  },
];
