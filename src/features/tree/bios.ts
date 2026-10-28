import type { StaticImageData } from "next/image";
import {
  aboutFamily,
  blogReunion,
  handover1,
  handover2,
  handover3,
  heroFamily,
  storyIntro,
} from "@/lib/images";
import type { Person } from "./data";

export interface Bio {
  /** The full title, as the family would introduce them. */
  title: string;
  /** Oral sayings, beyond the one on their card. */
  quotes: string[];
  memories: string[];
  photographs: { image: StaticImageData; caption: string }[];
}

/* TODO: the family register's own biographies. These are samples written
   for the stand-in people, said so in the drawer. Elders carry the fullest
   records, as the family's would. */
const ELDER_BIOS: Record<string, Partial<Bio>> = {
  p1: {
    title: "Grandmère of the family, eldest of the first generation",
    quotes: [
      "Imbere heza haharanirwa — a good future is fought for.",
      "Keep the door open; the family is whoever walks through it.",
    ],
    memories: [
      "Kept the first family record by hand, in a school exercise book.",
      "Hosted the first reunion under the mango tree at the family house.",
      "Taught every grandchild to greet the eldest first.",
    ],
    photographs: [
      { image: aboutFamily, caption: "The family house, where it began" },
      { image: storyIntro, caption: "An early gathering" },
      { image: handover2, caption: "With the elders at the handover" },
    ],
  },
  p2: {
    title: "Grandpère, keeper of the family's stories",
    quotes: ["We keep the door open.", "A name is a promise to the next one."],
    memories: [
      "Told the family's history every Sunday after the meal.",
      "Walked the young branch to the memorial each April.",
    ],
    photographs: [
      { image: handover3, caption: "Carrying the torch at Kwibuka" },
      { image: heroFamily, caption: "Remembering together" },
    ],
  },
  p3: {
    title: "Grandmère, who remembered every name",
    quotes: ["Every name is remembered.", "Write it down, then tell it."],
    memories: [
      "Knew every birthday in the family without a calendar.",
      "Sewed the white garments for the first handover.",
    ],
    photographs: [
      { image: handover2, caption: "At the handover" },
      { image: blogReunion, caption: "At the reunion" },
    ],
  },
};

const GENERATION_WORD = ["", "first", "second", "third", "fourth", "fifth"];

/** A person's biography: their elder record where there is one, otherwise
    a short entry built from what the tree knows. */
export function bioFor(person: Person, generation: number): Bio {
  const record = ELDER_BIOS[person.id] ?? {};
  return {
    title:
      record.title ??
      `${person.role} of the ${person.subfamily} branch, ${GENERATION_WORD[generation] ?? `${generation}th`} generation`,
    quotes: record.quotes ?? [person.saying],
    memories: record.memories ?? [],
    photographs: record.photographs ?? [
      { image: handover1, caption: "With the family at the handover" },
    ],
  };
}
