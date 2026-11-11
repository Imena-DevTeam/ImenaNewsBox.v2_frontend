import type { StaticImageData } from "next/image";
import type { BlogArticleDetail, BlogAuthor } from "./types";
import {
  blogReunion,
  dashboardFamilyGathering,
  elder1,
  handover1,
  handover2,
  handover3,
  storyCircle,
} from "@/lib/images";

/**
 * The articles the dashboard opens with. The blog API arrives in Phase 5;
 * until it does this is sample content, marked as such on the page.
 *
 * A search box that filters a single card reads like an error, so the list
 * holds a few records: enough for the dashboard's search pill to return
 * something for the words it invites the member to type.
 */
export interface FeaturedPost {
  slug: string;
  tag: string;
  minutes: number;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  cover: StaticImageData;
  coverAlt: string;
}

export const POPULAR_POSTS: FeaturedPost[] = [
  {
    slug: "echoes-across-the-thousand-hills",
    tag: "Lineage Reflection",
    minutes: 8,
    title:
      "Echoes Across the Thousand Hills: How Our Elders Taught Us to Stand",
    excerpt:
      "Before the family had anything written down, it had a way of standing: how to show up whole, carry a name well, and leave every doorway better than it was found. The elders did not teach it in lessons. They taught it by living it, within sight of everyone.",
    likes: 48,
    comments: 12,
    cover: handover2,
    coverAlt:
      "Family elders seated together in white and traditional dress at a family gathering",
  },
  {
    slug: "the-handover-when-the-elders-passed-the-torch",
    tag: "Family Story",
    minutes: 6,
    title: "The Handover: The Evening the Elders Passed the Torch",
    excerpt:
      "It took a single evening. The eldest branch read out what it was leaving behind, the young branch answered, and the record was moved — physically, with hands — to the table it lives on now. What changes in a family, it turns out, changes at a handover.",
    likes: 36,
    comments: 5,
    cover: handover1,
    coverAlt:
      "Family members in bright traditional and formal outfits at a reunion, balloons behind them",
  },
  {
    slug: "letters-from-the-younger-branches",
    tag: "Youth",
    minutes: 5,
    title: "Letters From the Younger Branches: What They Are Learning Now",
    excerpt:
      "School, Sunday, the walk home. The youngest of the family are not waiting for a story to be told to them, so this month we asked them to write one. Here is what they sent back, in their own words and none of ours.",
    likes: 27,
    comments: 9,
    cover: storyCircle,
    coverAlt:
      "Three family members laughing together over a selfie, a brick school building behind them",
  },
];

/** The single article the dashboard leads with. */
export const FEATURED_POST: FeaturedPost = POPULAR_POSTS[0] as FeaturedPost;

