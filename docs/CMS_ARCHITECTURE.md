# CMS Architecture — GameGear Nexus

> **Backend:** Supabase (PostgreSQL + Storage + Auth)  
> **Phase:** 2A — Planning (not implemented)  
> **Principle:** The Phase 1 static frontend is the source of truth for content boundaries. The CMS wraps what already exists — it does not reshape the UI.

---

## 1. Goals

1. Non-developers can edit site copy, categories, pills, and images without changing React source
2. Content updates do not require redeploying the frontend (client fetch + cache invalidation)
3. Media lives in Supabase Storage — not git, not PostgreSQL blobs
4. Admin access is protected by Supabase Auth + RLS
5. Public site reads **published** content only via the anon key
6. Visual components remain unchanged — only the data source switches

---

## 2. Static Data Inventory (Phase 1 Audit)

Complete inventory of hardcoded content as of commit `0b2db6f`.

### 2.1 `src/data/site-settings.ts`

| Field | Example | Classification |
|-------|---------|----------------|
| `siteName` | GameGear Nexus | **CMS** → `site_settings` |
| `tagline` | DISCOVER. COMPARE. DOMINATE. | **CMS** → `site_settings` |
| `heroHeadline` | Next-Gen Gear, Expertly Reviewed. | **CMS** → `site_settings` |
| `heroCtaText` | VIEW PROPERTIES | **CMS** → `site_settings` |
| `heroCtaHref` | #explore-solutions | **CMS** → `site_settings` |
| `aboutHeading` | What we are about | **CMS** → `site_settings` |
| `aboutBody` | paragraph | **CMS** → `site_settings` |
| `exploreHeading` | Explore our solutions | **CMS** → `site_settings` |
| `promoBannerText` | Power up your next-level… | **CMS** → `site_settings` |
| `contactHeading` | CONTACT US! | **CMS** → `site_settings` |
| `contactPhone` | 0793510481 | **CMS** → `site_settings` |
| `contactEmail` | jetagakoi@gmail.com | **CMS** → `site_settings` |
| `contactAnchor` | #contact | **App config** (routing constant) |
| `socialLinks[]` | platform, label, href | **CMS** → `social_links` |

### 2.2 `src/data/features.ts`

| Field | Classification |
|-------|----------------|
| `id` | Stable key → DB UUID + optional `key` slug |
| `title` | **CMS** |
| `description` | **CMS** (card + detail copy) |
| `image` | **Media** → `media_assets` + Storage |
| `imageAlt` | **CMS** |

3 rows — homepage feature cards + supporting copy.

### 2.3 `src/data/categories.ts`

| Field | Classification |
|-------|----------------|
| `slug` | **CMS** (stable URL identifier) |
| `name` | **CMS** (internal/admin name) |
| `displayTitle` | **CMS** (category page H1, e.g. COMMUNICATION GADGETS) |
| `cardLabel` | **CMS** (homepage card label) |
| `cardImage` | **Media** → FK to `media_assets` |
| `designFile` | **App config** (dev reference only — not stored in DB) |
| `offsetCard` | **CMS** (homepage grid layout flag) |
| `subCategories[]` | **CMS** → `category_pills` |
| `subCategories[].slug` | **CMS** (stable pill identifier) |
| `subCategories[].name` | **CMS** (pill label) |

6 categories, 19 pills total.

### 2.4 `src/data/category-collages.ts`

| Field | Classification |
|-------|----------------|
| `containerClassName` | **App config** (responsive min-heights — mapped from `container_variant`) |
| `images[]` | **CMS** → `collage_layers` (type=image) |
| `images[].id` | Stable `layer_key` in DB |
| `images[].src` | **Media** → `media_assets` |
| `images[].alt` | **CMS** |
| `images[].className` | **Decomposed** → numeric position + variant enums in DB; CSS mapping in code |
| `images[].decorative` | **CMS** |
| `panels[]` | **CMS** → `collage_layers` (type=panel) |
| `panels[].className` | **Decomposed** → `panel_variant` enum + numeric position in DB |
| `overlayText` | **CMS** → fields on `category_collages` |

24 collage images across 6 categories. 11 decorative panels. 1 overlay text (communication only).

### 2.5 Component-level static content

