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

    /* A locked-out administrator asks here; the backend tells the other
       administrators. It never mails the link itself — approve does, and
       only another administrator can call it. */
    forgotPassword: "/auth/forgot-password",
    resetRequests: "/auth/reset-requests",
    approveReset: (id: string) => `/auth/reset-requests/${id}/approve`,
    declineReset: (id: string) => `/auth/reset-requests/${id}/decline`,

    /* The token is in the path rather than the body because it is the whole
       credential: there is nothing else to send with it. */
    resetPassword: (token: string) => `/auth/reset-password/${token}`,
  },

  /**
   * Invitations.
   *
   * `one` is a **public** read: the person holding the link has no session
   * yet, which is the point of the link. It answers with a name and a role
   * or it refuses — never with anything else about the register.
   */
  invitations: {
    list: "/invitations",
    create: "/invitations",
    one: (token: string) => `/invitations/${token}`,
    accept: (token: string) => `/invitations/${token}/accept`,
    resend: (id: string) => `/invitations/${id}/resend`,
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