export const BLOG_CATEGORIES = [
  "All",
  "Celebrations",
  "Family Gatherings",
  "Remembering (Kwibuka)",
  "Visits",
  "Activities",
  "Milestones",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type PostStatus = "draft" | "published";

export interface BlogPagePost extends FeaturedPost {
  category: Exclude<BlogCategory, "All">;
  /** ISO 8601, so it sorts and can be shown in any locale or as "3 days ago". */
  publishedOn: string;
  status: PostStatus;
}

/**
 * The reading face of an ISO date. One place, so it never drifts.
 *
 * en-US because that is the format the design already shows — "May 31, 2026",
 * not "31 May 2026". The storage is ISO; only the face is US-ordered.
 */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The story the blogs page opens with, and the one the design shows. */
const REUNION_SLUG = "a-heart-warming-family-reunion";

export const BLOG_PAGE_POSTS: BlogPagePost[] = [
  {
    slug: REUNION_SLUG,
    tag: "Activity",
    minutes: 6,
    title:
      "A Heart-Warming Family Reunion: Embracing Togetherness! Embarking Cherished Moments Together",
    excerpt:
      "Amidst the hustle and bustle of our daily lives, this family reunion serves as a reminder of the importance of taking a pause and relishing the company of those who matter most.",
    likes: 48,
    comments: 12,
    cover: dashboardFamilyGathering,
    coverAlt: "Family members smiling together outside a brick building",
    category: "Activities",
    publishedOn: "2026-05-31",
    status: "published",
  },
  {
    ...FEATURED_POST,
    category: "Celebrations",
    publishedOn: "2024-07-14",
    status: "published",
    cover: handover1,
  },
  {
    slug: "walking-through-gisozi",
    tag: "Remembering",
    minutes: 6,
    title: "Walking Through Gisozi: When the Silence Speaks",
    excerpt:
      "Reflections from family members on their pilgrimage to the national memorial archives.",
    likes: 37,
    comments: 5,
    cover: storyCircle,
    coverAlt: "A quiet garden path framed by flowering trees",
    category: "Remembering (Kwibuka)",
    publishedOn: "2025-04-12",
    status: "draft",
  },
  {
    slug: "the-fraternal-cup",
    tag: "Activities",
    minutes: 6,
    title: "The Fraternal Cup: Light vs. Wihogora",
    excerpt:
      "Reflections from family members on the day every branch brought its best energy to the field.",
    likes: 37,
    comments: 5,
    cover: dashboardFamilyGathering,
    coverAlt: "Family members smiling together outside a brick building",
    category: "Activities",
    publishedOn: "2025-05-19",
    status: "published",
  },
  {
    ...(POPULAR_POSTS[1] as FeaturedPost),
    category: "Family Gatherings",
    publishedOn: "2024-08-22",
    status: "published",
    cover: handover2,
  },
  {
    ...(POPULAR_POSTS[2] as FeaturedPost),
    category: "Visits",
    publishedOn: "2024-09-08",
    status: "draft",
    cover: blogReunion,
  },
  {
    ...FEATURED_POST,
    slug: "the-record-we-carry",
    tag: "Family Story",
    minutes: 7,
    title: "The Record We Carry: Sixty Years in One Cupboard",
    excerpt:
      "Every photograph the family still has passed through a Wihogora cupboard, through two moves and a war. This is what is in it, who kept it, and what we nearly lost.",
    likes: 41,
    comments: 7,
    category: "Milestones",
    publishedOn: "2024-10-05",
    status: "published",
    cover: handover3,
  },
  {
    ...FEATURED_POST,
    slug: "the-evening-we-came-home",
    tag: "Celebrations",
    minutes: 5,
    title: "The Evening We Came Home",
    excerpt:
      "Nineteen of us arrived from four countries in the same week, and for one evening the house held everybody it was built for. Nobody planned it. It simply happened, and then it was over.",
    likes: 52,
    comments: 14,
    category: "Celebrations",
    publishedOn: "2024-11-02",
    status: "published",
    cover: handover1,
  },
  {
    ...(POPULAR_POSTS[1] as FeaturedPost),
    slug: "the-handover-in-photographs",
    tag: "Milestones",
    minutes: 4,
    title: "The Handover, in Photographs",
    excerpt:
      "The same evening told again with the talking taken out: fourteen photographs, in order, with a line under each saying who is in it and what had just been said.",
    likes: 18,
    comments: 2,
    category: "Milestones",
    publishedOn: "2024-12-10",
    status: "draft",
    cover: handover2,
  },
  {
    ...(POPULAR_POSTS[2] as FeaturedPost),
    slug: "letters-from-the-family-table",
    tag: "Family Gatherings",
    minutes: 6,
    title: "Letters From the Family Table",
    excerpt:
      "We left paper and a pen at the end of the table all through December and asked whoever sat down to write one line. Forty-one people did. Here is every one of them.",
    likes: 33,
    comments: 11,
    category: "Family Gatherings",
    publishedOn: "2025-01-18",
    status: "published",
    cover: blogReunion,
  },
];

/* ------------------------------------------------------------------ */
/* Reading a single article                                            */
/* ------------------------------------------------------------------ */

const NGABE: BlogAuthor = {
  id: "ngabe",
  name: "Ngabe",
  role: "Family Historian & Youth Lead",
  subfamily: "Wihogora Family",
  avatar: elder1,
};

const REUNION_PARAGRAPHS = [
  "The weekend began the way every good gathering does: with the sound of arrivals. Cars pulled up one after another, cousins who had not seen each other since the last handover recognised one another across the yard, and within minutes the compound was too loud to think in.",
  "Each branch had been asked to bring one thing, a dish, a song or a story, and nobody was told what the others would bring. The long tables that evening held all three. Light's cooks and Wihogora's cooks competed without anyone admitting it, and Hope's youngest stood up to sing the verse the elders had been waiting years to hear.",
  "Between the meals there was time to simply sit. The elders took the shaded chairs and the grandchildren took the ground beside them, and the questions came: what the village was like, who was named after whom, why the family keeps the dates it keeps.",
  "What stays with us is not the programme. It is the small things: a hand on a shoulder, a name remembered, a photograph taken badly and kept anyway. Those are the things nobody thinks to write down, which is why we are writing them down.",
  "Reunions like this are more than a pleasure. They are how a family of more than a hundred and forty people stays one family. Every face at the table is a reason for the next gathering.",
  "Until the next time, we carry the evening home with us, and we keep the door open for everyone who could not make it.",
];

/* The fallback for a post added without a body of its own. Nothing in
   BLOG_PAGE_POSTS uses it today. */
const SAMPLE_PARAGRAPHS = [
  "The family has always told its stories out loud before it wrote them down. This is one of them, set down while the people who were there can still correct it.",
  "It began, as most of our stories do, with someone saying yes to something small. A phone call, a borrowed chair, a seat kept at the table. The rest followed from there.",
  "What mattered afterwards was not how it was organised but who showed up, and how long they stayed once the formal part was over.",
  "If you were there, you will have your own version. Tell it to someone younger than you this week.",
];

/**
 * Every story's own words.
 *
 * Until 11 Nov 2026 one post had paragraphs of its own and the other nine
 * shared a set of four, which meant opening any two of them in the editor
 * showed the same text. A fixture that cannot tell two posts apart cannot be
 * used to judge a writing surface.
 *
 * TODO: the blog API. These are written in the family's voice so the reading
 * face and the editor can both be reviewed honestly, and they are samples.
 */
const BODIES: Record<string, string[]> = {
  "echoes-across-the-thousand-hills": [
    "Before any of this was written down, the family had a way of standing. You arrived whole, you greeted the oldest person in the room first, and you left a doorway better than you found it. Nobody called it a rule.",
    "Our grandmother taught it by doing it within sight of everyone. She would not be hurried through a greeting. A visitor who came for five minutes left after an hour, fed, and nobody in the house thought that was remarkable.",
    "What the hills gave us was distance. Branches settled a day's walk apart, and the only thing that travelled reliably was reputation: how a family behaved at a funeral, whether its word held. So behaviour became the inheritance, because it was the part that could not be lost in transit.",
    "The younger ones ask what they are supposed to keep, now that we live in cities and the walk between branches is a phone call. The answer has not changed. Show up whole. Greet the oldest person first. Leave the doorway better.",
  ],
  "walking-through-gisozi": [
    "We went on a Tuesday, because somebody said the crowds thin out midweek and we wanted the time. Eleven of us, three generations, in two cars.",
    "The archive does not ask anything of you. It sets out what happened and lets you stand in front of it for as long as you can. Our youngest, who is fourteen, read every panel. The rest of us moved at different speeds and found each other again at the end.",
    "Outside, nobody spoke for a while. Then the questions started, and they were the right questions: who in our family, where were they, why has nobody said. We answered what we knew and wrote down what we did not.",
    "We go back next year, and we are taking the list of what we could not answer with us. A family that keeps a record has no excuse for leaving that part blank.",
  ],
  "the-fraternal-cup": [
    "Light arrived with matching shirts. Wihogora arrived with a referee they had found somewhere, which Light objected to on the grounds that he was Wihogora's cousin, which he was.",
    "The football was not good. It was, however, very serious. Two penalties were awarded and both were disputed at length, and at one point play stopped entirely while an argument about the 2019 Cup was settled by an elder who had not been at the 2019 Cup.",
    "Hope's branch, who had claimed not to be competitive, won the tug of war without appearing to try, and then the children's race turned into the best twenty minutes of the day because every adult abandoned their own event to watch it.",
    "Light took the cup on penalties. The cup is a cup somebody bought in 2017 and it stays in the winning branch's house for a year, which is the only reason anyone plays.",
  ],
  "the-handover-when-the-elders-passed-the-torch": [
    "It took one evening. We had expected it to take the weekend.",
    "The eldest branch read out what it was leaving behind, the record, the dates, the names of everyone it had added in its time, and the young branch answered, line by line, that it had heard. Nobody had written a script. It sounded like one.",
    "Then the record itself was moved, physically, with hands, from the table it had sat on for nineteen years to the table it sits on now. That is the part people remember: the walk across the room with a box of paper in it.",
    "Afterwards there was food, and the formal part was over so quickly that the cooks were caught out. What changes in a family, it turns out, changes in about four minutes.",
  ],
  "letters-from-the-younger-branches": [
    "We asked, and we did not edit. These are the letters as they came in, and the spelling is theirs.",
    "School comes up in all of them. So does Sunday, and the walk home, and in four of them the same uncle, who will be pleased. What does not come up, in any of them, is the family's history, which is our failing and not theirs.",
    "The oldest letter is from somebody of seventeen who wants to know why we keep the dates we keep and has worked out, correctly, that two of them are wrong. We are checking.",
    "Next month we are asking the same question of the ones under ten, who cannot write yet and will be answering out loud. We are recording it.",
  ],
  "the-record-we-carry": [
    "The cupboard is in Wihogora, in a back room, and it is not a special cupboard. That is the first thing everybody says when they finally see it.",
    "Inside: four albums, two boxes of loose photographs, a school exercise book with the births in it in three different hands, and an envelope nobody can open yet because of who is still alive.",
    "It survived two moves and a war, and it survived them because people carried it. There is a version of this family in which somebody decided it was not worth the weight, and we would have nothing before 1994 in it.",
    "We are photographing all of it this year, and every branch gets a copy. A record that exists in one cupboard is a record waiting to be lost.",
  ],
  "the-evening-we-came-home": [
    "Nineteen of us landed in the same week, from four countries, none of it planned. Somebody noticed in a group message and said: well, then.",
    "The house was built for a family that size and has not held one since 2008. For one evening the chairs were all used, the children slept where they fell, and the kitchen ran until midnight because nobody would admit they had eaten enough.",
    "There was no programme. Somebody started a song in the wrong key and it was sung anyway. The photographs from that night are badly lit and we have kept all of them.",
    "By the Sunday after, four had flown out again. The evening was not arranged and will not be repeated, which is exactly why it is written down here.",
  ],
  "the-handover-in-photographs": [
    "The same evening, with the talking taken out. Fourteen photographs in the order they were taken.",
    "Under each one is a line saying who is in it and what had just been said, because in ten years the faces will be recognisable and the moment will not.",
    "The fourth is the one worth staying with: the record changing hands, both people holding the box, neither of them looking at the camera.",
    "Captions by the people in them, wherever we could ask. Three are still unnamed, and if you know who they are, tell us and we will fix it.",
  ],
  "letters-from-the-family-table": [
    "Paper and a pen at the end of the table all through December, and one instruction: write one line before you get up.",
    "Forty-one people did. The shortest is two words. The longest runs onto the back and is from somebody who has never volunteered a story in thirty years of gatherings.",
    "Read together, they are not a record of December. They are a record of what people were carrying when they sat down: a name, a worry, a thank you aimed at somebody who had already left.",
    "The paper is in the cupboard now. We are leaving a pen out again this year.",
  ],
};

function toArticle(post: BlogPagePost, index: number): BlogArticleDetail {
  const isReunion = post.slug === REUNION_SLUG;
  const secondary = [
    dashboardFamilyGathering,
    handover3,
    storyCircle,
    blogReunion,
  ];
  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    tag: post.tag,
    publishedAt: formatPostDate(post.publishedOn),
    readMinutes: post.minutes,
    author: NGABE,
    /* The design opens the reunion on the crest; every other story has a
       photograph to open on. */
    coverImage: isReunion ? undefined : post.cover,
    coverAlt: post.coverAlt,
    excerpt: post.excerpt,
    contentParagraphs: isReunion
      ? REUNION_PARAGRAPHS
      : (BODIES[post.slug] ?? SAMPLE_PARAGRAPHS),
    secondaryImage: (isReunion
      ? dashboardFamilyGathering
      : secondary[index % secondary.length]) as StaticImageData,
    secondaryImageAlt: isReunion
      ? "Generations of the family gathered and smiling together outside a brick building"
      : post.coverAlt,
    secondaryImageCaption: isReunion
      ? "Generations embracing at the welcome banquet \u2022 Photo by Family Media Team"
      : "Photo by Family Media Team",
    secondaryImageAfter: isReunion ? 3 : 2,
    likes: post.likes,
    commentsCount: post.comments,
  };
}

export function getArticleBySlug(slug: string): BlogArticleDetail | undefined {
  const index = BLOG_PAGE_POSTS.findIndex((post) => post.slug === slug);
  const post = BLOG_PAGE_POSTS[index];
  return post ? toArticle(post, index) : undefined;
}

/** Every slug that has an article, for the static build. */
export const ARTICLE_SLUGS: string[] = BLOG_PAGE_POSTS.map((post) => post.slug);
