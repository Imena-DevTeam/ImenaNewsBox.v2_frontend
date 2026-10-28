# IMENA Member Blog Article Detail Page: Visual Audit, UX Architecture & Implementation Blueprint

This document contains a comprehensive **design audit, UX critique, structural specifications, and implementation guide** for building the **Blog Article Detail Page** (`/blogs/[slug]` or `src/app/(member)/blogs/[slug]/page.tsx`) in the IMENA Family Sanctuary web application.

---

## 1. Visual & UX Audit of the Design Mockup

A rigorous inspection of the provided mockup reveals several key strengths along with critical visual, typographical, and ergonomic gaps that must be enhanced for a state-of-the-art reading experience:

### ⚠️ Flaw 1: Static Placeholder Block vs. Living Story Media

- **Problem**: The hero media container in the mockup depicts a flat, static gray container with the centered IMENA emblem. While respectful of the brand identity, real family stories thrive on vivid photography of the actual gathering.
- **Correction**:
  - Support high-resolution photography with graceful fallback to the embossed IMENA coat of arms in a warm sanctuary gradient frame (`bg-stone-100 dark:bg-stone-800/40 border border-stone-200/60`).
  - Add subtle image hover zoom (`transition-transform duration-500 hover:scale-[1.02]`) and accessible `alt` text detailing the gathering.

### ⚠️ Flaw 2: Capitalized Body Text & Typographic Fatigue

- **Problem**: The mockup renders all body text in Title Case (_"Amidst The Hustle And Bustle Of Our Daily Lives, This Family Reunion Serves As A Reminder..."_). In long-form reading, Title Case creates severe eye fatigue and violates editorial standards.
- **Correction**:
  - Use sentence case with modern editorial typography (`font-body text-stone-700 dark:text-stone-300 leading-relaxed text-base sm:text-lg`).
  - Stylize the lead paragraph as an editorial summary (`text-lg sm:text-xl font-medium text-stone-900 dark:text-stone-100 leading-relaxed border-l-4 border-brand/60 pl-4 py-1 italic`).

### ⚠️ Flaw 3: Anonymous Secondary Media Container

- **Problem**: The middle of the article contains a blank gray box placeholder with no captions, tags, or interaction.
- **Correction**:
  - Render an inline photo highlight or interactive mini-gallery component (`ArticleMediaBlock.tsx`) showing moments from the reunion with a subtle caption: _"Generations embracing at the welcome banquet • Photo by Family Media Team"_.
  - Include click-to-expand / lightbox support for immersive viewing.

### ⚠️ Flaw 4: Insufficient Interaction in the Author & Meta Bar

- **Problem**: The bottom author bar only shows a static avatar, the author name ("NGABE"), the date, and a generic paper airplane icon.
- **Correction**:
  - Provide a full interactive engagement row:
    - **Author Block**: Circular portrait, author name with subfamily chip (e.g., `NGABE • Wihogora Family`), and publish date.
    - **Reactions & Engagement**: Interactive Like/Heart button with live counter, Comment trigger with counter, and Share button.
    - **Share Action**: Copies the article link to clipboard with a toast notification or triggers native `navigator.share` on mobile devices.

### ⚠️ Flaw 5: Back Navigation Ergonomics

- **Problem**: The circular `<` button floats in isolation above the hero image without clear context on where it leads.
- **Correction**:
  - Implement a sleek circular back button (`size-10 rounded-full border border-brand/30 text-brand hover:bg-brand/10 transition-all flex items-center justify-center shadow-xs`) that links back to `ROUTES.BLOGS` (`/blogs`), accompanied by an accessible `aria-label="Back to all stories"` and optional hover tooltip.

### ⚠️ Flaw 6: Celebratory Background Doodles

- **Problem**: The mockup contains faint line-art party horns in the margins. If implemented rigidly, these can overlap text on narrow screens or cause horizontal scrollbars.
- **Correction**:
  - Implement dynamic, non-intrusive floating party poppers/horns (`PartyPopper` from `lucide-react` or custom SVG doodles in `text-purple-300/30 dark:text-purple-600/20 pointer-events-none absolute -z-10`) positioned safely outside the reading column on large viewports (`hidden xl:block`).

---

## 2. Corner-by-Corner Visual Specification & Layout

