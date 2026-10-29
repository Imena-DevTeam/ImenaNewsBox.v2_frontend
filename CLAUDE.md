# IMENA Family Times — Claude Code Development Guide & Specifications

This document is the single source of truth for Claude Code when developing, extending, or refining the **IMENA Family Times** web application (`Imena-DevTeam/ImenaNewsBox.v2_frontend`).

---

## 1. Project Overview & Tech Stack

- **Framework**: Next.js 15.x (App Router), React 19
- **Language**: TypeScript (strict mode, zero errors tolerated)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/styles/globals.css`)
- **Fonts**:
  - Headings: Roboto (`--font-heading`, `font-heading`)
  - Body: Nunito Sans (`--font-sans`, `font-sans`)
- **Color System**:
  - Brand Primary: `#0d1aba` (`bg-primary`, `text-primary`)
  - Heading Violet Accent: `#5a36da` (`text-heading`, `bg-heading`)
  - Page Background: `#fcffff` (`bg-background`)
  - Card Surface: `#ffffff` (`bg-surface`, `bg-white`)
  - Muted Neutral: `#6b6b6b` (`text-muted`)
  - Border: `#e5e7f0` or `#e8edf7`
- **Package Manager**: `pnpm`
- **Development Server**: `pnpm dev` on `http://localhost:3000`
- **Typecheck Command**: `pnpm typecheck` (`tsc --noEmit`)

---

## 2. Critical Behavioral Guidelines & Rules

> [!IMPORTANT]
> **STRICT RULE ON GIT COMMITS**: NEVER run `git commit` or `git push` unless the user explicitly tells you to do so in their message! Keep all working changes unstaged/uncommitted until instructed.

> [!CAUTION]
> **AVOID "AI SLOP" & OVER-ENGINEERED UI**:
>
> - Do **NOT** add artificial helper labels like _"Click card to flip"_, _"Preceding Generation"_, or explanatory pill badges that clutter the design.
> - Do **NOT** use random emojis (e.g. `🔄`, `✨`) in buttons or headings.
> - Do **NOT** add arbitrary thick borders (e.g. `border-l-4` blockquote lines) unless specifically indicated in the design mockup.
> - **Preserve Design Fidelity**: The user wants clean, Apple/Stripe-caliber luxury aesthetics matching the exact design exports (`media_1793188908046.png`).

---

## 3. Public Family Tree Page (`/family-tree`)

### Page Route

- `src/app/(public)/family-tree/page.tsx`
- Uses client wrapper `src/features/tree/components/PublicFamilyTreeClient.tsx` to coordinate `activeYear` between the hero tree illustration and the bottom promotion section.

### A. Hero Section & Interactive SVG Tree (`TreeHero.tsx` + `PublicTreeIllustration.tsx`)

1. **Title & Heading**:
   - Centered 3-line headline:
     ```
     Rediscover
     Your Legacy.
     ```
     with subhead: _"A modern space for family history, connections, and stories."_
   - Interactive button: _"Explore the Tree"_ smoothly scrolls to `#promotion-section`.
2. **SVG Tree Dimensions**:
   - ViewBox: `0 0 1000 680`, non-overlapping nodes, clean organic branches.
3. **Nodes & Roles**:
   - **Root Node (Patriarch)**: Center bottom, displays a subtle silhouette icon. On hover, displays a clean floating badge with the name **"Benon"**.
   - **Generations Included**: Only includes **Grandpère and Grandmère** for each generation (`2019-2021` up to `2025-2026`).
   - **Portraits**: Circular avatar nodes (`r={28}` or `r={32}`) filled with verified high-res Sanity CDN photography via SVG `<pattern>`.
   - **Hover Tooltips**: Names appear strictly on hover in an elevated floating badge (no static cluttering labels).
   - **Interactive Branch Glowing**: Hovering or selecting any node highlights its genealogical path in amber-gold (`#F59E0B`) all the way down to Benon.
   - **Click Navigation**: Clicking a node sets `activeYear` and scrolls to `#promotion-section`.

---

### B. Down Promotion Section (`PublicPromotionSection.tsx`)

#### 1. Header Layout (Strictly Matching `media_1793188908046.png`)

- **Centered Crest**: Official IMENA crest (`/images/imena-crest.webp`, 70x70) centered above the title.
- **Main Heading**:
  ```html
  <h2 className="text-h1-m md:text-h1 font-black text-black">
    AERG IMENA Family <span className="text-primary">Tree</span>
  </h2>
  ```
