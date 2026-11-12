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

  /* Member area. FAMILY_TREE above is the public invitation to the tree;
     TREE is the member one, and they are different pages on purpose — the
     first sells it to a visitor, the second is the thing itself. */
  DASHBOARD: "/dashboard",
  RESOURCES: "/resources",
  BIRTHDAYS: "/birthdays",
  PROFILE: "/profile",

  /* One page per subfamily branch: wihogora | light | hope. */
  FAMILIES: "/families",

  /* Admin panel. ADMIN_LOGIN above is deliberately outside it: it is the one
     /admin path a signed-out visitor may reach. */
  ADMIN: "/admin",
  ADMIN_MEMBERS: "/admin/members",
  ADMIN_MEMBER_NEW: "/admin/members/new",

  /* The studio: the blogger's area. Everything the family reads is written
     and arranged here, which is why it is not under /admin — the person who
     publishes is not the person who keeps the register. */
  STUDIO: "/studio",
  STUDIO_POSTS: "/studio/posts",
  STUDIO_POST_NEW: "/studio/posts/new",
  STUDIO_ALBUMS: "/studio/albums",
  STUDIO_ALBUM_NEW: "/studio/albums/new",
} as const;
