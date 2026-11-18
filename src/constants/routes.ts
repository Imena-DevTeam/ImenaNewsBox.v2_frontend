export const ROUTES = {
  HOME: "/",
  OUR_STORY: "/our-story",
  GALLERY: "/gallery",
  FAMILY_TREE: "/family-tree",
  TREE: "/tree",
  BLOGS: "/blogs",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  VERIFY: "/verify",
  SIGNUP: "/signup",
  /* Not a page: a route that ends a session the backend has already ended,
     so the login does not send the person straight back. */
  SESSION_ENDED: "/session-ended",

  /* Member area. FAMILY_TREE above is the public invitation to the tree;
     TREE is the member one, and they are different pages on purpose — the
     first sells it to a visitor, the second is the thing itself. */
  DASHBOARD: "/dashboard",
  RESOURCES: "/resources",
  BIRTHDAYS: "/birthdays",
  PROFILE: "/profile",

  /* One page per subfamily branch: wihogora | light | hope. */
  FAMILIES: "/families",

  /* One page per person in the register: /people/<id>. */
  PEOPLE: "/people",

  /* Admin panel. ADMIN_LOGIN above is deliberately outside it: it is the one
     /admin path a signed-out visitor may reach. */
  ADMIN: "/admin",
  ADMIN_MEMBERS: "/admin/members",
  ADMIN_MEMBER_NEW: "/admin/members/new",

  /* The /admin page a signed-out visitor may reach, beside the login. It
     exists for an administrator who has lost their password, so it cannot
     sit behind the gate that asks for it — see ADMIN_PUBLIC_PATHS in
     lib/session.ts, which is what actually lets it through. */
  ADMIN_FORGOT_PASSWORD: "/admin/forgot-password",

  /* The backend's invitation link: /invitation#token=…. Public, because the
     person holding it may have no account yet. One page for members and
     administrators, and for an administrator's new password too: the
     backend sends the same link for a reset. It grants no session. */
  INVITATION: "/invitation",

  /* The studio: the blogger's area. Everything the family reads is written
     and arranged here, which is why it is not under /admin — the person who
     publishes is not the person who keeps the register. */
  STUDIO: "/studio",
  STUDIO_POSTS: "/studio/posts",
  STUDIO_POST_NEW: "/studio/posts/new",
  STUDIO_ALBUMS: "/studio/albums",
  STUDIO_ALBUM_NEW: "/studio/albums/new",
} as const;
