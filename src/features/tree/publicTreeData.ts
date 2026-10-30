export interface PublicPromotionMember {
  id: string;
  name: string;
  singleName: string;
  role: string;
  familyName: string;
  imageUrl: string | null;
  saying: string;
}

export interface PublicPromotionGroup {
  heading: string;
  members: PublicPromotionMember[];
}

export const PROMOTION_YEARS = [
  "2019-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
] as const;

export type PromotionYear = (typeof PROMOTION_YEARS)[number];

/* Sourced from https://imenanewsbox.rw/about — strictly Grandpere & Grandmere for each generation */
export const PROMOTIONS_DATA: Record<PromotionYear, PublicPromotionGroup[]> = {
  "2025-2026": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "a60fd158-a6b1-47e3-8b61-047c8268e1f6",
          name: "MUGISHA Pacifique",
          singleName: "Pacifique",
          role: "Grandpere",
          familyName: "Rwamamara",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/0079bffac8150fffd03d00cd5be158de72219b83-309x931.jpg",
          saying: "Hora ukeye Nka za mfura z’iwacu",
        },
        {
          id: "dcdfb0e7-9841-4583-9db0-7c94592308f4",
          name: "ISIMBI Hyguette",
          singleName: "Hyguette",
          role: "Grandmere",
          familyName: "Karabo",
          imageUrl: null,
          saying: "Imbere heza haraharanirwa",
        },
      ],
    },
  ],
  "2024-2025": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "7a2dd339-9fb9-403d-8111-c21cafcfa656",
          name: "RUDASESWA Thierry",
          singleName: "Thierry",
          role: "Grandpere",
          familyName: "Rwaka",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/580b981c297507e207cfed2f06398289500f1312-424x756.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "d0672632-7aa4-46ce-b2da-66d6363327b1",
          name: "INGABIRE Liliane",
          singleName: "Liliane",
          role: "Grandmere",
          familyName: "Marebe",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/9983996c39ec338141c917b6ee54a78dd98bb3cf-480x1014.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
  "2023-2024": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "4fc25ea8-e628-4066-b333-d9d1ec2d7522",
          name: "BUGINGO Elua",
          singleName: "Elua",
          role: "Grandpere",
          familyName: "Nkotanyi",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/bfb8c538cdaffcea16ae84a5e8b768c62f78f99e-720x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "8c772cb8-9b88-4e89-bd07-8ec9d91fa9a7",
          name: "UWINEZA Joyeuse",
          singleName: "Joyeuse",
          role: "Grandmere",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/a60ff01b42586bb16f7cba4571d968218146c38c-690x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
  "2022-2023": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "f3fc0d09-b6aa-4a4b-9f84-ab2df8073534",
          name: "MUHIRE Patrick",
          singleName: "Patrick",
          role: "Grandpere",
          familyName: "Mwitero",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/0d330c7621c38bb28f4a5bfd605b46906337149f-1080x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "0a1ad6ba-a1be-44c0-99ce-3430ee86cf01",
          name: "UWAMAHORO Francine",
          singleName: "Francine",
          role: "Grandmere",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/51c7f0c9fa740e9c0bc029887c95f6e794b92069-728x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
  "2021-2022": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "3e5927ad-d09f-410a-b362-e64db801b702",
          name: "Kalangwa Innocent",
          singleName: "Innocent",
          role: "Grandpere",
          familyName: "gpere",
          imageUrl: null,
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "e57c6b90-f5a0-4a87-bb7c-2b21cfcae105",
          name: "UMULINGA Jolie",
          singleName: "Jolie",
          role: "Grandmere",
          familyName: "Jolie",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8b827c97469485123c912d22a3deda09dad90ffe-822x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
  "2019-2021": [
    {
      heading: "Grandpere & Grandmere",
      members: [
        {
          id: "c150263a-436a-4036-948a-f02f8d293647",
          name: "NIYOMUKIZA Sylvain",
          singleName: "Sylvain",
          role: "Grandpere",
          familyName: "Imenagitero",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/4f086790488e19882d8eafd6bd49b9a762acca34-750x1050.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "e5bf9be1-f67f-4424-81bc-539cfa671609",
          name: "MUREKATETE Honette",
          singleName: "Honette",
          role: "Grandmere",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8578939717167b3288ce11585291dd517e58f3e9-853x1280.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
};

/** Get preceding generation's member for card flipping */
export function getPrecedingGenerationMember(
  currentYear: PromotionYear,
  role: "Grandpere" | "Grandmere",
): { member: PublicPromotionMember; yearLabel: string } | null {
  const currentIndex = PROMOTION_YEARS.indexOf(currentYear);
  if (currentIndex <= 0) {
    // If at earliest generation (2019-2021), the predecessor is root Benon
    return {
      yearLabel: "Root Founder",
      member: {
        id: "root-benon-prev",
        name: "Benon",
        singleName: "Benon",
        role: "Root Patriarch",
        familyName: "IMENA Family",
        imageUrl: null,
        saying:
          "Umuryango ukura ku mizi yawo (Our strength comes from our roots)",
      },
    };
  }

  const prevYear = PROMOTION_YEARS[currentIndex - 1];
  if (!prevYear) return null;
  const prevGroup = PROMOTIONS_DATA[prevYear]?.[0];
  const prevMember = prevGroup?.members.find(
    (m: PublicPromotionMember) => m.role === role,
  );

  if (!prevMember) return null;
  return {
    yearLabel: prevYear,
    member: prevMember,
  };
}

export interface TreeNodeData {
  id: string;
  cx: number;
  cy: number;
  r: number;
  name: string;
  generation: PromotionYear;
  role: "Grandpere" | "Grandmere";
  isFirstRoot?: boolean;
  imageUrl?: string | null;
}

export interface TreeCardData {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

/*
 * Coordinates in a 960 x 1020 SVG viewBox matching the elongated vertical
 * multi-tier layout in Image Two:
 * - Root ancestor: Benon
 * - 6 generations: strictly Grandpere & Grandmere couples
 */
export const TREE_ROOT_BENON = {
  id: "benon-root",
  cx: 190,
  cy: 250,
  r: 68,
  name: "Benon",
  generation: "2019-2021" as PromotionYear,
  role: "Root Patriarch",
  isFirstRoot: true,
  imageUrl: null,
};

export const TREE_PORTRAIT_NODES: TreeNodeData[] = [
  // Generation 2019-2021 (Pair directly below Benon)
  {
    id: "gp-2019-sylvain",
    cx: 225,
    cy: 425,
    r: 34,
    name: "Sylvain",
    generation: "2019-2021",
    role: "Grandpere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/4f086790488e19882d8eafd6bd49b9a762acca34-750x1050.jpg",
  },
  {
    id: "gm-2019-honette",
    cx: 300,
    cy: 425,
    r: 34,
    name: "Honette",
    generation: "2019-2021",
    role: "Grandmere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/8578939717167b3288ce11585291dd517e58f3e9-853x1280.jpg",
  },

  // Generation 2021-2022 (Top Center pair)
  {
    id: "gp-2021-innocent",
    cx: 420,
    cy: 160,
    r: 34,
    name: "Innocent",
    generation: "2021-2022",
    role: "Grandpere",
    imageUrl: null,
  },
  {
    id: "gm-2021-jolie",
    cx: 495,
    cy: 175,
    r: 34,
    name: "Jolie",
    generation: "2021-2022",
    role: "Grandmere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/8b827c97469485123c912d22a3deda09dad90ffe-822x1080.jpg",
  },

  // Generation 2022-2023 (Top Right pair: Patrick higher, Francine offset)
  {
    id: "gp-2022-patrick",
    cx: 645,
    cy: 105,
    r: 34,
    name: "Patrick",
    generation: "2022-2023",
    role: "Grandpere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/0d330c7621c38bb28f4a5bfd605b46906337149f-1080x1080.jpg",
  },
  {
    id: "gm-2022-francine",
    cx: 720,
    cy: 130,
    r: 34,
    name: "Francine",
    generation: "2022-2023",
    role: "Grandmere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/51c7f0c9fa740e9c0bc029887c95f6e794b92069-728x1080.jpg",
  },

  // Generation 2023-2024 (Mid Center pair below middle cards)
  {
    id: "gp-2023-elua",
    cx: 410,
    cy: 555,
    r: 34,
    name: "Elua",
    generation: "2023-2024",
    role: "Grandpere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/bfb8c538cdaffcea16ae84a5e8b768c62f78f99e-720x1080.jpg",
  },
  {
    id: "gm-2023-joyeuse",
    cx: 485,
    cy: 550,
    r: 34,
    name: "Joyeuse",
    generation: "2023-2024",
    role: "Grandmere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/a60ff01b42586bb16f7cba4571d968218146c38c-690x1080.jpg",
  },

  // Generation 2024-2025 (Mid Right pair)
  {
    id: "gp-2024-thierry",
    cx: 680,
    cy: 545,
    r: 34,
    name: "Thierry",
    generation: "2024-2025",
    role: "Grandpere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/580b981c297507e207cfed2f06398289500f1312-424x756.jpg",
  },
  {
    id: "gm-2024-liliane",
    cx: 755,
    cy: 555,
    r: 34,
    name: "Liliane",
    generation: "2024-2025",
    role: "Grandmere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/9983996c39ec338141c917b6ee54a78dd98bb3cf-480x1014.jpg",
  },

  // Generation 2025-2026 (Bottom Tier pair)
  {
    id: "gp-2025-pacifique",
    cx: 350,
    cy: 860,
    r: 35,
    name: "Pacifique",
    generation: "2025-2026",
    role: "Grandpere",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/0079bffac8150fffd03d00cd5be158de72219b83-309x931.jpg",
  },
  {
    id: "gm-2025-hyguette",
    cx: 435,
    cy: 865,
    r: 35,
    name: "Hyguette",
    generation: "2025-2026",
    role: "Grandmere",
    imageUrl: null,
  },
];

/* Rounded rectangle cards with meaningful labels strictly matching Image Two */
export const TREE_CARDS: TreeCardData[] = [
  // Card below Sylvain & Honette (2019-2021)
  { id: "c1", x: 155, y: 475, w: 215, h: 38, label: "2019 – 2021" },
  // Cards side by side under Innocent & Jolie (2021-2022 & IMENA Roots)
  { id: "c2", x: 265, y: 280, w: 205, h: 38, label: "2021 – 2022" },
  { id: "c3", x: 485, y: 280, w: 185, h: 38, label: "IMENA Roots" },
  // Card to the right of Patrick & Francine (2022-2023)
  { id: "c4", x: 700, y: 200, w: 205, h: 38, label: "2022 – 2023" },
  // Card below Thierry & Liliane (2024-2025)
  { id: "c5", x: 680, y: 625, w: 225, h: 40, label: "2024 – 2025" },
  // Card below Elua & Joyeuse (2023-2024)
  { id: "c6", x: 250, y: 635, w: 225, h: 40, label: "2023 – 2024" },
  // Card below & to right of Pacifique & Hyguette (2025-2026)
  { id: "c7", x: 480, y: 880, w: 225, h: 42, label: "2025 – 2026" },
];
