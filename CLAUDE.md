# CLAUDE.md — Members Gallery (`/gallery`)

The page matches the Figma frame (`Members gallery.png`) to within a few
pixels. This file is what is still open, and what was closed and why.

Files: `src/features/gallery/components/*`, `src/components/layout/{PageHeader,
SectionHeading, FamilyTagline, MemberSidebar, MemberFooter}.tsx`,
`src/app/(member)/*`, `src/middleware.ts`, tokens in `src/styles/globals.css`.

---

## Still open

### 1. The session is a cookie, not an identity

`src/middleware.ts` keeps the member area off the public internet, but the
cookie it checks is written by `startMemberSession()` after _any_ five-digit
code. It is a gate, not authentication. When the auth API lands:

- verify the one-time password against it rather than `verifyCode()`'s
  700ms sleep (`src/features/auth/components/VerifyForm.tsx`),
- store the token it issues under `SESSION_COOKIE` and verify it in the
  middleware instead of only checking the cookie is present,
- give roles their own homes — admin does not belong on `/dashboard`.

`next-auth` is still installed and unused. Either wire it or drop it.

### 2. Everything is still sample data

`src/features/gallery/data.ts` is static imports. Albums, photos and the
member all need APIs. `MEMBER` (`src/constants/member.ts`) should come from
the session.

### 3. "Featured Videos" shows photographs

There is no player, no duration, no play affordance — the section is a photo
carousel with a video heading. Either wire real video (and add a poster,
duration, captions) or rename the section.

### 4. Sticky navigation

The rail scrolls away because the design draws it that way, which leaves a
2470px page with no navigation for most of its scroll. Decide with the
designer: bring `md:sticky` back on `MemberSidebar` and give up the
full-width album grid, or add a compact bar that appears once the rail
leaves.

### 5. Mobile navigation

Below `md` the rail is a horizontal strip showing four of seven items at
390px with no scroll hint. A bottom tab bar with four destinations and a
"More" sheet would serve better.

### 6. Images

Every photograph is a full-size PNG in `public/`. Convert the source art to
WebP/AVIF before the album count grows; the static imports already give
blur placeholders and intrinsic sizes.

### 7. Checks not yet run

Run axe over the page once the data is real, and test the stage and the
video dots with a screen reader — both are driven by state that mutates in
place.

### 8. The bell wears an unread dot

It is in the design, and the label says "not connected yet". Drop the dot or
wire notifications; do not ship a page that shows unread marks for nothing.

---

## Closed, and how

- **Member area was public** → `src/middleware.ts` redirects any member path
  without a session to `/login?next=…`; `/login` carries it to `/verify`,
  which validates it is a path on this site before returning to it. Sign out
  lives on `/profile`.
- **Album arrow was a dead end** → `/gallery/[album]` exists
  (`AlbumView`), six albums with slugs and photos, prerendered via
  `generateStaticParams`. The whole card is the link; the circle is the
  affordance.
- **No loading / error / empty states** → `(member)/gallery/loading.tsx`
  with `GallerySkeleton` (built on the same aspect tokens, so nothing
  shifts), `(member)/error.tsx` keeping the frame and offering a retry, and
  empty states inside `FeaturedAlbums` and `FeaturedVideos`.
- **Stage read as decoration** → side photographs now lift and take a
  pointer cursor, and left/right turn the stage from anywhere inside it.
  The video carousel takes the same keys.
- **Stage vanished on tablets** → `gallery-stage` drops to three columns
  between `md` and `lg` instead of one.
- **Two violets for one line** → `--color-member-future` is gone;
  `--color-tagline-accent` is the only one, and `FamilyTagline` is the only
  place the line is written (gallery, dashboard and blogs all use it).
- **Chrome lived in a feature** → `GalleryHeader` → `PageHeader` and
  `SectionHeading` moved to `components/layout/`, `MEMBER` to
  `constants/member.ts`. Blogs no longer imports from the gallery feature.
- **Rail labels were 10px** → `--text-rail` (11px).
- **Ornaments were absolute page offsets** → each now hangs off the section
  it belongs to, so they cannot drift when a section changes height.
