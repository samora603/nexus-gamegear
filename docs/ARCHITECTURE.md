# Architecture — GameGear Nexus

> **Phase:** Planning  
> **Stack:** React · Vite · TypeScript · Tailwind CSS · React Router · Supabase (future CMS)

---

## 1. Overview

GameGear Nexus is a content-driven gadget review and discovery website. Phase 1 delivers a static React SPA that visually matches the Canva designs. Phase 2 connects a Supabase-backed CMS for editable content. Phase 3 adds authentication, admin tooling, and dynamic product/review pages.

```
┌─────────────────────────────────────────────────────┐
│                     Browser (SPA)                    │
│  React + React Router + Tailwind CSS                │
└──────────────────────┬──────────────────────────────┘
                       │ (Phase 2+)
                       ▼
┌─────────────────────────────────────────────────────┐
│                   Supabase                           │
│  PostgreSQL │ Auth │ Storage │ Edge Functions       │
└─────────────────────────────────────────────────────┘
```

---

## 2. Application Structure

```
/
├── design/                    # Original Canva assets (read-only)
│   └── game gear.zip
├── docs/                      # Planning & architecture docs
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── App.tsx            # Root component + router outlet
│   │   ├── routes.tsx         # Route definitions
│   │   └── providers.tsx      # Context providers (future: Supabase)
│   ├── assets/
│   │   ├── images/            # Optimized production images
│   │   ├── icons/             # SVG icons (logo, social)
│   │   └── fonts/             # Self-hosted if needed
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── PillButton.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── GradientBackground.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeatureCardGrid.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── CategoryCardGrid.tsx
│   │   │   ├── PromoBanner.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── category/
│   │   │   ├── CategoryPageLayout.tsx
│   │   │   ├── SubCategoryNav.tsx
│   │   │   └── ImageCollage.tsx
│   │   └── shared/
│   │       ├── BrandLogo.tsx
│   │       ├── SocialLinks.tsx
│   │       └── PhotoGrid.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CategoryPage.tsx       # Dynamic route for all 6 categories
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   │   ├── useCategories.ts       # Phase 1: static data; Phase 2: Supabase
│   │   └── useSiteSettings.ts
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client (Phase 2)
│   │   └── cn.ts                  # clsx + tailwind-merge utility
│   ├── data/
│   │   ├── categories.ts          # Static seed data (Phase 1)
│   │   ├── features.ts
│   │   └── site-settings.ts
│   ├── types/
│   │   ├── category.ts
│   │   ├── feature.ts
│   │   └── site-settings.ts
│   ├── styles/
│   │   └── index.css              # Tailwind directives + CSS custom properties
│   └── main.tsx
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 3. Routing

| Path | Component | Source Design |
|------|-----------|---------------|
| `/` | `HomePage` | `1.png` |
| `/communication-gadgets` | `CategoryPage` | `2.png` |
| `/entertainment-gadgets` | `CategoryPage` | `3.png` |
| `/computer-gadgets` | `CategoryPage` | `4.png` |
| `/wearable-gadgets` | `CategoryPage` | `5.png` |
| `/photography-gadgets` | `CategoryPage` | `6.png` |
| `/power-charging-gadgets` | `CategoryPage` | `7.png` |
| `*` | `NotFoundPage` | — |

### Future Routes (not in current designs)

| Path | Purpose |
|------|---------|
| `/:category/:subcategory` | Sub-category product listing |
| `/reviews/:slug` | Review detail page |
| `/articles/:slug` | Article/insight detail |
| `/contact` | Redirect to `/#contact` or standalone page |
| `/admin/*` | CMS admin dashboard (auth-protected) |

### Route Configuration (`src/app/routes.tsx`)

```tsx
// Conceptual — not implemented yet
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/:categorySlug', element: <CategoryPage /> },
  { path: '*', element: <NotFoundPage /> },
];
```

Category slugs validated against known categories; unknown slugs → 404.

---

## 4. Component Architecture