| Location | Content | Classification |
|----------|---------|----------------|
| `HeroBrandLogo.tsx` | SVG logo geometry | **App config** (Phase 2: optional logo upload replaces) |
| `BrandLogo.tsx` | SVG icon | **App config** |
| `CategoryCard.tsx` | Arrow icon SVG | **App config** |
| `SocialLinks.tsx` | Icon SVG paths | **App config** |
| `PillButton.tsx` | Pill styling | **App config** |
| `tailwind.config.ts` | Design tokens | **App config** |
| `routes/router.tsx` | Route paths | **App config** |

### 2.6 Media assets (38 files)

**Homepage (`src/assets/images/home/`) — 14 files:**

| File | Used by | Classification |
|------|---------|----------------|
| `hero-background.webp` | HeroSection | **Media** |
| `hero-phone.webp` | HeroSection | **Media** |
| `feature-ai.webp` | features[0] | **Media** |
| `feature-gaming.webp` | features[1] | **Media** |
| `feature-audio.webp` | features[2] | **Media** |
| `feature-section-bg.webp` | FeatureGrid | **Media** → `content_blocks` |
| `promo-banner-bg.webp` | PromoBanner | **Media** → `content_blocks` |
| `contact-grid.webp` | ContactSection | **Media** (composite; future: 8 individual) |
| `category-*.webp` (×6) | categories cardImage | **Media** |

**Category collages (`src/assets/images/category/{slug}/`) — 24 files:**

Mapped per category in `category-collages.ts`. All **Media** → Storage under `media/categories/{slug}/`.

---

## 3. Content Classification Summary

### A. CMS-managed (PostgreSQL + Storage)

- Site settings (name, tagline, hero, about, promo, contact)
- Social links
- Feature cards (title, description, alt, image ref)
- Content block backgrounds (feature section, promo banner)
- Categories (slug, names, titles, labels, ordering, offset flag, card image)
- Category pills (labels, ordering — decorative for now)
- Collage composition (layers, panels, overlay text, image refs)
- Contact grid images (Phase 1: 1 composite; schema supports 8)
- All image metadata (path, alt, dimensions)

### B. Application configuration (code)

- React component structure and section order
- Routing (`/`, `/:categorySlug`, `/contact` redirect)
- Design tokens (Tailwind config)
- Collage **rendering engine** — maps DB position/variant enums → CSS
- Panel variant definitions (dark-overlay, white-window, etc.)
- Clip-path variant definitions (chamfer-bl, notch-tr, etc.)
- Container responsive height defaults
- CategoryBackNav (usability addition)
- Pill/button visual styling
- Logo SVG geometry (until logo upload is added)
- `designFile` dev references

### C. Media (Supabase Storage)

- All `.webp` images currently in `src/assets/images/`
- Future: product images, review hero images, article images (Phase 3)

---

## 4. Comparison with Pre-Phase-1 Plan

| Original plan | Status after Phase 1 audit |
|---------------|--------------------------|
| `site_settings` | **Valid** — extend with hero, about, promo, contact fields (merge `hero_section` into it) |
| `hero_section` separate table | **Change** — merge into `site_settings` to match `site-settings.ts` |
| `features` | **Valid** — add `image_alt`, optional stable `key` |
| `content_blocks` | **Valid** — promo banner + feature section background |
| `categories` | **Extend** — add `display_title`, `card_label`, `offset_card`; remove unused `card_icon_path` |
| `sub_categories` | **Rename** → `category_pills` (decorative, no routes yet) |
| `category_media` | **Replace** → `category_collages` + `collage_layers` (supports panels + positioning) |
| `contact_grid_images` | **Valid** — note Phase 1 uses 1 composite image |
| `media_assets` | **Valid** — central media registry |
| `navigation_items` | **Defer** — not used in Phase 1; CategoryBackNav is code-level |
| Tailwind in DB | **Reject** — position data as percentages + variant enums only |

---

## 5. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Public SPA (React)                       │
│                                                              │
│  Pages → Services → (static fallback | Supabase client)     │
│  Components consume normalized domain types only               │
└──────────────────────────┬──────────────────────────────────┘
                           │ anon key, SELECT published
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  PostgreSQL          Storage (media/)        Auth (admins)    │
│  RLS: public read    Public read             app_metadata    │
│       admin write    Admin write only        role=admin      │
└──────────────────────────┬──────────────────────────────────┘
                           │ authenticated
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Admin UI (Phase 3 — not yet built)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Collage Data Strategy

### Problem

Phase 1 stores collage composition as Tailwind class strings in `category-collages.ts`. This must not be copied into the database.

### Solution: separate content from rendering

