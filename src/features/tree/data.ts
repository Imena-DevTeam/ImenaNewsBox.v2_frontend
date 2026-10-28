import type { StaticImageData } from "next/image";
import { elder1, elder2, elder3, elder4 } from "@/lib/images";

/* ---------------------------------------------------------------------------
   The family tree.

   Coordinates are in the SVG's own 1248 x 1484 space, lifted from the design
   by finding the connected regions of its placeholder grey and taking their
   bounding boxes, rather than by eye.

   A household is a card and one or two people; a person is a circle. Each
   household names its parent, which is what lets the diagram light the path
   from anyone back to the first generation.
--------------------------------------------------------------------------- */

export const PROMOTIONS = [
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
] as const;

export type Promotion = (typeof PROMOTIONS)[number];
export const DEFAULT_PROMOTION: Promotion = "2019-2020";

export const SUBFAMILIES = ["Mutako", "Inyenyeri", "Urumuri"] as const;
export type Subfamily = (typeof SUBFAMILIES)[number];

export interface Person {
  id: string;
  name: string;
  role: string;
  subfamily: Subfamily;
  saying: string;
  photo: StaticImageData;
  /** Where the portrait sits in the diagram. */
  node: { cx: number; cy: number; r: number };
}

export interface Household {
  id: string;
  /** The household one generation up, which is what an ancestor path walks. */
  parent?: string;
  generation: number;
  people: Person[];
  card: { x: number; y: number; width: number; height: number };
}

/* TODO: the real family record. These thirteen are stand-ins placed at the
   design's own coordinates, distinct enough to exercise search, selection
   and the detail panel, and marked as samples on the page so nobody takes
   them for the register. */
export const HOUSEHOLDS: Household[] = [
  {
    id: "h1",
    generation: 1,
    card: { x: 348, y: 482, width: 267, height: 116 },
    people: [
      {
        id: "p1",
        name: "Mukamana Esperance",
        role: "Grandmere",
        subfamily: "Mutako",
        saying: "Imbere heza haharanirwa.",
        photo: elder1,
        node: { cx: 238, cy: 446, r: 88 },
      },
    ],
  },
  {
    id: "h2",
    parent: "h1",
    generation: 2,
    card: { x: 643, y: 482, width: 218, height: 116 },
    people: [
      {
        id: "p2",
        name: "Habimana Jean",
        role: "Grandpere",
        subfamily: "Mutako",
        saying: "We keep the door open.",
        photo: elder2,
        node: { cx: 528, cy: 310, r: 47 },
      },
      {
        id: "p3",
        name: "Uwase Clarisse",
        role: "Grandmere",
        subfamily: "Mutako",
        saying: "Every name is remembered.",
        photo: elder3,
        node: { cx: 622, cy: 332, r: 47 },
      },
    ],
  },
  {
    id: "h3",
    parent: "h1",
    generation: 2,
    card: { x: 884, y: 373, width: 271, height: 116 },
    people: [
      {
        id: "p4",
        name: "Niyonzima Eric",
        role: "Coordinator",
        subfamily: "Inyenyeri",
        saying: "We carry each other.",
        photo: elder4,
        node: { cx: 837, cy: 229, r: 47 },
      },
      {
        id: "p5",
        name: "Mukasine Diane",
        role: "Maman",
        subfamily: "Inyenyeri",
        saying: "A full table is the point.",
        photo: elder1,
        node: { cx: 931, cy: 264, r: 47 },
      },
    ],
  },
  {
    id: "h4",
    parent: "h1",
    generation: 3,
    card: { x: 201, y: 740, width: 271, height: 116 },
    people: [
      {
        id: "p6",
        name: "Bizimana Olivier",
        role: "Papa",
        subfamily: "Urumuri",
        saying: "Work, then rest together.",
        photo: elder2,
        node: { cx: 290, cy: 686, r: 47 },
      },
      {
        id: "p7",
        name: "Ingabire Aline",
        role: "Maman",
        subfamily: "Urumuri",
        saying: "Nobody is counted out.",
        photo: elder3,
        node: { cx: 384, cy: 686, r: 47 },
      },
    ],
  },
  {
    id: "h5",
    parent: "h3",
    generation: 3,
    card: { x: 878, y: 969, width: 288, height: 123 },
    people: [
      {
        id: "p8",
        name: "Nshimiyimana Patrick",
        role: "Vice Coordinator",
        subfamily: "Inyenyeri",
        saying: "Ask, and we will come.",
        photo: elder4,
        node: { cx: 884, cy: 845, r: 47 },
      },
      {
        id: "p9",
        name: "Umutoni Sandrine",
        role: "Recruitment",
        subfamily: "Inyenyeri",
        saying: "New names, same family.",
        photo: elder1,
        node: { cx: 972, cy: 845, r: 47 },
      },
    ],
  },
  {
    id: "h6",
    parent: "h2",
    generation: 3,
    card: { x: 299, y: 1056, width: 288, height: 123 },
    people: [
      {
        id: "p10",
        name: "Rwamamara Pacifique",
        role: "Papa",
        subfamily: "Mutako",
        saying: "Our history is our foundation.",
        photo: elder2,
        node: { cx: 516, cy: 884, r: 47 },
      },
      {
        id: "p11",
        name: "Keza Chantal",
        role: "Maman",
        subfamily: "Mutako",
        saying: "Celebrate the small days.",
        photo: elder3,
        node: { cx: 616, cy: 867, r: 47 },
      },
    ],
  },
  {
    id: "h7",
    parent: "h6",
    generation: 4,
    card: { x: 621, y: 1323, width: 288, height: 124 },
    people: [
      {
        id: "p12",
        name: "Gatete Emmanuel",
        role: "Member",
        subfamily: "Mutako",
        saying: "Still learning from the elders.",
        photo: elder4,
        node: { cx: 452, cy: 1281, r: 50 },
      },
      {
        id: "p13",
        name: "Ineza Teta Landra",
        role: "Member",
        subfamily: "Mutako",
        saying: "Imbere heza haharanirwa.",
        photo: elder1,
        node: { cx: 569, cy: 1302, r: 50 },
      },
    ],
  },
];

export const PEOPLE: Person[] = HOUSEHOLDS.flatMap((h) => h.people);

export const HOUSEHOLD_BY_ID = new Map(HOUSEHOLDS.map((h) => [h.id, h]));

/** Every household from this one up to the first generation. */
export function ancestorsOf(householdId: string): string[] {
  const chain: string[] = [];
  let current = HOUSEHOLD_BY_ID.get(householdId);
  while (current) {
    chain.push(current.id);
    current = current.parent ? HOUSEHOLD_BY_ID.get(current.parent) : undefined;
  }
  return chain;
}

/* The two groups the design lists under the tree. They read from the same
   record as the diagram rather than keeping a second copy of the people, so
   a change to a name or a role shows up in both places. */
export const MEMBER_GROUPS: { heading: string; members: Person[] }[] = [
  { heading: "Grandpere & Grandmere", householdId: "h2" },
  { heading: "Vice Coordinator / Recruitment", householdId: "h5" },
].map(({ heading, householdId }) => ({
  heading,
  members: HOUSEHOLD_BY_ID.get(householdId)?.people ?? [],
}));
