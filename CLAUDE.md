# IMENA Family Times — admin reshaped around people

Written from scratch on 11 Nov 2026, replacing the `/admin` refinement brief.
**Steps 1 to 7 were applied the same day**, and **step 8 followed** — see
section 13, which supersedes section 7 where the two differ. What was
built, and where it departs from what was planned, is recorded in section 11.
Everything in sections 1 to 9 still describes the intent.

---

## 1. Rules that do not change

> [!IMPORTANT]
> **Never `git commit` or `git push` unless the user asks in that message.**
> Leave work uncommitted. The user does all remote operations.

> [!CAUTION]
> **No AI slop.** No helper labels ("Click to open"), no emoji in buttons or
> headings, no decorative badges, no explanatory captions the design does not
> have. When there is no design frame, build the plainest thing that matches
> the surrounding page and stop.

- Tokens from `src/styles/globals.css` only — no raw hex, no `slate-*` or
  `neutral-*`, no bracket values such as `text-[11px]` or `h-[34rem]`.
  Tailwind v4 generates `h-136`, `size-18`, `top-6.5`; use those.
- `import { m } from "motion/react"` — never `{ motion }`.
- `useSyncExternalStore` over setState-in-effect:
  `react-hooks/set-state-in-effect` is an **error** in this project, not a
  warning.
- `components/ui` holds no business logic and makes no network calls.
- No charts, graphs, sparklines or gauges in the admin area. Numbers get read.
- Sentence case everywhere except `PageHeader`, which upper-cases in CSS.
- Dates are stored ISO and read through a formatter. `formatPostDate()` uses
  `en-US` on purpose; `ArticleDetailView.test.tsx` holds that line.
- The gate, every time: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
  `pnpm test`, `pnpm build`.

---

## 2. The decision this file acts on

The admin area was built as a content tool: write posts, create albums, add a
member. The user's correction, 11 Nov 2026:

> Posts and albums are a **social media manager's** job, not the
> administrator's. Take them out of `/admin`. Keep the overview. Keep the post
> and album screens themselves — they belong to that other role, which we will
> deal with next. What the administrator needs instead is **people**: see every
> user, change any user's email, add one, remove one. A CRUD.

So the admin stops being the person who publishes and becomes the person who
holds the register. Two roles, two areas, one codebase.

| Role                 | Owns                              | Area     |
| -------------------- | --------------------------------- | -------- |
| Administrator        | the people register, the overview | `/admin` |
| Social media manager | posts and albums                  | later    |
| Member               | reading, their own profile        | the rest |

> [!NOTE]
> **Nothing to do with posts or albums gets deleted.** `PostEditor`,
> `PostsArchive`, `AlbumForm`, `UploadDropzone`, `postSchema`, `albumSchema`
> and their tests are the next role's inheritance. They are moved or left in
> place, never removed.

---

## 3. What exists today

### Routes under `(member)/admin`

| Path                 | What it is                       | After this plan       |
| -------------------- | -------------------------------- | --------------------- |
| `/admin`             | overview, three bands + counts   | **kept**, reworded    |
| `/admin/posts`       | `PostsArchive`, refined 11 Nov   | leaves the admin tabs |
| `/admin/posts/new`   | `PostEditor`, refined 11 Nov     | leaves the admin tabs |
| `/admin/albums/new`  | `AlbumForm` + `UploadDropzone`   | leaves the admin tabs |
| `/admin/members/new` | `AddMemberForm`                  | becomes a sub-page    |
| `/admin/login`       | the one door a visitor may reach | unchanged             |

`loading.tsx`, `error.tsx` and `AdminSkeleton` exist. **`AdminSkeleton` still
previews the old `/admin` layout** — it is stale and is part of this work.

### What the register would be built on

There is **no people dataset**. The "73 members" on the overview is
`TRINITY.reduce((n, f) => n + f.members, 0)` — three branch counts, not three
branch rosters. `features/birthdays/data.ts` holds a handful of named people
for its own page. `features/profile` has no data file.

> [!WARNING]
> **A users CRUD needs a users list, and one does not exist.** This is the
> largest single item in the plan, and it is sample data either way, because
> there is no API. Section 5.1 creates the register as the one source the admin
> page, the birthdays page and the branch counts can all read.

### Role model

`src/lib/session.ts` — `type Role = "member" | "admin"`, HMAC-signed cookie,
token `v2.<role>.<issuedAtMs>.<sig>`. The middleware gates `/admin` on
`role === "admin"` and the admin layout checks again on the server. A third
role means touching the type, the token reader's validation, the login
screen's two choices, the middleware and the layout — five places, listed in
section 7.

---

## 4. The plan, in order

Eight steps. Each one leaves the gate green on its own; none depends on the
API arriving.

| #   | Step                                             | Size  |
| --- | ------------------------------------------------ | ----- |
| 1   | The people register (`features/members/data.ts`) | large |
| 2   | `/admin/members` — the list                      | large |
| 3   | Edit a user, including the email                 | med   |
| 4   | Add a user, remove a user                        | med   |
| 5   | Posts and albums out of the admin tabs           | small |
| 6   | The overview reworded around people              | med   |
| 7   | `AdminSkeleton` matched to the new pages         | small |
| 8   | `editor` role reserved, posts and albums parked  | med   |

Steps 1–4 are the CRUD the user asked for. 5–7 are the removal and the
tidy-up it forces. 8 is the next role's doorway, and is the one step that can
be deferred without leaving anything half-built.

---

## 5. The register and its pages

### 5.1 `src/features/members/data.ts` — step 1

One record per person. The fields are what the admin edits plus what the rest
of the site already needs, and nothing speculative.

```ts
export type MemberStatus = "active" | "invited" | "suspended";

export interface FamilyMember {
  /** Stable across an email change, which is the whole point of having it. */
  id: string;
  fullName: string;
  email: string;
  /** A branch slug from TRINITY: wihogora | light | hope. */
  branch: string;
  /** ISO, or empty — the Birthdays page cannot place them without it. */
  bornOn: string;
  role: Role;
  status: MemberStatus;
  /** ISO. The list's default order is newest first. */
  joinedOn: string;
}
```

Rules this data must satisfy, because the UI will lean on them:

- **Emails are unique, case-insensitively.** The edit and add forms both check
  it, so the fixture must not violate it.
- **Branch counts must come from here**, not from `TRINITY[].members`. Three
  numbers in two places disagree the moment one is edited. `TRINITY` keeps
  `members` as a field, but the admin reads `countByBranch()`.
- 73 records is a lot of fixture to hand-write and the right amount to test a
  list against. Generate them from a seed of real-looking Rwandan names across
  the three branches, with a scatter of missing `bornOn` and a few `invited`
  and `suspended`, so the filters and the attention queue have something to
  find.
- `members.ts` gets a sibling `members.test.ts` for `countByBranch`,
  `findByEmail` and the search/filter helper — the same shape as
  `features/admin/writing.test.ts`.

### 5.2 `/admin/members` — step 2

A table, not cards. This is the one place in the project where a table is
right: the columns carry comparison. Name, email, branch, role, status,
joined. `/admin/posts` became cards because its columns did not compare; here
they do.

```
┌──────────────────────────────────────────────────────────────────────┐
│  MEMBERS                                       [ Add a member ]      │
│  ▂▂▂▂                                                                │
│  73 people, 4 without a date of birth                                │
├──────────────────────────────────────────────────────────────────────┤
│  [ Search name or email        ]  [ Any branch ▾ ] [ Any status ▾ ]  │
├──┬───────────────────────┬────────────────────────┬────────┬─────────┤
│☐ │ Uwimana Claire        │ claire@…               │ Light  │  Edit   │
│  │ Wihogora · 12 Mar 1994│ active                 │        │         │
└──┴───────────────────────┴────────────────────────┴────────┴─────────┘
```

- Reuse `PostsArchive`'s `Picker` — the `field-sizing-content` +
  `appearance-none` + drawn `ChevronDown` dropdown. **Lift it to
  `components/ui/Picker.tsx`** rather than copying it; a native `<select>`
  sizes to its longest option and that bug is fixed in exactly one place
  today. A second user is the reason to move it.
- Search matches name **and** email. An admin looking a person up has one or
  the other, not both.
- Filters: branch, status, and "missing a date of birth", because that is the
  one data gap the rest of the site visibly suffers from.
- Sort: name A–Z, newest first, oldest first. No sort on email.
- Rows paginate at 25 with a "Show all" escape. 73 rows is 73 rows; the admin
  will scroll past the person they want.
- Selection and bulk actions are **out of scope for step 2**. Bulk-editing
  people is how an admin removes forty relatives by accident. Revisit only if
  asked.
- `MembersTable.test.tsx`, the shape of `PostsArchive.test.tsx`: search finds
  by email, branch filter counts, empty state reads as a sentence, the
  missing-birthday filter finds exactly the seeded gaps.

### 5.3 Edit — step 3

The email change is the headline request, so it gets the care.

- The row action **Edit** opens the record in a panel beside the table on wide
  screens and a `<dialog>` below `lg`. Not a separate route: the admin's job
  is a sweep through the list, and a full page navigation each time loses
  their place in it.
- Editable: full name, email, branch, date of birth, role, status.
- `memberEditSchema` in `features/admin/schemas.ts`, extending the existing
  `memberSchema`: email becomes **required** (a record being edited has one),
  and uniqueness is checked against every other record with a `superRefine`.
- **Changing an email changes how a person signs in.** The panel says so in
  one sentence under the field, and the save reports the old address and the
  new one. No silent success.
- Role is a `<select>`, and **an admin cannot remove their own admin role** —
  the control disables on your own record, with the reason stated. This is the
  classic lock-yourself-out bug, and it costs two lines to not have.
- Nothing saves. The panel reports what it would do, as `PostEditor` and
  `PostsArchive` already do, with a TODO naming the members service.

### 5.4 Add and remove — step 4

- **Add** reuses `AddMemberForm`, which exists and validates. Move it onto
  `/admin/members` as the same panel the edit uses, prefilled empty, and keep
  `/admin/members/new` as a route that renders the page with the panel open —
  so a link to it still works and the tab row does not gain a tab.
- Email becomes required on add too, for the same reason as the edit.
- **Remove** is `ConfirmDialog`, destructive variant, which exists and is
  already wired to the posts bulk delete. It names the person and says whether
  it can be undone.
- Prefer **suspend** to delete, and say which happened. A removed relative is
  still a relative; `status: "suspended"` keeps them in the register and out
  of the site. Delete stays available, and stays behind the confirmation.

---

## 6. Taking posts and albums out

### 6.1 Step 5 — the tabs and the routes

`ADMIN_TABS` in `src/constants/nav.ts` loses Posts and Albums and gains the
members list:

```ts
export const ADMIN_TABS: NavItem[] = [
  { label: "Overview", href: ROUTES.ADMIN },
  { label: "Members", href: ROUTES.ADMIN_MEMBERS },
];
```

Two consequences to handle rather than ignore:

1. **`AdminTabs` is built on `--i` and `--n` for a four-tab row.** It reads
   `ADMIN_TABS.length`, so two tabs work — but two tabs each at `flex-1`
   across a 1440px page is a 700px-wide hit area each, which looks broken. The
   row becomes `inline-flex` with the indicator tracking widths, or the tabs
   drop to a plain two-link row. Decide with it on screen.
   **Do not reintroduce `overflow-x: auto` on that nav** — it makes the y-axis
   `auto` too, and the indicator then raises a vertical scrollbar.
2. `AdminQuickActions` offers **Write a post · Create an album · Add a
   member**. Two of the three are not the admin's work. It becomes one button,
   **Add a member**, which means the component is a button rather than a row —
   fold it into the members page header and delete the component, or keep it
   with one action. Folding it in is the honest answer.

The routes `/admin/posts`, `/admin/posts/new` and `/admin/albums/new` **stay
on disk and stay reachable by URL** through steps 5–7. They leave the
navigation; they are not broken. `ROUTES.ADMIN_POSTS`, `ADMIN_POST_NEW` and
`ADMIN_ALBUM_NEW` stay in `routes.ts`, with a comment naming the role they now
belong to.

### 6.2 Step 6 — the overview, reworded

The three bands stay. What fills them changes, because the admin's work
changed.

| Band              | Was                          | Becomes                                    |
| ----------------- | ---------------------------- | ------------------------------------------ |
| Identity + action | three buttons, two now wrong | identity line + **Add a member**           |
| Needs attention   | drafts, empty albums, no DOB | **people only**: no DOB, invited, no email |
| Recent activity   | sample posts and albums      | sample **register** changes                |
| Counts strip      | Members · Posts · Albums     | the three **branches**, from the register  |

`attentionItems()` in `features/admin/data.ts` reads draft posts and empty
albums today. It is rewritten against the register. The draft-post and
empty-album items move with the posts role in step 8; until then they leave
the admin's queue, because the admin cannot act on them.

The `CommandPalette` keeps `Cmd K` and loses "Go to post…". It gains **"Find a
person…"**, which is the one thing an admin with 73 records opens a palette
for.

### 6.3 Step 7 — `AdminSkeleton`

