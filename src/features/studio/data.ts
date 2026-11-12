import { ROUTES } from "@/constants/routes";
import { BLOG_PAGE_POSTS } from "@/features/blogs/data";
import { FEATURED_ALBUMS } from "@/features/gallery/data";
import type { AttentionItem } from "@/features/admin/data";

/**
 * What is waiting for the blogger, worked out from the content itself rather
 * than stored anywhere.
 *
 * These two rows were in the administrator's queue until 11 Nov 2026, where
 * they were the wrong person's work: an administrator cannot finish somebody
 * else's draft. They are hers, and this is where they belong.
 */
export function studioAttention(skipDraft?: string): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const post of BLOG_PAGE_POSTS) {
    if (post.status !== "draft") continue;
    /* The overview leads with one draft in a band of its own. Listing it
       here as well would be the same row twice. */
    if (post.slug === skipDraft) continue;
    items.push({
      id: `draft-${post.slug}`,
      label: post.title,
      reason: "Draft, not published",
      href: `${ROUTES.STUDIO_POSTS}/${post.slug}/edit`,
      action: "Finish it",
    });
  }

  for (const album of FEATURED_ALBUMS) {
    if (album.photos.length > 0) continue;
    items.push({
      id: `album-${album.slug}`,
      label: album.title,
      reason: "Album has no photographs",
      href: `${ROUTES.STUDIO_ALBUMS}?album=${album.slug}`,
      action: "Add photographs",
    });
  }

  return items;
}

/* TODO: a real trail, written when something is published. Until then these
   are samples, so the band's shape and empty state can be built and
   reviewed. */
export const STUDIO_ACTIVITY = [
  {
    id: "s1",
    actor: "Ngabe",
    did: "published",
    subject: "A Heart-Warming Family Reunion",
    at: "2026-11-09T14:20:00Z",
    href: `${ROUTES.BLOGS}/a-heart-warming-family-reunion`,
  },
  {
    id: "s2",
    actor: "Ngabe",
    did: "added",
    subject: "Fête Memories to the gallery",
    at: "2026-11-08T09:05:00Z",
    href: ROUTES.STUDIO_ALBUMS,
  },
  {
    id: "s3",
    actor: "Ngabe",
    did: "saved a draft of",
    subject: "Walking Through Gisozi",
    at: "2026-11-02T11:15:00Z",
    href: ROUTES.STUDIO_POSTS,
  },
];
