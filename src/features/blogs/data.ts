import type { StaticImageData } from "next/image";
import {
  blogReunion,
  dashboardFamilyGathering,
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

export const BLOG_PAGE_POSTS: BlogPagePost[] = [
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