It previews the layout `/admin` had two refinements ago. It is rewritten to
the shape of the new overview, and a second skeleton is added for the members
table — a header, the filter row, and eight rows. From `components/ui/Skeleton`;
never `animate-pulse`.

---

## 7. Step 8 — the next role's doorway

The step to take **only when the user says to**, because it is the one that
changes auth.

1. `type Role = "member" | "admin" | "editor"` in `src/lib/session.ts`. The
   reader's `if (role !== "member" && role !== "admin") return null;` must
   learn the third value, or every editor token is rejected as forged.
   `session.test.ts` covers the token format and needs a case per role.
2. A segment for the content tools — `/studio/posts`, `/studio/albums` — with
   `isEditorPath()` beside `isAdminPath()`, a middleware branch, and a server
   check in its layout. The admin area's pattern, copied exactly.
3. `/admin/posts`, `/admin/posts/new` and `/admin/albums/new` move there
   whole. `PostEditor`, `PostsArchive`, `AlbumForm`, `UploadDropzone` and their
   tests move out of `features/admin`; the imports change, the components do
   not.
4. The login screen offers a third capacity. Today it offers two.
5. An administrator can reach `/studio` as well. An editor cannot reach
   `/admin`. One sentence of policy, two lines of middleware.

Until step 8 runs, the posts and album screens are admin-reachable by URL and
absent from the navigation. That is a deliberate holding state, not an
oversight — write it down anywhere a reader might think otherwise.

---

## 8. What stays untrue

- **Nothing saves.** `PostEditor`, `AlbumForm`, `AddMemberForm` and every panel
  this plan adds validate, report, and stop. `api-client.ts` and `services/`
  are still empty. The members CRUD will be a CRUD over a module-level array,
  and the page must never imply otherwise.
- **The register is sample data.** 73 invented people. A number drawn from a
  fixture is not presented as fact.
- **The activity trail is sample data.** A real trail is written when something
  changes, which needs the API.
- **No email is sent.** Changing a person's email address in a fixture does not
  notify them, and an "invited" status does not send an invitation.

---

## 9. Done means

1. `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`,
   `pnpm build` all clean. The suite is 113 tests over 20 files today; the
   register, the table and the schema should add to that, not replace it.
2. No horizontal scroll at 360, 390, 768 and 1440px — the members table is the
   first thing in the admin area wide enough to break this, so it needs a
   stacked reading below `sm`, not a scrolling table.
3. Tabbing reaches every row action and every panel control, and focus returns
   to the row after the panel closes. The native `<dialog>` gives the return
   for free; a side panel does not.
4. A member who reaches `/admin` lands on `/dashboard`; a signed-out visitor
   lands on `/admin/login`. Both hold today — do not regress them.
5. No chart, no sparkline, no gauge. No new raw hex, off-palette class or
   bracket value.
6. **Do not commit or push unless asked.**

---

## 10. History worth keeping

Two notes from the work this file replaces, because both cost real time.

**Syncfusion was tried and removed** on 10 Nov 2026 at the user's request. Do
not reintroduce it. The licence draws Syncfusion's own banner over the
components in a production build without a key, and in v35 the only working
stylesheet is the whole suite — 582KB gzipped, and `/admin/posts` reached
715KB first-load JS against 218KB after removal. Nothing in `src/` imports it
and no `@syncfusion/*` package is installed.

**The `.next` ENOENT loop is OneDrive.** The project sits inside a synced
folder, and OneDrive races Next's write-then-rename, producing
`ENOENT ..._buildManifest.js.tmp.<random>`. `.gitignore` excludes `.next`;
OneDrive does not read `.gitignore`. The fix is to replace `.next` with a
directory junction to `C:\Users\awk-3\AppData\Local\next-cache\project22`,
which is created and waiting. **It is blocked on the user**, who must first
stop every running Next process — several accumulate across sessions, and
`Stop-Process` is blocked for this session, so the user runs `taskkill`
themselves.

---

## 11. What was applied, 11 Nov 2026

Steps 1 to 7, in order. Step 8 is untouched: posts and albums are off the
navigation and reachable by URL, which is the holding state section 7
describes.

| Step | State | Where                                                       |
| ---- | ----- | ----------------------------------------------------------- |
| 1    | done  | `features/members/data.ts` + `data.test.ts` (14 tests)      |
| 2    | done  | `MembersTable` + `/admin/members` + `MembersTable.test.tsx` |
| 3    | done  | `MemberPanel`, `memberEditSchema`                           |
| 4    | done  | the same panel, and `ConfirmDialog` on the row              |
| 5    | done  | `ADMIN_TABS`, `AdminTabs`, `routes.ts`                      |
| 6    | done  | `admin/page.tsx`, `admin/data.ts`, `CommandPalette`         |
| 7    | done  | `AdminSkeleton` + `MembersSkeleton`                         |

**Gate:** typecheck, lint and format clean; **140 tests over 22 files**, up
from 113 over 20. `pnpm build` could not be run to completion — `next/font`
fails to reach Google Fonts from this machine (`ETIMEDOUT` on
`fonts.googleapis.com`) in `(auth)/layout.tsx` and `(member)/layout.tsx`,
neither of which this work touches. **Run `pnpm build` once the network
allows it.**

### Six departures from the plan, and why

1. **The edit panel is a `<dialog>` at every width**, not a side panel on
   wide screens. Section 9's third requirement is that focus returns to the
   row that opened it; the native dialog gives that, plus Escape and focus
   trapping, and a hand-built panel gives none of the three. The admin keeps
   their place in the list either way, because the table is never unmounted.
2. **`AddMemberForm` and `memberSchema` were deleted** rather than reused.
   Add and edit are the same form over the same record, and the old form
   disagreed with the new one about whether an email is required — it would
   have stored a person nobody could ever sign in as. One form, one schema.
   `/admin/members/new` renders the register with that panel already open.
3. **`AdminQuickActions` was deleted**, which is the "fold it in" answer
   section 6.1 called honest. The overview carries one `ButtonLink`, and the
   register carries its own.
4. **The attention queue has two kinds of row, not three.** "No email
   address" cannot happen: the register gives everybody one and the panel
   refuses to save a record without one. A branch nothing can reach is worse
   than an absent one, so it is absent, and `data.ts` says so.
5. **`vitest.setup.ts` now stands in for `showModal()` and `close()`.**
   jsdom 28 builds `<dialog>` but implements neither, which is why none of
   the seven dialogs in this codebase had ever been opened by a test —
   `MembersTable.test.tsx` is the first, and it threw. The stand-in tracks
   the `open` attribute and fires `close`; it does not pretend to implement
   the top layer, focus trapping or inertness.
6. **The tab row is a `w-fit` grid with `auto-cols-fr`**, so two tabs are as
   wide as their labels rather than half the page each. The indicator still
   needs equal columns, which is what `auto-cols-fr` under `w-fit` gives.

### Two things worth knowing about the register

**It reproduces the old arithmetic exactly.** 18 Wihogora, 24 Light, 31
Hope, 73 people — the three numbers `TRINITY[].members` carried, so no
page's total moved on the day the register arrived. A test holds that line.
Names are composed from two pools by coprime strides, so all 73 names, and
so all 73 emails, are distinct; a duplicate address would be a broken login
rather than an untidy fixture.

**The signed-in administrator is in it**, as `SIGNED_IN_ID`, and is the only
admin. That is what the role control locks against: taking your own
administrator role away locks you out of the page you are standing on, so
the control disables on your own record and says why.

### Still open

- **Step 8**, the `editor` role and `/studio`. Section 7 holds it.
- **`pnpm build`**, blocked on the font fetch above.
- **The `.next` junction**, blocked on the user — section 10.
- **Nothing saves.** The CRUD runs over a copy of the register in state and
  every outcome says so. `api-client.ts` and `services/` are still empty.

---

## 12. The gaps closed, 11 Nov 2026

Everything the audit of the admin area still listed, in one pass. Nothing
here was planned in sections 4 to 7; it is what was left over once the
register was built.

| Was missing                      | Now                                           |
| -------------------------------- | --------------------------------------------- |
| no way to correct a post         | `/admin/posts/[slug]/edit`                    |
| no way to see the albums         | `/admin/albums`                               |
| `/admin/albums/new` unrefined    | two columns, the photographs taking the width |
| `/admin/login` lost the way back | it forwards `?next=`, and signs in by address |
| five routes flashing blank       | five `loading.tsx`, five shaped skeletons     |
| no `not-found` under admin       | `admin/not-found.tsx`, keeping the tab row    |
| a generic `error.tsx`            | it names the tool, and keeps the tab row      |

### Correcting a post

`PostEditor` takes an optional `post` and edits that one. **The archive could
publish, filter and bulk-delete ten posts and never change one**, so a typo
in a family story was permanent. The body is `contentParagraphs` joined by
the blank lines the editor splits on, so what loads is what the reader sees.

The entry title in the archive now opens the editor instead of leaving the
admin area for the public blog page — that dead end was **C1** in the
original audit. Reading the published post is a small "Read it" link in the
meta row, which is the honest size for it.

### The albums

`/admin/albums` is a **grid**, not a table: every row's most useful column is
the photograph, and a photograph does not fit in a cell. Search by title or
place, three orders, a filter for albums with no photographs, and per card
Edit, Open and Remove. Renaming uses the same `albumSchema` the create form
does, so an album cannot be made with details it cannot be edited back to.

> [!NOTE]
> **No album in the fixture is empty**, which is also why the attention queue
> never had an empty album to report. `AlbumsBoard.test.tsx` holds that: the
> mark appears for nobody, and the filter finds nobody.

### `/admin/albums/new`

The same shape as the post editor, for the same reason — the photographs are
the album, so they take the width and the details sit in a sticky rail.

`UploadDropzone` changed with it: **thumbnails instead of file names** (it
asked somebody choosing between forty photographs of one afternoon to
recognise `IMG_4471.jpg`), **the cover is chosen rather than assumed to be
the first**, and the hard-coded `htmlFor="album-photos"` is a prop, so two of
these on a page no longer share one label. Object URLs are revoked on unmount
only: revoking on every change blanks the thumbnails still on screen.

### `/admin/login`

Two real defects, not a repaint.

1. **It threw away where the administrator was going.** The middleware sends
   anyone without an admin session there carrying `?next=`, and the member
   login has always forwarded it. This one did not, so being stopped on the
   way to `/admin/members` landed you on the overview. It forwards it now,
   drops anything that is not a plain path on this site, and says where you
   will carry on to.
2. **It asked for the family name**, which is the one credential that cannot
   identify an administrator: seventy-three people share it. `adminLoginSchema`
   took an email address instead — **reverted on 12 Nov 2026**, see §19. The
   field is a name again and the lookup moved into the server: the password
   is what makes it a credential.

> [!IMPORTANT]
> The credential change was a **departure from the design**, which shows
> "Enter family name" on both doors. It was put back on 12 Nov 2026 — the
> design won. See §19; the objection behind the departure survived it.

### The states

`loading.tsx` for `/admin/posts`, `/admin/posts/new`,
`/admin/posts/[slug]/edit`, `/admin/albums` and `/admin/albums/new`, each
from a skeleton shaped like what arrives — `PostsSkeleton`, `EditorSkeleton`,
`AlbumsSkeleton`, `AlbumFormSkeleton`, beside the two that already existed.
A skeleton that does not match what lands is worse than none, because the
page jumps.

`admin/not-found.tsx` is what a deleted post's bookmarked edit link renders.
It keeps the tab row, which is the difference between a dead end and a page
you can leave, and `error.tsx` now does the same and names which tool failed.

### Still true

Posts and albums are **still the social media manager's work and still off
the tab row** — three of these pages were built for a role that does not
exist yet, which is exactly why **step 8** is the next thing worth doing.
Nothing saves, anywhere.

---

## 13. Step 8, applied: Ngabe and the studio

The third role, 11 Nov 2026. Section 7 planned an `editor` role reached
through its own login. **That is not what was built**, because it is not what
the family needs:

> The blogger has the same login as a member. You type her name — Ngabe — and
> the system checks the name and gives her the posting functionality, like a
> button on her sidebar.

So there is **one login for the whole family**, and the thing that makes
somebody the blogger is a row in the register.

### How she gets in

1. `/login` asks for a name, as it always has.
2. `roleForName()` in `features/auth/roles.ts` looks that name up in
   `FAMILY_REGISTER` and returns `blogger` if the person it finds holds that
   role. The whole name or either part of it matches, case-insensitively —
   nobody types "Ngabe Uwase" when "Ngabe" is what they are called.
3. The form asks `/verify` for a blogger session; `VerifyPanel` reads the
   role and `startMemberSession` signs it into the cookie.
4. `MemberSidebar` gives her one extra target: **Studio**, a `PenLine` at the
   end of the rail, exactly as the admin's `Shield` works.

> [!IMPORTANT]
> **The lookup grants `blogger` and nothing else.** An administrator still
> comes through `/admin/login`, which asks for a password. The register is
> readable by anyone who can see the site, so a name must never be enough to
> become an administrator — `roles.test.ts` holds that line, by name and by
> full name.

