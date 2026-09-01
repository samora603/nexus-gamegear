# Database Plan — GameGear Nexus

> **Database:** PostgreSQL via Supabase  
> **Status:** Proposed — not created  
> **Convention:** snake_case tables/columns, UUID primary keys, `timestamptz` for dates

---

## 1. Entity Relationship Overview

```
site_settings (1 row)
    │
    ├── social_links (1:N)
    │
hero_section (1 row)
    │
features (1:N)
    │
content_blocks (1:N)
    │
categories (1:N)
    │
    ├── sub_categories (1:N)
    │
    └── category_media (1:N)
            │
            └── media_assets (N:1)

── Phase 3 ──

products (N:1 → categories, N:1 → sub_categories)
    │
    └── reviews (N:1 → products)

articles (standalone)

contact_submissions (standalone)

navigation_items (standalone, optional)
```

---

## 2. Phase 1–2 Tables (Core Content)

### 2.1 `site_settings`

Single-row table for global site configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `site_name` | `text` | NOT NULL, default `'GameGear Nexus'` | |
| `tagline` | `text` | NOT NULL | e.g. "DISCOVER. COMPARE. DOMINATE." |
| `about_heading` | `text` | | "What we are about" |
| `about_body` | `text` | | About section paragraph |
| `contact_phone` | `text` | | e.g. "0793510481" |
| `contact_email` | `text` | | e.g. "jetagakoi@gmail.com" |
| `logo_path` | `text` | | Storage path to logo SVG/PNG |
| `favicon_path` | `text` | | Storage path to favicon |
| `meta_title` | `text` | | Default SEO title |
| `meta_description` | `text` | | Default SEO description |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 2.2 `social_links`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `platform` | `text` | NOT NULL, UNIQUE | `facebook`, `twitter`, `instagram` |
| `url` | `text` | NOT NULL | Profile URL |
| `sort_order` | `int` | default 0 | Display order |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 2.3 `hero_section`

Single-row homepage hero content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `headline` | `text` | NOT NULL | "Next-Gen Gear, Expertly Reviewed." |
| `cta_text` | `text` | | "View Reviews" (corrected from design) |
| `cta_url` | `text` | | Link target |
| `background_image_path` | `text` | | Hero desk photo |
| `mockup_image_path` | `text` | | Phone mockup (optional) |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 2.4 `features`

Homepage three-column feature cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `title` | `text` | NOT NULL | Cyan heading text |
| `description` | `text` | | Body text below cards |
| `image_path` | `text` | NOT NULL | Card image |
| `sort_order` | `int` | default 0 | |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

**Seed data (3 rows):**
1. "On-device and generative AI power"
2. "Intelligent homes and ecosystems"
3. "Multi-device ownership and specialization"

---

### 2.5 `content_blocks`

Flexible text blocks for banners and misc content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `key` | `text` | NOT NULL, UNIQUE | e.g. `promo_banner`, `feature_section_bg` |
| `title` | `text` | | Optional heading |
| `body` | `text` | | Text content |
| `image_path` | `text` | | Optional background image |
| `published` | `boolean` | default `true` | |
| `updated_at` | `timestamptz` | default `now()` | |

**Seed keys:**
- `promo_banner` — retro tech banner quote
- `feature_section_bg` — soundboard background image path

---

### 2.6 `categories`

Top-level gadget categories (6 rows).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `name` | `text` | NOT NULL | Display name |
| `slug` | `text` | NOT NULL, UNIQUE | URL slug |
| `description` | `text` | | Optional short description |
| `card_image_path` | `text` | | Homepage category card image |
| `card_icon_path` | `text` | | Small icon on card |
| `sort_order` | `int` | default 0 | |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

**Seed data (6 rows):**

| name | slug | sort_order |
|------|------|------------|
| Communication Gadgets | `communication-gadgets` | 1 |
| Entertainment Gadgets | `entertainment-gadgets` | 2 |
| Computer Gadgets | `computer-gadgets` | 3 |
| Wearable Gadgets | `wearable-gadgets` | 4 |
| Photography Gadgets | `photography-gadgets` | 5 |
| Power & Charging Gadgets | `power-charging-gadgets` | 6 |

