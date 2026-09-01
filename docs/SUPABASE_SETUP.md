# Supabase Setup — GameGear Nexus

> **Phase:** 2B — Database foundation  
> **Architecture source:** [DATABASE_PLAN.md](./DATABASE_PLAN.md), [CMS_ARCHITECTURE.md](./CMS_ARCHITECTURE.md)

---

## 1. Supabase Project Status

| Item | Status |
|------|--------|
| Remote project **GameGear Nexus** | **Not created** — org free-tier limit (2 active projects) blocked creation |
| Local development stack | **Validated** — migrations applied via `supabase start` |
| Migrations in repo | **Complete** — 14 SQL files under `supabase/migrations/` |

### Remote project creation (required before production)

When ready to provision the hosted project:

1. Pause or delete an unused project in the Supabase dashboard, **or** upgrade the organization plan.
2. Create a project named **GameGear Nexus** (recommended region: `eu-central-1`).
3. Link the CLI: `supabase link --project-ref <ref>`
4. Push migrations: `supabase db push`
5. Copy **Project URL** and **anon key** into `.env.local` (never commit).

Record for your notes (no secrets in Git):

- **Project URL:** `https://<ref>.supabase.co`
- **Project ref:** `<ref>`
- **Region:** e.g. `eu-central-1`

---

## 2. Environment Variables

### Browser-safe (`.env.local`, gitignored)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Template: [.env.example](../.env.example)

### Server-only (never `VITE_` prefix)

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Used in Phase 2C+ for seed scripts and CI. **Never** import the service-role key in frontend code.

---

## 3. Migration Order

Migrations run in timestamp order:

| # | File | Purpose |
|---|------|---------|
| 0 | `20250901000000_shared_functions.sql` | `set_updated_at()` trigger helper |
| 1 | `20250901000001_create_media_assets.sql` | Media metadata registry |
| 2 | `20250901000002_create_site_settings.sql` | Global site + homepage config |
| 3 | `20250901000003_create_social_links.sql` | Social URLs |
| 4 | `20250901000004_create_features.sql` | Homepage feature cards |
| 5 | `20250901000005_create_content_blocks.sql` | Keyed content blocks |
| 6 | `20250901000006_create_categories.sql` | Six gadget categories |
| 7 | `20250901000007_create_category_pills.sql` | Decorative sub-category pills |
| 8 | `20250901000008_create_category_collages.sql` | Collage container + overlay |
| 9 | `20250901000009_create_collage_layers.sql` | Images + panels (percent layout) |
| 10 | `20250901000010_create_contact_grid_images.sql` | Contact photo grid |
| 11 | `20250901000011_create_indexes.sql` | Secondary / partial indexes |
| 12 | `20250901000012_create_rls_policies.sql` | RLS + `is_admin()` |
| 13 | `20250901000013_create_storage_buckets.sql` | `media` + `uploads` buckets |

---

## 4. Tables Created

| Table | Purpose |
|-------|---------|
| `media_assets` | Storage path metadata (no binary in Postgres) |
| `site_settings` | Single-row global + hero + contact |
| `social_links` | Facebook, Twitter, Instagram |
| `features` | Homepage feature cards |
| `content_blocks` | Keyed blocks (e.g. section backgrounds) |
| `categories` | Category pages + homepage cards |
| `category_pills` | Decorative pills per category |
| `category_collages` | One collage config per category |
| `collage_layers` | Layer images/panels with percentage layout |
| `contact_grid_images` | Contact section grid |

All tables use UUID primary keys. Slugs/keys are unique but not primary keys.

---

## 5. Relationships

```
site_settings ──FK──► media_assets (hero, logo)

features ──FK──► media_assets
content_blocks ──FK──► media_assets
categories ──FK──► media_assets (card)

categories ──1:N──► category_pills
categories ──1:1──► category_collages ──1:N──► collage_layers
collage_layers ──FK──► media_assets (image layers)

contact_grid_images ──FK──► media_assets
```

Foreign keys use `ON DELETE CASCADE` for category-owned rows and `RESTRICT` / `SET NULL` where appropriate.

---

## 6. RLS Strategy

- **RLS enabled** on all 10 CMS tables.
- **Anonymous users:** `SELECT` only where `published = true` (except `media_assets`, which allows public read of all rows).
- **Administrators:** full access via `is_admin()` reading `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`.
- **Never** uses `user_metadata` for authorization.
- **No** broad `USING (true)` write policies.

Helper:

