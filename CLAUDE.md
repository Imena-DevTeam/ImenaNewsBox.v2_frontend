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
   - The user noted: _"slack have container opened when u click on a pdf ... some small container .... that come in front .... not like this thing behind"_.
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

## 8. Family Birthdays Page (`/birthdays`) — Implementation Blueprint & Visual Design Specifications

This section defines the exact visual design, component tree, layout structure, and interaction behavior for the **Family Birthdays Page** (`/birthdays`) based on the design export.

### A. Route & Component Architecture

1. **Page Entry Point**:
   - `src/app/(member)/birthdays/page.tsx`
   - Metadata title: `"Family Birthdays"`
   - Renders a clean, single-column container: `max-w-5xl mx-auto flex flex-col gap-6 pb-24`
   - Uses `PageHeader` with Cake icon badge and renders `<FamilyCelebrationsCalendar />`.

2. **Core Feature Components**:
   - `src/features/birthdays/components/FamilyCelebrationsCalendar.tsx` (Main interactive calendar, month selector, spotlight card, and staggered celebrants grid)
   - `src/features/birthdays/components/WishDialog.tsx` (Accessible dialog for sending warm birthday wishes with confetti)
   - `src/components/layout/PageHeader.tsx` (Member page header supporting circular icon badge and member actions)

---

### B. Visual Breakdown & Layout Specifications

#### 1. Header Bar (`PageHeader.tsx`)

- **Top Left Badge**:
  - Circular badge container: `size-14 sm:size-16 rounded-full border border-member-border/40 bg-white shadow-menu flex flex-col items-center justify-center p-1 text-purple-600`
  - Icon: `<Cake className="size-6 text-[#581C87]" />`
  - Sub-label: `"Birthdays"` (`text-[10px] font-semibold text-neutral-600 leading-tight`)
- **Main Title**:
  - `BIRTHDAYS` in bold uppercase sans-serif (`text-page-title-m md:text-page-title font-extrabold tracking-tight uppercase text-text`).
- **Top Right Actions**:
  - `<NotificationBell />` (with active unread indicator dot).
  - Member Avatar Link: Circular link to `/profile` with portrait photo (`elder3`).

#### 2. Subtitle & Section Kicker

- **Centered Subtitle**:
  - `"Celebrating life, joy and the growth of our brothers and sisters across all subfamilies"`
  - Styling: `text-center text-sm sm:text-base font-normal text-neutral-600 max-w-2xl mx-auto mt-2`
- **Section Kicker**:
  - `"CALENDAR HORIZON"`
  - Styling: `text-center text-xs font-bold uppercase tracking-widest text-[#7C3AED] mt-8 mb-2`

#### 3. Month Filter Bar & Counter

- **Counter Bar (Right-Aligned)**:
  - Text: `"{count} Birthdays in {selectedMonth}"` (e.g. `8 Birthdays in March`)
  - Styling: `text-sm sm:text-base font-bold text-neutral-800 text-right mt-6 mb-2`