---

### 2.7 `sub_categories`

Sub-category pills on category pages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `category_id` | `uuid` | FK → `categories.id`, ON DELETE CASCADE | |
| `name` | `text` | NOT NULL | Display name |
| `slug` | `text` | NOT NULL | URL slug (unique per category) |
| `sort_order` | `int` | default 0 | |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

**Unique constraint:** `(category_id, slug)`

**Seed data (19 rows):**

| Category | Sub-categories |
|----------|---------------|
| Communication | Smartphones, Tablets, Smartwatches |
| Entertainment | TV, Gaming Consoles, Headphones, Speakers |
| Computer | Laptops, Desktops, Printers |
| Wearable | Fitness trackers, Smart watches, Smart glasses |
| Photography | Digital cameras, Action cameras, Drone cameras |
| Power & Charging | Chargers, Power banks, Wireless charging pads |

---

### 2.8 `media_assets`

Central media registry (optional normalization — links Storage paths to metadata).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `file_path` | `text` | NOT NULL, UNIQUE | Supabase Storage path |
| `file_name` | `text` | NOT NULL | Original filename |
| `mime_type` | `text` | | e.g. `image/webp` |
| `alt_text` | `text` | | Accessibility description |
| `width` | `int` | | Pixel width |
| `height` | `int` | | Pixel height |
| `file_size_bytes` | `int` | | |
| `created_at` | `timestamptz` | default `now()` | |

---

### 2.9 `category_media`

Collage images for category pages (multiple per category).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `category_id` | `uuid` | FK → `categories.id`, ON DELETE CASCADE | |
| `media_id` | `uuid` | FK → `media_assets.id`, nullable | |
| `image_path` | `text` | NOT NULL | Direct path (if not using media_assets) |
| `alt_text` | `text` | | |
| `position` | `text` | | Collage position hint: `primary`, `secondary`, `overlay`, etc. |
| `sort_order` | `int` | default 0 | Layer z-index ordering |
| `opacity` | `numeric(3,2)` | default 1.0 | For overlay images |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |

---

### 2.10 `contact_grid_images`

Homepage contact section photo grid.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `image_path` | `text` | NOT NULL | |
| `alt_text` | `text` | | |
| `sort_order` | `int` | default 0 | Grid position (0–7) |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |

**Seed:** 8 rows for the 2×4 grid.

---

## 3. Phase 3 Tables (Content Expansion)

### 3.1 `products`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `category_id` | `uuid` | FK → `categories.id` | |
| `sub_category_id` | `uuid` | FK → `sub_categories.id`, nullable | |
| `name` | `text` | NOT NULL | |
| `slug` | `text` | NOT NULL, UNIQUE | |
| `description` | `text` | | Short description |
| `image_path` | `text` | | Primary product image |
| `brand` | `text` | | |
| `featured` | `boolean` | default `false` | Show on homepage/category |
| `sort_order` | `int` | default 0 | |
| `published` | `boolean` | default `false` | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 3.2 `reviews`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `product_id` | `uuid` | FK → `products.id`, ON DELETE CASCADE | |
| `title` | `text` | NOT NULL | |
| `slug` | `text` | NOT NULL, UNIQUE | |
| `summary` | `text` | | Excerpt |
| `body` | `text` | | Full review (Markdown/HTML) |
| `rating` | `numeric(2,1)` | CHECK 0–5 | |
| `author_name` | `text` | | |
| `hero_image_path` | `text` | | |
| `published` | `boolean` | default `false` | |
| `published_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 3.3 `articles`

Blog/insight content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `title` | `text` | NOT NULL | |
| `slug` | `text` | NOT NULL, UNIQUE | |
| `summary` | `text` | | |
| `body` | `text` | | Markdown/HTML |
| `hero_image_path` | `text` | | |
| `author_name` | `text` | | |
| `published` | `boolean` | default `false` | |
| `published_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | |

---