- **Subtitle**:
  _"Discover the connections and relationships within our extended family. Each level represents a generation, and each circle represents a family member."_
- **Year Display**:
  - Shows **one year above** at a time (e.g. `2025-2026`).
  - Smooth cross-fade animation when cards are flipped (Current year fades out / previous year fades in).
  - **Subheading**: `Grandpere & Grandmere` in bold, uppercase text.

#### 2. Grandpère & Grandmère Cards

- **Role Limitation**: Strictly displays **Grandpère and Grandmère** (no extra coordinator or parent groups).
- **Card Dimensions & Styling**:
  - Surface: `bg-white rounded-3xl border border-[#e8edf7] p-6 md:p-7 shadow-[0_4px_24px_rgba(13,26,186,0.04)] hover:shadow-[0_20px_45px_rgba(13,26,186,0.08)]`.
  - Layout: Two columns (`flex-col sm:flex-row items-center sm:items-stretch gap-6`).
  - Left Portrait: Aspect ratio `4:5`, rounded-2xl (`rounded-2xl overflow-hidden aspect-[4/5] w-full sm:w-44 md:w-52 relative bg-[#eaeff5] ring-1 ring-black/5`).
  - Silhouette Fallback: For members without a photo, render a clean SVG silhouette on a soft `#eaeff5` container.
  - Right Details:
    - Name: `font-heading font-black text-2xl md:text-[26px] text-slate-900 tracking-tight leading-tight uppercase`.
    - Role Badge: `inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3fe] text-[#1d4ed8] border border-[#dbeafe]`.
    - Family Clan Badge: `inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-white text-[#1d4ed8] border border-[#bfdbfe]`.
    - Saying / Quote: `text-sm md:text-base text-slate-600 italic font-normal leading-relaxed mt-4` wrapped in typographical quotes `“...”` (no left border line).
- **3D Flip Interaction**:
  - Clicking either card triggers a 3D flip (`rotateY(180deg)` with `perspective: 1400px` and `transform-style: preserve-3d`).
  - Stagger: Grandpère flips at `0ms`, Grandmère flips at `75ms` delay.
  - Reveal: Back of the cards reveals the **preceding generation's Grandpère and Grandmère** in that lineage with their authentic photo, role, family clan, and quote.
  - Backface visibility: `backface-visibility: hidden; -webkit-backface-visibility: hidden;` on both faces.

---

## 4. Authentic Sanity CDN Member Data

Data is structured in `src/features/tree/publicTreeData.ts`:

| Promotion          | Role      | Name                 | Family Clan    | Sourced Photo URL / Asset                                                                                |
| ------------------ | --------- | -------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| **2025–2026**      | Grandpère | MUGISHA Pacifique    | Rwamamara      | `https://cdn.sanity.io/images/bge18m05/production/0079bffac8150fffd03d00cd5be158de72219b83-309x931.jpg`  |
| **2025–2026**      | Grandmère | ISIMBI Hyguette      | Karabo         | Silhouette placeholder (no official photo on site)                                                       |
| **2024–2025**      | Grandpère | RUDASESWA Thierry    | Rwaka          | `https://cdn.sanity.io/images/bge18m05/production/580b981c297507e207cfed2f06398289500f1312-424x756.jpg`  |
| **2024–2025**      | Grandmère | INGABIRE Liliane     | Marebe         | `https://cdn.sanity.io/images/bge18m05/production/9983996c39ec338141c917b6ee54a78dd98bb3cf-480x1014.jpg` |
| **2023–2024**      | Grandpère | BUGINGO Elua         | Nkotanyi       | `https://cdn.sanity.io/images/bge18m05/production/bfb8c538cdaffcea16ae84a5e8b768c62f78f99e-720x1080.jpg` |
| **2023–2024**      | Grandmère | UWINEZA Joyeuse      | gmere          | `https://cdn.sanity.io/images/bge18m05/production/a60ff01b42586bb16f7cba4571d968218146c38c-690x1080.jpg` |
| **2022–2023**      | Grandpère | MANZI Sylvain        | Intashya       | `https://cdn.sanity.io/images/bge18m05/production/fc7f57ec71f98d63d8b13689b70b5514f77c5ba8-502x711.jpg`  |
| **2022–2023**      | Grandmère | KANYANGE Elua        | Nyamurunga     | `https://cdn.sanity.io/images/bge18m05/production/c329486c997cb24b433cf57f4fb9f7a554a93ca0-475x882.jpg`  |
| **2021–2022**      | Grandpère | NIYONZIMA Patrick    | Inkomezamihigo | `https://cdn.sanity.io/images/bge18m05/production/5d4f3b25f992cf6d8ba986bf3ec09c6ae5e69e06-444x680.jpg`  |
| **2021–2022**      | Grandmère | MUKESHIMANA Francine | Inyamibwa      | `https://cdn.sanity.io/images/bge18m05/production/3e098ee3e070d65a882a9ba4f40f3b06cfa02927-463x742.jpg`  |
| **2019–2021**      | Grandpère | NIYOMUKIZA Sylvain   | Imenagitero    | `https://cdn.sanity.io/images/bge18m05/production/4f086790488e19882d8eafd6bd49b9a762acca34-750x1050.jpg` |
| **2019–2021**      | Grandmère | MUREKATETE Honette   | Isonga         | Silhouette placeholder                                                                                   |
| **Root Patriarch** | Founder   | Benon                | IMENA Family   | Silhouette icon, revealed as "Benon" on hover                                                            |

