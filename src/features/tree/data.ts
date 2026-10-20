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

export const DIAGRAM = { width: 1248, height: 1484 } as const;

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

/** The branches, traced from the design: every stroke of its dark line work
    read off row by row and refitted as a smooth path, so the sweeps are the
    designer's own rather than an approximation of them. */
export const TREE_BRANCHES = [
  "M 836 275 Q 833 301 832 314 Q 830 327 829 340 Q 827 353 826 366 Q 824 379 823 392 Q 821 405 819 418 Q 817 431 815 444 Q 813 457 812 470 Q 810 483 808 496 Q 806 509 804 522 Q 802 535 800 548 Q 797 561 795 574 Q 793 587 791 600 Q 788 613 786 626 Q 783 639 781 652 Q 778 665 776 678 Q 773 691 770 704 Q 767 717 764 730 Q 761 743 758 756 Q 755 769 752 782 Q 748 795 745 808 Q 741 821 738 834 Q 734 847 730 860 Q 725 873 721 886 Q 716 899 711 912 Q 706 925 700 938 Q 694 951 688 964 Q 681 977 671 990 Q 661 1003 647 1014 T 632 1024",
  "M 979 252 Q 990 278 995 291 Q 999 304 1002 317 Q 1005 330 1007 343 Q 1008 356 1010 369 Q 1011 382 1012 395 Q 1012 408 1012 421 Q 1012 434 1012 447 Q 1011 460 1010 473 Q 1009 486 1008 499 Q 1007 512 1005 525 Q 1003 538 1002 551 Q 1000 564 998 577 Q 996 590 994 603 Q 991 616 989 629 Q 986 642 983 655 Q 980 668 977 681 Q 974 694 971 707 Q 968 720 965 733 Q 961 746 957 759 Q 953 772 950 785 Q 946 798 942 811 Q 937 824 934 832 T 931 840",
  "M 665 356 Q 671 382 673 395 Q 675 408 676 421 Q 677 434 678 447 Q 678 460 678 473 Q 678 486 678 499 Q 677 512 676 525 Q 675 538 674 551 Q 673 564 671 577 Q 669 590 667 603 Q 665 616 663 629 Q 661 642 659 655 Q 656 668 653 681 Q 650 694 647 707 Q 644 720 641 733 Q 638 746 635 759 Q 631 772 627 785 Q 623 798 620 809 T 617 820",
  "M 919 882 Q 895 909 882 923 Q 868 936 854 950 Q 840 963 826 977 Q 811 990 796 1004 Q 780 1017 764 1031 Q 748 1044 731 1058 Q 714 1071 696 1085 Q 678 1098 659 1112 Q 640 1125 620 1139 Q 600 1152 579 1166 Q 557 1179 534 1193 Q 511 1206 489 1218 T 467 1230",
  "M 536 472 Q 533 497 532 510 Q 530 522 529 535 Q 527 547 524 560 Q 521 572 518 585 Q 514 597 509 610 Q 504 622 497 635 Q 490 647 480 660 Q 470 672 452 685 Q 433 697 431 699 T 429 700",
  "M 30 258 Q 92 233 153 227 Q 207 254 218 268 Q 229 281 234 295 Q 239 308 241 322 Q 242 335 241 348 T 239 361",
  "M 627 1139 Q 642 1162 642 1174 Q 642 1185 637 1197 Q 632 1208 622 1220 Q 611 1231 595 1243 Q 579 1254 579 1255 T 579 1255",
  "M 274 523 Q 322 552 338 567 Q 354 581 364 596 Q 374 610 379 624 T 383 637",
  "M 529 356 Q 532 385 533 400 Q 534 414 535 429 Q 535 443 535 456 T 535 469",
  "M 238 529 Q 233 557 235 571 Q 237 585 243 599 Q 249 613 260 627 T 271 641",
  "M 913 298 Q 916 322 914 334 Q 911 346 900 358 Q 889 370 866 381 T 843 391",
  "M 618 376 Q 621 399 619 411 Q 617 422 608 434 Q 598 445 574 457 T 550 468",
  "M 650 900 Q 647 919 642 929 Q 637 938 626 948 Q 615 957 596 965 T 577 973",
  "M 533 927 Q 537 939 540 945 Q 543 951 546 957 Q 549 963 553 969 T 556 975",
  "M 562 977 Q 566 989 571 995 Q 575 1001 581 1007 Q 587 1013 597 1019 T 607 1024",
];

/* Which households a branch runs between, worked out from where its two ends
   land rather than stated by hand, so the highlighting follows the drawing
   even if the drawing is retraced. A stroke that ends near nobody stays
   unattached and simply never lights up. */
function nearestHousehold(x: number, y: number): string | undefined {
  let best: string | undefined;
  let bestDistance = 150;
  for (const household of HOUSEHOLDS) {
    for (const person of household.people) {
      const d = Math.hypot(person.node.cx - x, person.node.cy - y);
      if (d < bestDistance) {
        bestDistance = d;
        best = household.id;
      }
    }
  }
  return best;
}

export const BRANCH_EDGES: (readonly [
  string | undefined,
  string | undefined,
])[] = TREE_BRANCHES.map((d) => {
  const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return [
    nearestHousehold(n[0] ?? 0, n[1] ?? 0),
    nearestHousehold(n[n.length - 2] ?? 0, n[n.length - 1] ?? 0),
  ] as const;
});

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