```
+-----------------------------------------------------------------------------------------+
| [Member Dock]  BLOGS                                                   [Bell(3)]  [User]|
|                Stories From Our Family                                                  |
|                                                                                         |
|  [ ACTIVITY ] (Category Pill Badge)                                                     |
|                                                                                         |
|  (<) (Circular Back Button)                                                             |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                                                                                   |  |
|  |                                  [ IMENA EMBLEM ]                                 |  |
|  |                         or High-Res Reunion Featured Photo                        |  |
|  |                                                                                   |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                           (\ Party Horn |
|  A HEART-WARMING FAMILY REUNION: EMBRACING TOGETHERNESS !                 |  Doodle     |
|  EMBARKING CHERISHED MOMENTS TOGETHER                                                   |
|                                                                                         |
|  "Amidst the hustle and bustle of our daily lives, this family reunion serves as a     |
|   reminder of the importance of taking a pause and relishing the company of those..."   |
|                                                                                         |
|  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque         |
|  volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh viverra   |
|  non semper suscipit posuere a pede.                                                    |
|                                                                                         |
|  Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet      |
|  orci. Aenean dignissim pellentesque felis.                                             |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                                                                                   |  |
|  |                       [ INLINE REUNION PHOTO / MEDIA GALLERY ]                    |  |
|  |                                                                                   |  |
|  +-----------------------------------------------------------------------------------+  |
|  / Party Horn                                                                           |
|  | Doodle                                                                               |
|  Amidst the hustle and bustle of our daily lives, this family reunion serves as a       |
|  reminder of the importance of taking a pause and relishing the company of those...     |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  | [Avatar]  NGABE                  [❤️ 48]  [💬 12]  [🔖 Save]            [📤 Share]  |  |
|  |           May 31, 2026 • 6 min read                                               |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
|                          Our History. Our Family. Our Future.                           |
|                    © Copyright 2026, All Rights Reserved by IMENA FAMILY.               |
+-----------------------------------------------------------------------------------------+
```

### Corner 1: Header & Context Navigation

- **Header**: Standard member `<PageHeader title="BLOGS" subtitle="Stories From Our Family" />`.
- **Category Badge**: Pill badge positioned above content:
  - Classes: `inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand text-surface shadow-xs`.
- **Back Button**:
  - Markup: `<Link href={ROUTES.BLOGS} className="group inline-flex items-center justify-center size-10 rounded-full border border-brand/40 text-brand hover:bg-brand/10 hover:border-brand transition-colors focus-visible:outline-brand">`.
  - Icon: `<ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />`.

### Corner 2: Featured Hero Image Block (`ArticleHero.tsx`)

- Container: `relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 bg-stone-100 dark:bg-stone-900 shadow-sm`.
- Centered Emblem / Hero Photo:
  - If cover image exists: Next.js `<Image src={post.cover} alt={post.coverAlt} fill priority className="object-cover" sizes="(min-width: 1200px) 960px, 100vw" />`.
  - If emblem mode: centered IMENA crest with soft ambient radial glow (`from-brand/10 via-transparent to-transparent`).

### Corner 3: Editorial Headline & Lead Text (`ArticleHeader.tsx`)

- **Headline**:
  - Tag: `<h1>`.
  - Typography: `font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-member-ink uppercase leading-tight mt-6 sm:mt-8`.
- **Lead Excerpt**:
  - Styled with typographic distinction: `text-lg sm:text-xl font-medium text-stone-700 dark:text-stone-300 leading-relaxed mt-4 sm:mt-6 border-l-4 border-brand pl-4 py-0.5`.

### Corner 4: Story Body & Inline Media Block (`ArticleBody.tsx`)

- **Prose Container**: Max measure optimized for reading ergonomics: `mx-auto max-w-3xl space-y-6 text-stone-700 dark:text-stone-300 text-base sm:text-lg leading-relaxed font-body`.
- **Inline Media Block**:
  - Container: `relative my-8 sm:my-10 w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 bg-stone-200/60 dark:bg-stone-800 shadow-xs`.
  - Caption: Optional subtle photo credit or caption in `text-xs sm:text-sm text-stone-500 italic text-center mt-2`.

### Corner 5: Author & Social Share Bar (`ArticleAuthorBar.tsx`)

- Container: `flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6 mt-12`.
- Left Side:
  - Author Avatar: `size-12 rounded-full overflow-hidden border border-brand/20 shadow-xs`.
  - Author Details:
    - Author Name: `text-sm sm:text-base font-bold uppercase text-stone-900 dark:text-stone-100 tracking-wide`.
    - Date & Read Time: `text-xs text-stone-500 dark:text-stone-400 mt-0.5`.
- Right Side (Engagement & Share):
  - Like Counter Button (`Heart` icon + count, active state).
  - Share Button (`Send` or `Share2` icon button) triggering link copy with feedback toast.

### Corner 6: Whimsical Celebration Atmosphere (`CelebrationOrnaments.tsx`)

