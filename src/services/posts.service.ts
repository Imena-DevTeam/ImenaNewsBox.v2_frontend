import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type { Post, PostInput } from "@/types/post";
import { ENDPOINTS } from "./endpoints";

/** The family's stories. Paths live in `endpoints.ts`. */
export type PostQuery = ListQuery & {
  category?: string;
  status?: "draft" | "published";
};

export const postsService = {
  list: (query: PostQuery = {}, token?: string) =>
    api.get<Paginated<Post>>(ENDPOINTS.posts.list, { query, token }),

  bySlug: (slug: string, token?: string) =>
    api.get<Post>(ENDPOINTS.posts.one(slug), { token }),

  create: (input: PostInput, token?: string) =>
    api.post<Post>(ENDPOINTS.posts.create, input, { token }),

  update: (id: string, input: Partial<PostInput>, token?: string) =>
    api.patch<Post>(ENDPOINTS.posts.update(id), input, { token }),

  remove: (id: string, token?: string) =>
    api.delete<void>(ENDPOINTS.posts.remove(id), { token }),

  /** Returns the new count, so the button shows the server's number. */
  like: (id: string, token?: string) =>
    api.post<{ likes: number }>(ENDPOINTS.posts.like(id), undefined, { token }),
};