**Database stores:**
- Which image (media FK)
- Alt text, decorative flag
- Layer type (image | panel)
- Normalized position: `pos_left_pct`, `pos_top_pct`, `width_pct`, `height_pct` (0–100)
- `z_index`, `rotation_deg`, `opacity`
- `clip_variant` enum: `none`, `chamfer_bottom_left`, `notch_top_right`
- `panel_variant` enum: `dark_overlay`, `white_window`, `burgundy`, `wood_surface`, `grey_accent`, `glass_frame`

**Application code stores:**
- Mapping from `panel_variant` → CSS classes (`src/lib/collage-variants.ts`)
- Mapping from `clip_variant` → clip-path CSS
- Responsive overrides for container min-height
- Shadow, rounded-corner defaults

**Transform pipeline:**
```
DB collage_layers
  → category.service.ts (fetch + join media)
  → collage-mapper.ts (enum → CategoryCollageConfig)
  → CategoryImageCollage (unchanged render component)
```

This preserves the existing `CategoryCollageConfig` TypeScript interface as the **view model** while the DB holds portable numeric data.

### Seed migration approach

1. Parse current `category-collages.ts` positions manually into percentage values (one-time seed script)
2. Store variant enums where class strings encode known patterns (e.g. `bg-indigo-950/80 -skew-x-6` → `dark_overlay`)

---

## 7. Storage Architecture

### Buckets

| Bucket | Public read | Admin write | Purpose |
|--------|-------------|-------------|---------|
| `media` | Yes | Yes | Published production assets |
| `uploads` | No | Yes | Draft uploads before publish |

### Path convention

```
media/
├── site/
│   ├── logo.svg
│   └── favicon.svg
├── hero/
│   ├── background.webp
│   └── phone.webp
├── features/
│   └── {feature_key}.webp
├── blocks/
│   ├── feature-section-bg.webp
│   └── promo-banner-bg.webp
├── categories/
│   └── {category_slug}/
│       ├── card.webp
│       └── collage/
│           └── {layer_key}.webp
└── contact/
    └── grid-{n}.webp
```

### Media lifecycle

```
Admin upload → uploads/{uuid}.webp (private)
       ↓ review
Publish → copy/move to media/{path}.webp
       ↓
media_assets row created/updated (path, alt, dimensions)
       ↓
Content record references media_assets.id
       ↓
Public site resolves Storage public URL
```

### Orphan handling (Phase 3)

- `media_assets` tracks `referenced_by` via FK constraints — deleting content nullifies or blocks
- Periodic admin job: list Storage objects with no DB reference
- Do not auto-delete on content removal without admin confirmation

---

## 8. Data Access Layer

Components must not contain raw Supabase queries.

### Proposed structure

```
src/
├── lib/
│   ├── supabase.ts              # Client init (Phase 2B)
│   ├── collage-variants.ts      # panel/clip enum → CSS (app config)
│   └── collage-mapper.ts        # DB rows → CategoryCollageConfig
├── services/
│   ├── site-content.service.ts  # site_settings + social_links
│   ├── homepage.service.ts      # features + content_blocks
│   └── category.service.ts      # categories + pills + collages
├── repositories/                # Optional thin Supabase query layer
│   ├── site.repository.ts
│   ├── homepage.repository.ts
│   └── category.repository.ts
└── hooks/
    ├── useSiteContent.ts
    ├── useHomepageContent.ts
    └── useCategory.ts
```

### Service pattern

```typescript
// category.service.ts — conceptual
export async function getCategoryPage(slug: string): Promise<CategoryPageData | null> {
  if (!isSupabaseConfigured()) {
    return getCategoryPageFromStatic(slug)  // Phase 1 fallback during migration
  }
  const row = await categoryRepository.findPublishedBySlug(slug)
  return mapCategoryPageRow(row)
}
```

Pages call hooks → hooks call services → services return **domain types** matching existing component props.

### Domain types (unchanged component contracts)

- `SiteSettings` — mirrors current `site-settings.ts`
- `Feature` — mirrors `features.ts`
- `Category` — mirrors `category.ts` (add `id` when from DB)
- `CategoryCollageConfig` — mirrors `collage.ts`

---

## 9. Migration Strategy

```
Phase 1 static TS/data
        ↓
Phase 2B: Supabase project + migrations (this plan)
        ↓
Phase 2C: Seed script from static data + upload images to Storage
        ↓
Phase 2D: Services + hooks with static fallback toggle
        ↓
Phase 2E: Switch env flag to Supabase source; verify visual parity
        ↓
Phase 3: Admin dashboard CRUD
```