---

## 5. File Map

```
src/
├── app/
│   ├── (public)/
│   │   └── family-tree/
│   │       └── page.tsx                         <-- Public family tree entry point
│   └── (member)/
│       └── tree/
│           └── page.tsx                         <-- Member internal tree
├── features/
│   └── tree/
│       ├── publicTreeData.ts                    <-- Grandpere/Grandmere datasets, Sanity URLs, preceding generation resolver
│       └── components/
│           ├── PublicFamilyTreeClient.tsx       <-- State coordinator (activeYear)
│           ├── TreeHero.tsx                     <-- Hero with 3-line headline and badges
│           ├── PublicTreeIllustration.tsx       <-- SVG tree with branch glow, tooltips & Benon root
│           ├── PublicPromotionSection.tsx       <-- Down section with clean year pill & 3D flip cards
│           └── index.ts
└── next.config.ts                               <-- Contains cdn.sanity.io in remotePatterns
```

---

## 6. Verification Checklist Before Handing Off

1. Run `pnpm typecheck` (`tsc --noEmit`) — MUST exit with 0 errors.
2. Confirm `next.config.ts` allows `cdn.sanity.io` image loading.
3. Check responsive layout on mobile (`375px`), tablet (`768px`), and desktop (`1440px`).
4. Ensure no unwanted UI clutter, artificial status badges, or instructional text on cards.
5. **NEVER commit to git unless explicitly told to commit by the user.**

---

## 7. Resources Page (`/resources`) & Slack PDF Viewer Specifications

### A. The Problem Identified by the User
1. **Modal Positioning / Z-Index Layering Bug**:
   - When a user clicks **"View PDF"** on a resource card, the current modal container can clip or render behind page elements (or create an awkward dark scrim overlay across the entire bottom half of the page while the container is misplaced or non-intuitive).
   - The user noted: *"slack have container opened when u click on a pdf ... some small container .... that come in front .... not like this thing behind"*.
2. **Container Sizing & Focus**:
   - The document viewer should NOT feel like an overwhelming full-page takeover that swallows the viewport.
   - In Slack, clicking on a PDF opens a **dedicated, self-contained, floating dialog container in front** of the interface (`z-[100]`), with clean borders, clear margins, dark Slack chrome (`#353535`/`#404040`), and immediate focus.

---

### B. Expected Slack-Style Document Viewer Behavior (`PdfViewerModal.tsx`)
1. **Portal-Mounted Front Container**:
   - Use `createPortal` (or a fixed root overlay at `z-[100]`) to ensure the viewer container ALWAYS renders directly into `document.body` in front of all member dock navigation, sticky headers, and footers.
2. **Compact Slack Container Dimensions**:
   - Max width: `max-w-4xl` or `max-w-5xl` (e.g. `w-[92vw] sm:w-[85vw] max-w-4xl h-[85vh]`).
   - Centered vertically and horizontally with soft dark backdrop (`bg-black/50 backdrop-blur-[2px]`).
   - Clean Slack dark header:
     - Avatar + `imena_archive`
     - Subtitle: `Shared in # resources — [filename.pdf]`
     - Close `✕` button on top right.
3. **Left Thumbnail Strip & Center Document Canvas**:
   - Left side: Compact thumbnail cards (Page 1, Page 2) with active border ring and `PDF Viewer` indicator tag.
   - Center: Crisp white document paper sheet (`shadow-xl`) simulating the PDF pages with clear typography, archive reference, and official verification seal.
   - Bottom Right: Floating action bar (`Download`, `Open in new window`, `More...`).
