/**
 * Every path this frontend asks the backend for, in one place, relative to
 * `API_URL` (which ends in `/api/v1`).
 *
 * They are the backend's own paths, and `endpoints.test.ts` holds them to
 * it: every one must match a path in `src/types/openapi.json`, the schema
 * `pnpm api:types` copies from the backend. A path the backend renames
 * fails that test rather than a page.
 *
 * The rule: a service names an endpoint from here and never writes a path
 * inline, so there is never a second place to look.
 */
const id = (value: string) => encodeURIComponent(value);

export const ENDPOINTS = {
  auth: {
    /* No login needed for these five: they are how somebody gets one. */
    login: "/auth/login",
    verify: "/auth/verify",
    google: "/auth/google",
    refresh: "/auth/refresh",
    logout: "/auth/logout",

    sessions: "/auth/sessions",
    session: (sessionId: string) => `/auth/sessions/${id(sessionId)}`,

    /* The invitation token goes in the body, never the path, so it stays
       out of every URL and log on the way. */
    invitationCheck: "/auth/invitations/check",
    invitationAccept: "/auth/invitations/accept",

    /* Asking needs no login; listing and answering are for administrators. */
    resetRequests: "/auth/reset-requests",
    approveReset: (requestId: string) =>
      `/auth/reset-requests/${id(requestId)}/approve`,
    declineReset: (requestId: string) =>
      `/auth/reset-requests/${id(requestId)}/decline`,
  },

  users: {
    /** The member directory (GET) and adding somebody (POST, admins). */
    list: "/users",
    me: "/users/me",
    resendEmailCode: "/users/me/email/resend",
    verifyEmail: "/users/me/email/verify",
    /** Every account with its private fields. Administrators only. */
    accounts: "/users/accounts",
    subFamilies: "/users/sub-families",
    promotions: "/users/promotions",
    /** One member as everybody sees them (GET); an admin's edit (PATCH). */
    one: (userId: string) => `/users/${id(userId)}`,
    account: (userId: string) => `/users/${id(userId)}/account`,
    deactivate: (userId: string) => `/users/${id(userId)}/deactivate`,
    reactivate: (userId: string) => `/users/${id(userId)}/reactivate`,
    invitation: (userId: string) => `/users/${id(userId)}/invitation`,
    sanityAuthor: (userId: string) => `/users/${id(userId)}/sanity-author`,
    photo: (userId: string) => `/users/${id(userId)}/photo`,
  },

  wishes: {
    send: "/wishes",
    upcomingBirthdays: "/wishes/upcoming-birthdays",
    received: "/wishes/received",
    sent: "/wishes/sent",
    one: (wishId: string) => `/wishes/${id(wishId)}`,
  },

  posts: {
    list: "/posts",
    images: "/posts/images",
    authors: "/posts/authors",
    /** Read by slug; written by Sanity id, which never changes. */
    bySlug: (slug: string) => `/posts/${id(slug)}`,
    byId: (postId: string) => `/posts/${id(postId)}`,
  },

  resources: {
    list: "/resources",
    one: (resourceId: string) => `/resources/${id(resourceId)}`,
    file: (resourceId: string) => `/resources/${id(resourceId)}/file`,
  },
} as const;