**Rules:**
- Do not rewrite visual components
- Seed data must reproduce current site exactly
- Static files remain as fallback until Supabase verified
- One env flag: `VITE_CONTENT_SOURCE=static|supabase` (optional, for gradual rollout)

---

## 16. Seed process

Repeatable seed: `npm run seed:cms` (`scripts/seed-cms.mjs`).

It checks the manifest against `src/data/*` and the WebP files under `src/assets/images/`, uploads those files to the `media` bucket, and upserts the CMS tables. Paths stored in `media_assets.storage_path` are relative to the bucket (`home/...`, `categories/<slug>/...`). The public URL is `{SUPABASE_URL}/storage/v1/object/public/media/{storage_path}`.

The script needs `SUPABASE_SERVICE_ROLE_KEY` in the environment. Do not commit that key. Anonymous writes stay denied.

`designFile` and `contactAnchor` are frontend-only and are not columns. Overlay text is stored; overlay pixel classes are not, because the schema has no width for that text box. Some collage clips and the dark-overlay skew are recorded in the seed log when they do not map onto the approved enums.

---

## 10. Security Model

### Auth

- Supabase Auth, email/password, admin users only
- Admin role in `app_metadata.role = 'admin'` (never `user_metadata`)
- No public sign-up endpoint

### RLS summary

| Audience | SELECT | INSERT | UPDATE | DELETE |
|----------|--------|--------|--------|--------|
| anon | published content only | no | no | no |
| authenticated admin | all | yes | yes | yes |
| service_role | Edge Functions only | — | — | — |

### Storage policies

- Public SELECT on `media` bucket
- Admin INSERT/UPDATE/DELETE on `media` and `uploads`
- Upsert requires INSERT + SELECT + UPDATE policies

### Frontend

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` in Vite env

See [DATABASE_PLAN.md](./DATABASE_PLAN.md) §7 for full RLS policy list.

---

## 11. Caching & Performance

### Read pattern

- Homepage: 1 settings query + 1 features query + 1 categories query (or single RPC/view)
- Category page: 1 category query with nested pills + collage layers + media joins
- Writes: rare (admin only)

### Recommendations (minimal)

| Strategy | Recommendation |
|----------|----------------|
| Client cache | `@tanstack/react-query` with `staleTime: 5 min` |
| Homepage fetch | Single Supabase RPC `get_homepage_content()` returning JSON |
| Category fetch | Single RPC `get_category_page(slug)` with nested joins |
| N+1 avoidance | Use Postgres joins or RPC — never per-layer fetch in loop |
| Images | Storage public URLs; long CDN cache; include content hash in filename on upload |
| Bundle | Remove static image imports once Storage URLs verified |

Do not add Redis, edge caching, or SSG until traffic warrants it.

---

## 12. Environment Variables

### Browser-safe (Vite)

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_CONTENT_SOURCE=supabase   # optional: static | supabase
```

### Server / CI only (never in SPA)

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Edge Functions, seed scripts, CI migrations
```

### Local development

```bash
# .env.local (gitignored)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## 13. Future CMS Capabilities (schema-ready)

| Capability | Phase | Schema support |
|------------|-------|----------------|
| Edit homepage copy | 3 | `site_settings`, `features`, `content_blocks` |
| Edit categories | 3 | `categories`, `category_pills` |
| Manage collage | 3 | `category_collages`, `collage_layers` |
| Upload images | 3 | `media_assets` + Storage |
| Publish/unpublish | 2 | `published` boolean on all content tables |
| Admin login | 3 | Supabase Auth |
| Contact form inbox | 4 | `contact_submissions` |
| Products/reviews | 4 | `products`, `reviews` |
| Sub-category routes | 4 | `category_pills` already has slugs |

---

## 14. Unresolved Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Hero in separate table vs site_settings | split / merge | **Merge** — matches Phase 1 single config file |
| Contact grid: 1 vs 8 images | composite / individual | **Schema supports 8**; seed with 1 composite initially |
| Collage responsive overrides | DB jsonb / code | **Code** for Phase 2; jsonb overrides in Phase 3 if needed |
| Admin app location | same SPA / separate | **Same SPA** `/admin/*` routes (Phase 3) |
| React Query vs SWR | either | **React Query** — better nested cache invalidation |
| Seed script language | SQL / TypeScript | **TypeScript** — can import static data directly |

---

## 15. What NOT to Build in Phase 2A

