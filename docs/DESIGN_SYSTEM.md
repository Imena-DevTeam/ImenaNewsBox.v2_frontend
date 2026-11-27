# IMENA Family Times - Frontend Design System

This document describes the visual foundations, shared UI components, layout primitives, and interaction conventions used in the IMENA Family Times frontend.

It is intended for developers building new pages, extending existing components, or maintaining the consistency of the application.

## 1. Sources of truth

The design system is maintained in the following locations:

| Location                 | Responsibility                                                 |
| ------------------------ | -------------------------------------------------------------- |
| `src/styles/globals.css` | Tailwind theme, design tokens, base styles, and CSS animations |
| `src/components/ui/`     | Reusable interface components                                  |
| `src/components/layout/` | Shared layout and navigation components                        |
| `src/components/motion/` | Reusable animation components and motion tokens                |
| `src/lib/cn.ts`          | Class-name composition utility                                 |

The Figma file **IMENA FAMILY TIMES** is the visual design reference.

Use existing design tokens and shared components before introducing new styles or creating duplicate components.

## 2. Visual themes

The application contains three distinct visual areas. They share the same project but have separate typography and visual conventions.

### 2.1 Public website

The public-facing website uses:

- **Roboto** for headings.

- **Nunito Sans** for body and interface text.

- Violet brand accents.

- Light backgrounds and surfaces.

- Responsive section layouts.

The public theme is defined primarily in the main `@theme` block in `src/styles/globals.css`.

### 2.2 Authentication screens

Authentication screens include login and account verification pages.

They use a dedicated typography system:

| Font token          | Typeface            | Purpose                           |
| ------------------- | ------------------- | --------------------------------- |
| `font-auth-display` | Bricolage Grotesque | Large authentication display text |
| `font-auth-heading` | Instrument Serif    | Authentication headings           |
| `font-auth-body`    | Jost                | Authentication body text          |

These font variables are provided by `src/app/(auth)/layout.tsx`.

Authentication also has dedicated form sizing, spacing, and layout tokens. Use these instead of copying public-page styles into authentication screens.

### 2.3 Member area

The member area includes the dashboard, gallery, blogs, and related member pages.

It uses:

- **Poppins** for interface text and prominent welcome headings.

- **Playfair Display** for serif titles and closing taglines.

- Dedicated member colors, surfaces, borders, and shadows.

- Its own navigation and page-title conventions.

The corresponding font variables are provided by `src/app/(member)/layout.tsx`.

Member-specific tokens use names such as `color-member-*`, `text-page-title`, and `text-motto`.

**Important:** Do not assume that a public-page token and a member-area token are interchangeable simply because they have similar visual colors.

## 3. Design tokens

Design tokens are defined in `src/styles/globals.css` using Tailwind CSS v4's `@theme` and `@theme inline` blocks.

Use the generated utility classes rather than hard-coded values.

### 3.1 Typography

The public theme provides a consistent heading scale:

| Token          | Desktop size | Mobile size | Intended use        |
| -------------- | -----------: | ----------: | ------------------- |
| `text-display` |         56px |        36px | Hero titles         |
| `text-h1`      |         40px |        30px | Page headings       |
| `text-h2`      |         32px |        26px | Section headings    |
| `text-h3`      |         24px |        20px | Subsection headings |
| `text-h4`      |         20px |        18px | Card headings       |

Use the mobile token together with its desktop counterpart where appropriate:

```tsx
<h2 className="text-h2-m md:text-h2">Section heading</h2>
```

Body and interface typography includes:

| Token          | Size | Intended use            |
| -------------- | ---: | ----------------------- |
| `text-body-lg` | 18px | Introductory paragraphs |
| `text-body`    | 16px | Default body text       |
| `text-body-sm` | 14px | Supporting text         |
| `text-ui`      | 16px | Buttons and navigation  |
| `text-caption` | 12px | Labels and metadata     |

The member theme also defines dedicated typography tokens, including `text-welcome`, `text-page-title`, `text-section`, `text-motto`, and their mobile counterparts.

Prefer these tokens over arbitrary font sizes.

### 3.2 Colors

The public theme includes semantic colors for:

- `background` and `surface`

- `brand` and `brand-hover`

- `heading`

- `text` and `muted`

- `border`

- `danger`

The member theme has separate tokens for its own visual identity, including:

- `member-tint`

