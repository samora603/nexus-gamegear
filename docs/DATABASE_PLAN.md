# Database Plan — GameGear Nexus

> **Database:** PostgreSQL via Supabase  
> **Phase:** 2A — Planning (revised against Phase 1 implementation)  
> **Convention:** snake_case tables/columns, UUID primary keys, `timestamptz` for dates  
> **Source of truth for requirements:** Phase 1 static data (`src/data/`, commit `0b2db6f`)

---

## 1. Design Principles

1. **Frontend-first** — schema mirrors what components already consume
2. **Stable IDs** — UUIDs in DB; slugs for URLs only
3. **No CSS in DB** — collage positions as percentages + variant enums; rendering in code
4. **Media in Storage** — PostgreSQL stores paths/metadata only
5. **RLS always on** — public read published; admin write via `app_metadata.role`
6. **Minimal normalization** — avoid tables that add complexity without CMS value

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram
    site_settings ||--o{ social_links : has
    site_settings {
        uuid id PK
        text site_name
        text tagline
        text hero_headline
        text hero_cta_text
        text hero_cta_href
        uuid hero_background_media_id FK
        uuid hero_phone_media_id FK
        text about_heading
        text about_body
        text explore_heading
        text promo_banner_text
        text contact_heading
        text contact_phone
        text contact_email
        uuid logo_media_id FK
        boolean published
    }

    media_assets {
        uuid id PK
        text storage_path UK
        text file_name
        text mime_type
        text alt_text
        int width
        int height
        int file_size_bytes
        timestamptz created_at
    }

    features {
        uuid id PK
        text key UK
        text title
        text description
        text image_alt
        uuid media_id FK
        int sort_order
        boolean published
    }

    content_blocks {
        uuid id PK
        text key UK
        text body
        uuid media_id FK
        boolean published
    }

    categories ||--o{ category_pills : has
    categories ||--|| category_collages : has
    category_collages ||--o{ collage_layers : contains
    categories {
        uuid id PK
        text slug UK
        text name
        text display_title
        text card_label
        uuid card_media_id FK
        boolean offset_card
        int sort_order
        boolean published
    }

    category_pills {
        uuid id PK
        uuid category_id FK
        text slug
        text label
        int sort_order
        boolean published
    }

    category_collages {
        uuid id PK
        uuid category_id FK UK
        text container_variant
        text overlay_primary
        text overlay_secondary
        numeric overlay_pos_left_pct
        numeric overlay_pos_top_pct
        boolean published
    }

    collage_layers {
        uuid id PK
        uuid collage_id FK
        text layer_key
        text layer_type
        uuid media_id FK
        text panel_variant
        text clip_variant
        text alt_text
        numeric pos_left_pct
        numeric pos_top_pct
        numeric width_pct
        numeric height_pct
        int z_index
        numeric rotation_deg
        numeric opacity
        boolean decorative
        int sort_order
        boolean published
    }

    contact_grid_images {
        uuid id PK
        uuid media_id FK
        text alt_text
        int sort_order
        boolean published
    }

    social_links {
        uuid id PK
        text platform UK
        text label
        text url
        int sort_order
        boolean published
    }

    media_assets ||--o{ features : image
    media_assets ||--o{ content_blocks : background
    media_assets ||--o{ categories : card
    media_assets ||--o{ collage_layers : image
    media_assets ||--o{ contact_grid_images : image
```

---

## 3. Entity Overview

| Entity | Purpose | Rows (seed) |
|--------|---------|-------------|
| `site_settings` | Global site + homepage text + hero + contact | 1 |
| `social_links` | Facebook, Twitter, Instagram URLs | 3 |
| `features` | Homepage feature cards | 3 |
| `content_blocks` | Keyed background/text blocks | 2 |
| `categories` | Six gadget categories | 6 |
| `category_pills` | Decorative sub-category pills | 19 |
| `category_collages` | One collage config per category | 6 |
| `collage_layers` | Images + panels within collages | ~35 |
| `media_assets` | Storage metadata registry | ~38 |
| `contact_grid_images` | Contact section photo grid | 1–8 |

**Deferred (Phase 4):** `products`, `reviews`, `articles`, `contact_submissions`

**Removed from original plan:**
- `hero_section` — merged into `site_settings`
- `sub_categories` — renamed to `category_pills`
- `category_media` — replaced by `collage_layers`
- `navigation_items` — not used in Phase 1
- `card_icon_path` — arrow icon is code-level SVG

---

## 4. Table Definitions

### 4.1 `site_settings`

Single-row table. Matches `src/data/site-settings.ts`.

| Column | Type | Constraints | Maps from |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | — |
| `site_name` | `text` | NOT NULL | `siteName` |
| `tagline` | `text` | NOT NULL | `tagline` |
| `hero_headline` | `text` | NOT NULL | `heroHeadline` |
| `hero_cta_text` | `text` | NOT NULL | `heroCtaText` |
| `hero_cta_href` | `text` | NOT NULL | `heroCtaHref` |
| `hero_background_media_id` | `uuid` | FK → `media_assets.id`, nullable | hero-background.webp |
| `hero_phone_media_id` | `uuid` | FK → `media_assets.id`, nullable | hero-phone.webp |
| `about_heading` | `text` | NOT NULL | `aboutHeading` |
| `about_body` | `text` | NOT NULL | `aboutBody` |
| `explore_heading` | `text` | NOT NULL | `exploreHeading` |
| `promo_banner_text` | `text` | NOT NULL | `promoBannerText` |
| `contact_heading` | `text` | NOT NULL | `contactHeading` |
| `contact_phone` | `text` | NOT NULL | `contactPhone` |
| `contact_email` | `text` | NOT NULL | `contactEmail` |
| `logo_media_id` | `uuid` | FK → `media_assets.id`, nullable | future logo upload |
| `meta_title` | `text` | nullable | future SEO |
| `meta_description` | `text` | nullable | future SEO |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

---

### 4.2 `social_links`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `platform` | `text` | NOT NULL, UNIQUE (`facebook`, `twitter`, `instagram`) |
| `label` | `text` | NOT NULL |
| `url` | `text` | NOT NULL |
| `sort_order` | `int` | NOT NULL, default 0 |
| `published` | `boolean` | NOT NULL, default `true` |
| `updated_at` | `timestamptz` | default `now()` |

---

### 4.3 `media_assets`

Central registry for Supabase Storage files. No binary data in Postgres.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `storage_path` | `text` | NOT NULL, UNIQUE |
| `file_name` | `text` | NOT NULL |
| `mime_type` | `text` | NOT NULL |
| `alt_text` | `text` | nullable |
| `width` | `int` | nullable |
| `height` | `int` | nullable |
| `file_size_bytes` | `int` | nullable |
| `created_at` | `timestamptz` | default `now()` |

**URL construction (frontend):**
```typescript
const url = `${SUPABASE_URL}/storage/v1/object/public/media/${storage_path}`
```

---

### 4.4 `features`

| Column | Type | Constraints | Maps from |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | — |
| `key` | `text` | NOT NULL, UNIQUE | `id` (ai-power, etc.) |
| `title` | `text` | NOT NULL | `title` |
| `description` | `text` | NOT NULL | `description` |
| `image_alt` | `text` | NOT NULL | `imageAlt` |
| `media_id` | `uuid` | FK → `media_assets.id`, NOT NULL | `image` |
| `sort_order` | `int` | NOT NULL, default 0 | array index |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

---

### 4.5 `content_blocks`

Keyed blocks for assets/text not tied to a single field.

| Column | Type | Constraints | Seed keys |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | — |
| `key` | `text` | NOT NULL, UNIQUE | — |
| `body` | `text` | nullable | — |
| `media_id` | `uuid` | FK → `media_assets.id`, nullable | — |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

**Seed keys:**
- `feature_section_bg` → feature-section-bg.webp
- `promo_banner_bg` → promo-banner-bg.webp

---

### 4.6 `categories`

| Column | Type | Constraints | Maps from |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | — |
| `slug` | `text` | NOT NULL, UNIQUE | `slug` |
| `name` | `text` | NOT NULL | `name` |
| `display_title` | `text` | NOT NULL | `displayTitle` |
| `card_label` | `text` | NOT NULL | `cardLabel` |
| `card_media_id` | `uuid` | FK → `media_assets.id`, nullable | `cardImage` |
| `offset_card` | `boolean` | NOT NULL, default `false` | `offsetCard` |
| `sort_order` | `int` | NOT NULL, default 0 | array order |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `created_at` | `timestamptz` | default `now()` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

**Seed slugs:** `communication-gadgets`, `entertainment-gadgets`, `computer-gadgets`, `wearable-gadgets`, `photography-gadgets`, `power-charging-gadgets`

---

### 4.7 `category_pills`

Decorative pills on category pages. Renamed from `sub_categories` to reflect Phase 1 behavior (no routes).

| Column | Type | Constraints | Maps from |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | — |
| `category_id` | `uuid` | FK → `categories.id` ON DELETE CASCADE | — |
| `slug` | `text` | NOT NULL | `subCategories[].slug` |
| `label` | `text` | NOT NULL | `subCategories[].name` |
| `sort_order` | `int` | NOT NULL, default 0 | array index |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

**Unique:** `(category_id, slug)`

---

### 4.8 `category_collages`

One row per category. Container + overlay text configuration.

| Column | Type | Constraints | Maps from |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK | — |
| `category_id` | `uuid` | FK → `categories.id` ON DELETE CASCADE, UNIQUE | — |
| `container_variant` | `text` | NOT NULL, default `'default'` | maps to responsive min-heights in code |
| `overlay_primary` | `text` | nullable | `overlayText.primary` |
| `overlay_secondary` | `text` | nullable | `overlayText.secondary` |
| `overlay_pos_left_pct` | `numeric(5,2)` | nullable | derived from className |
| `overlay_pos_top_pct` | `numeric(5,2)` | nullable | derived from className |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

---

### 4.9 `collage_layers`

Unified table for collage **images** and **decorative panels**.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK | — |
| `collage_id` | `uuid` | FK → `category_collages.id` ON DELETE CASCADE | — |
| `layer_key` | `text` | NOT NULL | stable key: `primary`, `tv-main`, etc. |
| `layer_type` | `text` | NOT NULL, CHECK IN (`image`, `panel`) | — |
| `media_id` | `uuid` | FK → `media_assets.id`, nullable | required when `layer_type = image` |
| `panel_variant` | `text` | nullable | required when `layer_type = panel`; see §5 |
| `clip_variant` | `text` | nullable | see §5; images only |
| `alt_text` | `text` | nullable | CMS-managed; required for non-decorative images |
| `pos_left_pct` | `numeric(5,2)` | NOT NULL | 0–100 |
| `pos_top_pct` | `numeric(5,2)` | NOT NULL | 0–100 |
| `width_pct` | `numeric(5,2)` | NOT NULL | 0–100 |
| `height_pct` | `numeric(5,2)` | nullable | null = auto aspect ratio |
| `z_index` | `int` | NOT NULL, default 0 | — |
| `rotation_deg` | `numeric(5,2)` | NOT NULL, default 0 | — |
| `opacity` | `numeric(3,2)` | NOT NULL, default 1.0 | 0–1 |
| `decorative` | `boolean` | NOT NULL, default `false` | — |
| `sort_order` | `int` | NOT NULL, default 0 | tie-breaker for same z_index |
| `published` | `boolean` | NOT NULL, default `true` | — |
| `updated_at` | `timestamptz` | default `now()` | — |

**Unique:** `(collage_id, layer_key)`

**Check constraints:**
```sql
CHECK (
  (layer_type = 'image' AND media_id IS NOT NULL)
  OR (layer_type = 'panel' AND panel_variant IS NOT NULL)
)
```

---

### 4.10 `contact_grid_images`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `media_id` | `uuid` | FK → `media_assets.id`, NOT NULL |
| `alt_text` | `text` | nullable |
| `sort_order` | `int` | NOT NULL, default 0 |
| `published` | `boolean` | NOT NULL, default `true` |
| `created_at` | `timestamptz` | default `now()` |

**Phase 1 seed:** 1 row (composite `contact-grid.webp`). Schema supports up to 8 for future grid.

---

## 5. Variant Enums (application-level, stored as text)

Validated in application code and optionally via Postgres CHECK constraints.

### `panel_variant`

| Value | Phase 1 usage | Rendered by |
|-------|---------------|-------------|
| `dark_overlay` | communication | skewed indigo panel |
| `white_window` | photography | rounded white/20 backdrop |
| `burgundy` | wearable | nexus-burgundy block |
| `white_panel` | wearable | white/15 rounded window |
| `wood_surface` | power | stone/wood tone panel |
| `grey_accent` | power | white/10 accent blocks |
| `glass_frame` | entertainment (headphones) | glass border wrapper |

### `clip_variant`

| Value | Phase 1 usage |
|-------|---------------|
| `none` | default |
| `chamfer_bottom_left` | communication primary |
| `notch_top_right` | computer printer |

### `container_variant`

| Value | Maps to |
|-------|---------|
| `default` | `min-h-[22rem] sm:min-h-[28rem] lg:min-h-[36rem]` |

Future variants can be added without schema migration.

---

## 6. Indexes

```sql
-- Categories
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order) WHERE published = true;

-- Pills
CREATE INDEX idx_category_pills_category ON category_pills(category_id);
CREATE UNIQUE INDEX idx_category_pills_slug ON category_pills(category_id, slug);

-- Collages
CREATE UNIQUE INDEX idx_category_collages_category ON category_collages(category_id);
CREATE INDEX idx_collage_layers_collage ON collage_layers(collage_id);
CREATE INDEX idx_collage_layers_sort ON collage_layers(collage_id, z_index, sort_order);

-- Features
CREATE UNIQUE INDEX idx_features_key ON features(key);
CREATE INDEX idx_features_sort ON features(sort_order) WHERE published = true;

-- Media
CREATE UNIQUE INDEX idx_media_assets_path ON media_assets(storage_path);

-- Content blocks
CREATE UNIQUE INDEX idx_content_blocks_key ON content_blocks(key);
```

---

## 7. Row Level Security

### Helper function

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$ LANGUAGE sql STABLE;
```

> **Security:** Use `app_metadata` only — never `user_metadata` for authorization.

### Policy template

```sql
-- Public read (published content)
CREATE POLICY "public_read_published"
  ON {table} FOR SELECT
  USING (published = true);

-- Admin full access
CREATE POLICY "admin_all"
  ON {table} FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Per-table exceptions

| Table | Public SELECT | Notes |
|-------|---------------|-------|
| `site_settings` | Always (1 row, `published = true`) | no INSERT/DELETE for anon |
| `social_links` | `published = true` | — |
| `features` | `published = true` | — |
| `content_blocks` | `published = true` | — |
| `categories` | `published = true` | — |
| `category_pills` | `published = true` | — |
| `category_collages` | `published = true` | — |
| `collage_layers` | `published = true` | — |
| `contact_grid_images` | `published = true` | — |
| `media_assets` | All rows | paths are public anyway via Storage |

### Storage policies

```sql
-- media bucket: public read
CREATE POLICY "public_read_media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- media bucket: admin write
CREATE POLICY "admin_write_media"
  ON storage.objects FOR ALL
  USING (bucket_id = 'media' AND is_admin())
  WITH CHECK (bucket_id = 'media' AND is_admin());
```

---

## 8. Storage Architecture

| Bucket | Public | Purpose |
|--------|--------|---------|
| `media` | Yes | Published assets |
| `uploads` | No | Draft admin uploads |

### Path convention

```
media/site/logo.svg
media/hero/background.webp
media/hero/phone.webp
media/features/{key}.webp
media/blocks/feature-section-bg.webp
media/blocks/promo-banner-bg.webp
media/categories/{slug}/card.webp
media/categories/{slug}/collage/{layer_key}.webp
media/contact/grid-{n}.webp
```

### Seed upload mapping (Phase 2C)

| Static file | Storage path |
|-------------|--------------|
| `home/hero-background.webp` | `media/hero/background.webp` |
| `home/hero-phone.webp` | `media/hero/phone.webp` |
| `home/feature-ai.webp` | `media/features/ai-power.webp` |
| `category/{slug}/*.webp` | `media/categories/{slug}/collage/{layer_key}.webp` |
| … | (see seed script in Phase 2C) |

---

## 9. Seed Strategy

### Order (respects FK dependencies)

```
1. media_assets        (register all Storage paths)
2. site_settings       (references hero media)
3. social_links
4. features
5. content_blocks
6. categories          (references card media)
7. category_pills
8. category_collages
9. collage_layers      (references media + collages)
10. contact_grid_images
```

### Source

TypeScript seed script that:
1. Reads current `src/data/*.ts` static exports
2. Uploads images from `src/assets/images/` to Storage
3. Inserts rows with UUIDs
4. Converts Tailwind positions to percentage values (manual mapping table in seed script)

### Idempotency

- Upsert on `slug` / `key` / `storage_path` unique constraints
- Safe to re-run during development

---

## 10. Frontend Data-Access Architecture

### Layer diagram

```
CategoryPage / HomePage
        ↓
   useCategory() / useHomepageContent()
        ↓
   category.service.ts / homepage.service.ts
        ↓
   category.repository.ts (Supabase queries)
        ↓
   collage-mapper.ts → CategoryCollageConfig
        ↓
   Existing components (unchanged)
```

### Supabase fetch optimization

**Option A — separate queries (simpler, Phase 2B):**
```typescript
const category = await supabase.from('categories').select(`
  *,
  category_pills(*),
  category_collages(
    *,
    collage_layers(*, media_assets(*))
  )
`).eq('slug', slug).single()
```

**Option B — RPC (recommended, Phase 2D):**
```sql
CREATE FUNCTION get_category_page(p_slug text)
RETURNS jsonb AS $$
  -- single query returning nested JSON matching domain types
$$ LANGUAGE sql STABLE;
```

Use Option A initially; add RPC if query count or payload shape becomes unwieldy.

### Type mapping

| DB | Domain (component) |
|----|-------------------|
| `categories.display_title` | `Category.displayTitle` |
| `category_pills.label` | `SubCategory.name` |
| `collage_layers` + mapper | `CategoryCollageConfig` |
| `media_assets.storage_path` | resolved URL in `src` field |
| `site_settings.*` | `siteSettings.*` (camelCase in mapper) |

---

## 11. Migration Order

```
001_create_media_assets.sql
002_create_site_settings.sql
003_create_social_links.sql
004_create_features.sql
005_create_content_blocks.sql
006_create_categories.sql
007_create_category_pills.sql
008_create_category_collages.sql
009_create_collage_layers.sql
010_create_contact_grid_images.sql
011_create_indexes.sql
012_create_rls_policies.sql
013_create_storage_buckets.sql
014_seed_data.ts                    # TypeScript seed, not SQL
--- Phase 4 ---
015_create_products.sql
016_create_reviews.sql
017_create_articles.sql
018_create_contact_submissions.sql
```

---

## 12. Phase 4 Tables (future — unchanged intent)

<details>
<summary>products, reviews, articles, contact_submissions</summary>

Retained from original plan for Phase 4 expansion. Not required for Phase 2 CMS of current static site.

- `products` — FK to `categories`, optional FK to `category_pills`
- `reviews` — FK to `products`
- `articles` — superseded for the public journal by `blog_posts` and `blog_authors` in `20250901000014_create_blog.sql`. That migration is single-author: one `site-owner` row, draft/published status, optional `media_assets` featured image, and anonymous SELECT of published posts only.
- `contact_submissions` — INSERT via Edge Function only; no public SELECT

</details>

---

## 13. Security Considerations

- [ ] RLS enabled on every `public` schema table
- [ ] `is_admin()` reads `app_metadata.role` only
- [ ] Anon key in frontend; service role in seed scripts / Edge Functions only
- [ ] Storage upsert: INSERT + SELECT + UPDATE policies for admins
- [ ] No public INSERT on any content table
- [ ] `contact_submissions` (future): INSERT via Edge Function with rate limiting
- [ ] Validate variant enums in service layer before insert
- [ ] Sanitize alt text and user-editable strings in admin forms (Phase 3)

---

## 14. What NOT to Create in Phase 2A

- Supabase project
- Migration SQL files
- `@supabase/supabase-js` installation
- Service layer code
- Seed scripts
- Admin UI

**Next:** Phase 2B — create Supabase project, run migrations, seed from static data.

---

## 15. Changes from Original Plan (Phase 0)

| Change | Reason |
|--------|--------|
| Merged `hero_section` → `site_settings` | Matches `site-settings.ts` single config |
| Renamed `sub_categories` → `category_pills` | Reflects decorative pill behavior |
| Replaced `category_media` → `collage_layers` | Supports panels, positioning, variants |
| Added `display_title`, `card_label`, `offset_card` | Required by Phase 1 category/home components |
| Added `category_collages` table | Container + overlay text per category |
| Added variant enums for panels/clips | Avoids Tailwind strings in DB |
| Removed `navigation_items` | Not used in Phase 1 |
| Removed `card_icon_path` | Icon is SVG in component code |
| Added `features.key` + `image_alt` | Matches `features.ts` shape |
| Added `content_blocks` keys for backgrounds | Matches FeatureGrid + PromoBanner |
| Documented collage mapper layer | Separates DB data from CSS rendering |