- [x] Architecture documentation (this file)
- [ ] Supabase project
- [ ] npm install `@supabase/supabase-js`
- [ ] Migrations
- [ ] Seed scripts
- [ ] Service layer implementation
- [ ] Admin UI
- [ ] Auth UI
- [ ] Replace static data in components

**Next:** Phase 2B — Supabase project setup + migrations + seed.

---

## 16. Single-author blog

There is no existing blog screen in the Canva pages. `/blog` and `/blog/:slug` use the category gradient, display type, and back navigation.

- One `blog_authors` row, key `site-owner`, display name taken from the site name. Posts reference that row. There is no author admin.
- `blog_posts.status` is `draft` or `published`. A published row must have `published_at`. Anonymous SELECT allows only published rows whose `published_at` is not in the future. There is no public INSERT, UPDATE, or DELETE. Admin writes use the existing `is_admin()` policy through the CMS.
- Body copy is plain text paragraphs. React renders text nodes. Tailwind classes are not stored.
- `featured_image_id` points at `media_assets`. The public URL comes from the existing media resolver. A missing image does not block the article.
- SEO title and description fall back to the title and excerpt.
- Product categories are not reused as blog tags.
- The migration seeds one unpublished draft, `development-seed-draft`. It is not production content. `npm run seed:cms` upserts the same draft on `slug`.
- A failed blog read shows an unavailable message. It does not substitute invented articles.

---

## 17. Admin authentication

Phase 2F adds sign-in only. The future CMS admin (Phase 2G) should sit behind `/admin` and call the existing Supabase browser client. It must not send the service-role key.

- Sign-in uses `signInWithPassword`. The session is the Supabase Auth session. Admin UI state reads `user.app_metadata.role === 'admin'`.
- `public.is_admin()` still reads `auth.jwt() -> app_metadata ->> role`. A matching frontend flag does not grant database writes.
- Create the owner in the Supabase dashboard. Set App Metadata, not User Metadata, to `{ "role": "admin" }`. Do not store the password in git.
- `/admin/login` is public. Other `/admin` paths redirect signed-out visitors to the login page with an internal `next` path. Signed-in non-admins see an unauthorized state.

---

## 18. Authenticated CMS

Phase 2G replaces the authorization shell with dashboard, blog, and media screens. There is still one owner. The CMS does not manage users, roles, or authors.

- Routes: `/admin`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/:id`, `/admin/media`.
- Blog posts always use the `site-owner` author row. If that row is missing, the editor shows a configuration error and does not insert another author.
- Save draft sets `status = draft` and `published_at = null`. Publish sets `status = published` and keeps an existing `published_at`, or stamps the current time. Return to draft clears `published_at`.
- Slugs are normalized to lowercase hyphenated text. The unique constraint on `blog_posts.slug` rejects duplicates.
- Article content stays plain text. The public page still renders text nodes.
- SEO title and description are optional. The public mapper still falls back to title and excerpt.
- Featured images are `featured_image_id` values chosen from `media_assets`.
- Uploads validate JPEG, PNG, WebP, GIF, and SVG files up to 8 MB, store them at `admin/<uuid>.<ext>` in the public `media` bucket, then insert `media_assets`. The private `uploads` bucket is unchanged.
- Delete checks features, collage layers, contact images, categories, content blocks, site settings, and blog posts before removing a media row. A referenced file is left in place.
- Mutations use `getSupabaseClient()` with the Auth session. `public.is_admin()` remains the database boundary.

Phase 2H checked the live project on 2026-10-13. The existing confirmed Auth user now has App Metadata `role` `admin`, with `provider` and `providers` preserved. `is_admin()` and RLS were not changed. The CMS was not signed in during that update. Homepage CMS stays blocked until an admin session completes the draft, publish, unpublish, delete, and upload checks.

---

## 19. Category management

Phase 2I adds `/admin/categories` and `/admin/categories/:id`. The editor updates `name`, `display_title`, `card_label`, `sort_order`, and `published` on `categories`. It does not change `slug`, `card_media_id`, or collage rows.

Pills keep their existing `slug` when the label changes. A new pill gets a slug from its label. Reordering writes `sort_order`. Removing a pill deletes that row. There is no category delete.

Public category routes still call `loadPublishedCms()`. RLS already hides unpublished categories and pills. If the published snapshot loads and omits a known category slug, the page is not found. A failed CMS request still uses the static collage. The homepage cards stay on `src/data/categories.ts`, so they do not follow title or publication edits.

Writes use `categories_admin_all` and `category_pills_admin_all`, both gated by `is_admin()`. No migration was added.
