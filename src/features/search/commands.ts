import type { Command } from "@/components/ui/CommandPalette";
import {
  ADMIN_TABS,
  MEMBER_NAV,
  STUDIO_TABS,
  type NavItem,
} from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { BLOG_PAGE_POSTS } from "@/features/blogs/data";
import { TRINITY } from "@/features/families/data";
import { FEATURED_ALBUMS } from "@/features/gallery/data";
import { mayUseStudio, type Role } from "@/lib/session";
import type { DirectoryEntry } from "@/types/member";

function pages(items: NavItem[], prefix = ""): Command[] {
  return items.map((item) => ({
    id: `page-${prefix}${item.label}`.toLowerCase().replace(/\W+/g, "-"),
    label: prefix ? `${prefix} · ${item.label}` : item.label,
    group: "Pages",
    href: item.href,
  }));
}

/**
 * Everything the search palette can reach, for the person signed in.
 *
 * Built on the server and handed to the palette as plain data, so the
 * register and the post list are not bundled into every member page's
 * JavaScript. A member is taken to the relative's own page; an
 * administrator to the person's record in the register.
 *
 * The people are the directory (`GET /users`, or the sample register in
 * fixture mode), loaded by the member layout. Stories and albums are still
 * fixtures until steps 8 and 9 of CLAUDE.md §23.
 */
export function searchCommands(
  role: Role | null,
  people: DirectoryEntry[],
): Command[] {
  const branchName = new Map(TRINITY.map((b) => [b.slug, b.name]));
  const isAdmin = role === "admin";
  const mayWrite = role !== null && mayUseStudio(role);

  return [
    ...pages(MEMBER_NAV),
    ...(mayWrite ? pages(STUDIO_TABS, "Studio") : []),
    ...(isAdmin ? pages(ADMIN_TABS, "Admin") : []),
    ...people.map((person) => ({
      id: `person-${person.id}`,
      label: person.name,
      group: "People",
      hint: `${branchName.get(person.branch) ?? person.branch} family`,
      href: isAdmin
        ? `${ROUTES.ADMIN_MEMBERS}?find=${person.id}`
        : `${ROUTES.PEOPLE}/${person.id}`,
    })),
    ...BLOG_PAGE_POSTS.map((post) => ({
      id: `story-${post.slug}`,
      label: post.title,
      group: "Stories",
      hint: post.tag,
      href: `${ROUTES.BLOGS}/${post.slug}`,
    })),
    ...FEATURED_ALBUMS.map((album) => ({
      id: `album-${album.slug}`,
      label: album.title,
      group: "Albums",
      hint: album.location,
      href: `${ROUTES.GALLERY}/${album.slug}`,
    })),
  ];
}
