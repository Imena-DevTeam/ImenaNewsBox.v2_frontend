import type { ApiAuth } from "@/lib/api-auth";
import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type {
  AuthorRead,
  PostCreate,
  PostImageUploaded,
  PostRead,
  PostSummary,
  PostUpdate,
} from "@/types/wire";
import { ENDPOINTS } from "./endpoints";

/**
 * The family blog, which lives in Sanity behind the backend.
 *
 * Read by slug, written by Sanity id: a slug can change, the id never does.
 * Only published posts exist here. A draft is kept on the device until it
 * is published (CLAUDE.md §23).
 *
 * Writing needs every field, and the cover image goes first: upload it with
 * `uploadImage`, then send its `asset_id` as the post's `image_asset_id`.
 */
export type PostQuery = ListQuery & { category?: string };

export const postsService = {
  list: (query: PostQuery, auth: ApiAuth) =>
    api.get<Paginated<PostSummary>>(ENDPOINTS.posts.list, { ...auth, query }),

  bySlug: (slug: string, auth: ApiAuth) =>
    api.get<PostRead>(ENDPOINTS.posts.bySlug(slug), auth),

  /* Social media managers and administrators, from here down. */

  create: (post: PostCreate, auth: ApiAuth) =>
    api.post<PostRead>(ENDPOINTS.posts.list, post, auth),

  update: (postId: string, changes: PostUpdate, auth: ApiAuth) =>
    api.patch<PostRead>(ENDPOINTS.posts.byId(postId), changes, auth),

  remove: (postId: string, auth: ApiAuth) =>
    api.delete<void>(ENDPOINTS.posts.byId(postId), auth),

  /** JPEG, PNG or WebP, at most 5 MB. */
  uploadImage: (image: Blob, auth: ApiAuth) => {
    const form = new FormData();
    form.append("image", image);
    return api.post<PostImageUploaded>(ENDPOINTS.posts.images, form, auth);
  },

  /** Administrators: Sanity's authors and who each is linked to. */
  authors: (auth: ApiAuth) =>
    api.get<AuthorRead[]>(ENDPOINTS.posts.authors, auth),
};
