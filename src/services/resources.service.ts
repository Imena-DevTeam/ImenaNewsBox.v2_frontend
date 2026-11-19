import type { ApiAuth } from "@/lib/api-auth";
import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type {
  ResourceCategory,
  ResourceRead,
  ResourceUpdate,
} from "@/types/wire";
import { ENDPOINTS } from "./endpoints";

/**
 * The family's documents: PDFs, private, at most 10 MB.
 *
 * The backend never hands out an address for a file. It streams the file to
 * a signed-in member, so `file` returns the response itself for a route
 * handler to pass on, and the browser loads it from this site.
 */
export type ResourceQuery = ListQuery & {
  category?: ResourceCategory;
  featured?: boolean;
};

export interface ResourceUploadInput {
  file: Blob;
  fileName: string;
  title: string;
  category: ResourceCategory;
  description?: string;
  featured?: boolean;
}

export const resourcesService = {
  list: (query: ResourceQuery, auth: ApiAuth) =>
    api.get<Paginated<ResourceRead>>(ENDPOINTS.resources.list, {
      ...auth,
      query,
    }),

  one: (resourceId: string, auth: ApiAuth) =>
    api.get<ResourceRead>(ENDPOINTS.resources.one(resourceId), auth),

  /** The PDF, unread, to be streamed on. `download` asks the browser to
      save it rather than show it. */
  file: (resourceId: string, auth: ApiAuth, download = false) =>
    api.stream(ENDPOINTS.resources.file(resourceId), {
      ...auth,
      query: { download: download || undefined },
      headers: { Accept: "application/pdf" },
    }),

  /* Social media managers and administrators, from here down. */

  upload: (input: ResourceUploadInput, auth: ApiAuth) => {
    const form = new FormData();
    form.append("file", input.file, input.fileName);
    form.append("title", input.title);
    form.append("category", input.category);
    if (input.description) form.append("description", input.description);
    if (input.featured !== undefined) {
      form.append("featured", String(input.featured));
    }
    return api.post<ResourceRead>(ENDPOINTS.resources.list, form, auth);
  },

  update: (resourceId: string, changes: ResourceUpdate, auth: ApiAuth) =>
    api.patch<ResourceRead>(ENDPOINTS.resources.one(resourceId), changes, auth),

  /** A new PDF under the same details. */
  replaceFile: (
    resourceId: string,
    file: Blob,
    fileName: string,
    auth: ApiAuth,
  ) => {
    const form = new FormData();
    form.append("file", file, fileName);
    return api.put<ResourceRead>(
      ENDPOINTS.resources.file(resourceId),
      form,
      auth,
    );
  },

  remove: (resourceId: string, auth: ApiAuth) =>
    api.delete<void>(ENDPOINTS.resources.one(resourceId), auth),
};