```sql
CREATE FUNCTION public.is_admin() ...
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
```

23 policies total (20 on `public` tables + 3 on `storage.objects`).

---

## 7. Storage Buckets

| Bucket | Public read | Purpose |
|--------|-------------|---------|
| `media` | Yes | Published site assets |
| `uploads` | No | Admin draft uploads (Phase 3+) |

### Path convention

```
hero/background.webp
features/{key}.webp
blocks/feature-section-bg.webp
categories/{slug}/card.webp
categories/{slug}/collage/{layer_key}.webp
contact/grid-{n}.webp
site/logo.svg
```

Paths are relative to the bucket root (not `media/...` prefix in the path column — the bucket name is `media`).

---

## 8. Storage Policies

| Policy | Bucket | Access |
|--------|--------|--------|
| `storage_media_public_read` | `media` | Anonymous `SELECT` |
| `storage_media_admin_all` | `media` | Admin `ALL` (insert/update/delete/select for upsert) |
| `storage_uploads_admin_all` | `uploads` | Admin `ALL` only — no anonymous access |

Anonymous users **cannot** upload or delete storage objects.

---

## 9. Admin Authorization Model

- Supabase Auth JWT **`app_metadata.role`** must equal `'admin'`.
- Set via Supabase Dashboard → Authentication → Users → user → **App Metadata** (not User Metadata).
- Phase 3 will add login UI; Phase 2B does not create admin users.

---

## 10. Local Development Workflow

**Prerequisites:** Docker, [Supabase CLI](https://supabase.com/docs/guides/cli) v2+

```bash
# Start local stack (applies migrations automatically)
npm run supabase:start
# or: supabase start

# Reset DB and re-apply all migrations
npm run supabase:reset

# Stop local stack
npm run supabase:stop

# Regenerate TypeScript types (local stack must be running)
npm run supabase:types
```

Local Studio: http://127.0.0.1:54323  
Local API: http://127.0.0.1:54321

---

## 11. Reset / Reapply Migrations

### Local

```bash
supabase db reset
```

Destroys local data and replays every file in `supabase/migrations/`.

### Remote (after linking)

```bash
supabase link --project-ref <ref>
supabase db push
```

For a fresh remote database, `db push` applies pending migrations in order.

---

## 12. TypeScript Type Generation

Generated file: [`src/types/database.ts`](../src/types/database.ts)

```bash
# Local (stack running)
npm run supabase:types

# Remote linked project
npm run supabase:types:remote
```

The npm script strips CLI noise and keeps output through `} as const`.

Client module: [`src/lib/supabase.ts`](../src/lib/supabase.ts)

- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `isSupabaseConfigured()` — safe check without throwing
- `getSupabaseClient()` — throws if env vars missing (for Phase 2D+ services)

**Phase 2B:** Frontend still reads static `src/data/*`; Supabase client is not wired into pages yet.

---

## 13. Validation Performed (Phase 2B)

| Check | Result |
|-------|--------|
| All 10 tables exist | Pass |
| RLS enabled on all CMS tables | Pass |
| `is_admin()` function | Pass |
| Storage buckets `media`, `uploads` | Pass |
| 23 RLS/storage policies | Pass |
| Collage opacity CHECK constraint | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| Frontend unchanged (static data) | Pass |

---

## 14. Deviations from DATABASE_PLAN.md

| Item | Notes |
|------|-------|
| `20250901000000_shared_functions.sql` | Added for `set_updated_at()` — not in original 001–013 list but required for `updated_at` triggers |
| `social_links.platform` CHECK | Enforces `facebook`, `twitter`, `instagram` at DB level |
| Collage numeric CHECKs | Added range checks for percentages, opacity, rotation per Phase 2B requirements |
| Remote Supabase project | Blocked by org free-tier project limit — local validation used instead |

No schema entity or relationship changes from the approved plan.

---

## 15. Unresolved Issues

1. **Remote Supabase project** — Create after freeing a slot in the org (pause/delete existing project or upgrade).
2. **Type generation on CI** — Requires linked project or running local stack; document in Phase 2C CI if needed.

---

## 16. Recommended Phase 2C

1. Provision remote **GameGear Nexus** project and link CLI.
2. TypeScript seed script: read `src/data/*.ts`, upload images to `media` bucket, insert rows.
3. Map Tailwind collage positions → percentage values in seed script.
4. Upsert on `slug` / `key` / `storage_path` for idempotency.
5. Verify Storage public URLs resolve correctly before switching frontend.