### Principles
- **Composition over inheritance** — small, single-purpose components
- **Data-driven pages** — category pages use one template + data
- **Design tokens in Tailwind** — colors, fonts, spacing centralized in `tailwind.config.ts`
- **No screenshot backgrounds** — recreate layouts with real HTML/CSS
- **Progressive CMS integration** — static data files mirror future DB shape

### Component Hierarchy

```
App
└── PageLayout
    ├── SiteHeader (recommended)
    ├── Outlet (React Router)
    │   ├── HomePage
    │   │   ├── HeroSection
    │   │   ├── FeatureCardGrid → FeatureCard[]
    │   │   ├── AboutSection
    │   │   ├── CategoryCardGrid → CategoryCard[]
    │   │   ├── PromoBanner
    │   │   └── ContactSection
    │   │       ├── ContactInfo
    │   │       ├── SocialLinks
    │   │       └── PhotoGrid
    │   └── CategoryPage
    │       └── CategoryPageLayout
    │           ├── CategoryTitle
    │           ├── SubCategoryNav → PillButton[]
    │           └── ImageCollage
    └── SiteFooter (optional — contact section serves as footer on homepage)
```

---

## 5. Styling Strategy

### Tailwind CSS + CSS Custom Properties

```css
/* src/styles/index.css — token layer */
:root {
  --color-purple-900: #2D0B5A;
  --color-purple-700: #6B21A8;
  --color-purple-500: #A855F7;
  --color-indigo-950: #0A041A;
  --color-cyan-400: #22D3EE;
  --color-pink-200: #FBCFE8;
}
```

### Tailwind Config Extensions

- **Font families:** `font-display` (serif), `font-body` (sans)
- **Background images:** gradient utilities + custom collage clip-paths
- **Backdrop blur:** for glassmorphism cards
- **Animation:** subtle hover transitions only (not in design — keep minimal)

### No CSS-in-JS
Stick to Tailwind utility classes + minimal custom CSS for clip-paths and complex collages.

---

## 6. Asset Strategy

| Phase | Approach |
|-------|----------|
| **Phase 1** | Extract images from Canva PNGs → optimize with `@responsive` sizes → store in `src/assets/images/` |
| **Phase 2** | Migrate to Supabase Storage; URLs from database |
| **Production** | Replace with licensed photography; WebP/AVIF with fallbacks |

### Image Optimization
- Use Vite's asset pipeline for bundled images
- `<picture>` with `srcset` for responsive loading
- Lazy-load below-fold images (`loading="lazy"`)
- Preserve aspect ratios from design

### Logo
- Inline SVG component (`BrandLogo.tsx`) for crisp rendering at all sizes

---

## 7. CMS Strategy (Future)

See [CMS_ARCHITECTURE.md](./CMS_ARCHITECTURE.md) for full detail.

**Summary:** Supabase PostgreSQL for structured content, Supabase Storage for media, Supabase Auth for admin access. Public site reads via anon key + RLS policies. Admin dashboard (Phase 3) writes via authenticated role.

**Phase 1 approach:** Static TypeScript data files in `src/data/` shaped identically to future DB entities. Swap data source in hooks when CMS is ready.

---

## 8. Authentication Strategy

| Role | Access | Phase |
|------|--------|-------|
| Public visitor | Read published content | Phase 1 |
| Admin / Editor | CRUD content via admin UI | Phase 3 |
| Service role | Server-side operations only | Phase 3 |

- Supabase Auth with email/password for admin users
- No public user accounts in initial scope
- JWT stored in httpOnly cookies via `@supabase/ssr` if SSR added later; for SPA, `@supabase/supabase-js` with session persistence
- RLS enforces: public SELECT on published content; authenticated INSERT/UPDATE/DELETE for admins

---

## 9. Database Strategy

See [DATABASE_PLAN.md](./DATABASE_PLAN.md) for full schema.

**Summary:** PostgreSQL via Supabase with normalized tables for categories, sub-categories, features, site settings, media assets, and (future) products/reviews/articles.

---

## 10. Storage Strategy

