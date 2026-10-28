import {
  aboutFamily,
  blogReunion,
  elder1,
  elder2,
  elder3,
  elder4,
  handover1,
  handover2,
  handover3,
} from "@/lib/images";
import type {
  HierarchyRole,
  PromotionRecord,
  Subfamily,
  TreePerson,
} from "./types";

/** The tiers, top to bottom, with who stands where. Left is the father. */
const ROLE_ORDER: {
  role: HierarchyRole;
  label: string;
  subfamily: Subfamily;
  duty: string;
}[] = [
  {
    role: "grand_pere",
    label: "Grand Père",
    subfamily: "Sanctuary",
    duty: "the senior elder and guardian of the family",
  },
  {
    role: "grand_mere",
    label: "Grand Mère",
    subfamily: "Sanctuary",
    duty: "the senior elder and matriarch of the family",
  },
  {
    role: "coordinator",
    label: "Coordinator",
    subfamily: "Sanctuary",
    duty: "the coordinator, who leads the year's activities and speaks for the family",
  },
  {
    role: "vice_coordinator",
    label: "Vice Coordinator",
    subfamily: "Sanctuary",
    duty: "the vice coordinator, who steers the year's pastoral care alongside the coordinator",
  },
  {
    role: "pere_light",
    label: "Père Light",
    subfamily: "Light",
    duty: "the father figure of the Light family",
  },
  {
    role: "mere_light",
    label: "Mère Light",
    subfamily: "Light",
    duty: "the mother figure of the Light family",
  },
  {
    role: "pere_wihogora",
    label: "Père Wihogora",
    subfamily: "Wihogora",
    duty: "the father figure of the Wihogora family",
  },
  {
    role: "mere_wihogora",
    label: "Mère Wihogora",
    subfamily: "Wihogora",
    duty: "the mother figure of the Wihogora family",
  },
  {
    role: "pere_hope",
    label: "Père Hope",
    subfamily: "Hope",
    duty: "the father figure of the Hope family",
  },
  {
    role: "mere_hope",
    label: "Mère Hope",
    subfamily: "Hope",
    duty: "the mother figure of the Hope family",
  },
];

export const PROMOTION_YEARS = [
  "2015-2016",
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
] as const;

export const ALL_GENERATIONS = "all";

export const DEFAULT_PROMOTION = "2019-2020";

/* TODO: the family register. These are stand-ins, nine names for each
   promotion in the order of ROLE_ORDER, so the page can be built and
   exercised; it says so on screen rather than let anyone take them for the
   record. */
const NAMES: Record<(typeof PROMOTION_YEARS)[number], string[]> = {
  "2015-2016": [
    "Mukamana Esperance",
    "Habimana Jean",
    "Uwase Diane",
    "Niyonzima Eric",
    "Ingabire Claire",
    "Bizimana Olivier",
    "Uwimana Sandrine",
    "Nshimiyimana Patrick",
    "Mukeshimana Aline",
  ],
  "2016-2017": [
    "Kamanzi Joseph",
    "Mukantwari Alice",
    "Rukundo Samuel",
    "Iradukunda Eric",
    "Umutoni Grace",
    "Ndayisaba Emmanuel",
    "Mutesi Chantal",
    "Habiyaremye David",
    "Uwera Josiane",
  ],
  "2017-2018": [
    "Gasana Theogene",
    "Nyirahabimana Rose",
    "Munyaneza Felix",
    "Twagirayezu Paul",
    "Ishimwe Belise",
    "Hakizimana Jean Paul",
    "Umuhoza Vanessa",
    "Mugisha Kevin",
    "Kayitesi Providence",
  ],
  "2018-2019": [
    "Nkurunziza Pierre",
    "Mukashema Odette",
    "Byiringiro Daniel",
    "Uwizeye Aimable",
    "Umulisa Joyce",
    "Ntakirutimana Eric",
    "Mukamazimpaka Anita",
    "Dusabimana Innocent",
    "Irakoze Mercy",
  ],
  "2019-2020": [
    "Habimana Jean",
    "Mukamana Esperance",
    "Niyigena Christian",
    "Bizimana Olivier",
    "Uwamahoro Diane",
    "Niyonzima Eric",
    "Ingabire Solange",
    "Nshimiyimana Patrick",
    "Umutesi Clarisse",
  ],
  "2020-2021": [
    "Sibomana Andre",
    "Nyiransabimana Béatrice",
    "Tuyisenge Yves",
    "Habineza Aaron",
    "Mukarurangwa Linda",
    "Rwigema Bruno",
    "Uwingabire Sylvie",
    "Ishema Brian",
    "Nyirangirimana Dorine",
  ],
  "2021-2022": [
    "Ntwari Cedric",
    "Mukabera Immaculee",
    "Manzi Fabrice",
    "Karangwa Elie",
    "Umwali Gloria",
    "Mbabazi Jonathan",
    "Kwizera Peace",
    "Tuyishime Alain",
    "Ineza Natasha",
  ],
};

const COORDINATORS: Record<(typeof PROMOTION_YEARS)[number], string> = {
  "2015-2016": "Uwase Christella",
  "2016-2017": "Mugabo Ivan",
  "2017-2018": "Ntirenganya Alex",
  "2018-2019": "Uwitonze Gaelle",
  "2019-2020": "Uwase Clement",
  "2020-2021": "Kamali Josue",
  "2021-2022": "Murekatete Joy",
};

const LOCATIONS = [
  "Kigali, Rwanda",
  "Huye, Rwanda",
  "Musanze, Rwanda",
  "Rubavu, Rwanda",
  "Diaspora",
];

const PORTRAITS = [
  elder1,
  elder2,
  elder3,
  elder4,
  handover1,
  handover2,
  handover3,
  blogReunion,
  aboutFamily,
];

const QUOTES = [
  "Imbere heza haharanirwa.",
  "Ku bw’umurava n’ikizere.",
  "Together we build what lasts.",
];

function member(
  year: string,
  index: number,
  offset: number,
  name: string,
): TreePerson {
  const spec = ROLE_ORDER[index]!;
  return {
    id: `${year}-${spec.role}`,
    name,
    role: spec.role,
    roleLabel: spec.label,
    subfamily: spec.subfamily,
    image: PORTRAITS[(index + offset) % PORTRAITS.length]!,
    bio: `${name} is ${spec.duty} for the ${year} promotion, and one of the people the rest of the family writes to when something needs carrying.`,
    quote: QUOTES[index % QUOTES.length],
    promotionYear: year,
    location: LOCATIONS[(index + offset) % LOCATIONS.length],
  };
}

export const PROMOTIONS: PromotionRecord[] = PROMOTION_YEARS.map(
  (year, offset) => {
    /* The stand-in names run in ROLE_ORDER with the coordinator after the
       two elders. */
    const names = [
      ...NAMES[year].slice(0, 2),
      COORDINATORS[year],
      ...NAMES[year].slice(2),
    ];
    const members = names.map((name, index) =>
      member(year, index, offset, name),
    );
    return {
      id: year,
      year,
      label: `The ${year} Promotion`,
      memberCount: members.length,
      members,
    };
  },
);

export const ALL_MEMBERS: TreePerson[] = PROMOTIONS.flatMap((p) => p.members);
