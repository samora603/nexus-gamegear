# Engineering Guide — GameGear Nexus

> Conventions and workflows for frontend development.

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (default http://localhost:5173)
npm run build        # Typecheck + production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check (CI)
```

### Design Asset Extraction

```bash
bash scripts/extract-design-images.sh
bash scripts/crop-homepage-images.sh
bash scripts/crop-category-images.sh
```

Extracts Canva PNGs from `design/game gear.zip` into `src/assets/dev/canva-exports/` (gitignored, temporary).

---

## Folder Conventions

```
src/
├── assets/dev/          # Temporary Canva extractions (not production)
├── components/
│   ├── ui/              # Design-system primitives (PillButton, GlassCard, …)
│   ├── navigation/      # Minimal nav helpers (CategoryBackNav)
│   └── shared/          # Cross-page shared (BrandLogo)
├── data/                # Static seed data (Phase 1); mirrors future CMS shape
├── layouts/             # Page shells (PageLayout, CategoryLayout)
├── lib/                 # Utilities (cn)
├── pages/               # Route-level components (thin; compose sections later)
├── routes/              # React Router configuration
├── styles/              # Global CSS + Tailwind entry
└── types/               # Shared TypeScript interfaces
```

**Not yet created (intentionally):** `sections/`, `hooks/`, `services/` — added when needed in Phase 1B+.

---

## Component Conventions

- **One component per file**, named PascalCase matching the export
- **Props interfaces** exported alongside components when reused
- Use `@/` path alias for imports
- Use `cn()` from `@/lib/cn` for conditional Tailwind classes
- Prefer composition; avoid prop drilling beyond two levels
- Page components default-export; shared components named-export

### Primitive vs Page vs Section

| Layer | Location | Example |
|-------|----------|---------|
| Primitive | `components/ui/` | `PillButton` |
| Shared | `components/shared/` | `BrandLogo` |
| Layout | `layouts/` | `CategoryLayout` |
| Page | `pages/` | `HomePage` |
| Section | `sections/` (Phase 1B+) | `HeroSection` |

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files | PascalCase for components | `PillButton.tsx` |
| Routes | kebab-case slugs | `/communication-gadgets` |
| CSS tokens | `nexus-*` prefix in Tailwind | `bg-nexus-purple-900` |
| Data keys | camelCase in TS | `heroCtaText` |
| DB fields (future) | snake_case | `hero_cta_text` |

---

## Styling Approach

- **Tailwind CSS** for all styling
- Design tokens in `tailwind.config.ts` + CSS custom properties in `src/styles/index.css`
- No CSS-in-JS, no UI component libraries
- Canva-derived colors use `nexus-*` namespace to avoid Tailwind defaults collision
- Custom gradients via `backgroundImage` extensions

### Design Token Reference

See `tailwind.config.ts` and `docs/DESIGN_ANALYSIS.md` §5–8.

Approximations are documented — do not treat hex values as pixel-perfect without visual QA against Canva exports.

---

## Typography

| Role | Font | Source | Notes |
|------|------|--------|-------|
| Display / headings | **Playfair Display** | Google Fonts | Serif, all-caps in designs |
| Body / UI | **Inter** | Google Fonts | Clean sans-serif for paragraphs |

**Decision rationale:** Playfair Display closely matches the high-contrast serif in Canva page titles and logo. Inter provides readable body text and UI labels. Both are free, well-supported, and load via `@import` in `index.css`.

Category page pill buttons use `font-display` (serif) per Canva. Homepage card labels may use `font-body` when implemented.

---

## Responsive Strategy

**Canva exports are desktop-only at 1366px width.** Mobile/tablet behavior is **inferred**, not specified.

| Breakpoint | Tailwind | Intended use |
|------------|----------|--------------|
| `< 640px` | default | Single column; stacked hero; full-width pills |
| `640px+` | `sm:` | 2-column grids where appropriate |
| `1024px+` | `lg:` | Match desktop layout; side-by-side category columns |
| `1366px` | `design:` / `max-w-design` | Design canvas reference width |

All responsive layouts require visual QA — no mobile Canva designs exist.

Foundation utilities established; full responsive pages come in Phase 1B/1C.

---

## Asset Strategy

### Source (read-only)

| Asset | Location |
|-------|----------|
| Original Canva export | `design/game gear.zip` |
| 7 page PNGs inside zip | `1.png` – `7.png` |

### Development (temporary)

| Asset | Location | Git |
|-------|----------|-----|
| Extracted PNGs | `src/assets/dev/canva-exports/` | Ignored |
| Extract script | `scripts/extract-design-images.sh` | Tracked |

### Production (future)

| Asset | Location | Notes |
|-------|----------|-------|
| Optimized images | `src/assets/images/` or Supabase Storage | Licensed, WebP/AVIF |
| Icons / logo SVG | `src/assets/icons/` | Scalable, accessible |
| Favicon | `public/favicon.svg` | Placeholder atomic icon |

**Rule:** Never represent Canva-derived/cropped screenshots as production-ready assets. Document temporary usage in code comments and PR descriptions.

---

## Environment Variables

| Variable | Phase | Required | Description |
|----------|-------|----------|-------------|
| `VITE_SUPABASE_URL` | 2+ | No | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | 2+ | No | Public anon key |

Copy `.env.example` to `.env` when Supabase is integrated. Phase 1A requires no env vars.

---

## Git Workflow

1. Planning docs on `main` — initial commit `f2044ab`
2. Feature work in focused commits with conventional prefixes:
   - `chore:` tooling, config
   - `feat:` new functionality
   - `fix:` bug fixes
   - `docs:` documentation only
3. Do not commit `node_modules/`, `dist/`, `.env`, or extracted Canva PNGs
4. Do not modify `design/game gear.zip`

---

## Current Limitations

- No homepage or category Canva UI implemented yet
- No Supabase / CMS / auth
- Sub-category pills are visual-only (no routes)
- Contact is homepage section only (`/#contact`)
- Hero CTA text preserved as `VIEW PROPERTIES` (content ambiguity)
- `CategoryBackNav` added for usability — not in Canva designs
- Responsive layouts inferred from 1366px desktop exports
- Temporary dev imagery must be replaced before production

---

## Quality Gates

Before merging implementation phases:

```bash
npm run lint
npm run format:check
npm run build
```

Manual visual comparison against extracted Canva PNGs at 1366px width.
