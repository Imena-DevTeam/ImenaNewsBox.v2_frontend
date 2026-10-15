# IMENA Family Times — Frontend

Web frontend for IMENA Family Times, a private family platform that preserves
the history, stories and relationships of the IMENA family and its three
subfamilies: **Wihogora**, **Light** and **Hope**.

| Item          | Detail                                  |
| ------------- | --------------------------------------- |
| Framework     | Next.js 15 (App Router) with TypeScript |
| Styling       | Tailwind CSS v4                         |
| Package manager | pnpm                                  |
| Design source | Figma file "IMENA FAMILY TIMES"         |

## Requirements

- Node.js 20.9 or newer
- pnpm 12 (`npm i -g pnpm`, or `corepack enable` with admin rights)

## Getting started

```bash
git clone https://github.com/Imena-DevTeam/ImenaNewsBox.v2_frontend.git
cd ImenaNewsBox.v2_frontend
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

The app runs at http://localhost:3000.

## Scripts

| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start the development server   |
| `pnpm build`      | Production build               |
| `pnpm start`      | Serve the production build     |
| `pnpm lint`       | ESLint checks                  |
| `pnpm typecheck`  | TypeScript, no emit            |
| `pnpm format`     | Format with Prettier           |
| `pnpm test`       | Unit tests (Vitest)            |
| `pnpm test:e2e`   | End-to-end tests (Playwright)  |

## Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable               | Purpose                          |
| ---------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API      |
| `AUTH_SECRET`          | Auth.js session secret           |
| `AUTH_GOOGLE_ID`       | Google OAuth client id           |
| `AUTH_GOOGLE_SECRET`   | Google OAuth client secret       |

## Project structure

```
src/
├── app/          # routes only — thin pages
├── features/     # domain logic and feature components
├── components/   # shared UI (ui/) and layout (layout/)
├── lib/          # config, clients, helpers
├── services/     # API endpoint functions
├── hooks/        # shared React hooks
├── store/        # Zustand stores
├── types/        # shared TypeScript types
├── constants/    # routes, nav links, roles
└── styles/       # globals.css, design tokens
```

A feature may import from `components/`, `lib/` and `services/` — never from
another feature. `components/ui` holds no business logic and makes no API calls.

## Conventions

| Item          | Convention              | Example                    |
| ------------- | ----------------------- | -------------------------- |
| Components    | PascalCase `.tsx`       | `PostCard.tsx`             |
| Hooks         | camelCase, `use` prefix | `useResendTimer.ts`        |
| Services      | kebab-case `.service`   | `posts.service.ts`         |
| Route folders | kebab-case              | `family-tree/`             |
| Types         | PascalCase interfaces   | `interface FamilyMember`   |
| Constants     | UPPER_SNAKE_CASE        | `ROUTES.FAMILY_TREE`       |
| Imports       | Absolute alias `@/`     | `@/components/ui/Button`   |

- One component per file; co-locate tests as `Component.test.tsx`.
- Use `cn()` (clsx + tailwind-merge) to combine class names.
- No inline styles and no arbitrary values such as `text-[17px]` — add a token.
- Every image needs alt text; interactive elements must be keyboard reachable.

## Branching and reviews

- `main` is protected: no direct pushes, no force pushes.
- Branch from `main` as `feature/<short-description>`, `fix/<short-description>`
  or `chore/<short-description>`.
- Open a pull request into `main`. At least one approving review is required.
- `pnpm lint`, `pnpm typecheck` and `pnpm build` must pass before merge.
- Keep pull requests scoped to one phase task where possible.