- **Month Pills Bar**:
  - Scrollable/flex row: `flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none`
  - All 12 months: `Jan`, `Feb`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`.
  - **Active Month Pill**:
    - Styling: `bg-[#4338CA] text-white shadow-md ring-2 ring-[#4338CA]/20 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2`
    - Displays: `Month Name` + white dot separator (`size-1.5 rounded-full bg-white`) + birthday count number (e.g., `March • 8`).
  - **Inactive Month Pills**:
    - Styling: `bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] rounded-full px-5 py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all`
    - Months with notable celebrants show count in parentheses (e.g., `April (5)`).

#### 4. Spotlight Hero Card ("TODAY'S FAMILY BIRTHDAY!")

- **Card Container**:
  - `w-full max-w-xl mx-auto bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm my-8`
- **Top Bar**:
  - Left Kicker: `🎉 TODAY'S FAMILY BIRTHDAY!` (`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600` with pink `<Sparkles className="size-3.5 text-pink-500" />`).
  - Right Badges:
    - Date Pill: `Jan 01` (`bg-neutral-100 text-neutral-600 rounded-full px-3 py-0.5 text-xs font-medium`).
    - Subfamily Pill: `LIGHT FAMILY` (`bg-[#E9D5FF] text-[#6B21A8] rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider`).
- **Middle Section**:
  - Celebrant Avatar:
    - Photo: `elder2` (`Bigwi`), rounded-2xl container (`size-16 sm:size-18 overflow-hidden rounded-2xl shadow-sm`).
    - Violet Status Indicator: Small dot overlapping top-right corner (`size-3.5 bg-violet-600 rounded-full ring-2 ring-white absolute -top-1 -right-1`).
  - Celebrant Details:
    - Name: `Bigwi` (`text-xl sm:text-2xl font-extrabold text-neutral-900`).
    - Subtitle: `Turned 16 today 🎉` (`text-xs sm:text-sm font-medium text-neutral-500 flex items-center gap-1.5`).
- **Bottom Action**:
  - Full-width button: `"Send Warm Family Wish"`
  - Styling: `w-full rounded-xl bg-[#3B2883] hover:bg-[#311f70] text-white py-3 px-6 text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer`.
  - Interaction: Opens `WishDialog` targeting Bigwi (`{ name: "Bigwi", subfamily: "Light" }`).

#### 5. Staggered Birthday Cards Constellation

- **Constellation Grid Layout**:
  - The celebrant cards are distributed across the page in an organic, staggered formation:
    - Row 1: Left card (`justify-self-start sm:ml-4 md:ml-10`), Right card (`justify-self-end sm:mr-4 md:mr-16`)
    - Row 2: Center card (`justify-self-center`)
    - Row 3: Left card (`justify-self-start sm:ml-2 md:ml-6`), Right card (`justify-self-end sm:mr-8 md:mr-24`)
    - Row 4: Left card (`justify-self-start sm:ml-6 md:ml-14`)
    - Row 5: Center-Right card (`justify-self-center md:translate-x-12`), Right card (`justify-self-end sm:mr-6 md:mr-20`)
- **Card Specifications**:
  - Dimensions & Surface: `w-full max-w-xs bg-white rounded-2xl border border-neutral-100 p-2.5 sm:p-3 shadow-sm flex items-center gap-3 transition-transform hover:-translate-y-0.5`.
  - **Date Block (Left)**:
    - Container: `bg-neutral-100/90 rounded-xl px-2 py-1.5 text-center shrink-0 min-w-[44px] flex flex-col items-center justify-center`
    - Month: `MAR` (`text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none`)
    - Day: `30` (`text-base font-extrabold text-neutral-900 leading-tight`)
  - **Avatar**:
    - `size-10 sm:size-11 rounded-xl overflow-hidden shrink-0` with portrait image (`elder1.webp`, object-cover).
  - **Information (Center)**:
    - Name: `Divine Kaneza` (`text-sm font-bold text-neutral-900 truncate`).
    - Subfamily Badge: Pill with pink background `bg-pink-100 text-pink-600 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider` + separator dot `•`.
    - Role: `Vice-Coordinator` (`text-[11px] text-neutral-400 truncate mt-0.5`).
  - **Heart Action Button (Right)**:
    - Container: `size-8 shrink-0 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer`
    - Icon: `<Heart className="size-4" />`
    - Interaction: Opens `WishDialog` targeting the selected celebrant.

---

### C. Wish Sending Flow (`WishDialog.tsx`)

1. Accessible `<dialog>` modal with backdrop overlay.
2. Form with preset family messages or custom textarea with 280-character limit counter.
3. Upon submit:
   - Triggers `canvas-confetti` celebration burst with official family colors (`#5935da`, `#bfa3d3`, `#f26493`, `#f2c14e`, `#ffffff`).
   - Persists wish confirmation on the local device without artificial failure states.
   - Smoothly auto-closes or resets state.

---

### D. Verification Checklist for Claude Code

1. Verify layout against uploaded mockup:
   - Header: cake icon badge + "Birthdays" + uppercase "BIRTHDAYS" title.
   - Centered subtitle + "CALENDAR HORIZON" kicker.
   - Right-aligned "8 Birthdays in March".
   - Active month pill is royal purple with count (`March • 8`).
   - "TODAY'S FAMILY BIRTHDAY!" spotlight card is centered with Bigwi's portrait, purple status dot, and "Send Warm Family Wish" button.
   - Staggered cards constellation flows across left, center, and right.
2. Clicking "Send Warm Family Wish" or any card's heart button opens the `WishDialog`.
3. Selecting a different month (e.g. April) updates the counter and filters the cards.
4. Run `pnpm typecheck` (`tsc --noEmit`) — MUST exit with 0 errors.
5. Run `pnpm lint` (`eslint .`) — MUST exit with 0 errors and 0 warnings.
6. Run `pnpm format:check` (`prettier --check .`) — MUST be 100% compliant.
7. Run `pnpm test` (`vitest run`) — all test suites must pass.
8. **DO NOT run `git commit` or `git push` unless explicitly asked by the user.**

---

## 9. UI/UX Audit — Issues Found Across the Frontend

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

---

## 10. Gap Analysis vs. "IMENA Frontend Project Structure" (PDF v1.0) & Implementation Roadmap

Source: `IMENA-Frontend-Project-Structure.pdf` (v1.0, 15 Oct 2026, 15 pages). That PDF is the original plan. The codebase has moved on since then, so this section says **what exists, what is missing, and the order to build the missing parts**. It is written so any developer or AI agent can pick up a level and implement it without asking.

### 10.0 Precedence rules (read first)

When the PDF and the codebase disagree, follow this order:

1. **The code wins for anything already built and shipped.** Do not rename routes, fonts or colours that exist.
   - Routes: the public tree is `/family-tree`, the member tree is `/tree`, and the member gallery is `/gallery`. The PDF's `/member/gallery` and member-only `/family-tree` are **not** used.
   - Fonts: Roboto (headings) and Nunito Sans (body) in the root layout. Member pages also load Poppins and Playfair, and auth pages load Bricolage, Instrument and Jost, each in its own layout. The PDF's single Lato font is **not** used.
   - Colours: `src/styles/globals.css` `@theme` is the source of truth. `--color-primary` is `#0d1aba`; the PDF's violet `#5935DA` already exists as `--color-brand`, and the member and auth frames use it.
   - Typography tokens: use the existing `text-display`, `text-h1`…`text-h4`, their `-m` mobile variants, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption` and `text-ui`.
2. **The PDF wins for anything not built yet**: the admin panel, subfamily pages, the services layer, shared UI primitives, types, the API client and role-based access.
3. **The PDF's folder rules always apply**:
   - `app/` holds thin pages only.
   - A feature never imports from another feature. Compose features in the page file, the way `dashboard/page.tsx` does.
   - `components/ui` has no business logic and makes no API calls.
   - `store/` holds UI state only. Server data lives in TanStack Query.
   - No hard-coded paths outside `constants/`.
4. **The anti-"AI slop" rules in §2 apply to every new screen.** Without a Figma frame, build the plainest version that follows the existing member design language (white cards, `border-member-border`, `rounded-2xl`, `shadow-menu`, `bg-brand` primary actions) and do not invent decorative extras.
5. Motion: import `{ m } from "motion/react"`, never `{ motion }`, because `LazyMotion strict` will crash.

### 10.1 Status legend

| Mark       | Meaning                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------- |
| ✅ DONE    | Built and matches the PDF's intent, sometimes under a different file name                   |
| 🟡 PARTIAL | Exists but is missing something the PDF requires                                            |
| ❌ MISSING | Not in the codebase. Build it at the level shown                                            |
| ⏭️ COVERED | The PDF names a file that the code covers under another name. **Do not create a duplicate** |

### 10.2 Page & route inventory (the PDF's 18 pages)

| #   | Page              | PDF route                 | Actual route / file                                  | Status                                                                                 | Level |
| --- | ----------------- | ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- | ----- |
| 1   | Home              | `/`                       | `src/app/(public)/page.tsx`                          | ✅ DONE                                                                                | —     |
| 2   | Our Story         | `/our-story`              | `src/app/(public)/our-story/page.tsx`                | ✅ DONE                                                                                | —     |
| 3   | Public Gallery    | `/gallery` (guest)        | `/gallery` is **member-only** (`(member)/gallery`)   | 🟡 PARTIAL. No guest gallery. See open decision D1                                     | L8    |
| 4   | Member Home       | `/dashboard`              | `src/app/(member)/dashboard/page.tsx`                | ✅ DONE                                                                                | —     |
| 5   | Gallery (full)    | `/member/gallery`         | `/gallery` and `/gallery/[album]`                    | ✅ DONE (different URL, keep it)                                                       | —     |
| 6   | Birthdays         | `/birthdays`              | `src/app/(member)/birthdays/page.tsx`                | ✅ DONE                                                                                | —     |
| 7   | Family Tree       | `/family-tree` (member)   | `/family-tree` (public) and `/tree` (member)         | ✅ DONE (split, keep it)                                                               | —     |
| 8   | Resources         | `/resources`              | `src/app/(member)/resources/page.tsx`                | ✅ DONE                                                                                | —     |
| 9   | Blogs             | `/blogs`, `/blogs/[slug]` | both exist                                           | 🟡 PARTIAL. No comments; likes are stored on the device only                           | L6    |
| 10  | Wihogora Family   | `/families/wihogora`      | —                                                    | ❌ MISSING                                                                             | L5    |
| 11  | Light Family      | `/families/light`         | —                                                    | ❌ MISSING                                                                             | L5    |
| 12  | Hope Family       | `/families/hope`          | —                                                    | ❌ MISSING                                                                             | L5    |
| 13  | Login             | `/login`, `/admin/login`  | both exist under `(auth)`                            | ✅ DONE (the admin flow is a UI stub)                                                  | L3    |
| 14  | Member Sign Up    | `/signup`, `/verify`      | `/signup` is in `(public)`; `/verify` is in `(auth)` | 🟡 PARTIAL. The form is inline in the page with no Zod schema and nothing is submitted | L3    |
| 15  | Admin Dashboard   | `/admin`                  | —                                                    | ❌ MISSING                                                                             | L7    |
| 16  | Manage Posts      | `/admin/posts`            | —                                                    | ❌ MISSING                                                                             | L7    |
| 17  | Create Album      | `/admin/albums/new`       | —                                                    | ❌ MISSING                                                                             | L7    |
| 18  | Add Family Member | `/admin/members/new`      | —                                                    | ❌ MISSING                                                                             | L7    |
| —   | Auth.js handler   | `/api/auth/[...nextauth]` | —                                                    | ❌ MISSING (only once a backend exists)                                                | L3b   |
| —   | Profile           | not in PDF                | `/profile`                                           | ✅ DONE (extra page)                                                                   | —     |

### 10.3 File-level gap table

#### `src/components/ui/`

| PDF file           | Status                        | Notes                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button.tsx`       | ✅ DONE                       | Variants are `primary`, `outline`, `light` and `brand`; the PDF's `ghost` is missing. Add `ghost` (`bg-transparent text-text hover:bg-band`) and a `loading` prop (spinner and `aria-busy`, disables the button)                                                                                                                                          |
| `SectionTitle.tsx` | ✅ DONE                       | —                                                                                                                                                                                                                                                                                                                                                         |
| `Input.tsx`        | ⏭️ COVERED by `TextField.tsx` | Do not create `Input.tsx`; keep `TextField`                                                                                                                                                                                                                                                                                                               |
| `Label.tsx`        | ❌ MISSING                    | L2                                                                                                                                                                                                                                                                                                                                                        |
| `Textarea.tsx`     | ❌ MISSING                    | L2 (admin post editor, comments, add member)                                                                                                                                                                                                                                                                                                              |
| `Select.tsx`       | ❌ MISSING                    | L2 (subfamily and promotion pickers; `signup/page.tsx` has an ad-hoc one to replace)                                                                                                                                                                                                                                                                      |
| `Card.tsx`         | ❌ MISSING                    | L2                                                                                                                                                                                                                                                                                                                                                        |
| `Badge.tsx`        | 🟡 PARTIAL                    | `SubfamilyBadge.tsx` exists. Add a generic `Badge` and leave `SubfamilyBadge` alone (it may wrap `Badge`)                                                                                                                                                                                                                                                 |
| `Avatar.tsx`       | ❌ MISSING                    | L2. Many components use inline `<Image className="rounded-full">`; new code uses `Avatar`                                                                                                                                                                                                                                                                 |
| `Modal.tsx`        | ❌ MISSING                    | L2. Pull the portal, z-index, Escape and backdrop logic out of `PdfViewerModal.tsx` and `WishDialog.tsx` into it                                                                                                                                                                                                                                          |
| `Tabs.tsx`         | ❌ MISSING                    | L2                                                                                                                                                                                                                                                                                                                                                        |
| `Dropdown.tsx`     | ❌ MISSING                    | L2 (the posts table row menu; the U8 resources "more" menu)                                                                                                                                                                                                                                                                                               |
| `Skeleton.tsx`     | ✅ DONE                       | Exports `Skeleton`, `SkeletonText` and `SkeletonPage`. Uses the `skeleton` shimmer utility in `globals.css`, which stays still under reduced motion. Every member route, `/gallery/[album]` and `/family-tree` has a `loading.tsx` that renders a page-shaped skeleton from its feature (`*Skeleton.tsx`); `PageHeaderSkeleton` is in `components/layout` |
| `Spinner.tsx`      | ❌ MISSING                    | L2                                                                                                                                                                                                                                                                                                                                                        |
| `EmptyState.tsx`   | 🟡 PARTIAL                    | `empty-testimonial.tsx` is a showcase component. Add a plain `EmptyState`                                                                                                                                                                                                                                                                                 |

#### `src/components/layout/`

| PDF file                                                   | Status     | Notes                                                                                                                  |
| ---------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Navbar.tsx`, `NavLink.tsx`, `Footer.tsx`, `Container.tsx` | ✅ DONE    | —                                                                                                                      |
| `AppHeader.tsx`                                            | ⏭️ COVERED | Covered by `PageHeader.tsx` (title, bell, avatar), `MemberSidebar.tsx` (dock) and `MemberFooter.tsx`. Do not create it |
| `AdminSidebar.tsx`                                         | ❌ MISSING | L7                                                                                                                     |

#### `src/lib/`

| PDF file          | Status     | Notes                                                                                                          |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `cn.ts`           | ✅ DONE    | —                                                                                                              |
| `api-client.ts`   | ❌ MISSING | L1                                                                                                             |
| `query-client.ts` | ❌ MISSING | L1 (`@tanstack/react-query` is installed but has no provider)                                                  |
| `format-date.ts`  | ❌ MISSING | L1. Date helpers are scattered: `timeAgo` in `lib/notifications.ts` and `formatPhotoDate` in `gallery/data.ts` |
| `auth.ts`         | ❌ MISSING | L3b (Auth.js). For now, `lib/session.ts` (an HMAC cookie) does this job                                        |

#### `src/services/`

These files are all ❌ MISSING (the folder is empty) and are built at L4: `posts.service.ts`, `members.service.ts`, `albums.service.ts`, `families.service.ts`, `birthdays.service.ts` and `resources.service.ts`.

#### `src/hooks/`

| PDF file                                                                                       | Status     | Notes                                       |
| ---------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------- |
| `useMediaQuery.ts`                                                                             | ❌ MISSING | L1                                          |
| `useDebounce.ts`                                                                               | ❌ MISSING | L1. Resources and blog search should use it |
| `useRole.ts`                                                                                   | ❌ MISSING | L3                                          |
| (extra) `useNow`, `useReducedMotion`, `useDocumentVisible`, `useSearchQuery`, `useStoredValue` | ✅         | Keep                                        |

#### Other folders

| Folder           | PDF file                                                  | Status     | Notes                                                     |
| ---------------- | --------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| `src/store/`     | `ui.store.ts`                                             | ❌ MISSING | L1. Zustand is installed but unused                       |
| `src/types/`     | `member.ts`, `family.ts`, `post.ts`, `album.ts`, `api.ts` | ❌ MISSING | L1. The folder is empty; types live inside features today |
| `src/constants/` | `routes.ts`, `nav.ts`                                     | ✅ DONE    | Extend both at L1                                         |
| `src/constants/` | `roles.ts`                                                | ❌ MISSING | L1                                                        |

#### `src/features/`

| PDF component                                                                                                            | Status       | Actual file / action                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| auth `LoginForm`, `OtpInput`, `GoogleButton`                                                                             | ✅           | exist                                                                                                                                                             |
| auth `RoleSwitch`                                                                                                        | ⏭️           | `AuthSwitch.tsx`                                                                                                                                                  |
| auth `SignupForm`                                                                                                        | ❌ L3        | Move the form out of `src/app/(public)/signup/page.tsx` into `features/auth/components/SignupForm.tsx` and add `signupSchema` to `features/auth/schemas.ts`       |
| auth `hooks/useResendTimer`                                                                                              | ⏭️           | `hooks/useCountdown.ts`                                                                                                                                           |
| landing (all eight components)                                                                                           | ✅           | `FinalCta` is covered by `StoryCta.tsx`                                                                                                                           |
| story `StoryIntro`, `Slogans`, `StatsStrip`                                                                              | ✅           | exist                                                                                                                                                             |
| family-tree `TreeCanvas`, `RootNodeCard`, `SubfamilyBranch`, `ParentCard`, `ChildCard`, `BranchStats`, `utils/buildTree` | ⏭️           | The folder is called `features/tree/`. `TreeCanvas`, `MemberCard`, `HierarchyRoleCard`, `TreeHierarchyGrid` and `branch.ts` cover these. Do not rename the folder |
| family-tree `api.ts`                                                                                                     | ❌ L4        | Replace it with the `members.service` and `families.service` hooks                                                                                                |
| families `SubfamilyHeader`, `SloganCallout`                                                                              | ❌ L5        | `families/components/SubFamilyTrinity.tsx` already exists                                                                                                         |
| gallery `AlbumGrid`, `Lightbox`                                                                                          | ✅           | exist                                                                                                                                                             |
| gallery `PhotoGrid`                                                                                                      | ⏭️           | `AlbumView.tsx`                                                                                                                                                   |
| blogs `PostCard`, `PostList`, `PostDetail`                                                                               | ⏭️           | `BlogCard`, `BlogsHome`, `ArticleDetailView`                                                                                                                      |
| blogs `CommentList`, `CommentForm`, `LikeButton`                                                                         | ❌ L6        | —                                                                                                                                                                 |
| blogs `hooks/usePosts`, `useComments`, `useLike`                                                                         | ❌ L4 and L6 | `blogs/hooks/` contains only a `.gitkeep`                                                                                                                         |
| birthdays `BirthdayList`, `BirthdayCard`                                                                                 | ⏭️           | `FamilyCelebrationsCalendar`, `BirthdaysPanel`                                                                                                                    |
| resources `ResourceList`, `ResourceItem`                                                                                 | ⏭️           | `ResourcesBrowser`, `ResourceCard`, `ResourceListItem`                                                                                                            |
| dashboard `WelcomePanel`                                                                                                 | ⏭️           | `DashboardGreeting`, `DashboardHeader`                                                                                                                            |
| dashboard `QuickLinks`, `UpdatesFeed`                                                                                    | ⏭️           | Not in the shipped dashboard design, and the dock covers quick links. **Do not add** unless a Figma frame shows them                                              |
| admin `StatsOverview`, `PostEditor`, `PostsTable`, `AlbumForm`, `UploadDropzone`, `AddMemberForm`                        | ❌ L7        | The folder contains only a `.gitkeep`                                                                                                                             |

### 10.4 Open decisions (ask the user; until answered, use the default)

| ID  | Question                                                                                                                                                                      | Default until answered                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | The PDF lists a **guest** Public Gallery at `/gallery`, but `/gallery` is a member page. Should guests get a curated public gallery?                                          | Leave it out. If approved, add `src/app/(public)/moments/page.tsx` (route `ROUTES.PUBLIC_GALLERY = "/moments"`) showing only albums flagged `isPublic`, and leave `/gallery` member-only |
| D2  | Which subfamilies are canonical? The README and PDF say **Wihogora, Light, Hope**. `tree/types.ts` adds **Sanctuary**, and `tree/data.ts` uses **Mutako, Inyenyeri, Urumuri** | Use `wihogora`, `light` and `hope` in all new code (`SubfamilySlug`). Leave the existing tree data alone                                                                                 |
| D3  | The backend API contract (paths and JSON shapes) is not published                                                                                                             | Use the contract in §10.5 L4 and keep every service behind mock mode                                                                                                                     |

### 10.5 Implementation levels (build strictly in this order)

Each level depends on the ones above it. Finish a level, run the gate (§10.7), then move on. Levels L0–L2 have no visible UI change.

```
L0  Tooling unblock ............................ do first
L1  Foundation: types, constants, lib, hooks, store, providers
L2  Shared UI primitives (components/ui)
L3  Auth & roles (role-carrying session, admin guard, signup form)
L4  Services layer + mock mode + TanStack Query hooks
L5  Subfamily pages /families/[slug]
L6  Blog interactions (likes via API, comments)
L7  Admin panel (/admin, posts, albums/new, members/new)
L8  Open-decision features (public gallery D1), §9 audit P2/P3 leftovers
L9  Real data switch-over + remove sample notes (§9 U17)
L10 End-to-end tests (tests/*.spec.ts)
```

---

#### L0 — Tooling unblock

- **Problem:** `vitest run` fails at startup with `Cannot find module '@rolldown/binding-wasm32-wasi'`. `node_modules` was installed on a different OS; the repo sits on a shared NTFS drive.
- **Fix:** from the repo root, run `rm -rf node_modules && pnpm install`. If `pnpm` is not on PATH, run `corepack enable` or `npm i -g pnpm@12` first.
- **Done when:** `pnpm test`, `pnpm lint`, `pnpm typecheck` and `pnpm format:check` all exit 0.

---

#### L1 — Foundation

**1. `src/types/`** mirrors backend models. Use string URLs for images, not `StaticImageData`; mock adapters convert local imports with `.src`.

```ts
// src/types/api.ts
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export interface ApiErrorBody {
  message: string;
  code?: string;
  fields?: Record<string, string>;
}

// src/types/family.ts
export const SUBFAMILY_SLUGS = ["wihogora", "light", "hope"] as const;
export type SubfamilySlug = (typeof SUBFAMILY_SLUGS)[number];
export interface Family {
  slug: SubfamilySlug;
  name: string;
  motto: string;
  mottoMeaning: string;
  holds: string;
  leader: string;
  memberCount: number;
  imageUrl: string;
}

// src/types/member.ts
import type { Role } from "@/constants/roles";
import type { SubfamilySlug } from "./family";
export interface Member {
  id: string;
  name: string;
  email?: string;
  role: Role;
  subfamily: SubfamilySlug;
  promotion: string; // "2025-2026"
  roleLabel?: string; // "Grand Père", "Vice-Coordinator"
  avatarUrl?: string;
  birthday?: string; // ISO "YYYY-MM-DD"
}

// src/types/post.ts
export type PostStatus = "draft" | "published";
export interface PostAuthor {
  id: string;
  name: string;
  roleLabel: string;
  subfamily: SubfamilySlug;
  avatarUrl?: string;
}
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string;
  coverUrl?: string;
  coverAlt: string;
  body: string[]; // paragraphs
  author: PostAuthor;
  publishedAt: string;
  readMinutes: number;
  likes: number;
  likedByMe: boolean;
  commentsCount: number;
  status: PostStatus;
}
export interface Comment {
  id: string;
  postId: string;
  author: PostAuthor;
  body: string;
  createdAt: string;
}

// src/types/album.ts
export interface Photo {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  takenAt?: string;
}
export interface Album {
  id: string;
  slug: string;
  title: string;
  description?: string;
  coverUrl: string;
  date: string;
  photoCount: number;
  photos?: Photo[];
  isPublic?: boolean;
}

// src/types/index.ts  -> re-export everything above
```

**2. `src/constants/roles.ts`**

```ts
export const ROLES = { MEMBER: "member", ADMIN: "admin" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];
```

**3. `src/constants/routes.ts`**: add the following without changing existing keys:

```ts
FAMILIES: "/families",
ADMIN: "/admin",
ADMIN_POSTS: "/admin/posts",
ADMIN_ALBUMS_NEW: "/admin/albums/new",
ADMIN_MEMBERS_NEW: "/admin/members/new",
```

Also add a helper next to it: `export const familyRoute = (slug: SubfamilySlug) => \`${ROUTES.FAMILIES}/${slug}\`;`

**4. `src/constants/nav.ts`**: add `ADMIN_NAV: NavItem[]` (Dashboard → `/admin`, Posts → `/admin/posts`, New album → `/admin/albums/new`, Add member → `/admin/members/new`, then "Back to member site" → `/dashboard`). Rename the footer label "Archive" to "Blogs" (§9 U11).

**5. `src/lib/api-client.ts`**

- `export class ApiError extends Error { status: number; body?: ApiErrorBody }`
- `export const api = { get<T>(path, init?), post<T>(path, body?, init?), put<T>, patch<T>, delete<T> }`
- Base URL: `process.env.NEXT_PUBLIC_API_URL`, with no trailing slash.
- Headers: `Content-Type: application/json` and `Accept: application/json`. Send `credentials: "include"`.
- On the server (`typeof window === "undefined"`), accept an optional `token` in `init` and send it as `Authorization: Bearer …`.
- On a non-2xx response, parse the JSON body if possible and throw `ApiError`. A 204 response returns `undefined as T`.
- `export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true" || !process.env.NEXT_PUBLIC_API_URL;`
- Add `NEXT_PUBLIC_USE_MOCKS=true` to `.env.example` and to the README env table.

**6. `src/lib/query-client.ts`** and a provider

- `makeQueryClient()` returns `new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } })`.
- `getQueryClient()` returns a new client on the server for each request and one singleton in the browser (the standard TanStack and Next App Router pattern).
- Create `src/components/providers/QueryProvider.tsx` (`"use client"`). It wraps `QueryClientProvider` and renders `ReactQueryDevtools` only when `process.env.NODE_ENV === "development"`.
- Mount it in `src/app/layout.tsx` inside `<MotionProvider>`.

**7. `src/lib/format-date.ts`**

- Exports `formatDate(iso, style: "long" | "short" = "long")`, which gives `"12 March 2026"` or `"12 Mar"`.
- Exports `formatMonthDay(iso)`, which gives `{ month: "MAR", day: "30" }`.
- Exports `timeAgo(iso, now?)`, moved from `lib/notifications.ts`; re-export it there so existing imports keep working.
- Use `Intl.DateTimeFormat("en-GB", …)` with a fixed `timeZone: "Africa/Kigali"` so the server and client agree (this avoids the §9 U14 class of hydration bugs).
- Add `format-date.test.ts`.

**8. Hooks**

- `useDebounce<T>(value: T, delay = 300): T`.
- `useMediaQuery(query: string): boolean`. Build it on `useSyncExternalStore` with a server snapshot of `false`.
- `useRole()` comes in L3.

**9. `src/store/ui.store.ts`** (Zustand, UI state only)

```ts
interface Toast {
  id: string;
  message: string;
  tone?: "success" | "error" | "info";
}
interface UiState {
  toasts: Toast[];
  pushToast(t: Omit<Toast, "id">): void;
  dismissToast(id: string): void;
}
```

- Add `src/components/ui/Toaster.tsx`. It renders `toasts` fixed at the bottom-right, `z-[110]`, auto-dismisses after 4s, uses `role="status"` and animates with `m.div`.
- Mount it once in the root layout.
- Replace the ad-hoc toast in the resources download flow with `pushToast`.

**Gate:** `pnpm typecheck`, `pnpm lint` and `pnpm test` pass. There is no visual change except the toast.

---

#### L2 — Shared UI primitives (`src/components/ui/`)

Rules for this level:

- One component per file and PascalCase names.
- Use `cn()`, tokens only, and no business logic.
- Every interactive part is keyboard-reachable with a visible focus ring (`focus-visible:outline-brand`).
- Hit areas are at least 44px tall on touch (§9 U7).
- Co-locate a `*.test.tsx` for Modal, Tabs and Dropdown.

| Component             | Props                                                                                            | Behaviour / style                                                                                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Label`               | `htmlFor`, `children`, `required?`                                                               | `mb-2 block text-body-sm font-medium`; `required` appends a muted `*` with `aria-hidden`                                                                                                                                                                                                                                                                                     |
| `Textarea`            | Same API as `TextField` (`label`, `error`, `maxLength?`, `showCount?`)                           | Reuse TextField's border and error styling. With `showCount`, show `n/max` bottom-right in `text-caption text-muted`                                                                                                                                                                                                                                                         |
| `Select`              | `label`, `error?`, `options: {value,label}[]`, `placeholder?`, plus native select props          | A native `<select>` styled like TextField, with a lucide `ChevronDown`. Must work with `react-hook-form` `register` (use `forwardRef`, or React 19 ref-as-prop)                                                                                                                                                                                                              |
| `Card`                | `padding?: "sm" \| "md" \| "lg"`, `shadow?: boolean`, `as?`                                      | `bg-surface rounded-2xl border border-member-border`; `shadow` adds `shadow-menu`                                                                                                                                                                                                                                                                                            |
| `Badge`               | `tone: "neutral" \| "brand" \| "success" \| "warning" \| "danger"`, `children`                   | A pill: `rounded-pill px-2.5 py-0.5 text-caption font-semibold`; minimum 12px (§9 U6)                                                                                                                                                                                                                                                                                        |
| `Avatar`              | `src?`, `name`, `size: "sm"(32) \| "md"(40) \| "lg"(64)`, `shape?: "circle" \| "rounded"`        | `next/image` with both `width` and `height` set (§9 U13). Without `src`, show initials on `bg-member-tint text-brand`. `alt` is `Portrait of {name}`                                                                                                                                                                                                                         |
| `Modal`               | `open`, `onClose`, `title`, `description?`, `size?: "sm" \| "md" \| "lg"`, `children`, `footer?` | Mount with `createPortal` into `document.body`, `z-[100]`, backdrop `bg-black/50 backdrop-blur-[2px]`. Close on Escape and backdrop click. Trap focus, return focus to the trigger on close, set `aria-modal` and `role="dialog"`, and lock scroll on `<html>` while open. Then migrate `WishDialog` and the PDF viewer shell onto it **only if the visuals stay identical** |
| `Tabs`                | `items: {id,label,count?}[]`, `value`, `onChange`                                                | Follow the WAI-ARIA tabs pattern (`role="tablist"`/`"tab"`, arrow keys move focus). Style the active tab like the birthdays month pill (`bg-[#4338CA]` becomes the `bg-brand` token)                                                                                                                                                                                         |
| `Dropdown`            | `trigger: ReactNode`, `items: {label, onSelect, icon?, danger?}[]`, `align?`                     | Use the menu-button pattern: `aria-haspopup="menu"`, Escape closes, a click outside closes, and arrow keys move between items                                                                                                                                                                                                                                                |
| `Skeleton` (✅ built) | `className` (plus `SkeletonText {lines}` and `SkeletonPage {label}`)                             | The `skeleton` utility: a grey `member-field` block with a light band sweeping across. `aria-hidden`; `SkeletonPage` sets `role="status"` and `aria-busy`. New async UI must use these, not `animate-pulse`                                                                                                                                                                  |
| `Spinner`             | `size?: "sm" \| "md"`, `label?: string`                                                          | A lucide `Loader2` with `animate-spin`; `label` renders `sr-only` text                                                                                                                                                                                                                                                                                                       |
| `EmptyState`          | `icon?`, `title`, `description?`, `action?`                                                      | Centred and quiet, with no illustration unless one is passed in                                                                                                                                                                                                                                                                                                              |
| `Button` (update)     | add `variant="ghost"` and `loading?: boolean`                                                    | `loading` shows `Spinner`, sets `aria-busy` and disables the button                                                                                                                                                                                                                                                                                                          |

**Gate:** add unit tests for Modal (Escape closes it, focus returns), Tabs (arrow keys) and Dropdown (Escape and outside click). The full check passes.

---

#### L3 — Auth & roles

**L3a: role in the existing session.** Do this now; it needs no backend.

1. In `src/lib/session.ts`, add a token version `v2` with the payload `v2.<issuedAt>.<role>`.
   - `createSessionToken(role: Role = "member", now?)`.
   - `readSession(token): Promise<{ role: Role; issuedAt: number } | null>`, which replaces the boolean check (keep `verifySessionToken` as a thin wrapper).
   - Reject `v1` tokens so everyone signs in again once. Update `session.test.ts`.
2. **Admin login without a backend.** It must not let anyone become admin just by adding `?role=admin`.
   - New server action `beginAdminLogin({ name, password })` in `src/app/actions/session.ts`. It validates with `adminLoginSchema`, then compares `password` with `process.env.ADMIN_DEV_PASSWORD` using a constant-time compare.
   - In production with no `ADMIN_DEV_PASSWORD` it always fails (fail closed).
   - On success it sets a signed, short-lived (5 min) `imena_admin_pending` cookie.
   - `AdminLoginForm` calls this action and shows "Wrong name or password." on failure.
   - `startMemberSession()` becomes `startSession()`. It grants `admin` **only** if a valid `imena_admin_pending` cookie is present, then deletes that cookie. Otherwise it grants `member`.
   - In `VerifyForm`, after success, admins go to `ROUTES.ADMIN` and members go to `returnTo ?? ROUTES.DASHBOARD` (this replaces the TODO at line ~63).
   - Add `ADMIN_DEV_PASSWORD=` to `.env.example`.
3. **`src/middleware.ts`**
   - Member paths keep the current behaviour. Add `/families` to `MEMBER_PREFIXES`.
   - For `/admin` and `/admin/**` except `/admin/login`: with no session, redirect to `/admin/login?next=…`; with `role !== "admin"`, redirect to `/dashboard`.
   - A signed-in user visiting `/login` or `/admin/login` is redirected to their home.
4. **Server-side re-check**: create `src/lib/auth-guard.ts` (server only).
   - `getSession()` reads `cookies()` and calls `readSession`.
   - `requireRole(role)` calls `redirect()` when the check fails.
   - Call `requireRole("admin")` in `src/app/admin/(panel)/layout.tsx`, as the PDF requires: "each protected layout repeats the check".
5. **`useRole()`**: the root or member layout reads the role on the server and passes it to a small `SessionProvider` (React context, in `src/components/providers/`). `useRole()` reads that context.
6. **`SignupForm`**
   - Move the form from `src/app/(public)/signup/page.tsx` into `features/auth/components/SignupForm.tsx`, using `react-hook-form` and a new `signupSchema` (name, email, phone optional, promotion, branch, message optional, max 500).
   - Use the L2 `Select` and `Textarea`, and keep the existing visual design exactly.
   - Submit goes through `members.service.requestJoin()` (L4; it is a mock until then).

**L3b: Auth.js.** Do this only when the backend and Google OAuth credentials exist.

- Create `src/lib/auth.ts` with `NextAuth({ providers: [Credentials (name + OTP verified against the API), Google], session: { strategy: "jwt" }, callbacks: { jwt, session } })`. The callbacks copy `role` and `memberId` from the API response into the token.
- Create `src/app/api/auth/[...nextauth]/route.ts`, which does `export const { GET, POST } = handlers`.
- Swap `readSession` for `auth()` in the middleware and the guards. Delete the HMAC session only after this works end to end.

**Gate:**

- Unit tests cover: a forged role is rejected, a v1 token is rejected, an admin without the pending cookie gets `member`, and the middleware redirect matrix (signed-out / member / admin × `/dashboard` / `/admin` / `/admin/login`).

---

#### L4 — Services layer, mock mode, query hooks

Pattern for every `src/services/<name>.service.ts`:

```ts
import { api, USE_MOCKS } from "@/lib/api-client";
import type { Paginated, Post } from "@/types";
import { mockPosts } from "./mocks/posts.mock";

export const postsService = {
  list: (p: { page?: number; category?: string; q?: string } = {}) =>
    USE_MOCKS
      ? mockPosts.list(p)
      : api.get<Paginated<Post>>(`/posts?${new URLSearchParams(toParams(p))}`),
  // ...
};
```

- Mocks live in `src/services/mocks/*.mock.ts`. They **adapt the existing feature `data.ts` files** into the shared types, so the UI keeps showing the same sample content.
- Mocks may import from feature `data.ts` files; this is the one allowed exception, and it is deleted at L9.
- Mocks resolve after `await delay(250)` so loading states get exercised.
- Mock writes keep an in-memory array for the browser session and return the created entity with `id: crypto.randomUUID()`.

**Assumed REST contract** (this is decision D3; confirm it with the backend and change only the service files):

| Service         | Method → endpoint                                                                                                                                                                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `posts`         | `list` → `GET /posts?page&category&q&status`<br>`bySlug` → `GET /posts/:slug`<br>`like` → `POST /posts/:id/like`<br>`unlike` → `DELETE /posts/:id/like`<br>`comments` → `GET /posts/:id/comments`<br>`addComment` → `POST /posts/:id/comments {body}`<br>`create` → `POST /posts`<br>`update` → `PATCH /posts/:id`<br>`remove` → `DELETE /posts/:id` |
| `members`       | `me` → `GET /members/me`<br>`list` → `GET /members?page&q&subfamily&promotion`<br>`create` → `POST /members` (admin)<br>`requestJoin` → `POST /members/requests`                                                                                                                                                                                     |
| `albums`        | `list` → `GET /albums?page`<br>`bySlug` → `GET /albums/:slug`<br>`create` → `POST /albums`<br>`signUpload` → `POST /uploads/sign {fileName, contentType}` returning `{uploadUrl, publicUrl}`                                                                                                                                                         |
| `families`      | `list` → `GET /families`<br>`bySlug` → `GET /families/:slug`                                                                                                                                                                                                                                                                                         |
| `birthdays`     | `byMonth` → `GET /birthdays?month=1..12`<br>`today` → `GET /birthdays/today`                                                                                                                                                                                                                                                                         |
| `resources`     | `list` → `GET /resources?category&q&page`<br>`byId` → `GET /resources/:id`                                                                                                                                                                                                                                                                           |
| `stats` (admin) | `overview` → `GET /admin/stats` returning `{members, posts, albums, birthdaysThisMonth}`                                                                                                                                                                                                                                                             |

**Query hooks** live inside each feature's `hooks/` folder, never in `components/ui`.

- Query keys are arrays that start with the resource name, for example `["posts", params]`, `["post", slug]`, `["comments", postId]` and `["families"]`.
- Hooks to create:
  - `features/blogs/hooks/usePosts.ts`, `usePost.ts`
  - `features/families/hooks/useFamily.ts`
  - `features/birthdays/hooks/useBirthdays.ts`
  - `features/resources/hooks/useResources.ts`
  - `features/gallery/hooks/useAlbums.ts`
  - `features/admin/hooks/useAdminStats.ts`
- **Do not switch the existing pages over to these hooks yet.** That is L9. New pages (L5–L7) use them from the start.

**Gate:** add unit tests for `api-client` (an error is thrown as `ApiError`, a 204 returns `undefined`) and for one mock service. The full check passes.

---

#### L5 — Subfamily pages `/families/[slug]`

- **Route:** `src/app/(member)/families/[slug]/page.tsx`
  - `generateStaticParams` returns the three `SUBFAMILY_SLUGS`.
  - An unknown slug calls `notFound()`.
  - `generateMetadata` gives `title: "{Name} Family"`.
- **Composition** (the page composes features; a feature never imports another feature):
  1. `PageHeader` with `title={name.toUpperCase()}` and a badge with the branch icon (reuse `BRANCH_ICON` from `features/tree/branch.ts` through a prop, or duplicate the three icons in `features/families`).
  2. `features/families/components/SubfamilyHeader.tsx` contains:
     - A hero image (`rounded-3xl`, `aspect-[16/7]`, with `next/image` `priority`).
     - The name, `holds`, the leader and the member count in a `Card` **beside** the image, not on top of the photo (this avoids the §9 U10 contrast problem).
  3. `features/families/components/SloganCallout.tsx` shows:
     - The Kinyarwanda motto in `font-member-display` (Playfair) italic at `text-h3`.
     - The English meaning below it in `text-muted`.
     - It sits centred with plenty of whitespace, with no borders and no quote icons.
  4. Members of this branch: a grid of `Avatar` + name + role label, grouped by promotion and newest first. Use the `members.service.list({ subfamily })` hook.
  5. Recent posts from this branch: up to three `BlogCard`s through `usePosts({ subfamily })`. If there are none, show an `EmptyState` with "No stories from {Name} yet."
- **Links into it:** make each card in `SubFamilyTrinity.tsx` link to `familyRoute(slug)`. Add a "Families" group to `MEMBER_FOOTER_GROUPS`. **Do not add a dock icon**; the dock is already full.
- **Gate:** all three slugs render; an unknown slug gives 404. There is no horizontal scroll at 360, 390, 768 or 1440px. The full check passes.

---

#### L6 — Blog interactions

- **`features/blogs/components/LikeButton.tsx`**
  - Props: `postId`, `initialLikes`, `initialLiked`.
  - Uses `useLike()`, a `useMutation` with an **optimistic update** of the `["post", slug]` cache that rolls back on error and calls `pushToast({tone: "error"})`.
  - Replace the `useStoredValue` like logic in `ArticleAuthorBar.tsx` with this button and keep the existing visual.
- **`features/blogs/components/CommentList.tsx`**
  - Uses `useComments(postId)`.
  - Each comment shows `Avatar` (sm), name, `timeAgo` and the body. The list is oldest first.
  - Show a `Skeleton` while loading and an `EmptyState` with "Be the first to leave a word." when there are none.
- **`features/blogs/components/CommentForm.tsx`**
  - A `Textarea` with a 500-character max and a counter, and a "Post comment" `Button` in the `brand` variant with a loading state.
  - Uses `useAddComment()`: an optimistic append, which also bumps `commentsCount`.
  - Zod schema `commentSchema`: body trimmed, between 1 and 500 characters.
- **Placement:** in `ArticleDetailView.tsx`, under the article body, with an `h2` "Comments ({count})". Keep the article title as the page `h1` (§9 U15).
- **Gate:** tests cover the optimistic like rollback and comment form validation.

---

#### L7 — Admin panel

**Route structure.** It does not collide with the existing `(auth)/admin/login`:

```
src/app/admin/(panel)/layout.tsx          # requireRole("admin"), AdminSidebar + header
src/app/admin/(panel)/page.tsx            # /admin
src/app/admin/(panel)/posts/page.tsx      # /admin/posts
src/app/admin/(panel)/albums/new/page.tsx # /admin/albums/new
src/app/admin/(panel)/members/new/page.tsx# /admin/members/new
```

**`components/layout/AdminSidebar.tsx`**

- A fixed left rail, `w-64` on desktop, that collapses into a top bar with a menu button below `md` (use `useMediaQuery`).
- Items come from `ADMIN_NAV` with lucide icons: `LayoutDashboard`, `FileText`, `Images` and `UserPlus`.
- The active item is styled `bg-member-tint text-brand font-semibold`.
- At the bottom: "Back to member site" and "Sign out" (a server action calling `endMemberSession`, then redirect to `/admin/login`).
- The layout uses the member fonts (Poppins and Playfair) like `(member)/layout.tsx`, and the content area is `max-w-page px-4 md:px-8 py-8`.

**Features (`src/features/admin/`).** Each feature has `components/`, `hooks/` and `schemas.ts`.

| Component                              | Page                                  | Spec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StatsOverview.tsx`                    | `/admin`                              | Four `Card`s in a `grid-cols-2 lg:grid-cols-4` grid: Members, Published posts, Albums, Birthdays this month. Each has a label in `text-body-sm text-muted` and a value in `text-h2` with `CountUp`. Data comes from `useAdminStats()`. Below the cards, a "Recent posts" list of the latest five, each linking to `/admin/posts`                                                                                                                                                                                                                                                                                                                      |
| `PostsTable.tsx`                       | `/admin/posts`                        | `Tabs` for All, Published and Drafts with counts, and a search box using `TextField` + `useDebounce`.<br>Desktop shows a `<table>` with Title, Author, Category, Status (`Badge`), Date and Actions (`Dropdown`: Edit, Publish/Unpublish, Delete). Phones show a stacked list (§9 U8).<br>Delete asks for confirmation in a `Modal`. Mutations invalidate `["posts"]` and show a toast. The "New post" button opens `PostEditor`                                                                                                                                                                                                                      |
| `PostEditor.tsx`                       | Modal (`size="lg"`) on `/admin/posts` | `react-hook-form` + `postSchema`, with fields: title (required, 5–120), category `Select` (the blog categories without "All"), tag, excerpt (`Textarea`, max 200), body (`Textarea`, paragraphs split on blank lines), cover image (`UploadDropzone` with single file) and cover alt (required when there is a cover).<br>Actions: "Save draft" (ghost) and "Publish" (brand). The same component handles edit when given a `post` prop. **Any field without an alt text cannot publish**                                                                                                                                                             |
| `AlbumForm.tsx` + `UploadDropzone.tsx` | `/admin/albums/new`                   | `albumSchema`: title, description, date, `isPublic` checkbox, and at least one photo.<br>`UploadDropzone` takes `accept="image/*"`, `multiple` and `maxFiles=100`, with drag-and-drop **and** a "Choose files" button for keyboard users. Each file gets a thumbnail preview (`URL.createObjectURL`, revoked on unmount), a progress bar and a remove button, plus an alt-text input (required).<br>Upload flow: `albums.signUpload()` → `PUT` the file to `uploadUrl` with `XMLHttpRequest` (for progress events) → keep `publicUrl`. In mock mode, simulate progress.<br>On submit, `albums.create()` → toast → `router.push(\`/gallery/${slug}\`)` |
| `AddMemberForm.tsx`                    | `/admin/members/new`                  | `memberSchema`: full name, email (optional but must be valid), phone (optional), subfamily `Select` (`SUBFAMILY_SLUGS`), promotion `Select` (`PROMOTION_YEARS` from the tree data, passed in as a prop from the page), role label `Select` (Grand Père, Grand Mère, Coordinator, Vice-Coordinator, Père/Mère + branch, Member), birthday (`type="date"`), photo (`UploadDropzone` with single file) and role (`member`/`admin` radio, default member).<br>On success: a toast "{name} was added to the family." and the form resets                                                                                                                   |

**Gate:**

- A member who opens `/admin` lands on `/dashboard`; a signed-out user lands on `/admin/login`.
- Every form shows inline Zod errors and submits in mock mode. The tables work at 390px.
- The full check passes.

---

#### L8 — Open-decision features and remaining audit items

- **D1 public gallery:** build it only if the user approves (see §10.4).
- **§9 P2/P3 items still open:** U3, U6–U14 and U16. U16 fix: compute the footer year at request time (or in a small client component using `useNow`) so it isn't frozen at build.

---

#### L9 — Real data switch-over

Do this only once the backend is live (`NEXT_PUBLIC_USE_MOCKS=false`).

1. Replace every direct `data.ts` import in pages and components with the L4 hooks, or with server-side `service` calls for public pages (`export const revalidate = 3600`, as the PDF requires).
2. Replace `constants/member.ts` `MEMBER` with `members.service.me()`.
3. Remove every "Sample…" note together (§9 U17). Today they are in `birthdays/data.ts`, `BirthdaysPanel.tsx`, `PopularArticles.tsx`, `AlbumView.tsx`, `ArticleDetailView.tsx`, `PersonDialog.tsx` and `BioDrawer.tsx`.
4. Delete `src/services/mocks/` and the feature `data.ts` files that are no longer imported.

---

#### L10 — End-to-end tests (`tests/`, Playwright)

The `tests/` folder is empty and Playwright is configured. Add these specs:

| Spec                  | Covers                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public.spec.ts`      | Home, Our Story and Family Tree load. There is no horizontal scroll at 390px. "Explore the Tree" scrolls to `#promotion-section`                                                              |
| `auth.spec.ts`        | Member login, then a 5-digit code, lands on `/dashboard`. A protected URL while signed out redirects to `/login?next=…` and returns there after verify. A wrong admin password shows an error |
| `admin-guard.spec.ts` | A member is redirected away from `/admin`. An admin reaches all four admin pages                                                                                                              |
| `member.spec.ts`      | Each dock link opens a page with an `h1`. The resources PDF viewer opens and closes with Escape. A birthday wish dialog opens. `/families/light` renders                                      |
| `admin-forms.spec.ts` | Create a post draft, create an album with one image, and add a member (all in mock mode)                                                                                                      |

### 10.6 Definition of done (every level)

1. `pnpm typecheck`, `pnpm lint`, `pnpm format:check` and `pnpm test` exit 0. From L10 on, `pnpm test:e2e` passes too.
2. There is no horizontal scroll at 360, 390, 768 or 1440px, and no new hydration warnings in the console.
3. Every new image has `alt` and both `width` and `height` (or `fill` with `sizes`). Text is at least 12px and touch targets at least 44px.
4. There are no new raw hex colours. Use tokens, and add a token to `globals.css` if one is missing.
5. There are no `motion.*` imports (only `m.*`) and no cross-feature imports.
6. Update this section's status marks (❌ → ✅) for whatever was finished.
7. **Never `git commit` or `git push` unless the user explicitly asks.**