### 3.4 `contact_submissions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `name` | `text` | NOT NULL | |
| `email` | `text` | NOT NULL | |
| `message` | `text` | NOT NULL | |
| `read` | `boolean` | default `false` | Admin inbox status |
| `created_at` | `timestamptz` | default `now()` | |

**RLS:** No public SELECT. INSERT via Edge Function only (prevents spam via anon key).

---

### 3.5 `navigation_items` (optional)

If navigation becomes CMS-managed beyond category cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `label` | `text` | NOT NULL | |
| `url` | `text` | NOT NULL | |
| `sort_order` | `int` | default 0 | |
| `location` | `text` | | `header`, `footer`, `mobile` |
| `published` | `boolean` | default `true` | |
| `created_at` | `timestamptz` | default `now()` | |

---

## 4. Indexes

```sql
-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- Sub-categories
CREATE INDEX idx_sub_categories_category ON sub_categories(category_id);
CREATE UNIQUE INDEX idx_sub_categories_slug ON sub_categories(category_id, slug);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sub_category ON products(sub_category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_slug ON reviews(slug);
CREATE INDEX idx_reviews_published ON reviews(published_at) WHERE published = true;

-- Articles
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published_at) WHERE published = true;

-- Category media
CREATE INDEX idx_category_media_category ON category_media(category_id);
```

---

## 5. Row Level Security Policies

### Public Read (anon + authenticated)
```sql
-- Template for all content tables
CREATE POLICY "Public read published"
  ON {table} FOR SELECT
  USING (published = true);
```

Applies to: `categories`, `sub_categories`, `features`, `content_blocks`, `category_media`, `contact_grid_images`, `social_links`, `products`, `reviews`, `articles`

### Admin Full Access
```sql
CREATE POLICY "Admin full access"
  ON {table} FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
```

### Special Cases

| Table | Public SELECT | Public INSERT | Admin |
|-------|--------------|---------------|-------|
| `site_settings` | Yes (always 1 row) | No | UPDATE |
| `hero_section` | Yes | No | UPDATE |
| `contact_submissions` | No | Via Edge Function | SELECT/UPDATE |
| `media_assets` | Yes | No | ALL |

---

## 6. Triggers

```sql
-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (repeat for each table)
```

---

## 7. Seed Data Summary

| Table | Row Count | Source |
|-------|-----------|--------|
| `site_settings` | 1 | Design copy |
| `social_links` | 3 | Design (Facebook, Twitter, Instagram) |
| `hero_section` | 1 | Design copy |
| `features` | 3 | Design copy |
| `content_blocks` | 2 | Design copy |
| `categories` | 6 | Design |
| `sub_categories` | 19 | Design |
| `category_media` | ~30 | Design images (5 per category avg) |
| `contact_grid_images` | 8 | Design |

---

## 8. TypeScript Type Mapping

```typescript
// src/types/category.ts — mirrors DB shape
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  card_image_path: string | null;
  card_icon_path: string | null;
  sort_order: number;
  published: boolean;
  sub_categories?: SubCategory[];
  category_media?: CategoryMedia[];
}

interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
  published: boolean;
}
```

Phase 1 static data files will export arrays matching these interfaces exactly.

---

## 9. Migration Order

```
001_create_site_settings.sql
002_create_social_links.sql
003_create_hero_section.sql
004_create_features.sql
005_create_content_blocks.sql
006_create_categories.sql
007_create_sub_categories.sql
008_create_media_assets.sql
009_create_category_media.sql
010_create_contact_grid_images.sql
011_create_rls_policies.sql
012_seed_data.sql
--- Phase 3 ---
013_create_products.sql
014_create_reviews.sql
015_create_articles.sql
016_create_contact_submissions.sql
017_create_navigation_items.sql
018_create_phase3_rls.sql
019_create_phase3_indexes.sql
```

---

## 10. What NOT to Create Yet

- Supabase project
- Migration files
- Seed scripts
- Generated TypeScript types (`supabase gen types`)
- Database functions beyond `updated_at` trigger

This document serves as the blueprint for Phase 2 implementation.