4. **Scrolling & Escape Handling**:
   - Pressing `Escape` or clicking the backdrop dismisses the container.
   - Internal scrolling only within the document canvas (`overflow-y-auto`), avoiding body lock issues.

---

### C. Resources Page Layout & Architecture
1. **Page Entry Point**:
   - `src/app/(member)/resources/page.tsx`
2. **Core Components**:
   - `src/features/resources/components/ResourcesBrowser.tsx` (State manager for category filtering, search, viewMode grid/list, pagination, and modal state)
   - `src/features/resources/components/PdfViewerModal.tsx` (Slack-style floating container)
   - `src/features/resources/components/ResourceCard.tsx` (2-column card matching original mockup)
   - `src/features/resources/components/ResourceListItem.tsx` (Dense list view row)
   - `src/features/resources/components/CategoryFilter.tsx` (Unified pill filters with `Categories →`)
   - `src/features/resources/components/FeaturedResourceBanner.tsx` (Most Popular / Spotlight banner)
   - `src/features/resources/components/PaginationControls.tsx` (Pills `1`, `2`, `3`, `Previous`, `Next`)
3. **Empty State Requirement**:
   - Component: `src/components/ui/empty-testimonial.tsx`
   - **CRITICAL**: The app uses `<LazyMotion features={domAnimation} strict>` in `MotionProvider.tsx`.
   - Any animated components inside MUST import `{ m } from "motion/react"` and use `<m.div>`, `<m.span>`. Importing `{ motion }` will throw a runtime crash!

---

### D. Verification Checklist for Claude Code
1. Click **"View PDF"** on `/resources`:
   - Confirm a clean, centered Slack container opens **directly in front** of all UI elements (`z-[100]`).
   - Confirm the background page does NOT render on top or clip the modal.
2. Click thumbnails on the left: verify the page switches between Page 1 and Page 2.
3. Click `Download`: verify file download triggers and toast message appears.
4. Click `✕` or press `Escape`: verify the container cleanly dismisses.
5. Run `pnpm typecheck` (`tsc --noEmit`): **MUST exit with 0 errors**.
6. **NEVER commit or push to git without explicit user instruction!**

---

## 8. UI/UX Audit — Issues Found Across the Frontend

Scope: what a person sees and does. Found by loading every route in a browser at 1440px and 390px, measuring the DOM, and reading screenshots. Dev-server findings, not a production build. Fix in priority order. Each item says where it is and what "done" looks like.

### P1 — Broken or clearly wrong for the user

**U1. The landing page scrolls sideways on phones.**

- Where: `/` at 390px. `document.scrollWidth` is 454px against a 390px screen.
- Cause: the decorative rings in `src/features/landing/components/Hero.tsx` (`size-[36rem]`, `size-[30rem]`, positioned at `-left-40` and `left-[35%]`) poke out of the section.
- Fix: clip the hero wrapper (`overflow-x-clip`) so the rings cannot widen the page.
- Done when: `scrollWidth <= innerWidth` at 360, 390 and 430px.

**U2. Resources: every card has the same title, description and thumbnail.**

- Where: `src/features/resources/data.ts`, shown on `/resources`.
- Problem: all 10 entries read "General chapter oversight, external Rwandan Genocide Memorial Sites added to national heritage list". It looks like a rendering bug and the filters and search appear to do nothing.
- Also: the featured banner at the top repeats the first card, so the same item shows twice.
- Fix: give each resource its own title, description, category and icon or cover. Exclude the featured item from the list below it.

**U3. The PDF viewer shows the same hard-coded text for every resource.**

- Where: `PdfViewerModal.tsx`, pages one and two.
- Problem: opening "Family Guides" shows memorial-site legislation. People will assume the file is wrong.
- Fix: show the real document, or a clearly labelled preview built from that resource's own fields.

**U4. Two member pages are empty "Coming soon" screens.**

- Where: `/birthdays` and `/profile`. Both sit in the main dock and in the footer, and `/profile` is behind the header avatar and the "Aganze, Wihogora family" footer link.
- Problems:
  - They have no page header, bell or avatar, unlike every other member page.
  - "Back to the home page" sends a signed-in member to the public landing page, not the dashboard.
  - A dock icon that leads to an empty page reads as broken.
- Fix: build them, or mark them as not ready in the dock, or at least give them the member `PageHeader` and a "Back to dashboard" link.

**U5. Login does not recover from failure.**