**It is data, not code.** An administrator can hand the studio to somebody
else from `/admin/members` — the role select there now offers Member,
Blogger and Administrator — and no deploy is needed. `BLOGGER_ID` is `m-02`
in the register, and `constants/member.ts` carries her name for the frames
to greet, beside the member's, until the session carries an identity.

### Where her work lives

`/studio`, gated like `/admin`: `isStudioPath()` and `mayUseStudio()` in
`lib/session.ts`, checked in the middleware **and** again in
`studio/layout.tsx`, so the rule never rests on the middleware alone. An
administrator may use the studio too — they answer for what the family
publishes. A member who reaches for it lands on their dashboard, and is not
sent to a login, because the login does not grant it.

| Page                        | What moved there               |
| --------------------------- | ------------------------------ |
| `/studio`                   | new — her overview             |
| `/studio/posts`             | was `/admin/posts`             |
| `/studio/posts/new`         | was `/admin/posts/new`         |
| `/studio/posts/[slug]/edit` | was `/admin/posts/[slug]/edit` |
| `/studio/albums`            | was `/admin/albums`            |
| `/studio/albums/new`        | was `/admin/albums/new`        |

`features/admin/{PostsArchive,PostEditor,AlbumsBoard,AlbumForm,UploadDropzone}`,
`archive.ts`, `writing.ts` and their tests are now `features/studio/`, and
`albumSchema` and `postSchema` moved to `features/studio/schemas.ts`.
`features/admin/schemas.ts` keeps `memberEditSchema` alone.

### Two things worth knowing

**`AdminTabs` became `components/ui/SectionTabs`.** The studio needed the
same row, and that row carries two hard-won lessons — no `overflow-x:auto`,
equal columns for the gliding indicator. One copy, so they are only learned
once. `AdminTabs` and `StudioTabs` are four lines each.

**The draft and empty-album queue rows came back.** They were taken out of
the administrator's attention queue because an administrator cannot finish
somebody else's draft. They are in `studioAttention()` now, which is the
right person's queue, and a draft's row links straight to its editor.

### Still true

Nothing saves, anywhere. `roleForName` is not authentication: the one-time
password does not prove anything either, and the TODO above it says so.

---

## 14. The studio, judged and fixed, 11 Nov 2026

Seven things, in the order they were worth doing. Two were defects.

### The defects

**Her own name was missing from her own pages.** `PageHeader` read a
hard-coded `MEMBER`, so every studio page greeted the blogger as "Aganze ·
Family Member" while the line underneath said "Signed in as Ngabe · Family
blogger". The page contradicted itself, and the dashboard greeting and the
member footer told the same lie.

`constants/member.ts` now holds a `Person` shape, three people, and
`signedInPerson(role)`. The member layout already reads the role — the one
server component every member page passes through — and hands it to
`SignedInProvider`, which `PageHeader`, `DashboardHeader`,
`DashboardGreeting` and the footer's `SignedInName` read.

> [!NOTE]
> The portrait is still the one photograph the project ships. The register
> holds no portraits, and inventing one for Ngabe would be worse than a
> shared placeholder. When the session carries a real identity, the provider
> is the only place that changes.

**She could not add a photograph to an album that existed.** `AlbumsBoard`
renamed albums and nothing more, so the only way to put a photograph into an
album was to create another album — and the studio's own attention queue said
"Album has no photographs → Add photographs" and linked to the page where she
could not.

`AlbumPanel` is its own component now and owns the photographs as well as the
details: existing ones as thumbnails with a remove button and a cover radio,
and an `UploadDropzone` under them for new ones. The queue's row carries
`?album=<slug>`, so "Add photographs" opens the album it is talking about.
The outcome names what would change — renamed, lost, gained — and says
nothing was stored.

### The gaps

**A cover photograph on the post editor**, which §13 had left out. One slot
in the rail, `max={1}`, replacing what it holds. **Publishing without one is
refused**: the archive and the blog both lead with a photograph, so a post
published without one is published broken. A draft may wait for it.

**Every post now has its own words.** `toArticle()` gave one post its
paragraphs and the other nine a shared set of four, so opening any two in the
editor showed the same text — and four posts shared another post's title and
excerpt as well, because they spread `...FEATURED_POST`. All ten have their
own body in `BODIES`, and the four have their own titles. A fixture that
cannot tell two posts apart cannot be used to judge a writing surface.

**A preview.** `PostPreview` sets the words in the reading face — category,
title, reading time, cover, excerpt, paragraphs split on blank lines — and
the rail toggles between writing and reading. It is deliberately not
`ArticleDetailView`: that renders an author, likes, comments and a secondary
photograph, none of which exist while a post is being written, so it would
preview a post that is not this one.

### The polish

**Her overview leads with the writing.** `ResumeWriting` shows the newest
draft with its cover, its category, when it was started and a **Carry on**
button, and says how many others are waiting. With nothing unfinished it says
so and offers the blank page. The two buttons dropped to outlines below it:
the filled button belongs on the thing she came to do. The attention queue
skips the draft that band already shows, so no row appears twice.

**`AttentionQueue`'s empty state is a prop.** The queue is shared by the
admin area and the studio, and the two have nothing in common to say when it
is empty — hers was telling her about dates of birth and invitations.

