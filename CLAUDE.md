# IMENA Family Times — Claude Code Development Guide & Specifications

This document is the single source of truth for Claude Code when developing, extending, or refining the **IMENA Family Times** web application (`Imena-DevTeam/ImenaNewsBox.v2_frontend`).

---

## 1. Project Overview & Tech Stack

* **Framework**: Next.js 15.x (App Router), React 19
* **Language**: TypeScript (strict mode, zero errors tolerated)
* **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/styles/globals.css`)
* **Fonts**:
  * Headings: Roboto (`--font-heading`, `font-heading`)
  * Body: Nunito Sans (`--font-sans`, `font-sans`)
* **Color System**:
  * Brand Primary: `#0d1aba` (`bg-primary`, `text-primary`)
  * Heading Violet Accent: `#5a36da` (`text-heading`, `bg-heading`)
  * Page Background: `#fcffff` (`bg-background`)
  * Card Surface: `#ffffff` (`bg-surface`, `bg-white`)
  * Muted Neutral: `#6b6b6b` (`text-muted`)
  * Border: `#e5e7f0` or `#e8edf7`
* **Package Manager**: `pnpm`
* **Development Server**: `pnpm dev` on `http://localhost:3000`
* **Typecheck Command**: `pnpm typecheck` (`tsc --noEmit`)

---

## 2. Critical Behavioral Guidelines & Rules

> [!IMPORTANT]
> **STRICT RULE ON GIT COMMITS**: NEVER run `git commit` or `git push` unless the user explicitly tells you to do so in their message! Keep all working changes unstaged/uncommitted until instructed.

> [!CAUTION]
> **AVOID "AI SLOP" & OVER-ENGINEERED UI**:
> * Do **NOT** add artificial helper labels like *"Click card to flip"*, *"Preceding Generation"*, or explanatory pill badges that clutter the design.
> * Do **NOT** use random emojis (e.g. `🔄`, `✨`) in buttons or headings.
> * Do **NOT** add arbitrary thick borders (e.g. `border-l-4` blockquote lines) unless specifically indicated in the design mockup.
> * **Preserve Design Fidelity**: The user wants clean, Apple/Stripe-caliber luxury aesthetics matching the exact design exports (`media_1793188908046.png`).

---

## 3. Public Family Tree Page (`/family-tree`)

### Page Route
* `src/app/(public)/family-tree/page.tsx`
* Uses client wrapper `src/features/tree/components/PublicFamilyTreeClient.tsx` to coordinate `activeYear` between the hero tree illustration and the bottom promotion section.

### A. Hero Section & Interactive SVG Tree (`TreeHero.tsx` + `PublicTreeIllustration.tsx`)
1. **Title & Heading**:
   * Centered 3-line headline:
     ```
     Rediscover
     Your Legacy.
     ```
     with subhead: *"A modern space for family history, connections, and stories."*
   * Interactive button: *"Explore the Tree"* smoothly scrolls to `#promotion-section`.
2. **SVG Tree Dimensions**:
   * ViewBox: `0 0 1000 680`, non-overlapping nodes, clean organic branches.
3. **Nodes & Roles**:
   * **Root Node (Patriarch)**: Center bottom, displays a subtle silhouette icon. On hover, displays a clean floating badge with the name **"Benon"**.
   * **Generations Included**: Only includes **Grandpère and Grandmère** for each generation (`2019-2021` up to `2025-2026`).
   * **Portraits**: Circular avatar nodes (`r={28}` or `r={32}`) filled with verified high-res Sanity CDN photography via SVG `<pattern>`.
   * **Hover Tooltips**: Names appear strictly on hover in an elevated floating badge (no static cluttering labels).
   * **Interactive Branch Glowing**: Hovering or selecting any node highlights its genealogical path in amber-gold (`#F59E0B`) all the way down to Benon.
   * **Click Navigation**: Clicking a node sets `activeYear` and scrolls to `#promotion-section`.

---

### B. Down Promotion Section (`PublicPromotionSection.tsx`)

#### 1. Header Layout (Strictly Matching `media_1793188908046.png`)
* **Centered Crest**: Official IMENA crest (`/images/imena-crest.webp`, 70x70) centered above the title.
* **Main Heading**:
  ```html
  <h2 className="text-h1-m md:text-h1 font-black text-black">
    AERG IMENA Family <span className="text-primary">Tree</span>
  </h2>
  ```
* **Subtitle**:
  *"Discover the connections and relationships within our extended family. Each level represents a generation, and each circle represents a family member."*
* **Year Display**:
  * Shows **one year above** at a time (e.g. `2025-2026`).
  * Smooth cross-fade animation when cards are flipped (Current year fades out / previous year fades in).
  * **Subheading**: `Grandpere & Grandmere` in bold, uppercase text.