- `member-night`

- `member-panel`

- `member-border`

- `member-ink`

- `member-accent`

- `member-active`

Family-tree branches also have dedicated edge, tint, and ink tokens.

Use semantic colors according to their intended purpose. Do not introduce arbitrary hex values into component class names.

### 3.3 Layout and spacing

Important layout tokens include:

| Token               |  Value | Purpose                 |
| ------------------- | -----: | ----------------------- |
| `container-page`    | 1280px | Maximum page width      |
| `container-footer`  | 1157px | Footer content width    |
| `spacing-section`   |   96px | Desktop section spacing |
| `spacing-section-m` |   56px | Mobile section spacing  |

Authentication also defines dedicated form and verification widths and responsive spacing tokens.

The shared `Container` component applies the page-width and horizontal-padding conventions.

### 3.4 Radius and shadows

The shared radius scale includes:

| Token           |  Value | Intended use                      |
| --------------- | -----: | --------------------------------- |
| `rounded-sm`    |    6px | Inputs and small controls         |
| `rounded-md`    |   12px | Cards and panels                  |
| `rounded-lg`    |   20px | Hero images                       |
| `rounded-pill`  | 9999px | Pill buttons and badges           |
| `rounded-field` |   15px | Authentication fields and buttons |

The stylesheet also provides named shadows such as `shadow-main` and `shadow-menu`, alongside member-specific shadow tokens.

Use the existing scale rather than introducing arbitrary radii and shadows.

### 3.5 Control heights

Buttons, inputs, and selects share three standard heights:

| Token          | Height |
| -------------- | -----: |
| `h-control-sm` |   36px |
| `h-control-md` |   44px |
| `h-control-lg` |   52px |

Use the existing control-size conventions when building or updating form elements.

## 4. Shared UI components

Reusable UI components live in `src/components/ui/`.

### 4.1 Button

File: `src/components/ui/Button.tsx`

The module exports two components:

- `Button`: renders a native button.

- `ButtonLink`: renders a Next.js link with the same visual styling.

Supported variants:

| Variant   | Intended use                                          |
| --------- | ----------------------------------------------------- |
| `primary` | Main actions                                          |
| `outline` | Secondary outlined actions                            |
| `light`   | Actions on dark or photographic backgrounds           |
| `brand`   | Violet-filled authentication and member-frame actions |
| `ghost`   | Quiet actions such as Cancel, Close, or Show more     |
| `danger`  | Destructive or ending actions                         |

Supported sizes are `sm`, `md`, and `lg`. The default is `md`.

Example:

```tsx
import { Button, ButtonLink } from "@/components/ui/Button";

export function ActionExample() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" size="md">
        Save changes
      </Button>

      <Button variant="outline" size="md">
        Cancel
      </Button>

      <ButtonLink href="/profile" variant="ghost">
        View profile
      </ButtonLink>
    </div>
  );
}
```

The native button defaults to `type="button"`. Specify `type="submit"` when it is intended to submit a form.

Both components accept additional native props and a `className`.

### 4.2 SectionTitle

File: `src/components/ui/SectionTitle.tsx`

`SectionTitle` provides a reusable animated section heading.

Props:

| Prop        | Type                 | Default    |
| ----------- | -------------------- | ---------- |
| `title`     | `string`             | Required   |
| `align`     | `"left" or "center"` | `"center"` |
| `className` | `string`             | None       |

Example:

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";

export function GallerySection() {
  return (
    <section>
      <SectionTitle
        title="Our Family Gallery"

        align="center"
      />
    </section>
  );
}
```

The component uses `SplitText` for its heading animation and a Motion-based accent bar.

It is a client component.

### 4.3 Container

File: `src/components/layout/Container.tsx`

`Container` provides consistent maximum width, centering, and responsive horizontal padding.

It accepts standard div props and an optional `as` prop for choosing the rendered element.

Example:

```tsx
import { Container } from "@/components/layout/Container";

export function PageSection() {
  return (
    <Container as="section" className="py-12">
      <h2 className="text-h2-m md:text-h2">About our family</h2>
    </Container>
  );
}
```

The default rendered element is `div`.

### 4.4 PageHeader

File: `src/components/layout/PageHeader.tsx`

`PageHeader` is a member-area page header.

Its props include:

| Prop           | Type        | Default         |
| -------------- | ----------- | --------------- |
| `title`        | `string`    | `"Gallery"`     |
| `subtitle`     | `string`    | None            |
| `as`           | `h1` or `p` | `h1`            |
| `badgeIcon`    | `ReactNode` | None            |
| `badgeLabel`   | `string`    | None            |
| `rightActions` | `ReactNode` | Default actions |

Example:

```tsx
import { PageHeader } from "@/components/layout/PageHeader";