**Also:** a delete button in the editor behind `ConfirmDialog` (it was only
in the archive's bulk bar), a line in the rail saying where the post stands —
"Published May 31, 2026", "Draft, started …" — an optional **Publish on**
date, and the archive's five filter controls split into a search row and a
picker row, which stops one picker stranding itself on a line of its own.

### Gate

Typecheck, lint and format clean. **174 tests over 25 files**, up from 162.
`pnpm build` compiles in 15.3s.

### Still true

Nothing saves. The cover, the added photographs and the publishing date are
all held in the browser and reported, and every outcome says so.

---

## 15. Motion, and what it is for, 11 Nov 2026

Seventeen items across both working areas, asked for as "transitions,
animations, something cool". The rule applied to every one of them: motion
that answers something the person would otherwise have to work out, and
nothing that is only decoration. Two of the seventeen turned out to be
already done, and are recorded here as such rather than quietly claimed.

### The frame

**Two entrances, not one.** `(member)/template.tsx` gave every member page
the same 450ms fade, rise and blur. That is right for arriving at the
gallery and wrong for Overview -> Members, where it reads as the page
reloading under somebody who only meant to look at the next tab — and the
tab indicator's own glide is invisible underneath it. The template is a
client component now: reading pages keep `route-enter`, and the admin and
studio get `section-enter`, 180ms of fade and six pixels.

**The skeleton handoff.** Each working page's root carries `section-enter`
too, and that is the half that matters: a template animates when the route
_mounts_, which is when the skeleton appears, not when the content replaces
it. The class on the page is what fades that swap.

**The reduced-motion floor.** Every animation in `globals.css` already gated
itself on `prefers-reduced-motion: no-preference`, which is the right way
round — and one forgotten `@media` from failing. The last rule in the file
is now unlayered and flattens every duration and delay in the document.

> [!NOTE]
> It sets `animation-duration: 0.01ms`, never `animation: none`. A keyframe
> animation with `both` holds its element at the _first_ frame, so
> cancelling one outright can leave something at `opacity: 0`. A hundredth
> of a millisecond lands on the last frame, which is where it belongs.

**Dialogs now close as well as open.** All seven had `dialog-pop` on the way
in and nothing on the way out, because `close()` takes the element out of
the top layer on the same frame and leaves no frame to animate. The new
`useModalDialog` holds the dialog open, writes `data-closing`, and closes it
when that animation's length has passed. The backdrop fades with it.

> [!IMPORTANT]
> Two deliberate choices in that hook, both load-bearing. `data-closing` is
> written to the DOM rather than kept in React state, because setting state
> from an effect is an error in this project. And the close is on a **timer,
> not `animationend`** — a dialog whose animation never runs, under reduced
> motion or in jsdom, would otherwise stay open for ever.

### The register

| What moves         | What it is telling the administrator           |
| ------------------ | ---------------------------------------------- |
| the edited row     | which of seventy-three rows changed            |
| the leaving row    | what left, and that **Undo** is still there    |
| the rows, in order | that the list has become a different list      |
| the clicked name   | whose record the dialog that just opened holds |

The flash is **colour, not movement**, so it still plays for somebody who
turned motion down: they need to know which record they edited as much as
anybody. It matters most for an email change, where the only visible
difference in the row is one address.

**Undo** is new behaviour, not a transition. Removing somebody reports the
outcome at once, slides the row out, and takes them from the register when
it has — and that second is where the offer to put them back belongs,
indexed so they return to their place in the list rather than to the top.
Nothing was stored, so it costs one splice.

**The name travels into the dialog** through `lib/viewTransition.ts`.
`view-transition-name` on its own does nothing to a React re-render: the API
only captures a change made inside `document.startViewTransition`, and
React's updates are asynchronous, so the callback has to `flushSync` them.
A name may belong to one element at a time, so the row claims it on the
frame _before_ the dialog opens and the heading takes it over — which is
what the `morphing` state is for. Where the API is missing (Firefox today,
jsdom under the tests) it is one plain state change.

**Also:** the table head is sticky, because seventy-three rows is three
screens and the columns are what the rows mean; the live region says which
slice is on screen, because twenty-five of seventy-three looks exactly like
all twenty-five of twenty-five; and the search is deferred with
`useDeferredValue` rather than debounced with a timer — the keystroke lands
first and the table catches up, with no timer to clean up and no window in
which the list is knowingly wrong.

### The studio

**The preview swap is the one orchestrated moment.** The column is keyed on
which face is showing, so the animation runs on every swap rather than only
the first. The reading face rises; the writing face only fades, because a
textarea sliding under the cursor is unpleasant to write in.

**The reading time dips when it crosses a minute** — keyed on the minute, so
nothing happens on the keystrokes in between. The word count cannot have
this: it changes constantly and means nothing on its own.

**The cover slot says what it needs, where it can be acted on.** "Needed
before publishing" sits beside the slot, and the Publish button points at it
with `aria-describedby`. The button **stays enabled** on purpose: a disabled
control cannot explain itself, and the refusal naming the one missing thing
is worth more than a dead button. When a cover arrives the button pulses
once, because publishing has just gone from refused to possible and nothing
else on the page said so.

**The rail follows what she has just done.** "Draft, started 12 May" was
prose describing the record as it was _loaded_, which stopped being true the
moment she saved. It is a live region now, and the outcome wins over the
record.

**`ResumeWriting` is built as a hero**, not as another panel in the stack:
the photograph goes to the edge of the band at every width wide enough to
hold it, so the band reads as the unfinished post itself, and **Carry on**
is the only filled button on the page.

**The album grid arrives in order**, and the cover of the album being opened
carries into the panel — the same device as the register's, and here it is
the whole point of the card, because the cover is the only thing that tells
two albums apart at a glance.

### Two that were already done

Reported as outstanding and found not to be, which is worth writing down
rather than ticking off:

- **The dropzone already had a `dragover` state.** What it lacked was any
  sense of how many photographs landed, so the thumbnails arrive in order
  now and the panel leans in a little harder under a drag.
- **The counts strips were not static** — `components/ui/CountUp` already
  existed for the public pages, counting up on first sight with the true
  figure in the server's HTML. It gained a `durationMs` prop and the two
  strips pass 420ms: these numbers are read, not admired. Still no chart.

### Gate

Typecheck, lint and format clean. **179 tests over 25 files**, up from 174 —
the five new ones cover the behaviour, not the animation: Undo and where it
puts somebody back, the slice the register is showing, the cover slot's
requirement and that the Publish button points at it, and the rail
following the last thing done.

`pnpm build` compiles in 13.2s. `/admin` 15.1 kB, `/studio` 11.4 kB.

### Still true

Nothing saves. Undo puts somebody back into a copy of the register held in
state, which is the same place the removal took them from.

---

## 16. The clean-up, 11 Nov 2026

Dead code removed and the structure brought back in line with the Frontend
Project Structure PDF (v1.0). **No page was removed**: every one of the
eighteen the PDF lists is still there, and so is everything built since. What
went was code nothing reached.

### Nothing imported it

Found by walking every import in `src/` and deleting what nothing named, then
walking it again — because each round uncovers the next. It took five rounds
to reach zero.

| Round | Removed                                                             |
| ----- | ------------------------------------------------------------------- |
| 1     | `ComingSoon`, `empty-testimonial-demo`, `TreeDetail`                |
| 2     | three barrel `index.ts` files (see below)                           |
| 3     | `TreeExplorer`, `MemberGroups`, `TreeIntro`                         |
| 4     | `TreeCanvas`, `BioDrawer`, `TreeList`, `TreeControls`, `MemberCard` |
| 5     | `tree/bios.ts`                                                      |

**Twenty files, ~1,900 lines.** The tree is most of it, and the reason is
worth recording: the family tree has been built three times. The React Flow
canvas (`TreeCanvas` + `BioDrawer` + `TreeList` + `TreeControls`) was
replaced by `TreeExplorer`, which was replaced by `TreeBrowser` —
`HierarchyRoleCard`, `PersonDialog`, `TreeHierarchyGrid`,
`PromotionSelector`. Neither older version was taken out, and a dead barrel
kept them all looking referenced.

### The barrels, and why they went rather than came back

`features/{landing,story,tree,resources}/components/index.ts` re-exported
everything in their folders. Three of the four were genuinely imported by a
public page; the fourth was not.

They are gone and the three pages import each component by path, which is
what every other feature in this codebase already does — `admin`, `studio`,
`blogs`, `gallery`, `birthdays` never had one.

> [!IMPORTANT]
> A local barrel puts every component in the folder into the module graph of
> any page that imports one of them. `/family-tree` imported a single
> component through `features/tree/components` and was paying for the whole
> folder, React Flow included: **78.8 kB → 9.18 kB**, first load 308 kB →
> 238 kB. That one line was the most expensive import in the project.

### Dependencies with nothing left to do

| Removed                      | Why                                               |
| ---------------------------- | ------------------------------------------------- |
| `@xyflow/react`              | the only file using it was `TreeCanvas`           |
| `@hugeicons/react`           | one icon, in one component, beside `lucide-react` |
| `@hugeicons/core-free-icons` | the icon set that icon came from                  |

`EmptyTestimonial` draws lucide's `Plus` now. 21 packages left the lockfile.

> [!NOTE]
> **Three dependencies were deliberately kept though nothing imports them.**
> `@tanstack/react-query`, `zustand` and `next-auth` are not dead — they are
> §10 of the PDF, unbuilt. Removing them would be deciding against the data
> layer, which is not a clean-up's call to make. They are the subject of the
> next piece of work.

### Naming, back to the convention

PDF §11 says components are `PascalCase.tsx`. Three files were not, all of
them pasted in from elsewhere:

- `empty-testimonial.tsx` → `EmptyTestimonial.tsx`
- `ghost-404-page.tsx` → `NotFoundArt.tsx`, with its test
- and `EmptyTestimonial`'s `export default` beside its named export went:
  one way in per component.

`lib/badge-path.ts` stays kebab-case, which is also the convention — the PDF
names `api-client.ts` and `format-date.ts`.

### Dead CSS

`foil-sheen` (the birthday card's sheen, no longer used) and `.lineage-lit`
(a glow on a React Flow edge that no longer exists) — 1,519 bytes.

A sweep for dead `ROUTES` keys, dead `@utility` classes and `public/` files
nothing names found **nothing else**: every route constant is used, every
other utility is used, and every image in `public/` is referenced.

### Gate

Typecheck, lint and format clean. **179 tests over 25 files** — unchanged,
which is the point: nothing deleted was covered by one. `pnpm build`
compiles in 18.1s.

### What this did not touch, and should be next

**The palette debt.** `globals.css` is the only place colour is allowed, and
**149 off-palette classes** (`slate-*`, `neutral-*`, `gray-*`) remain across
ten files, with bracket values beside them:

| File                         | Off-palette |
| ---------------------------- | ----------- |
| `PdfViewerModal`             | 59          |
| `ProfileView`                | 30          |
| `FamilyCelebrationsCalendar` | 30          |
| `EmptyTestimonial`           | 14          |
| six others                   | 16          |

Every one is a pasted-in component that never got converted. It is a real
refactor with real visual risk, not a clean-up, so it was left alone and
written down instead.

**`tests/` still does not exist**, while `playwright.config.ts` points at it
and `test:e2e` runs `--pass-with-no-tests`. CI therefore has a green
end-to-end job that tests nothing, which is worse than not having one.

---

## 17. The audit, and what it closed, 12 Nov 2026

A read of the whole application for bugs, mistakes and UI/UX. Four decisions
were the user's and were asked for before anything was touched; two approved
removals were made and two that were not approved were left alone.

### The hole under everything

**Anyone could become an administrator by typing a URL.** `/verify?role=admin`
and any five digits. The pieces:

- `VerifyPanel` read the role out of the **query string**;
- `verifyCode()` returns `code.length === 5`, so any five digits pass;
- `startMemberSession(role)` took the role as an **argument** and signed
  whatever it was handed.

The HMAC was sound throughout. It was faithfully signing a lie. And
`AdminLoginForm`'s `handleSubmit(() => ...)` **ignored its own values**, so
the password was validated for shape and then thrown away — nothing had ever
read it.

> [!CAUTION]
> `startMemberSession` is a **server action**, so it has a public endpoint.
> Removing `?role=` from the URL would not have been enough on its own: a
> role passed in by a caller is decided by the caller, wherever it is passed
> from.

**What replaced it.** The role is decided on the server at the login step and
carried in a signed, httpOnly cookie:

| File                     | Its job                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `lib/signing.ts`         | the HMAC, lifted out of `session.ts` so a second cookie cannot get a weaker version of the first one's |
| `lib/pending.ts`         | the login in progress: `p1.<role>.<issued>.<sig>`, ten minutes                                         |
| `features/auth/admin.ts` | the address is an administrator's in the register **and** the password matches `ADMIN_PASSWORD`        |
| `actions/session.ts`     | `beginMemberLogin`, `beginAdminLogin`, and `startMemberSession()` — **no arguments**                   |

`startMemberSession` reads the pending cookie and nothing else, spends it,
and throws without one; the verify screen then offers the way back to the
login. `?role=` is ignored everywhere. `?from=admin` survives as a
breadcrumb that chooses a back link and decides nothing.

`ADMIN_PASSWORD` fails closed in production and falls back to a known value
in development, the same shape as `AUTH_SECRET`. **16 new tests** hold the
boundary: a forged token, a token whose role was edited while keeping its
signature, an expired one, one issued in the future, a member who learned the
password, the blogger, an address nobody has, and a missing password.

### The dock that broke for the two people who need it

`MemberSidebar`'s mobile dock is capped at `max-w-sm` with fixed 44px
circles. On a 360px phone that is 328px of room:

| Role          | Targets | Column | Result          |
| ------------- | ------- | ------ | --------------- |
| Member        | 7       | 44.6px | fits            |
| Blogger       | 8       | 39px   | overflows       |
| Administrator | 9       | 34.7px | **overlapping** |

The gliding pill divided by `--n` and shrank correctly; the links did not.
Each target now fills its own column — `h-11 w-full`, `md:size-12` — so the
hit areas stay separate whoever is signed in, and are as wide as there is
room for rather than wider.

### Two modals that only looked like modals

`ProfileView`'s "edit motto" and `FamilyCelebrationsCalendar`'s "inform the
coordinator" were `fixed inset-0` overlays: no Escape, no focus trap, the
page behind them still reachable by Tab, and focus lost on close. Both are
native `<dialog>`s on `useModalDialog` now, like the other nine. Their raw
hex buttons (`#5B21B6`, `#3B2883`) became the brand violet on the way past.

### The focus ring, put back

`globals.css` gives everything focusable a 2px outline — and `TextField`,
`OtpInput` and `CommandPalette` each turned it off, leaving a 1px border
going from grey to slightly darker grey as the only sign of where the
keyboard was. On the one-time password that border was the only thing saying
which of five boxes you were in.

### The rest

| Was                                                    | Now                                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| "Continue with Google" did nothing                     | disabled, and says Google sign-in is not connected                          |
| landing CTAs bounced guests to a login                 | they say "Family members only — you will be asked to sign in"               |
| `text-primary-foreground`, `bg-surface-elevated`       | real tokens; both named nothing and compiled to nothing                     |
| a default tweet about `uselayouts.com` and `@0xUrvish` | no fallback address at all                                                  |
| `Button` with no default `type`                        | `type="button"`, so a forgotten prop no longer submits a form               |
| OTP arrows moved the caret and the focus               | `preventDefault`, one box per press                                         |
| gallery dates in en-GB                                 | en-US, like every other date                                                |
| `focus:border-purple-600`                              | `focus:border-brand` — the bought purple was not ours                       |
| "Log out" beside "Sign out of this device"             | one name for one action                                                     |
| smooth scroll on pagination                            | asks `motionWanted()` first; a scroll in JS is out of the CSS floor's reach |
| the copyright year frozen at build time                | `CurrentYear`, corrected on hydration                                       |

### Left alone on purpose

- **The emoji** (`📂 💖 ✓ ♥`) and the **dead `const Page`** in
  `EmptyTestimonial` — offered and not approved.
- **The 149 off-palette classes** across ten files. A refactor with real
  visual risk and no way to check it without running the app; see §16.
- **`tests/`**, which still does not exist while `playwright.config.ts`
  points at it and `test:e2e` passes with no tests.

### Gate

Typecheck, lint and format clean. **197 tests over 27 files**, up from 179.
`pnpm build` compiles. `/admin/login` fell from 12.7 kB to 3.12 kB, because
the thing it was carrying was the role logic that should never have been in
the browser.

### Still true

Nothing saves. `verifyCode()` still accepts any five digits — the one-time
password is not real, and the TODO above it says so. What changed is that it
no longer decides **what you are**: a fake code now gets you exactly the role
the server decided at the login step, and no more.

---

## 18. Server and client, audited, 12 Nov 2026

Asked for as "all the things are client rendered, there is no server side
rendering thing". **That turned out not to be the case**, and the first job
was to establish what is actually true before changing anything.

### What the build says

Every route is rendered on the server. Next's own classification:

| Mark | Meaning                             | Routes                                                                            |
| ---- | ----------------------------------- | --------------------------------------------------------------------------------- |
| `○`  | prerendered to static HTML at build | `/`, `/our-story`, `/family-tree`, `/login`, `/verify`, `/signup`, `/admin/login` |
| `●`  | prerendered per parameter           | `/blogs/[slug]` (10), `/families/[slug]` (3), `/gallery/[album]` (6)              |
| `ƒ`  | rendered on the server per request  | every other member route                                                          |

**Exactly one page in the project is a client component** — `/signup` — and
even that is server-rendered first and hydrated after. 88 of 208 components
carry `"use client"`, which is 42%, and a classification of every one of them
by what it actually uses found only **two** that needed nothing from the
browser at all.

So the directive discipline was good. What was wrong was **where the
boundaries sat**.

> [!NOTE]
> Member routes are `ƒ` rather than `○` because `(member)/layout.tsx` reads
> `cookies()` to learn the role. That is not a defect to fix: the frame
> genuinely differs per person — a member, the blogger and an administrator
> see different rails — so the page cannot be one cached file. The three `●`
> groups are the pages that declare `generateStaticParams`.

### The two that needed nothing

- **`StoryIntro`** carried `"use client"` and used no hook, no handler and no
  browser API. Its children — `MaskReveal`, `Reveal`, `SplitText` — are the
  islands, and **a parent does not have to be one to render one**. Deleting
  that single line took `/our-story` from **7.69 kB to 2.88 kB**, and its
  first load from 237 kB to 232 kB.
- **`PostPreview`**, same story. Removing it is correct hygiene and changes
  nothing measurable today, because `PostEditor` imports it directly and
  `PostEditor` is a client component — a client parent makes a client child
  whatever the child says. Worth recording so nobody reads the saving into it
  that `StoryIntro` earned.

### One filter, one whole page

`BlogsHome` was a 200-line client component for **one `useState`** holding
which category is open. That single piece of state pulled the hero
photograph, two headings, three decorative poppers and the family tagline
into the browser bundle, to render markup that is identical for everybody on
every visit.

It is a server component now. `BlogFeed` is the island: the category row, the
grid, and the empty state — everything the state actually touches.

> [!IMPORTANT]
> **`BlogFeed` reads the posts from the module rather than taking them as a
> prop.** `BlogCard` already imports from the same module, so handing the
> list down from the server would serialise it into the RSC payload _and_
> keep it in the bundle — the same data shipped twice. Passing data across
> the boundary is not free, and a module both sides already import is not
> data that needs passing.

**The honest measurement:** first load fell from 219 kB to 218 kB. One
kilobyte. The split is right — static markup belongs on the server — but the
saving is in the noise, and the five kilobytes from deleting one line on
`/our-story` is the better lesson about where the wins are.

### What must stay client, and why

| Component                                                                | Why                                                                                                                                       |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `MembersTable`, `PostEditor`, `AlbumsBoard`, `PostsArchive`, `AlbumForm` | working tools: filters, dialogs, drafts, uploads                                                                                          |
| `ResourcesBrowser`, `FamilyCelebrationsCalendar`, `TreeBrowser`          | search, paging, selection, modals                                                                                                         |
| `ProfileView`                                                            | the motto comes from `localStorage` through `useStoredValue`, and the card renders it — the card legitimately depends on per-device state |
| `MemberSidebar`, `SectionTabs`, `NavLink`, `template.tsx`                | `usePathname`: which page is open is a browser fact                                                                                       |
| `PageHeader`, `DashboardHeader`, `SignedInName`                          | `useSignedIn` context                                                                                                                     |
| `components/motion/*`, `SectionTitle`, `SuccessBadge`                    | Motion drives them                                                                                                                        |
| every `error.tsx`                                                        | the App Router requires it                                                                                                                |
| `CountUp`, `CurrentYear`, `useModalDialog`                               | `IntersectionObserver`, hydration, `showModal()`                                                                                          |

### A boundary that closed itself

`features/auth/roles.ts` imports the whole family register, and `LoginForm`
imported `roleForName` — so **73 names and addresses were in the bundle of
the public login page**. The auth fix in §17 moved that lookup into a server
action for a different reason, and the register went with it. `roles.ts` is
now imported by `actions/session.ts` and nothing else.

It still ships to the browser on `/admin/members`, where `MembersTable`,
`MemberPanel` and `CommandPalette` import it directly. That is admin-only and
the table is a client CRUD over a fixture, so it is correct for now — but
when the API lands the table should take its rows as props from the server
rather than importing the module.

### Gate

Typecheck, lint and format clean. **197 tests over 27 files**, unchanged —
nothing here changed behaviour. `pnpm build` compiles.

### Still true

Nothing saves. And the thing that would make the biggest difference to what
the server renders is still missing: with no API, every page renders the same
module-level fixtures, so there is nothing yet for a server component to
fetch that a client one could not have imported.

---

## 19. The administrators' door, back to a name, 12 Nov 2026

> I noticed that on the admin login it only required family name and
> password, then you changed it to email and password. Change that back.

Correct, and the design agrees. `/admin/login` asked for a name until 11 Nov,
when §12 swapped it for an email address on this reasoning: a family name is
shared by seventy-three people, so it cannot identify one administrator. That
note ended "one field and one schema to put back if the design wins". It won.

### What went back

|              | Was (11–12 Nov)                | Now                                                                      |
| ------------ | ------------------------------ | ------------------------------------------------------------------------ |
| field        | Email address, `type="email"`  | **Name**, "Enter family name"                                            |
| schema       | `email` + `.email()`           | `name` + `.min(1)`                                                       |
| check        | address matches a register row | **name** matches a register row                                          |
| refusal      | "That address and password…"   | "That name and password…"                                                |
| autocomplete | `email`                        | `username`, so a password manager still pairs it with the password field |

### The objection survived the revert

The reason for the email address was real, and dropping the field did not
make it go away — so it is answered a different way. `checkAdminCredential`
takes the name and **looks it up in the register**: the person it finds has
to hold the administrator role and be active, and only then is the password
compared. Knowing the password is not enough, and neither is typing a name.

> [!IMPORTANT]
> **The password is what makes this a credential, not the name.** `/login`
> takes a name with no password at all, and the register is readable by
> anyone who can see the site. The lookup only stops the door opening for a
> name that is not an administrator's — it adds nothing on its own.

`matchesName()` moved out of `roleForName` into a shared export, so both
doors agree about what a typed name means: the whole name, or either part of
it, case-insensitively. "Aganze" opens the administrators' door with the
password; "Aganze Imena" does the same.

Everything §17 built is untouched. The role is still decided on the server,
still carried in the signed pending cookie, and `startMemberSession()` still
takes no arguments.

### Gate

Typecheck, lint and format clean. **199 tests over 27 files**, up from 197:
the admin suite swapped address cases for name cases and gained two — either
part of the name opens it, and an empty name does not.

---

## 20. The integration layer, 12 Nov 2026

The backend is finished, so the frontend needs somewhere for it to land.
This is that: the transport, the types, the services and the cache. **No
page calls it yet** — connecting a screen is the next step and is deliberately
separate, because the layer can be reviewed against the real API before
anything depends on it.

### What was built

| File                                              | Its job                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| `lib/env.ts`                                      | every `process.env` read, parsed once, failing with the variable's name   |
| `types/api.ts`                                    | `Paginated`, `ApiFailure`, `ApiError`, `ListQuery` — the transport shapes |
| `types/media.ts`                                  | `ImageSource`, `RemoteImage` — see the mismatch below                     |
| `types/member.ts`, `post.ts`, `album.ts`          | the domain, as the wire carries it                                        |
| `lib/api-client.ts`                               | the one `fetch`: base URL, auth, timeout, one failure shape               |
| `lib/api-auth.ts`                                 | the credential, server-only — **the seam the backend lands on**           |
| `services/endpoints.ts`                           | every path, in one file                                                   |
| `services/{members,posts,albums}.service.ts`      | typed calls, no paths inline                                              |
| `lib/query-client.ts` + `providers/QueryProvider` | the cache, mounted in the root layout                                     |

### The rule the layer is built on

A service returns the body **typed**, or throws an `ApiError`. Nothing above
it ever sees a `Response`, checks `res.ok`, or guesses what the body looks
like when something went wrong.

`ApiError` carries `status`, `code` and `fields`, so a form can place
per-field messages and the query client can decide what is worth retrying.
**Status 0 means the request never reached the server** — offline, DNS, or
the timeout — which is a different problem from a 400 and reads differently
to the person waiting.

> [!CAUTION]
> **The paths in `endpoints.ts` are this frontend's assumption.** They were
> written from the Frontend Project Structure PDF §10 because the API
> specification was not to hand. They are all in one file precisely so that
> correcting them against the real contract is one edit — the services, the
> types and the components above them do not change.

### The mismatch that will cost the most

Every image in this project is a `StaticImageData`: a local file imported at
build time, carrying its own width, height and blur placeholder. **The API
will send a URL string**, which carries none of them.

|                      | `StaticImageData` | remote URL                                   |
| -------------------- | ----------------- | -------------------------------------------- |
| `width`/`height`     | inferred          | **required**, or `fill`                      |
| `placeholder="blur"` | works             | needs `blurDataURL`                          |
| host                 | n/a               | must be in `next.config.ts` `remotePatterns` |

`types/media.ts` names both shapes, and the wire types use `RemoteImage`
rather than pretending otherwise. Every component that renders a photograph
will need to accept `ImageSource` and supply dimensions. That is the single
largest piece of the connection work, and it is worth doing before the
fixtures are swapped rather than during.

### Two of my own bugs, caught by the tests

Worth recording, because both are the kind that only surface under a real
backend:

- **`publicEnv` was parsed at module load**, freezing whatever the
  environment held at import time. Wrong in a test that sets it afterwards,
  and wrong in any runtime that fills the environment after the bundle is
  evaluated. It is a function now.
- **A missing `NEXT_PUBLIC_API_URL` was reported as a network failure**,
  because the URL was built inside the `try` that catches `fetch`. Somebody
  with an unfilled `.env` would have been told to check their connection.
  The URL is built before the `try`.

### The auth seam

`lib/api-auth.ts` reads the session cookie and returns the token every
service sends. Today that cookie holds a token **this frontend signed**,
which the backend has never seen and will not accept.

When the backend's auth is connected, the login step stores the backend's
token instead and `apiToken()` returns that — and nothing else changes,
because every service already takes its token from there.

> [!IMPORTANT]
> `api-client.ts` wires up **two** credential mechanisms:
> `credentials: "include"` for a backend that sets its own cookie, and
> `Authorization: Bearer` for one that returns a token. Which is right
> depends on the API. When that is known, **delete the other** rather than
> leaving a second way in.

### Also closed

The gap reported in the client/server audit: **server actions now validate
their own inputs** with the same zod schemas the forms use.
`beginMemberLogin` and `beginAdminLogin` parse before they act, because a
server action is a public endpoint and the form's validation is a courtesy
to whoever is typing, not a guarantee about what arrives.

### Gate

Typecheck, lint and format clean. **209 tests over 28 files**, up from 199 —
ten of them hold the api-client's promise: the URL it builds, the query
entries it drops, the token it sends, the error it makes out of a refusal,
out of HTML, out of a dead connection, and out of an unset variable.

`pnpm build` compiles. **First Load JS rose from 218 kB to 227 kB**: that is
TanStack Query in the root layout, and it is the price of the cache.

### What is not done

- **No page calls a service.** Every screen still reads its fixture.
- **Three services exist** — members, posts, albums. Families, birthdays and
  resources are not written, and should be written against the real contract
  rather than guessed at.
- **Uploads.** `UploadDropzone` holds `File` objects and nothing sends them;
  `endpoints.uploads.sign` is a placeholder for the signed-URL flow the
  structure document describes.
- **`store/`** is still empty. Nothing has needed global client state yet,
  and `zustand` stays installed for when something does.

---

## 21. Invitations, admin signup, and the password nobody else knows

The plan for the feature asked for on 13 Nov 2026. Written before the code,
so what gets built can be judged against it.

> When we want a person to be a member, the admin clicks **Add a member**,
> fills the details, and it sends an invitation link to their email. Then it
> shows them their family name, and below it a button saying **Go to login**.
> The same should work for admins who were invited first — but for them we
> need a **signup page**, only reachable from the link. And if there is a
> signup page for admins, there should be a **forgot password** page for
> them too: there must be at least two admins, so when one forgets, the
> other is notified and can send the link to the address already known, and
> the first one refills their credentials.

### The four flows

| #   | Who                        | Lands on                 | What they do there                                    |
| --- | -------------------------- | ------------------------ | ----------------------------------------------------- |
| 1   | an invited member          | `/invite/[token]`        | read the name they sign in with, then **Go to login** |
| 2   | an invited administrator   | `/invite/[token]/signup` | set a password nobody else has ever known             |
| 3   | a locked-out administrator | `/admin/forgot-password` | ask; the other administrators are told                |
| 4   | the other administrator    | `/admin`                 | send the reset link to the address on the record      |

Flow 1 is the one worth reading twice. `/login` takes a **name and no
password**, so the invitation landing page is not a form — it is a
**statement**. Its whole job is to tell somebody what to type. A form there
would be asking them to invent a credential the member door does not have.

### What this breaks on purpose

> [!CAUTION]
> **`ADMIN_PASSWORD` cannot survive this.** There is one password for all
> administrators today, read from the environment and compared in plain text
> in `features/auth/admin.ts`. Per-administrator signup and per-administrator
> reset are impossible on top of a single shared secret: "A sets a new
> password" would set everybody's.

So this feature is really **administrators getting individual credentials**,
which is what the TODO in that file has always said would happen. The
password moves to the backend, hashed, and `checkAdminCredential` stops being
a frontend concern. `admin.ts` and its tests stay until the auth endpoint is
real, and the file gains a note naming what replaces it.

### The three rules that are not negotiable

**1. The token is the backend's property.** Expiry, single use, and the role
inside it are signed server-side. This frontend hands the token over, renders
what comes back, and shows a clean refusal when the answer is no. It
**never** decodes a token in the browser and **never** trusts a `role` in a
URL — that is precisely the hole §17 closed, and an invitation link is a
better disguise for it than `/verify?role=admin` ever was.

**2. The two-administrator floor is enforced, not advertised.** The register
refuses to demote or remove the second-to-last administrator, with the reason
on the control rather than on save. Without that, somebody suspends an
administrator in November and in January the remaining one forgets their
password and **nobody alive can reach `/admin`**. The backend has to enforce
the same floor; a disabled `<select>` is a courtesy, not a rule.

**3. A reset notifies both administrators.** If B can send A a reset link,
B can take A's account. That is inherent in the design and not a reason to
reject it — the family wants a person in the loop rather than an email
provider — but it needs two guards, and they are the whole protection:

- the link goes **only** to the address already on A's record, never to one
  typed at reset time;
- **A is told as well as B.** A silent takeover is the failure mode, and the
  notice to A is what makes it a loud one.

### What the frontend can and cannot do

**Everything that matters here is an email and a signed token, and this
frontend can send neither.** So what gets built is the complete set of
screens and states, calling services that call endpoints that do not answer
yet — the same honest holding pattern the rest of the app is in. Nothing
stores, nothing is emailed, and every outcome says so.

|                                                 | Frontend | Backend                            |
| ----------------------------------------------- | -------- | ---------------------------------- |
| the invite form, the outcome, the address shown | yes      | creates the record, sends the mail |
| the invitation landing page                     | yes      | validates the token, returns it    |
| the admin signup form and its password rules    | yes      | stores the hash, spends the token  |
| the forgot-password request screen              | yes      | notifies the other administrators  |
| the other administrator's **send the link**     | yes      | issues and mails the token         |
| the reset form behind the token                 | yes      | validates, sets, invalidates       |
| the two-administrator floor on the control      | yes      | **enforces it as a rule**          |

### The stand-in, and why it cannot be a back door

With no API there is nothing to validate a token against, and four states
have to be reviewable: a member's invitation, an administrator's, an expired
link and a spent one. So `features/invitations/data.ts` holds a stand-in that
reads the **shape** of the token (`member-…`, `admin-…`, `expired-…`,
`used-…`) and answers from the register.

> [!IMPORTANT]
> **The stand-in is off whenever an API is configured.** It is behind
> `hasApi()`, so the moment `NEXT_PUBLIC_API_URL` is set the real service
> answers and a hand-written token gets the backend's refusal. And it grants
> nothing in either case: the invitation pages issue **no session**. The
> member's page renders a name; the administrator's posts a password to a
> service that does not store it. There is no path from a guessed token to a
> session, which is the only property that matters.

### The middleware hole this opens

`isAdminPath()` exempts exactly one path — `/admin/login` — and everything
else under `/admin` needs an admin session. **`/admin/forgot-password` and
`/admin/reset-password/[token]` are reached by people who cannot sign in**,
so they need the same exemption, and getting that wrong either locks them out
of the page that unlocks them or opens the register to the world.

So the exemption becomes a named list rather than a second `if`, in
`lib/session.ts` beside `isAdminPath`, with a test per path and a test that
`/admin`, `/admin/members` and a path merely _starting_ with an exempt name
are still gated.

### Routes

| Path                            | Public?        | What it is                                |
| ------------------------------- | -------------- | ----------------------------------------- |
| `/invite/[token]`               | yes            | the member's name, and **Go to login**    |
| `/invite/[token]/signup`        | yes            | the administrator's password, token-gated |
| `/admin/forgot-password`        | **yes, newly** | ask for a reset                           |
| `/admin/reset-password/[token]` | **yes, newly** | set the new password                      |
| `/admin`                        | no             | gains a **Reset requests** band           |
| `/admin/members`                | no             | the invitation outcome, and the floor     |

### The register needs a second administrator

`FAMILY_REGISTER` holds exactly one, and `data.test.ts` asserts it — flow 3
cannot even be demonstrated with one. A second active administrator joins the
fixture and that test becomes "at least two, so a locked-out one can be
helped", which is the rule the feature rests on rather than an incidental
count. `SIGNED_IN_ID` stays the one whose role control is locked.

### Done means

1. The gate clean: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
   `pnpm test`, `pnpm build`.
2. No session is issued anywhere in this feature.
3. The middleware exemptions are tested path by path.
4. The floor cannot be got around from the UI: not by the role select, not
   by the remove button.
5. No new raw hex, off-palette class or bracket value. No emoji, no helper
   labels.
6. Every screen says what would happen and that nothing was stored.

### What the backend team still has to answer

Five endpoints and one decision:

```
POST /invitations                        create, with a role
GET  /invitations/:token                 validate -> { fullName, role, email }
POST /invitations/:token/accept          password when the role is admin
POST /auth/forgot-password               -> notifies the other admins
POST /auth/reset-requests/:id/approve    the other admin sends the link
POST /auth/reset-password/:token         set it, spend the token
```

**Does the invited administrator set their own password, or does the inviting
one set a temporary password they must change?** This plan assumes the
former — a password nobody else has ever known is strictly better — but it is
their call, because they store it.

### Applied, 13 Nov 2026

Every screen and state in the plan above, judged against it.

| Built                                   | Where                                                              |
| --------------------------------------- | ------------------------------------------------------------------ |
| the exemption list                      | `lib/session.ts` — `ADMIN_PUBLIC_PATHS`, `isAdminPublicPath`       |
| the floor                               | `members/data.ts` — `MIN_ADMINS`, `administrators`, `mayLoseAdmin` |
| the wire shapes                         | `types/invitation.ts`                                              |
| the calls                               | `services/invitations.service.ts`, `services/auth.service.ts`      |
| the stand-in                            | `features/invitations/data.ts`                                     |
| the member's landing, and every refusal | `InviteWelcome`, `InviteRefused`                                   |
| choosing a password, once               | `auth/components/SetPasswordForm`                                  |
| the two screens that use it             | `AdminSignupForm`, `ResetPasswordForm`                             |
| asking for a reset                      | `auth/components/ForgotPasswordForm`                               |
| answering one                           | `admin/components/ResetRequests`, a third band on `/admin`         |

**One form for both passwords.** The invitation's and the reset's differ
only in what they say above the fields and what they say when it worked, so
those are props. A second copy would have been a second place for the
confirmation field, the lockout warning and the no-API case to drift apart.

**One link for both kinds of person.** `/invite/[token]` reads the role from
the **backend's answer** and sends an administrator on to the signup page, so
whoever invites somebody does not have to know which URL to paste. The signup
page checks the token again rather than trusting that the page before it did,
because most people arrive there directly.

### Four departures from the plan

1. **The role select locks for two different reasons now**, and the message
   says which: your own record locks because you would lose the page you are
   standing on, and the floor locks because the register needs two
   administrators. One sentence for both would have been wrong for each.
2. **The floor closes three doors, not one.** The plan named demote and
   remove. **Suspending** an administrator takes the role away just as
   surely — a suspended administrator cannot send anybody a link — so the
   status select refuses it too. Closing two of three would have been worse
   than closing none, because the open one would look like a decision.
3. **No rosette on the two password pages**, though `/verify` has one and it
   is the same kind of moment. `SuccessBadge` pulls Motion into the bundle,
   and these pages are public and opened once, from a link, by somebody who
   may be on mobile data: **212 kB first load fell to 169 kB** when it went.
   The rosette belongs where it is the climax of something rather than the
   preamble to a link.
4. **`ForgotPasswordForm` has no error branch.** A refusal would say
   something about the name, and the one thing that screen must not do is
   tell a stranger which of seventy-three people is an administrator. It
   answers the same way whoever asks, and a failure on the server is
   reported by the silence — no link arrives, and they ask in person, which
   is what this flow was always going to come down to.

### What the tests hold

**`no-session.test.ts` reads the four public pages and refuses to let them
grow a session** — it looks for `startMemberSession`, both cookies, both
token makers and `cookies(` by name, so it cannot be fooled by a helper
three files away. That is the one property the whole feature rests on: a
link grants nothing.

Beside it: a case per middleware exemption, including that `/admin/login-x`
and `/admin/forgot-password/members` are still gated and a reset path with
no token is too; the floor from all three directions; the stand-in's four
states; that it **stops standing in** the moment `NEXT_PUBLIC_API_URL` is
set; that no administrator is ever asked to approve their own reset; and
that the forgot-password screen says the same thing about a name in the
register and a name nobody has.

### Gate

Typecheck, lint and format clean. **246 tests over 31 files**, up from 209.
`pnpm build` compiles; `/invite/[token]` is 114 kB first load, the other
three 169 kB.

### Still true, and what is next

**Nothing is sent and nothing is stored.** Every screen says so in its own
words. The admin's invitation reports what the link would do; the reset band
reports what the email would say and that the other administrator would be
told.

`ADMIN_PASSWORD` is still the only administrator credential, and it is now
**contradicted by two screens that exist**. That is the first thing to fix
when the auth endpoints answer, and `features/auth/admin.ts` says so at the
top. Until then the shared password is what `/admin/login` checks, and the
password somebody sets at `/invite/<token>/signup` goes nowhere.

To walk the four flows locally, with no backend: `/invite/member-demo`,
`/invite/admin-demo`, `/invite/expired-demo`, `/invite/used-demo`, and
`/admin/forgot-password`. The tokens are `SAMPLE_TOKENS` in
`features/invitations/data.ts`.

### Two administrators, seeded and told apart

The second administrator was whichever row index 2 happened to be, which was
enough for the floor to have something to lock and not enough to walk the
reset through: a reviewer has to be able to sign in as **both** people.

| Who               | id     | Name             | Signs in with      |
| ----------------- | ------ | ---------------- | ------------------ |
| `SIGNED_IN_ID`    | `m-01` | Aganze Rubagumya | `aganze-dev-admin` |
| `SECOND_ADMIN_ID` | `m-03` | Shema Nkusi      | `shema-dev-admin`  |

Both are seeded by name in `register()`, declared in `constants/member.ts`
beside the member and the blogger, and both surnames sit **outside** the two
name pools so a seeded name cannot collide with a generated one.

**A password each, in development only.** The reset is the first feature that
needs two administrators distinguished by their credential — "one of them
forgets his password" is not a story you can walk through if both share one.
`DEV_PASSWORDS` in `features/auth/admin.ts` keys them by id, and knowing one
does not open the other's door.

> [!IMPORTANT]
> **Setting `ADMIN_PASSWORD` overrides all of it** and both administrators
> share that one value again. That is not a bug in the fixture, it is the
> limitation itself: one secret in the environment cannot be set per person,
> which is why per-person signup ends it. Four tests hold both behaviours,
> including that `ADMIN_PASSWORD` wins when it is set.

`checkAdminCredential` now picks the expected password **after** finding the
person, so one more thing had to be kept true: an unknown name falls back to
a value nothing matches rather than returning early, because no path through
that function may skip the comparison — skipping it is what tells somebody,
by how long the answer took, that a name is not an administrator's.

**Gate:** typecheck, lint and format clean. **250 tests over 31 files**, up
from 246. `pnpm build` compiles.

---

## 22. Modernisation pass, 15 Nov 2026

| Was                                                         | Now                                                                                                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| decorative gradients and glows                              | flat fills; only the scrims behind text on photos and the skeleton shimmer remain                                                     |
| three ornament sources (lucide, hand SVGs, `/images/*.svg`) | `components/ui/Ornaments` — lucide only, stroke 1.5, `text-ornament`, sizes `sm`/`md`/`lg`, placed beside headings or in the margin   |
| off-palette classes, raw hex, bracket sizes                 | tokens; what remains in brackets is layout with no token (`calc`, `min()`, grid templates, `transition-[…]`), and canvas-confetti hex |
| emoji, sparkle icons, "TODAY'S FAMILY BIRTHDAY!"            | gone; sentence case                                                                                                                   |
| perpetual float, orbit, ping and parallax                   | removed; one entrance per page, then still                                                                                            |
| fixed-width card layouts                                    | `@container` on `BlogCard` and `HierarchyRoleCard`                                                                                    |
| fixture images typed `StaticImageData`                      | `ImageSource`; `placeholderFor()` and `imageUrl()` in `types/media.ts` keep a remote URL from throwing on `placeholder="blur"`        |
| plain navigation                                            | `TransitionLink`: blog cards glide their cover into the article; album cards cross-fade                                               |
| `tests/` did not exist                                      | 21 Playwright tests: both doors, the forged-role hole, invitations, and no sideways scroll at 360/390/768/1440                        |

> [!IMPORTANT]
> In this palette **`heading` is violet** and **`member-chip` is solid
> violet**. Dark text is `member-ink`; a light chip is `member-tint`.

The e2e suite found and fixed two real overflows: `/family-tree` at 360–768px
and `/dashboard` at 360px, both an implicit grid column sized by content
(`grid-cols-1` fixes it). It runs on port 3100 with no API configured, so the
stand-ins answer even when `.env.local` names a backend.

**Not done, because they need the API:** optimistic updates with TanStack
Query, and the members table taking its rows from the server.

### Colour, made one system (15 Nov 2026)

**One accent: violet, `brand`.** The royal blue `primary` is gone. The
public pages carried it and the member area carried violet, so a blog card
had a violet tag and a blue link. The user chose violet everywhere.

| Use                                   | Token                                  |
| ------------------------------------- | -------------------------------------- |
| accent, links, filled buttons         | `brand` / `brand-hover`                |
| headings, ink on light surfaces       | `member-ink` (`heading` is the accent) |
| body text / quiet text                | `text` / `muted`                       |
| edges                                 | `member-border` (`border` aliases it)  |
| quiet panels / tints                  | `member-panel` / `member-tint`         |
| white, and the dark scrim over photos | `surface`, `member-ink/…`              |
| subfamilies                           | `wihogora-*`, `light-*`, `hope-*`      |

Near-duplicates now point at one source (`heading`, `member-accent`,
`tagline-accent` → `brand`; `tree-ink`, `tagline-ink`, `sanctuary-ink` →
`member-ink`), and seven unused tokens were deleted. `white`/`black` classes
became `surface`/`member-ink`. The confetti reads its colours from the tokens
at runtime instead of copying hex values.

### Blog comments, and the transition timeout

The comment count on a story was a `<span>` styled like a button, and no
comments section existed. `ArticleComments` lists sample comments and the
reader's own, posts and deletes them, and keeps them on the device, like
likes and saves. The count is the number listed, and it links to
`#comments`. Four tests cover it.

`TransitionLink` threw "Transition was aborted because of timeout" when the
next page took longer than the browser waits (a first compile in dev). It
now stops waiting after 1.2s and ignores that rejection. The navigation
always carried on.

**Gate:** typecheck, lint and format clean; **254 tests over 32 files**;
`pnpm build` compiles.

### The UX pass (15 Nov 2026)

| What                               | Where                                                                                                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| one way to say how an action ended | `components/ui/Toaster` — `useToast()({ message, action })`, mounted in the member layout. It pauses while hovered or focused. The register, posts, albums, resources and the share button all use it                             |
| undo, not "are you sure"           | posts and albums delete at once with **Undo** in the toast. Removing a **person** still asks first, then offers Undo as well: a relative is worth the extra click                                                                 |
| missing loading screens            | `/families/[slug]`, `/admin/members/new`                                                                                                                                                                                          |
| autofill hints                     | every field has one: `name`, `email`, `username`, `bday`, `new-password`, and `off` for searches and written content. The member door is `username`, not `organization`                                                           |
| touch targets                      | in `globals.css`: icon-only controls (named only by `aria-label`) are at least 44px under `pointer: coarse`                                                                                                                       |
| one radius scale                   | `sm` 6 · `md` 12 · `lg` 20 · `pill`. Tailwind's `xl`–`4xl` and `--radius-media` are gone. `field`, `dock` and `member-rail` stay as named shapes                                                                                  |
| search for everyone                | `CommandPalette` moved to `components/ui` and takes its list as props. `features/search/commands.ts` builds it **on the server** per role: pages, people, stories, albums, plus studio and admin pages for those who may use them |
| completion nudge                   | `ProfileNudge` on the dashboard asks for a missing date of birth; **Add it** opens `/profile?edit=1`                                                                                                                              |

> [!NOTE]
> The code box already supported paste, `inputMode="numeric"` and
> `one-time-code`. The audit said otherwise because it only searched single
> lines.

**Gate:** typecheck, lint and format clean. **264 tests over 35 files.**
`pnpm build` compiles. **All 21 Playwright tests pass** (two of them only
after a retry, because a dev compile can outlast the waits; see
`tests/helpers.ts`).

### Mottos are official (15 Nov 2026)

> [!IMPORTANT]
> **Nobody edits their own motto.** The family sets the mottos: one per
> branch (`TRINITY[].motto`) and the family's own (`FAMILY_MOTTO`). The
> profile shows the member's branch motto, read-only, falling back to the
> family's. The motto editor, its device storage key and the "write your own
> motto" nudge step are gone. `ProfileView.test.tsx` holds that no motto
> field exists.

The profile editor now holds only the date of birth.

### The second UI/UX pass (15 Nov 2026)

| What              | Now                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| landing hero      | one heading, one line, one button, one photograph; no rings, magnetic button or letter-by-letter title. The tree preview has its own section, `TreeTeaser` |
| profile           | rebuilt on the type scale and `Button`; the signed-in name and branch, not a hard-coded "AGANZE" / "LIGHT FAMILY"; the invented activity counters are gone |
| birthdays         | today's card, a month row, an even grid; the staggered "constellation" is gone; "Notice sent" now says nothing was sent                                    |
| PDF viewer        | shows **the file** in the browser's own reader, in a native `<dialog>`. It used to draw two invented "certified" pages styled like Slack                   |
| `Button`          | gained `ghost` and `danger`                                                                                                                                |
| type scale        | 116 plain Tailwind sizes (`text-xs`…`text-5xl`) mapped onto the project's; none remain                                                                     |
| `/people/[id]`    | a page per relative: initials, branch and its motto, birthday (day and month only), year joined. No email. Member search links here                        |
| offline           | `OfflineBanner` in the member layout; the member `error.tsx` says "You're offline" and retries by itself when the connection returns                       |
| empty states      | slides, notifications, album grid, comments and upcoming birthdays each say something when empty instead of rendering nothing or crashing                  |
| lightbox on touch | swipe between photos, pinch to zoom, drag to look around, swipe down to close                                                                              |

**Found by looking, not by tests:** `/birthdays` scrolled sideways at
375px because the search button made the page header too wide (the badge
now hides below `sm` and the title truncates); the birthday grid truncated
names at three columns (now `xl` only); and `OtpInput` lost the first digit
when two were typed before a re-render (it now reads the boxes themselves).

> [!NOTE]
> Screenshots from the in-app browser pane show member pages blurred: a
> hidden pane pauses CSS animations on their first frame. The page itself
> is fine. The pane also did not draw the PDF inside the viewer; the file is
> served correctly, so check that one in Chrome.

**Gate:** typecheck, lint and format clean. **271 tests.** `pnpm build`
compiles. **21 Playwright tests pass.**

### The third pass (15 Nov 2026)

| What                | Now                                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| studio and admin    | checked by eye and at 360/1280px: no overflow. The profile and person pages each had two `<h1>`s; the header is `as="p"` there now                                                                                                                                     |
| family tree, public | no rings, no squares, no letter-by-letter title; one plain heading and one fade                                                                                                                                                                                        |
| family tree, member | the drifting face cloud with hearts is a single row of faces; `PairedHearts` is deleted                                                                                                                                                                                |
| photos for people   | `FamilyMember.photo` (an address, or empty). Only the three seeded people have one. `components/ui/PersonAvatar` shows the portrait or the initials; used on the person page, the register and every birthday                                                          |
| birthdays           | built from the register on the server (`app/(member)/_lib/birthdays.ts`, `features/birthdays/data.ts`): today's people from today's real date, then the next ones; every name links to `/people/<id>`. The invented celebrant list, nicknames and "42 wishes" are gone |
| one quotation style | `components/ui/Quote`: serif italic in curly marks, meaning underneath, attribution under that. Used for the profile, person page, branch pages and cards, footer, tree dialog, tree cards, timeline and the elders' quotes                                            |
| tests               | person page, offline banner, both new loading screens, `Quote`, `PersonAvatar`, the birthday arithmetic, and `tests/gallery.spec.ts` for the touch gestures and the document viewer                                                                                    |

**Found by the new browser test:** the lightbox's `setPointerCapture`
can throw for a pointer the browser no longer tracks, and the throw stopped
the swipe before it began. It is guarded now.

> [!NOTE]
> `pnpm build` fails with "next/font/google queries have exactly one entry"
> while a dev server is running from the same folder. Stop dev servers
> before building; it is not a code problem.

The PDF itself has still not been seen rendered: the in-app pane does not
draw it and Claude in Chrome was not connected. The e2e test proves the
viewer points at a real `application/pdf` file, not that Chrome draws it.

**Gate:** typecheck, lint and format clean. **281 tests.** `pnpm build`
compiles. **23 Playwright tests pass.**

---

## 23. Integration with backend-v2, planned 17 Nov 2026

The backend (`../backend-v2`, FastAPI, `/api/v1`) is finished. §20's layer
was written before its contract was known, and almost every assumption in it
is wrong: paths, page shape, error shape, code length, roles, the invitation
URL. The contract is the backend's `docs/auth.md`, `docs/domain.md` and its
OpenAPI schema; this section is how the frontend meets it.

### The user's decisions

| Question           | Decision                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| where tokens live  | **BFF**: the Next server holds them; the browser never sees one             |
| albums and gallery | **stay on fixtures**; the backend has no albums                             |
| post drafts        | **kept on the device** until published; the backend has no drafts           |
| person page        | **"year joined" dropped**; `UserPublicRead` has no `created_at`             |
| code length        | **5 digits, changed in the backend** (its decision 76)                      |
| role names         | **`member`, `social_media_manager`, `admin`** everywhere, as the API says   |
| forgot password    | **a reset-request queue in the backend**, answered by another administrator |

### BFF: how auth works

- `/login` and `/admin/login` call server actions, which `POST /auth/login`.
  The pending cookie carries the **family name** and nothing else: the
  frontend decides nothing about roles any more.
- `/verify` calls `POST /auth/verify`. The Next server keeps the access token
  and the backend's `refresh_token` (read from its `Set-Cookie`) as its own
  httpOnly cookies, then reads `GET /users/me` and keeps the role in a small
  signed cookie. That cookie only chooses what the frontend shows; the
  backend still refuses what a role may not do.
- **Only middleware refreshes**, about two minutes before the access token
  expires. Refresh tokens rotate and reuse revokes the session, so a request
  that loses a race (409 `refresh_conflict`) must still hold a valid token.
- Every server-to-backend call forwards the browser's `User-Agent` (it is
  the device label), and sends `Origin` from `FRONTEND_ORIGIN`: refresh and
  logout check it against the backend's `CORS_ORIGINS`.
- `NEXT_PUBLIC_API_URL` and `credentials: "include"` go. `API_URL` is
  server-only, such as `http://localhost:8000/api/v1`.
- Client components never call the backend. They take data as props from
  server components and change it through server actions, which
  `revalidatePath` afterwards. Route handlers exist only where a stream is
  needed (the resource PDF).
- Deleted: `features/auth/admin.ts`, `roles.ts`, `ADMIN_PASSWORD`,
  `DEV_PASSWORDS`, the invitation stand-in, and the frontend-signed role in
  the session token.

### The steps

Each one is a PR on its own and leaves the gate green.

| #   | Step                                                                                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **backend**: 5-digit codes. **Done**, merged as #35 (decision 76)                                                                                                                              |
| B2  | **backend**: the reset-request queue and the two-admin floor. **Done**, merged as #36 (decisions 77, 78)                                                                                       |
| 0   | local stack. **Done**, see below                                                                                                                                                               |
| 1   | transport: types generated from `/openapi.json`, `endpoints.ts` rewritten, `toError()` reading `{error: {code, message, details}}`, `Page` to `Paginated`, `Origin` and `User-Agent`. **Done** |
| 2   | auth over the BFF; `blogger` becomes `social_media_manager`; `SignedInProvider` from `/users/me`. **Done**, see below                                                                          |
| 3   | invitations: one `/invitation` page reading `location.hash`; `/invite/[token]` and its `/signup` retired. **Done**, see below                                                                  |
| 4   | forgot password and the reset queue, against B2. **Done**, merged as #28                                                                                                                       |
| 5   | the register and directory: `family_name` field, sub-family and promotion selects, **Remove** becomes **Deactivate**, **Undo** reactivates, **Send a new link**. **Done**, see below           |
| 6   | profile: display name, birthday, bio, photo; confirming a changed email; devices from `/auth/sessions`                                                                                         |
| 7   | wishes and upcoming birthdays                                                                                                                                                                  |
| 8   | blog reading: a Portable Text renderer for the backend's block set, Sanity images                                                                                                              |
| 9   | studio posts: image upload, then create, patch or delete by Sanity id; drafts stay on the device                                                                                               |
| 10  | resources: list, a route handler streaming the PDF, an upload screen for social media managers and admins                                                                                      |
| 11  | fixtures retired where the API answers; Playwright against a seeded backend; hosting variables                                                                                                 |
| 12  | Google sign-in, once everything else works end to end (the user's call, 18 Nov 2026). See below                                                                                                |

### B2: the reset-request queue, as built

The backend already reset an administrator's password by having another
admin resend their invitation (`POST /users/{id}/invitation`): the link goes
to the address on record and sets a new password. The queue is the front
half, which is how the other administrators find out. The contract is
`docs/auth.md`, "Forgotten admin passwords".

- `POST /auth/reset-requests`, no login, `{family_name}`: always 202 with
  the same `{message}`, so it never says who is an administrator. For an
  active admin with no open request it records one, and emails every
  **other** active admin after the response.
- `GET /auth/reset-requests`, admins: open requests, oldest first, never
  their own, as `{id, requested_at, user: {id, family_name, display_name,
email}}`.
- `POST /auth/reset-requests/{id}/approve`, admins, never their own: sends
  the invitation link to the address on record and closes the request. 403
  `cannot_answer_own_reset_request`, 404 `reset_request_not_found`, 429
  `invitation_recently_sent`, 503 on a failed email (the request stays open).
- `POST /auth/reset-requests/{id}/decline`, admins, never their own: closes
  it and emails **nobody**.

**The two-administrator floor is in the backend now.** Demoting or
deactivating one of the last two active admins is a 409 `too_few_admins`, so
the frontend's disabled controls (§21) are a courtesy over a real rule.

### Steps 0 and 1, applied 17 Nov 2026

**The local stack.** In `../backend-v2`: Docker Desktop running,
`uv run alembic upgrade head`, `uv run python scripts/seed_admin.py` (the
first admin from its `.env`), then `uv run fastapi dev src/app/main.py`.
The backend's `.env` sends mail through a real SMTP account, so login codes
reach real inboxes and no mail catcher is needed. Here, `.env.local` holds
`API_URL`, `FRONTEND_ORIGIN` and a generated `AUTH_SECRET`; `.env.example`
documents all three.

**The contract is generated, not guessed.** `pnpm api:types` copies the
backend's schema to `src/types/openapi.json` (committed, so nothing else
needs the backend) and generates `src/types/api.gen.ts`. `types/wire.ts`
names the backend's shapes; `endpoints.test.ts` fails if any path in
`endpoints.ts` is not in the schema.

| File                                           | Now                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `lib/env.ts`                                   | server-only: `API_URL`, `FRONTEND_ORIGIN`, `API_TIMEOUT_MS`. No `NEXT_PUBLIC_` value; `hasApi()` is false in the browser |
| `lib/api-client.ts`                            | server-only. `Origin` on every call, the browser's `User-Agent` when given, `no-store`, no browser credentials           |
| `types/api.ts`                                 | `Paginated` is the backend's `{items, total, page, limit}`; `ApiError.isSessionOver` replaces a 401 check                |
| `lib/api-auth.ts`                              | `apiAuth()`: the token and the user agent. The token is still the frontend's own until step 2                            |
| `services/{auth,users,wishes,posts,resources}` | one per backend feature; `members`, `albums` and `invitations` deleted (no such endpoints)                               |

**Three things worth knowing.**

- **Not every 401 means the session ended.** A wrong code
  (`invalid_code`) and a wrong admin password (`invalid_credentials`) are
  401s too. The old client replaced every 401's message with "Your session
  has ended", which would have told an administrator who mistyped their
  password that they had been signed out. `isSessionOver` checks the code.
- **A cleared cookie is not a token.** On logout Starlette answers
  `refresh_token=""; Max-Age=0`, and a naive reader keeps `""` (two quote
  characters) as the token. `readRefreshToken` treats a cleared cookie as
  none; a test holds it.
- **Checked against the real backend**, with calls that send no email:
  `Origin` reaches it (refused when foreign), `Cookie` reaches it, a 422
  becomes field errors, and every refusal keeps the backend's own words.
  `grep` finds none of the layer in `.next/static`.

**The holding state until step 4.** The forgot-password screen and the
reset band on `/admin` answer from their stand-ins whatever `API_URL` says.
(The invitation screens were in the same state until step 3.)

**Gate:** typecheck, lint and format clean. **337 tests over 43 files**, up
from 281. `pnpm build` compiles; shared first load is 213 kB.

### Step 2, applied 17 Nov 2026: signing in through the Next server

**Three modes, one switch** (`lib/auth-mode.ts`):

| Mode      | When                                     | Who checks the code                             |
| --------- | ---------------------------------------- | ----------------------------------------------- |
| `backend` | `API_URL` is set                         | the backend: `/auth/login`, then `/auth/verify` |
| `fixture` | no `API_URL`, and not a production build | nobody: any five digits, the sample register    |
| `off`     | a production build with no `API_URL`     | nobody can sign in                              |

The fixture mode is the user's choice (17 Nov 2026): it keeps offline work
and the Playwright suite running without a backend. It is a door that
opens for any five digits, so `auth-mode.test.ts`, `admin.test.ts` and
`middleware.test.ts` hold that a production build and a configured backend
each close it on their own.

**The cookies**, all httpOnly and `lax`, all written by `lib/auth-cookies.ts`:

| Cookie          | Holds                                                   | Lasts      |
| --------------- | ------------------------------------------------------- | ---------- |
| `imena_member`  | `v3`: role and user id, signed with `AUTH_SECRET`       | 90 days    |
| `imena_access`  | the backend's access token (backend mode)               | its 15 min |
| `imena_refresh` | the backend's refresh token (backend mode)              | 90 days    |
| `imena_pending` | `p2`: the family name a code was sent for, and the door | 10 min     |

**The flow.** `beginMemberLogin` / `beginAdminLogin` call `POST
/auth/login` and hold the family name in `imena_pending`.
`verifyLoginCode(code)` takes the code and nothing else, calls `POST
/auth/verify`, keeps both tokens (the refresh token read out of the
backend's `Set-Cookie`), asks `GET /users/me` for the role and id, and
writes `imena_member`. `resendLoginCode` asks for another code for the
member door; an administrator's needs the password again, so they are sent
back to log in. `endMemberSession` calls `POST /auth/logout`, then clears
everything whatever the backend said.

**The middleware refreshes** (Node runtime, not edge: `lib/refresh.ts`
shares one refresh between every request carrying the same token, in
memory, for the backend's 30-second grace). It refreshes two minutes before
the access token ends, writes the new tokens to the browser **and** to the
request being rendered, and re-issues `imena_member` from `/users/me`, so a
changed role reaches the rail within fifteen minutes. An ended session
clears the cookies and goes to the login; a lost race or an unreachable
backend carries on with the tokens it has.

**Who is reading** is `lib/viewer.ts`: `getViewer()`, cached per request,
is the backend's `/users/me` (or, in fixture mode, the sample person for the
session's role). The member layout hands its person to `SignedInProvider`;
the admin and studio layouts check its role, so somebody demoted a minute
ago is turned away now, not at the next refresh. The admin and studio
overviews greet it rather than a constant.

**Roles are the backend's**: `member`, `social_media_manager`, `admin`.
`blogger` is gone from code, data and tests. In the frames the role reads
"Social Media Manager"; in the register and on a person's page, "Social
media manager".

**Gone:** `ADMIN_PASSWORD` (one shared secret, which per-person passwords
replaced), `startMemberSession` (now `verifyLoginCode`), the v1/v2 session
and p1 pending tokens (holders sign in again), and the 700 ms fake check on
the verify screen. `features/auth/admin.ts` and `roles.ts` remain for the
fixture mode only and refuse in any other.

**Two behaviours that changed on purpose.** The administrators' door takes
a password of any length, because the backend checks it and one set before
the eight-character rule must still work. A wrong code clears the boxes
and shows the backend's words; it costs one of the backend's five tries.

**Not yet:** the profile still reads the sample register in fixture mode
and nothing in backend mode (step 6); Google sign-in stays disabled.

### Waiting for an email, 18 Nov 2026

The first real login sent no code. Gmail took about 7.5 seconds here just
to connect, start TLS and say hello, so the backend's 5 seconds per attempt
ran out every time, and this frontend's 10-second wait would have too. The
backend now gives each email one 25-second budget (its decision 43,
`fix/smtp-time-budget`), and every call that makes it send one waits
`EMAIL_TIMEOUT_MS` (40 s, `lib/env.ts`): `login`, `approveReset`,
`resendEmailCode`, `create`, `update`, `invite`. Everything else keeps the
10-second limit. `email-wait.test.ts` holds both halves.

### Staying signed in, 18 Nov 2026

The next real login worked and then went straight back to the login, and
the login asked for another code. Two things:

- **A bug from step 2.** `apiAuth()` still sent `SESSION_COOKIE` (the
  frontend's own signed token) as the backend's bearer token. The backend
  refused it, `getViewer()` took the refusal for a signed-out visitor, and
  the layout sent them to the login. It sends `ACCESS_COOKIE` now, and
  `api-auth.test.ts` holds it.
- **The login was shown to a signed-in device.** The middleware now sends a
  device with a session past `/login` to where it was headed (a plain path
  on this site only) or to `/dashboard`, and an administrator past
  `/admin/login` to `/admin`. A member still sees the administrators' door,
  since the device may be handed to one.

That second change needs a way out for a session the backend has ended
since (revoked from another device, say), or the layout and the login
would send the person back and forth. `requireViewer()` now redirects to
`/session-ended`, a route that asks the backend before it does anything: it
refreshes an access token that has only run out, keeps the cookies when the
session still works or the backend cannot be reached, and clears them only
when the backend agrees the session is over. It never takes the page's word
for it, because a cookie-clearing link is one any other site could send.

### Step 3, applied 18 Nov 2026: the invitation link

The backend emails one link, `/invitation#token=…`, to a new member, a new
administrator, somebody promoted to administrator, and an administrator
whose reset request another one answered. So there is one page.

- **The token is after the `#`**, which never reaches the Next server.
  `InvitationFlow` reads it from `location.hash` (`useSyncExternalStore`, so
  the prerendered page shows "Checking your link…" until the browser has
  looked) and passes it to the server actions in `actions/invitation.ts`,
  which post it to `/auth/invitations/check` and `/accept`.
- **Opening the page only asks.** `check` changes nothing; the link is
  used when the person presses the button, so a mail scanner that opens it
  uses nothing up.
- **A member** sees the family name they log in with and **Go to login**,
  which accepts (confirming their address) and opens `/login?name=…`.
  **An administrator** chooses a password with `SetPasswordForm` (8 to 256
  characters, the backend's rule, checked again in the action), then **Go
  to admin login** opens `/admin/login?name=…`. Both forms fill the name
  from `NAME_PARAM`; family names are not secret, and the field decides
  nothing.
- **One refusal.** The backend answers every bad link with 400
  `invalid_invitation` (wrong, used, replaced, expired, deactivated), so
  the page says the link no longer works, and that somebody who used it
  can log in. A link with no token is "incomplete". An unreachable backend
  is neither, and offers **Try again**.
- **No session, in any mode.** `no-session.test.ts` reads the page, the
  flow and the actions for the session machinery by name.
- **Fixture mode** answers `#token=member-demo` and `#token=admin-demo`
  (`features/invitations/fixture.ts`) and refuses anything else; nothing is
  stored. A production build with no backend answers nobody.

**Retired:** `/invite/[token]`, `/invite/[token]/signup`,
`/admin/reset-password/[token]` (and its exemption from the admin gate),
`AdminSignupForm`, `InviteWelcome`, `ResetPasswordForm`, the token-shape
stand-in, and `SetPasswordForm`'s "nothing was stored" branch: it now
always has an action to send to. `features/invitations/data.ts` keeps only
the sample reset requests, which step 4 replaces.

The backend's `FRONTEND_URL` must be this frontend's address (locally
`http://localhost:3000`), or its emails link somewhere else.

**Gate:** typecheck, lint and format clean. **400 tests over 51 files.**
`pnpm build` compiles; `/invitation` is 340 kB first load, like the other
auth pages. The six invitation Playwright tests pass.

### `main` rewritten, 25 Nov 2026

#26 ("Fine-tunements") added 14.5 MB to `public/images/` and nothing else:
a ChatGPT conversation saved with the browser's "Save page as" (the page and
its `_files/` folder) and six unused screenshots, all served as public files.
#27 ("Chore/birthday refinements") was a redesign still in progress: it broke
the member layout (an unclosed `ToastProvider`, `requireViewer` no longer
imported), took the query provider away from `/invitation`, and failed lint.
Both merged with `lint` red, because the ruleset required a check named `CI`
that no job reports; it now requires `lint`, `unit`, `e2e` and
`malware-guard`.

`main` was reset to #25 and #27's work re-applied in one commit, without the
saved page, the screenshots, `design-references/`, `scripts/dev-warm.mjs`
(it minted the old `v2` cookie), or the `public/**` lint exclusion; with the
layout fixed, the resources page back on `useToast`, and `QueryProvider`
mounted by `/invitation` alone instead of the root layout. `.gitignore`
refuses `*_files/`.

### Step 5, applied 26 Nov 2026: the register and the directory

`/admin/members` is `GET /users/accounts` now, every page of it and the
deactivated people too, with `GET /users/sub-families` and
`/users/promotions` for the selects (`admin/_lib/register.ts`). The table
still searches, filters and sorts on the client: a family is hundreds of
people.

| What                | Now                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the record          | `FamilyMember` gained `familyName` and `promotion`; `features/members/wire.ts` builds it from `UserRead`                                                |
| status              | `active`, `invited`, `deactivated`. Invited: a member who never confirmed their address, an administrator with no password                              |
| the panel           | name, **family name** (what they log in with), email, sub-family and promotion selects, date of birth, role. No status select: deactivating is a button |
| saving              | `actions/members.ts`: add, update (only the fields that changed), deactivate, reactivate, send a new link. The dialog waits for the answer              |
| refusals            | `family_name_taken` and `email_taken` land on their field; anything else (`too_few_admins`, `cannot_change_own_role`…) under the form, in its own words |
| **Remove**          | became **Deactivate**, behind a confirmation, then **Undo**, which reactivates. Deactivated rows stay in the list with a reactivate button              |
| **Send a new link** | in the panel, for somebody still invited and for any administrator (theirs also resets the password)                                                    |
| the overview        | its counts and its attention queue read the same register, deactivated people left out; absent rather than zero when the backend cannot be asked        |
| `/people/[id]`      | `GET /users/{id}`: branch, birthday (day and month), promotion, bio. No role and no "year joined": `UserPublicRead` has neither                         |
| the search palette  | its people are the directory (`GET /users`), loaded once by the member layout (`_lib/people.ts`)                                                        |

**Your own record** is locked for role and deactivation, because the backend
refuses both (`cannot_change_own_role`, `cannot_deactivate_self`). In fixture
mode the sample session is not a register row, so the seeded administrator
(`SIGNED_IN_ID`) stands in for it.

**The floor** counts invited administrators, as the backend does: only a
deactivated one does not count.

**Fixture mode** stores nothing: every action answers `person: null` and says
so, and the table applies the change to its own copy of the sample register.

**Not yet:** birthdays still read the sample register (step 7), and so does
the profile (step 6). Linking a Sanity author (`PUT /users/{id}/sanity-author`)
has no screen yet; it belongs with the studio's posts (step 9).

**Gate:** typecheck, lint and format clean. **446 tests over 56 files.**
`pnpm build` compiles. 23 of 24 Playwright tests pass; "public pages hold at
360px" times out loading `/family-tree` here, on `main` as well, which no
page in this step touches.

### Step 12, later: Google sign-in

Deferred by the user until everything else works end to end. What it takes:

- **Google Cloud console**: a Web application OAuth client; this site's
  origins under "Authorized JavaScript origins" (`http://localhost:3000`
  and the production address); test users while the consent screen is in
  testing.
- **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`**, equal to the backend's
  `GOOGLE_CLIENT_ID`: the backend checks the ID token's audience against
  it.
- **The button**: Google Identity Services' button posts its `credential`
  to a server action, which calls `POST /auth/google` (with the password,
  for an administrator) and keeps the tokens as `verifyLoginCode` does.
  `GoogleButton` is disabled until then.
- **Leftovers to remove**: `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in
  `.env.example`, and the unused `next-auth` dependency.

### Stays on fixtures

Albums and the gallery (and the studio's album tools), likes and comments,
notifications, branch mottos, the tree's copy. Post drafts live on the device.

### Risks

- **Uploads and Vercel.** Functions take at most 4.5 MB per request;
  resources allow 10 MB and photos 5 MB. Settle hosting before step 10.
  Server actions also need `serverActions.bodySizeLimit` raised.
- **Neon cold starts.** The first query after idle is slow; keep the timeout
  and the error state.
- **The router cache.** `staleTimes.dynamic` is 30 s, so every mutation
  revalidates.
