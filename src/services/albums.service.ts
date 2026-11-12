import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type { Album, AlbumInput, Photo } from "@/types/album";
import { ENDPOINTS } from "./endpoints";

/** The gallery. Paths live in `endpoints.ts`. */
export const albumsService = {
  list: (query: ListQuery = {}, token?: string) =>
    api.get<Paginated<Album>>(ENDPOINTS.albums.list, { query, token }),

  bySlug: (slug: string, token?: string) =>
    api.get<Album>(ENDPOINTS.albums.one(slug), { token }),

  create: (input: AlbumInput, token?: string) =>
    api.post<Album>(ENDPOINTS.albums.create, input, { token }),

  update: (id: string, input: Partial<AlbumInput>, token?: string) =>
    api.patch<Album>(ENDPOINTS.albums.update(id), input, { token }),

  remove: (id: string, token?: string) =>
    api.delete<void>(ENDPOINTS.albums.remove(id), { token }),

  /** Photographs already uploaded, attached to the album by id. */
  addPhotos: (albumId: string, photoIds: string[], token?: string) =>
    api.post<Photo[]>(
      ENDPOINTS.albums.photos(albumId),
      { photoIds },
      { token },
    ),

  removePhoto: (albumId: string, photoId: string, token?: string) =>
    api.delete<void>(ENDPOINTS.albums.photo(albumId, photoId), { token }),
};
