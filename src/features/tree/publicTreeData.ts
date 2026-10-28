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
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "67d888ac-697c-40e4-8d4e-6e45936c8c02",
          name: "NDIZIHIWE Christian",
          singleName: "Christian",
          role: "Vice Coordinator",
          familyName: "Ruvunababisha",
          imageUrl: null,
          saying: "Imbere heza ni ahacu",
        },
        {
          id: "ec4b6145-4214-4fb0-a38b-a9e6d7d7f89e",
          name: "MUTAGOMA Isimbi Patience",
          singleName: "Patience",
          role: "Recruitment Lead",
          familyName: "Isimbi",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/a0b883b235e03d10b6c2af042dcf3d241dd21aef-1256x1674.png",
          saying: "Imbere heza haraharanirwa",
        },
      ],
    },
    {
      heading: "Pere Wihogora & Mere Wihogora",
      members: [
        {
          id: "36cb7b3c-a8e2-46de-8e5f-3bb3923a120a",
          name: "NYUMBAYIRE Laurent",
          singleName: "Laurent",
          role: "Pere Wihogora",
          familyName: "Cyusa",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/a56fc657afb614f73491ada4a72ecd61b5c7e06b-1066x1600.jpg",
          saying: "Mu buzima ntakujenjeka, urumva",
        },
        {
          id: "7e119c1f-9f5e-40e5-ad52-fc3f7d879939",
          name: "MUTAGOMA Isimbi Patience",
          singleName: "Patience",
          role: "Mere Wihogora",
          familyName: "Isimbi",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/a55ff9a9ea55ad84e645dd704758264600f03384-1468x2674.jpg",
          saying: "Urukundo ni ibanga ryacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "4bcc464f-d402-4f06-b479-d5b083eb1f97",
          name: "MICOMYIZA Prince",
          singleName: "Prince",
          role: "Pere Hope",
          familyName: "Cyangabwoba",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/cc8122426586b84a44e00554660617f065472aa6-644x1080.jpg",
          saying: "Urukundo ni ibanga ryacu",
        },
        {
          id: "7db93c2b-c99f-4cb0-8000-8ce030e3bfad",
          name: "FURAHA Niyongira Celia",
          singleName: "Celia",
          role: "Mere Hope",
          familyName: "Isheja",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/21fc118718e76d5d38c339b797981cde20e99a81-960x1280.jpg",
          saying: "Urukundo ni ibanga ryacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "de485f34-05e3-4f34-9b02-d6afd75e5297",
          name: "NDAHIRO Loic",
          singleName: "Loic",
          role: "Pere Light",
          familyName: "Cyomoro",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/b916e327aeb3dbb9ffe6e8fa4747e04364dbffe2-3600x2400.jpg",
          saying: "Shinjagira, Niyo waba ushira",
        },
        {
          id: "fb6ac9f8-42d8-4069-bd80-f07870c995d8",
          name: "UMURUNGI Olga",
          singleName: "Olga",
          role: "Mere Light",
          familyName: "Muhorakeye",
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
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "86157715-3cb8-42b5-a1d8-12ca33800fc5",
          name: "MUTABAZI Frank",
          singleName: "Frank",
          role: "Vice Coordinator",
          familyName: "Gabiro",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8a383144562ccac84db3fe9667e393d28d79355c-662x654.webp",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "f8932a2f-9179-4048-8d8f-75a2328a171a",
          name: "MUGISHA Pacifique",
          singleName: "Pacifique",
          role: "Recruitment Lead",
          familyName: "Rwamamara",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/b1d335812bd2c9e0a0c901fedd91e011c9e40561-960x1280.jpg",
          saying: "Hora ukeye Nka za mfura z’iwacu",
        },
      ],
    },
    {
      heading: "Pere Wihogora & Mere Wihogora",
      members: [
        {
          id: "4689eda4-ed03-4e77-89e3-9575ccef3740",
          name: "SHEMA Frank",
          singleName: "Frank",
          role: "Pere Wihogora",
          familyName: "Mushongore",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/e9bf542078e01df21a7a9c96e4145c0a15dd68a2-4016x6396.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "46db1b0f-da62-4d33-b3fc-0c77cdd8b6d3",
          name: "INEZA Niyongira Bernice",
          singleName: "Bernice",
          role: "Mere Wihogora",
          familyName: "Mucyo",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/d5b2c66f2a275379e62edd9f36170dedb4edb253-756x1008.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "f44fb477-c843-4b83-89ec-80d8e5cfa7c8",
          name: "BAGUMIRE Hertier",
          singleName: "Hertier",
          role: "Pere Hope",
          familyName: "Majyambere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/f037e14cae353a340c1b1c292c3824bfabaf02d7-3024x4032.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "14a66023-7c57-47a4-9b71-b61280de9e6e",
          name: "IRIZA Joella",
          singleName: "Joella",
          role: "Mere Hope",
          familyName: "Kundwa",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/24ab4ed882334c01de800d7d49fe8297f8ca34f7-662x566.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "68a84f7d-ec38-4d80-ba3f-4cfeb504448d",
          name: "MUTABAZI Frank",
          singleName: "Frank",
          role: "Pere Light",
          familyName: "Gabiro",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8a383144562ccac84db3fe9667e393d28d79355c-662x654.webp",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "d56571e5-8c70-4e40-a363-e57ac788890e",
          name: "UMULISA Ornellah",
          singleName: "Ornellah",
          role: "Mere Light",
          familyName: "Isaro",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/bc071005d87d9222788adb2f6a6ab10389bf0f13-486x1080.jpg",
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
            "https://cdn.sanity.io/images/bge18m05/production/86bdf3b924b1d62489c67bc1ca6d81b4f4c9b33a-694x848.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "8c772cb8-9b88-4e89-bd07-8ec9d91fa9a7",
          name: "UWINEZA Joyeuse",
          singleName: "Joyeuse",
          role: "Grandmere",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/628045a557879e6bc279930feee14b531bc7b7e8-720x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "ab77d23e-e382-47be-b6c4-d4b4cafcbd1a",
          name: "UMUTONI Mireille Oxanne",
          singleName: "Mireille",
          role: "Recruitment Lead",
          familyName: "Muheto",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/333bbb5bed77242e1879c0b7480cd0427499307d-810x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Wihogora & Mere Wihogora",
      members: [
        {
          id: "5b591bfa-ce92-4809-b687-f81d898516ee",
          name: "MANZI Kabanda Cedric",
          singleName: "Cedric",
          role: "Pere Wihogora",
          familyName: "Kirenga",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/07279cb6c507df09ff25d7ef048fa4d9b62646c2-4016x6016.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "9731427d-932f-48d6-96cb-2483a9a81f8f",
          name: "MBABAZI Shallon",
          singleName: "Shallon",
          role: "Mere Wihogora",
          familyName: "Muberarugo",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/2acf6c1511127ec842953d446f2a11d56096e67b-1607x2410.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "0d54fa56-a9ba-47a3-83eb-e4e69b59ca54",
          name: "DUSHIME Jazzy Bruno",
          singleName: "Bruno",
          role: "Pere Hope",
          familyName: "Rutabagisha",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/940f5a7d97607a829280d8cb3006a8e8b6b21c43-1536x2048.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "5d55b0a3-d021-4d1e-84b2-29777d54b4d6",
          name: "UMUTONI Mireille Oxanne",
          singleName: "Mireille",
          role: "Mere Hope",
          familyName: "Muheto",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/333bbb5bed77242e1879c0b7480cd0427499307d-810x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "c8fdd632-5842-4f22-b2df-97e41f60865e",
          name: "MUHIRE Igor",
          singleName: "Igor",
          role: "Pere Light",
          familyName: "Ganza",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/144a4d31bf21006a16d7426705d4f9a7b1671242-768x1020.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "af97616d-0976-40ff-a745-6e14c27ead34",
          name: "Gisele Nyiramugisha",
          singleName: "Gisele",
          role: "Mere Light",
          familyName: "Ndabaga",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/d335242adfa14bd6752e523320fb598f40163732-720x1080.jpg",
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
            "https://cdn.sanity.io/images/bge18m05/production/b96316239103c81215b24e6ebfa48d3c5097aa48-694x848.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "0a1ad6ba-a1be-44c0-99ce-3430ee86cf01",
          name: "UWAMAHORO Francine",
          singleName: "Francine",
          role: "Grandmere",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/0523e42930268579cfeb1b26caec2d354b56461a-640x799.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "fb4ca8f5-3c99-4d39-b9d9-2e23214da956",
          name: "BUGINGO Elua",
          singleName: "Elua",
          role: "Recruitment Lead",
          familyName: "NKotanyi",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/86bdf3b924b1d62489c67bc1ca6d81b4f4c9b33a-694x848.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "6e288e17-5732-45e0-81f1-09ea9bc1ca6f",
          name: "Ngenzi",
          singleName: "Ngenzi",
          role: "Pere Hope",
          familyName: "pere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/28004f29a008fa722e0321c76ba299d0c2794c48-694x848.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "8c351478-f62f-48e0-bb1a-f1115dfaa920",
          name: "UWAMAHORO Francine",
          singleName: "Francine",
          role: "Mere Hope",
          familyName: "mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/0523e42930268579cfeb1b26caec2d354b56461a-640x799.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "228cbfe8-8c1d-4f10-9ecb-d1ee1762c776",
          name: "MAZIMPAKA Patrick",
          singleName: "Patrick",
          role: "Pere Light",
          familyName: "Patrick",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8fc23f66f9166ae083a2ff6e855584ee3511eb44-694x848.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "cf1ad32b-3e5f-4d9d-bf8d-d7e17c093a2e",
          name: "UWIMPUHWE Heureuse",
          singleName: "Heureuse",
          role: "Mere Light",
          familyName: "Mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/c32938f322797fbdfd5292415170d10b71e16447-768x960.jpg",
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
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/95eb994119cc7b81dd892e66dd008986f34585c5-720x960.jpg",
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
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "47b06ba6-86c0-438d-8a4f-5cb39a738c64",
          name: "UMULINGA Jolie",
          singleName: "Jolie",
          role: "Recruitment Lead",
          familyName: "mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8b827c97469485123c912d22a3deda09dad90ffe-822x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "4472c29d-4767-4d92-bb8d-19417855322c",
          name: "Ndagijimana Emmy",
          singleName: "Emmy",
          role: "Pere Hope",
          familyName: "emmy",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/347b749ad5f23497d51ee9bb525e6e8c751a0b5f-864x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "a34df4e2-d35c-43df-9ec9-d3005bf90013",
          name: "ISHIMWE Rosine",
          singleName: "Rosine",
          role: "Mere Hope",
          familyName: "Rosine",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/49a997dcf562f63f58a7b05a7aa42d45b736b006-810x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "277e9fe5-0259-4bf9-85e6-ec612d765fe6",
          name: "Mugenga Alupha",
          singleName: "Alupha",
          role: "Pere Light",
          familyName: "pere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/cf02d1341ba1010373262294125bdf2559b9c1d5-720x960.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "ea9105ea-eebe-451e-b816-8c08ff634f19",
          name: "Micomyiza Julia",
          singleName: "Julia",
          role: "Mere Light",
          familyName: "mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/5725f0cbff9eeef585579f15a1c3ce3673f32468-694x848.jpg",
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
    {
      heading: "Vice Coordinator / Recruitment",
      members: [
        {
          id: "bfeb1462-a621-493c-8593-6235349e6a98",
          name: "NIYOMUKIZA Sylvain",
          singleName: "Sylvain",
          role: "Recruitment Lead",
          familyName: "Imenagitero",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/4f086790488e19882d8eafd6bd49b9a762acca34-750x1050.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Wihogora & Mere Wihogora",
      members: [
        {
          id: "45a3b530-3038-490b-8e5f-a854e55c7f5f",
          name: "Rukundo wilson",
          singleName: "wilson",
          role: "Pere Wihogora",
          familyName: "pere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8a383144562ccac84db3fe9667e393d28d79355c-662x654.webp",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "0f1264ac-074c-4cc2-b577-70ec060d75e8",
          name: "UMULINGA Jolie",
          singleName: "Jolie",
          role: "Mere Wihogora",
          familyName: "mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8b827c97469485123c912d22a3deda09dad90ffe-822x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Hope & Mere Hope",
      members: [
        {
          id: "4ddfd2d8-108c-4fcb-8131-3bd4c09f46ce",
          name: "NDAGIJIMANA Danny",
          singleName: "Danny",
          role: "Pere Hope",
          familyName: "pere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/7356760188ecb03ec92c6071534c760ad2a031b9-720x1080.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
        {
          id: "3e69a6ea-aa59-4dcc-94fc-e94060702176",
          name: "MUREKATETE Honette",
          singleName: "Honette",
          role: "Mere Hope",
          familyName: "gmere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/8578939717167b3288ce11585291dd517e58f3e9-853x1280.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
    {
      heading: "Pere Light & Mere Light",
      members: [
        {
          id: "da8b6167-9785-4744-9fd3-d09076169e25",
          name: "UMUTONI Fifi",
          singleName: "Fifi",
          role: "Mere Light",
          familyName: "mere",
          imageUrl:
            "https://cdn.sanity.io/images/bge18m05/production/7936a2828b8a5fc1a6ceca5b69c450123c21c762-720x960.jpg",
          saying: "Umuryango ni umusingi wacu",
        },
      ],
    },
  ],
};

export interface TreeNodeData {
  id: string;
  cx: number;
  cy: number;
  r: number;
  name: string;
  isFirstRoot?: boolean;
  imageUrl?: string | null;
}

export interface TreeCardData {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/* Coordinates in a 1000 x 760 SVG viewBox precisely matching media_1793182339302.png */
export const TREE_ROOT_BENON: TreeNodeData = {
  id: "benon-root",
  cx: 190,
  cy: 205,
  r: 72,
  name: "Benon",
  isFirstRoot: true,
  imageUrl: null, // First circle: leave blank/profile icon, show "Benon" on hover
};

export const TREE_PORTRAIT_NODES: TreeNodeData[] = [
  // Pair below Benon:
  {
    id: "node-pacifique",
    cx: 232,
    cy: 295,
    r: 36,
    name: "Pacifique",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/0079bffac8150fffd03d00cd5be158de72219b83-309x931.jpg",
  },
  {
    id: "node-patience",
    cx: 310,
    cy: 295,
    r: 36,
    name: "Patience",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/a0b883b235e03d10b6c2af042dcf3d241dd21aef-1256x1674.png",
  },

  // Pair top center:
  {
    id: "node-laurent",
    cx: 425,
    cy: 175,
    r: 36,
    name: "Laurent",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/a56fc657afb614f73491ada4a72ecd61b5c7e06b-1066x1600.jpg",
  },
  {
    id: "node-celia",
    cx: 500,
    cy: 182,
    r: 36,
    name: "Celia",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/21fc118718e76d5d38c339b797981cde20e99a81-960x1280.jpg",
  },

  // Pair top right:
  {
    id: "node-prince",
    cx: 675,
    cy: 155,
    r: 36,
    name: "Prince",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/cc8122426586b84a44e00554660617f065472aa6-644x1080.jpg",
  },
  {
    id: "node-loic",
    cx: 750,
    cy: 165,
    r: 36,
    name: "Loic",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/b916e327aeb3dbb9ffe6e8fa4747e04364dbffe2-3600x2400.jpg",
  },

  // Pair mid center:
  {
    id: "node-thierry",
    cx: 415,
    cy: 390,
    r: 35,
    name: "Thierry",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/580b981c297507e207cfed2f06398289500f1312-424x756.jpg",
  },
  {
    id: "node-liliane",
    cx: 492,
    cy: 385,
    r: 35,
    name: "Liliane",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/9983996c39ec338141c917b6ee54a78dd98bb3cf-480x1014.jpg",
  },

  // Pair mid right:
  {
    id: "node-frank",
    cx: 710,
    cy: 385,
    r: 35,
    name: "Frank",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/e9bf542078e01df21a7a9c96e4145c0a15dd68a2-4016x6396.jpg",
  },
  {
    id: "node-bernice",
    cx: 782,
    cy: 385,
    r: 35,
    name: "Bernice",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/d5b2c66f2a275379e62edd9f36170dedb4edb253-756x1008.jpg",
  },

  // Pair bottom:
  {
    id: "node-shallon",
    cx: 365,
    cy: 520,
    r: 36,
    name: "Shallon",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/2acf6c1511127ec842953d446f2a11d56096e67b-1607x2410.jpg",
  },
  {
    id: "node-joella",
    cx: 455,
    cy: 530,
    r: 36,
    name: "Joella",
    imageUrl:
      "https://cdn.sanity.io/images/bge18m05/production/24ab4ed882334c01de800d7d49fe8297f8ca34f7-662x566.jpg",
  },
];

export const TREE_CARDS: TreeCardData[] = [
  { id: "c1", x: 160, y: 315, w: 215, h: 32 },
  { id: "c2", x: 270, y: 232, w: 190, h: 32 },
  { id: "c3", x: 500, y: 232, w: 190, h: 32 },
  { id: "c4", x: 710, y: 202, w: 220, h: 32 },
  { id: "c5", x: 240, y: 440, w: 230, h: 32 },
  { id: "c6", x: 705, y: 425, w: 230, h: 34 },
  { id: "c7", x: 500, y: 535, w: 230, h: 34 },
];