- Where: `VerifyForm.tsx`.
- Problem: if starting the session fails, the page stays on "Verified! Taking you in…" with the digit boxes disabled. There is no error and no way out.
- Fix: catch the failure, return to the idle state, and show "Something went wrong. Try again."

### P2 — Hard to read, hard to tap, inconsistent

**U6. Text under 12px.**

- Measured: `/resources` has 16 text nodes at 10 to 11px (counts, "2 days ago", file sizes, category chips). The dashboard, blogs and tree pages have 4 or 5 each at 10px ("2 days ago", "Family Member", counts).
- Fix: 12px minimum for anything a person needs to read. Use the 14px token for supporting text.

**U7. Touch targets are too small.**

- Measured on `/resources` at 390px: footer links are 23px tall, "Sign out of this device" and "Family updates" are 26px, and the nav links in the footer are 56 to 89px wide by 23px tall.
- The public pages have 12 to 24 targets under 32px.
- Fix: at least 44px tall hit areas for links and buttons on touch (padding is enough, the text can stay the same size).

**U8. Mobile resource cards are very tall.**

- Where: `/resources` at 390px. Each card stacks a large "View PDF" button, then "Open" and "Download" side by side. Four cards fill about three screens.
- Fix: a compact list row on phones, with one primary action and a menu for the rest.

**U9. The dashboard is unbalanced at desktop width.**

- Where: `/dashboard` at 1440px. The Birthdays column ends well above the blog column, leaving a large empty block beside "Popular Articles and Blogs".
- Fix: make the right column sticky, or move the Sub Family Trinity up beside it.

**U10. Text over photographs on the Sub Family Trinity cards.**

- Where: dashboard. The quote and description sit directly on a busy photo with only a light scrim. Contrast is poor on the lighter areas.
- Fix: a stronger bottom gradient, or move the text to a solid panel. Check with a contrast tool.

**U11. Labels do not match where they go.**

- "Archive" in the footer opens `/blogs`.
- Footer column "Memories" lists Gallery, Archive and Resources, which are not memories.
- Fix: rename "Archive" to "Blogs", or point it at an archive page. Regroup the columns by what the pages are.

**U12. Colour and style drift.**

- Over 150 raw hex colours and `slate-*` classes in the resources files, the public tree illustration, the promotion section and `empty-testimonial.tsx`, against the project's token palette. The resources page, the PDF viewer and the tree look slightly different from the rest of the member area.
- Fix: map the values to the design tokens, or add the missing tokens to `globals.css`. Decide once which rule wins, this file or the token rule.

### P3 — Polish

**U13. Layout shift and slow first paint.**

- Console warnings on most pages: images with `width` or `height` set but not the other (`elder-*.webp`, `imena-crest.webp`, `google.svg`, `hearts.svg`). Add `h-auto` or `w-auto`, or set both.
- `/signup` loads `footer-bg.webp` as its largest paint without `priority`. `/tree` does the same for `hearts.svg`.
- `/gallery/family-celebrations` preloads images it then does not use.

**U14. A hydration mismatch on `/family-tree` at 390px.** React logs "a tree hydrated but some attributes of the server rendered HTML didn't match". A visible flicker is possible on phones. Look for browser-only values (width, `Date`, `window`) used during render in `PublicTreeIllustration.tsx`.

**U15. The page title and the first heading say the same thing on the blog article page.** The header reads "BLOGS" and the story title is an `h2`. Make the article title the page `h1` and keep "Blogs" as a small label.

**U16. Footer year is fixed at build time.** `new Date().getFullYear()` in a statically rendered footer will show last year after New Year until the next deploy.

**U17. Sample content is everywhere.** Names, counts, "Sample articles, shown until the family blog is connected" and similar notes appear on several pages. Keep the notes until the data is real, then remove them all together so nothing looks half-finished.

### Checked and fine

- One `h1` per page and a correct `lang` on every route.
- No missing `alt` text and no duplicate ids on the 16 routes tested.
- No horizontal scroll on any route except `/` at 390px.
- The 404 page loads and keeps the site frame.
- The PDF viewer opens in front of the dock, closes with Escape, the backdrop or the close button, and downloads with a toast.

### How to verify

1. Run `pnpm dev`, sign in, and open every route at 360, 390, 768 and 1440px.
2. For each fix, check `document.documentElement.scrollWidth <= innerWidth`.
3. Run `pnpm typecheck`, `pnpm lint` and `pnpm test`.
4. Do not commit or push unless asked.
