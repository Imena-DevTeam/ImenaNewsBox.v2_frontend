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

export interface BlogPagePost extends FeaturedPost {
  category: Exclude<BlogCategory, "All">;
  date: string;
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
    date: "May 31, 2026",
  },
  {
    ...FEATURED_POST,
    category: "Celebrations",
    date: "July 14, 2024",
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
    date: "April 12, 2025",
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
    date: "May 19, 2025",
  },
  {
    ...(POPULAR_POSTS[1] as FeaturedPost),
    category: "Family Gatherings",
    date: "August 22, 2024",
    cover: handover2,
  },
  {
    ...(POPULAR_POSTS[2] as FeaturedPost),
    category: "Visits",
    date: "September 8, 2024",
    cover: blogReunion,
  },
  {
    ...FEATURED_POST,
    slug: "the-record-we-carry",
    category: "Milestones",
    date: "October 5, 2024",
    cover: handover3,
  },
  {
    ...FEATURED_POST,
    slug: "the-evening-we-came-home",
    category: "Celebrations",
    date: "November 2, 2024",
    cover: handover1,
  },
  {
    ...(POPULAR_POSTS[1] as FeaturedPost),
    slug: "the-handover-in-photographs",
    category: "Milestones",
    date: "December 10, 2024",
    cover: handover2,
  },
  {
    ...(POPULAR_POSTS[2] as FeaturedPost),
    slug: "letters-from-the-family-table",
    category: "Family Gatherings",
    date: "January 18, 2025",
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

/* Until the blog API exists, every other story reads from a shared set of
   paragraphs under its own lead. The page says so. */
const SAMPLE_PARAGRAPHS = [
  "The family has always told its stories out loud before it wrote them down. This is one of them, set down while the people who were there can still correct it.",
  "It began, as most of our stories do, with someone saying yes to something small. A phone call, a borrowed chair, a seat kept at the table. The rest followed from there.",
  "What mattered afterwards was not how it was organised but who showed up, and how long they stayed once the formal part was over.",
  "If you were there, you will have your own version. Tell it to someone younger than you this week.",
];

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
    publishedAt: post.date,
    readMinutes: post.minutes,
    author: NGABE,
    /* The design opens the reunion on the crest; every other story has a
       photograph to open on. */
    coverImage: isReunion ? undefined : post.cover,
    coverAlt: post.coverAlt,
    excerpt: post.excerpt,
    contentParagraphs: isReunion ? REUNION_PARAGRAPHS : SAMPLE_PARAGRAPHS,
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
