/**
 * Every path this frontend asks the backend for, in one place.
 *
 * > [!IMPORTANT]
 * > **These paths are this frontend's assumption, not the backend's
 * > contract.** They were written from the Frontend Project Structure PDF
 * > (§10) before the API specification was to hand. When the real paths are
 * > known, correcting them is editing *this file* — the services, the
 * > components and the types above them do not change.
 *
 * The rule: a service names an endpoint from here and never writes a path
 * inline, so there is never a second place to look.
 */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    verify: "/auth/verify",
    logout: "/auth/logout",
    me: "/auth/me",
  },

  members: {
    list: "/members",
    one: (id: string) => `/members/${id}`,
  },

  posts: {
    list: "/posts",
    one: (slug: string) => `/posts/${slug}`,
    create: "/posts",
    update: (id: string) => `/posts/${id}`,
    remove: (id: string) => `/posts/${id}`,
    like: (id: string) => `/posts/${id}/like`,
  },

  albums: {
    list: "/albums",
    one: (slug: string) => `/albums/${slug}`,
    create: "/albums",
    update: (id: string) => `/albums/${id}`,
    remove: (id: string) => `/albums/${id}`,
    photos: (id: string) => `/albums/${id}/photos`,
    photo: (albumId: string, photoId: string) =>
      `/albums/${albumId}/photos/${photoId}`,
  },

  families: {
    list: "/families",
    one: (slug: string) => `/families/${slug}`,
  },

  birthdays: {
    list: "/birthdays",
  },

  resources: {
    list: "/resources",
    one: (id: string) => `/resources/${id}`,
  },

  /** Signed upload URLs, as the structure document describes. */
  uploads: {
    sign: "/uploads/sign",
  },
} as const;