export function GalleryHeader() {
  return (
    <PageHeader
      title="Gallery"

      subtitle="Memories preserved through generations"
    />
  );
}
```

By default, the header displays search, notification, and profile actions. Providing `rightActions` replaces those default actions.

The profile information comes from the signed-in member session.

Use this component for the member-area header rather than treating it as a generic public-page heading.

## 5. Motion conventions

Motion styles are shared between CSS and JavaScript animation.

### 5.1 CSS motion tokens

The stylesheet defines consistent durations:

| Token           | Duration | Intended use                        |
| --------------- | -------: | ----------------------------------- |
| `duration-fast` |    150ms | Hover color and opacity changes     |
| `duration-base` |    300ms | Hover movement and card transitions |
| `duration-slow` |    600ms | Scroll reveals                      |

The shared easing token is `ease-out-soft`.

Use existing motion tokens rather than introducing arbitrary animation durations.

### 5.2 JavaScript motion tokens

File: `src/components/motion/tokens.ts`

The file exports:

- `EASE_OUT_SOFT`

- `DURATION`

- `DISTANCE`

- `From`

- `offset()`

- `VIEWPORT`

These values keep Motion animations consistent with the CSS motion system.

The `VIEWPORT` configuration makes an animation play once when 20% of the element becomes visible.

### 5.3 Reusable motion components

The `src/components/motion/` directory contains reusable components such as:

- `Reveal`

- `SplitText`

- `Stagger`

- `MaskReveal`

- `Parallax`

- `Grow`

- `Magnetic`

- `TiltCard`

- `ScrollProgress`

Check the individual component implementation before using it, since each component has its own props and behavior.

### 5.4 Reduced motion

Respect users who request reduced motion.

The stylesheet includes `prefers-reduced-motion` handling, and interactive movement should use motion-safe behavior where appropriate.

Avoid adding animations that ignore the existing reduced-motion conventions.

## 6. Accessibility and interaction

Accessibility is part of the design system.

### Keyboard focus

The global stylesheet provides a shared `:focus-visible` treatment:

- 2px outline

- Brand color

- 2px outline offset

Do not remove visible keyboard focus without providing an equally accessible alternative.

### Interactive elements

- Interactive elements must be keyboard reachable.

- Use semantic HTML elements for their intended purpose.

- Provide accessible labels for controls that do not have visible text.

- Provide meaningful alternative text for informative images.

- Ensure text and interface states have sufficient contrast.

- Do not rely on color alone to communicate important information.

### Reduced motion

Animations must respect `prefers-reduced-motion`.

Keep movement subtle and consistent with the shared motion system.

## 7. Guidelines for contributors

When adding or modifying UI:

1. Check whether a suitable shared component already exists.

2. Reuse the correct theme for the page area being developed.

3. Use existing typography, color, spacing, radius, and shadow tokens.

4. Use `cn()` to combine class names.

5. Avoid arbitrary values such as `text-[17px]`.

6. Avoid hard-coded hex colors in component styles.

7. Keep shared components in `src/components/ui/` or `src/components/layout/` according to their responsibility.

8. Keep business logic and API calls out of `components/ui/`.

9. Ensure interactive elements remain keyboard accessible.

10. Respect reduced-motion preferences.

For a new reusable token, update the appropriate theme definition in `src/styles/globals.css` and use the generated utility class.

For a new reusable component, follow the existing component conventions and co-locate its tests where appropriate.

## 8. Maintenance

This document describes the design system as implemented in the source files. If a token, component API, or theme changes, update this guide in the same contribution when the change affects developer usage.

When uncertain, the implementation in `src/styles/globals.css` and the relevant component source file take precedence over examples in this document.

---

**Primary references**

- `src/styles/globals.css`

- `src/components/ui/Button.tsx`

- `src/components/ui/SectionTitle.tsx`

- `src/components/layout/Container.tsx`

- `src/components/layout/PageHeader.tsx`

- `src/components/motion/tokens.ts`