- Subtle celebratory party poppers / horns floating in the outer margins:
  - Left doodle: `-left-12 top-1/2 -translate-y-1/2 size-24 -rotate-12 text-purple-300/30 dark:text-purple-600/20`.
  - Right doodle: `-right-12 top-1/4 size-24 rotate-12 text-purple-300/30 dark:text-purple-600/20`.
  - Hidden on mobile to avoid layout crowding (`hidden xl:block`).

### Corner 7: Footer & Tagline

- `<FamilyTagline className="mt-16 sm:mt-24" />`
- Copyright bar: `text-center text-xs text-stone-400 py-6 border-t border-border/40 mt-6`.

---

## 3. Data Model & Types (`src/features/blogs/types.ts`)

```typescript
export interface BlogAuthor {
  id: string;
  name: string; // e.g., "NGABE"
  role?: string; // e.g., "Family Historian & Youth Lead"
  subfamily?: string; // e.g., "Wihogora Family"
  avatar: string; // image path or StaticImageData
}

export interface BlogArticleDetail {
  slug: string;
  title: string;
  category:
    | "Activity"
    | "Celebrations"
    | "Family Gatherings"
    | "Remembering (Kwibuka)"
    | "Visits"
    | "Milestones";
  publishedAt: string; // e.g., "May 31, 2026"
  readMinutes: number;
  author: BlogAuthor;
  coverImage?: string; // or StaticImageData
  coverAlt: string;
  excerpt: string;
  contentParagraphs: string[];
  secondaryImage?: string; // or StaticImageData
  secondaryImageCaption?: string;
  likes: number;
  commentsCount: number;
}
```

---

## 4. File Structure & Component Plan

```
src/
├── app/
│   └── (member)/
│       └── blogs/
│           ├── page.tsx                         <-- Blogs Index (Existing)
│           └── [slug]/
│               └── page.tsx                     <-- NEW: Article Detail Page
└── features/
    └── blogs/
        ├── components/
        │   ├── BlogsHome.tsx                    <-- Existing Index view
        │   ├── BlogCard.tsx                     <-- Existing Card component
        │   ├── ArticleDetailView.tsx            <-- Main Single Article Container
        │   ├── ArticleHeader.tsx                <-- Category Pill + Back Button + Title
        │   ├── ArticleHeroMedia.tsx             <-- Hero image / IMENA coat-of-arms crest
        │   ├── ArticleBody.tsx                  <-- Structured prose + inline secondary media
        │   ├── ArticleAuthorBar.tsx             <-- Author bio, date, likes, and share button
        │   └── CelebrationOrnaments.tsx         <-- Floating party horns / confetti doodles
        ├── data.ts                              <-- Extended with full article mock data & helper
        └── types.ts                             <-- Shared interfaces for blogs & articles
```

---

## 5. Implementation Checklist for Claude

1. **Route Implementation**:
   - Create `src/app/(member)/blogs/[slug]/page.tsx`.
   - Export `generateStaticParams()` matching all slugs in `BLOG_PAGE_POSTS` for instant SSG.
   - Set up dynamic metadata generation (`generateMetadata()`) for accurate titles and OpenGraph tags.

2. **Data Layer Expansion**:
   - Create helper `getArticleBySlug(slug: string)` in `src/features/blogs/data.ts`.
   - Ensure the featured post `a-heart-warming-family-reunion` contains complete paragraph content matching the design mockup, author details for **NGABE**, and May 31, 2026 date.

3. **Component Construction**:
   - Build `ArticleHeader.tsx` with circular outline back button (`<ChevronLeft />`) and category pill (`ACTIVITY`).
   - Build `ArticleHeroMedia.tsx` supporting both photographic covers and the official IMENA crest layout.
   - Build `ArticleBody.tsx` with optimal typography (`max-w-3xl mx-auto`), paragraph spacing, and the secondary media showcase container.
   - Build `ArticleAuthorBar.tsx` with author avatar, name, date, interactive Like state, and Share action with clipboard copy toast.
   - Build `CelebrationOrnaments.tsx` for celebratory decorative line-art in the outer margins.

4. **Interactive Polish & UX**:
   - Provide copy-to-clipboard functionality with a brief visual toast (`"Article link copied to clipboard!"`).
   - Back button should safely route to `/blogs`.
   - Keyboard accessible back button with focus rings.

5. **Quality & Standard Compliance**:
   - `pnpm typecheck` must pass with 0 errors.
   - `pnpm lint` must pass with 0 warnings.
   - Fully responsive on mobile (375px), tablet (768px), and desktop (1280px+).