#### 2. Grandpère & Grandmère Cards
* **Role Limitation**: Strictly displays **Grandpère and Grandmère** (no extra coordinator or parent groups).
* **Card Dimensions & Styling**:
  * Surface: `bg-white rounded-3xl border border-[#e8edf7] p-6 md:p-7 shadow-[0_4px_24px_rgba(13,26,186,0.04)] hover:shadow-[0_20px_45px_rgba(13,26,186,0.08)]`.
  * Layout: Two columns (`flex-col sm:flex-row items-center sm:items-stretch gap-6`).
  * Left Portrait: Aspect ratio `4:5`, rounded-2xl (`rounded-2xl overflow-hidden aspect-[4/5] w-full sm:w-44 md:w-52 relative bg-[#eaeff5] ring-1 ring-black/5`).
  * Silhouette Fallback: For members without a photo, render a clean SVG silhouette on a soft `#eaeff5` container.
  * Right Details:
    * Name: `font-heading font-black text-2xl md:text-[26px] text-slate-900 tracking-tight leading-tight uppercase`.
    * Role Badge: `inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3fe] text-[#1d4ed8] border border-[#dbeafe]`.
    * Family Clan Badge: `inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-white text-[#1d4ed8] border border-[#bfdbfe]`.
    * Saying / Quote: `text-sm md:text-base text-slate-600 italic font-normal leading-relaxed mt-4` wrapped in typographical quotes `“...”` (no left border line).
* **3D Flip Interaction**:
  * Clicking either card triggers a 3D flip (`rotateY(180deg)` with `perspective: 1400px` and `transform-style: preserve-3d`).
  * Stagger: Grandpère flips at `0ms`, Grandmère flips at `75ms` delay.
  * Reveal: Back of the cards reveals the **preceding generation's Grandpère and Grandmère** in that lineage with their authentic photo, role, family clan, and quote.
  * Backface visibility: `backface-visibility: hidden; -webkit-backface-visibility: hidden;` on both faces.

---

## 4. Authentic Sanity CDN Member Data

Data is structured in `src/features/tree/publicTreeData.ts`:

| Promotion | Role | Name | Family Clan | Sourced Photo URL / Asset |
|---|---|---|---|---|
| **2025–2026** | Grandpère | MUGISHA Pacifique | Rwamamara | `https://cdn.sanity.io/images/bge18m05/production/0079bffac8150fffd03d00cd5be158de72219b83-309x931.jpg` |
| **2025–2026** | Grandmère | ISIMBI Hyguette | Karabo | Silhouette placeholder (no official photo on site) |
| **2024–2025** | Grandpère | RUDASESWA Thierry | Rwaka | `https://cdn.sanity.io/images/bge18m05/production/580b981c297507e207cfed2f06398289500f1312-424x756.jpg` |
| **2024–2025** | Grandmère | INGABIRE Liliane | Marebe | `https://cdn.sanity.io/images/bge18m05/production/9983996c39ec338141c917b6ee54a78dd98bb3cf-480x1014.jpg` |
| **2023–2024** | Grandpère | BUGINGO Elua | Nkotanyi | `https://cdn.sanity.io/images/bge18m05/production/bfb8c538cdaffcea16ae84a5e8b768c62f78f99e-720x1080.jpg` |
| **2023–2024** | Grandmère | UWINEZA Joyeuse | gmere | `https://cdn.sanity.io/images/bge18m05/production/a60ff01b42586bb16f7cba4571d968218146c38c-690x1080.jpg` |
| **2022–2023** | Grandpère | MANZI Sylvain | Intashya | `https://cdn.sanity.io/images/bge18m05/production/fc7f57ec71f98d63d8b13689b70b5514f77c5ba8-502x711.jpg` |
| **2022–2023** | Grandmère | KANYANGE Elua | Nyamurunga | `https://cdn.sanity.io/images/bge18m05/production/c329486c997cb24b433cf57f4fb9f7a554a93ca0-475x882.jpg` |
| **2021–2022** | Grandpère | NIYONZIMA Patrick | Inkomezamihigo | `https://cdn.sanity.io/images/bge18m05/production/5d4f3b25f992cf6d8ba986bf3ec09c6ae5e69e06-444x680.jpg` |
| **2021–2022** | Grandmère | MUKESHIMANA Francine | Inyamibwa | `https://cdn.sanity.io/images/bge18m05/production/3e098ee3e070d65a882a9ba4f40f3b06cfa02927-463x742.jpg` |
| **2019–2021** | Grandpère | NIYOMUKIZA Sylvain | Imenagitero | `https://cdn.sanity.io/images/bge18m05/production/4f086790488e19882d8eafd6bd49b9a762acca34-750x1050.jpg` |
| **2019–2021** | Grandmère | MUREKATETE Honette | Isonga | Silhouette placeholder |
| **Root Patriarch** | Founder | Benon | IMENA Family | Silhouette icon, revealed as "Benon" on hover |

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