| Bucket | Access | Contents |
|--------|--------|----------|
| `media` | Public read, admin write | Category images, collage photos, feature images |
| `uploads` | Admin only | Draft/unpublished assets |

- Store file path in DB, not full URL (construct URL from Supabase Storage public URL + path)
- Image transformations via Supabase Storage transforms or build-time optimization

---

## 11. Deployment Strategy

### Recommended: Vercel or Netlify

```
Git push → CI (lint + typecheck + build) → Deploy static SPA
```

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 LTS |

### Environment Variables

```bash
# Phase 2+
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Service role key **never** in frontend.

### SPA Routing
Configure host to redirect all routes to `index.html` for client-side routing.

### Future Considerations
- CDN for Supabase Storage assets
- Preview deployments for content review
- Separate staging Supabase project

---

## 12. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Utility functions, hooks, data transforms |
| Component | Vitest + React Testing Library | UI components render correctly |
| E2E | Playwright (Phase 2+) | Critical user flows: home → category → contact |
| Visual | Manual + optional Chromatic | Match Canva designs at 1366 px |
| Accessibility | axe-core in RTL tests | WCAG AA compliance |
| Lint | ESLint + Prettier | Code quality |

**Phase 1 minimum:** lint + typecheck in CI. Component tests for shared UI. Manual visual QA against designs.

---

## 13. Proposed Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | DOM rendering |
| `react-router-dom` | Client-side routing |

### Development

| Package | Purpose |
|---------|---------|
| `vite` | Build tool |
| `typescript` | Type safety |
| `@vitejs/plugin-react` | React support for Vite |
| `tailwindcss` | Utility-first CSS |
| `postcss` | CSS processing |
| `autoprefixer` | CSS vendor prefixes |
| `eslint` | Linting |
| `@eslint/js` | ESLint base config |
| `typescript-eslint` | TypeScript ESLint rules |
| `eslint-plugin-react-hooks` | React hooks linting |
| `eslint-plugin-react-refresh` | HMR linting |
| `prettier` | Code formatting |
| `prettier-plugin-tailwindcss` | Class sorting |

### Phase 2 (CMS)

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Supabase client |

### Phase 3 (Admin + Testing)

| Package | Purpose |
|---------|---------|
| `vitest` | Unit testing |
| `@testing-library/react` | Component testing |
| `@testing-library/jest-dom` | DOM matchers |
| `playwright` | E2E testing |

### Utilities (as needed)

| Package | Purpose |
|---------|---------|
| `clsx` | Conditional class names |
| `tailwind-merge` | Merge Tailwind classes safely |

**Intentionally excluded:** UI component libraries (shadcn, MUI, etc.) — custom components match design identity.

---

## 14. Implementation Phases

### Phase 1 — Static Site (MVP)
1. Scaffold Vite + React + TS + Tailwind + Router
2. Design tokens + global styles
3. Shared UI components (Button, Card, Heading, etc.)
4. Homepage (all 6 sections)
5. Category page template + 6 category pages
6. Extract and optimize design images
7. Responsive layouts (inferred breakpoints)
8. Accessibility pass
9. Deploy to staging

### Phase 2 — CMS Integration
1. Supabase project setup
2. Database migrations
3. Seed data from static files
4. Storage bucket + image migration
5. Replace static data hooks with Supabase queries
6. Environment configuration

### Phase 3 — Admin & Content Expansion
1. Supabase Auth for admins
2. Admin dashboard (CRUD)
3. Sub-category listing pages
4. Product/review detail pages
5. Contact form with DB storage
6. SEO metadata management

### Phase 4 — Production Hardening
1. Licensed image replacement
2. Performance optimization (Lighthouse)
3. E2E test suite
4. Analytics integration
5. Production deployment + monitoring

---

## 15. Configuration & Credentials

| Variable | Required | Phase | Notes |
|----------|----------|-------|-------|
| `VITE_SUPABASE_URL` | Phase 2+ | CMS | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Phase 2+ | CMS | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 3+ | Server only | Never expose to client |

Document all credentials in `.env.example` with placeholder values.
