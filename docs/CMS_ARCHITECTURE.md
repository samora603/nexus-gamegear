# CMS Architecture — GameGear Nexus

> **Backend:** Supabase (PostgreSQL + Storage + Auth)  
> **Status:** Planned — not implemented  
> **Principle:** Content editors manage copy and media without touching React source code.

---

## 1. Goals

1. Non-developers can update site content (text, images, categories, contact info)
2. Content changes publish without redeploying the frontend (Phase 2+) or with ISR/cache invalidation
3. Media assets managed through Supabase Storage, not git
4. Admin access protected by Supabase Auth + RLS
5. Public site reads only published content via anon key

---

## 2. Content Classification

### CMS-Managed (dynamic)

| Content | Entity | Priority |
|---------|--------|----------|
| Site name, tagline, logo | `site_settings` | High |
| Contact phone, email | `site_settings` | High |
| Social media URLs | `social_links` | High |
| Homepage hero headline + CTA | `hero_section` | High |
| Feature cards (3) | `features` | High |
| "What we are about" text | `site_settings` or `content_blocks` | High |
| Promo banner text | `content_blocks` | Medium |
| Categories (6) | `categories` | High |
| Sub-categories (per category) | `sub_categories` | High |
| Category collage images | `category_media` | High |
| Homepage category card images | `categories` | High |
| Contact photo grid (8 images) | `media_assets` | Medium |
| Future: products/gadgets | `products` | Phase 3 |
| Future: reviews | `reviews` | Phase 3 |
| Future: articles/insights | `articles` | Phase 3 |
| Future: contact form submissions | `contact_submissions` | Phase 3 |

### Static (code-level)

| Content | Reason |
|---------|--------|
| Layout structure | Tied to React components |
| Design tokens (colors, fonts, spacing) | Design system — rarely changes |
| Route definitions | Application logic |
| Component behavior | Application logic |
| SEO defaults / fallback meta | Code with CMS override |
| Error pages | Application logic |
| Animation definitions | Application logic |

### Hybrid (code structure + CMS content)

| Element | Code | CMS |
|---------|------|-----|
| Homepage sections | Section order, layout | Text, images within sections |
| Category page template | Layout, collage positioning | Title, sub-categories, images |
| Navigation | Route mapping | Labels, ordering, visibility |
| Footer/Contact | Component structure | Contact details, social links |

---

## 3. Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Public Website (SPA)                   │
│                                                          │
│  React hooks → Supabase JS client (anon key)             │
│  Reads: categories, features, settings, media URLs       │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS (SELECT only, RLS enforced)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                      Supabase                             │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ PostgreSQL  │  │   Storage    │  │     Auth      │  │
│  │  (content)  │  │   (media)    │  │   (admins)    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  RLS Policies:                                           │
│  • anon/authenticated → SELECT published content         │
│  • admin role → INSERT/UPDATE/DELETE                     │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS (authenticated)
                         ▼
┌──────────────────────────────────────────────────────────┐
│              Admin Dashboard (Phase 3)                    │
│                                                          │
│  Supabase JS client (authenticated session)              │
│  CRUD: all content entities + file uploads               │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### Public Read Path
```
Page component
  → useCategories() / useSiteSettings() hook
    → supabase.from('categories').select('*').eq('published', true)
      → RLS validates anon read access
        → Return typed data to component
```

### Admin Write Path (Phase 3)
```
Admin form submit
  → supabase.from('categories').update({ ... }).eq('id', id)
    → RLS validates admin role via auth.uid()
      → Postgres trigger updates updated_at
        → Optional: cache invalidation webhook
```

### Media Upload Path
```
Admin selects file
  → supabase.storage.from('media').upload(path, file)
    → Returns storage path
      → Save path in entity record (categories.image_path, etc.)
        → Public URL constructed at render time
```

---

## 5. Supabase Services Usage

| Service | Usage |
|---------|-------|
| **PostgreSQL** | All structured content (categories, settings, features, future products/reviews) |
| **Storage** | Images, icons, future document uploads |
| **Auth** | Admin login only (no public user accounts initially) |
| **Edge Functions** | Contact form handler (spam protection, email notification) — Phase 3 |
| **Realtime** | Not needed initially; optional for admin live preview |
| **RLS** | All tables in `public` schema |

---

## 6. Authentication & Authorization

### Roles

| Role | Implementation | Permissions |
|------|---------------|-------------|
| `anon` | Default Supabase role | Read published content |
| `authenticated` | Logged-in admin | Full CRUD on content tables |
| `service_role` | Server-side only | Bypass RLS (Edge Functions only) |

### Admin User Management
- Admins created manually via Supabase dashboard or seed script
- No public sign-up endpoint
- Store admin flag in `app_metadata` (not `user_metadata` — security requirement)
- Example: `{ "role": "admin" }` in `raw_app_meta_data`

### RLS Pattern (conceptual)
```sql
-- Public read
CREATE POLICY "Public read published categories"
  ON categories FOR SELECT
  USING (published = true);

-- Admin write
CREATE POLICY "Admin full access"
  ON categories FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
```

---

## 7. Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `media` | Yes (read) | Production images (categories, features, collages) |
| `uploads` | No | Draft/unpublished uploads |

### File Organization
```
media/
├── logo/
│   └── logo.svg
├── hero/
│   └── desk-setup.webp
├── features/
│   ├── ai-power.webp
│   ├── gaming-setup.webp
│   └── audio-knobs.webp
├── categories/
│   ├── communication/
│   │   ├── card.webp
│   │   └── collage-1.webp
│   ├── entertainment/
│   └── ...
├── banner/
│   └── retro-tech.webp
└── contact/
    ├── grid-1.webp
    └── ...
```

### Storage Policies
- Public SELECT on `media` bucket
- INSERT/UPDATE/DELETE restricted to authenticated admins
- Storage upsert requires INSERT + SELECT + UPDATE policies

---

## 8. Content Versioning & Publishing

### Phase 2 (simple)
- `published` boolean on content tables
- Edits are immediately live when `published = true`
- No draft preview

### Phase 3 (enhanced)
- `status` enum: `draft`, `published`, `archived`
- Optional `published_at` timestamp
- Admin preview mode with `?preview=true` + auth token

---

## 9. Caching Strategy

| Layer | Strategy |
|-------|----------|
| **Phase 1 (static)** | No caching needed — data in JS bundles |
| **Phase 2 (CMS)** | React Query or SWR with stale-while-revalidate |
| **CDN** | Cache Storage assets with long TTL; versioned filenames |
| **Build-time** | Optional: fetch CMS data at build for SSG hybrid |

**Recommendation:** Start with client-side fetching + React Query (`staleTime: 5min`). Evaluate SSG pre-rendering if SEO becomes critical.

---

## 10. Admin Dashboard (Phase 3)

### Scope
Minimal admin UI — not a full CMS like Strapi. Built as protected routes in the same React app or a separate `/admin` SPA.

### Admin Sections
1. **Site Settings** — tagline, contact info, social links
2. **Hero** — headline, CTA text, hero image
3. **Features** — CRUD feature cards
4. **Categories** — CRUD categories + sub-categories + images
5. **Content Blocks** — banner text, about section
6. **Media Library** — browse/upload Storage assets
7. **Products/Reviews** — Phase 3+
8. **Contact Submissions** — read-only inbox

### Tech Options
- Same React app with `/admin/*` routes (simpler)
- Separate admin app (better isolation, more effort)

**Recommendation:** Same app, protected admin routes. Keeps one codebase.

---

## 11. Migration Path (Static → CMS)

```
Phase 1                          Phase 2                         Phase 3
────────                         ───────                         ───────
src/data/categories.ts     →     Supabase categories table  →    Admin CRUD UI
src/data/features.ts       →     Supabase features table    →    Admin CRUD UI
src/data/site-settings.ts  →     Supabase site_settings     →    Admin settings page
src/assets/images/*        →     Supabase Storage/media/*   →    Media library UI

Hooks:
useCategories() reads from   →   reads from Supabase       →   same + admin mutations
static import
```

**Key principle:** TypeScript interfaces stay the same. Only the data source changes in hooks.

---

## 12. External Integrations (Future)

| Integration | Purpose | Phase |
|-------------|---------|-------|
| Email (Resend/SendGrid) | Contact form notifications | Phase 3 |
| Analytics (Plausible/GA) | Traffic tracking | Phase 4 |
| Search (Postgres FTS) | Product/review search | Phase 3 |

---

## 13. Security Checklist

- [ ] RLS enabled on every public schema table
- [ ] Admin role in `app_metadata`, never `user_metadata`
- [ ] Anon key only in frontend env vars
- [ ] Service role key only in Edge Functions / CI
- [ ] Storage policies restrict write to admins
- [ ] Contact form protected by rate limiting (Edge Function)
- [ ] Input validation on all admin forms
- [ ] No SQL injection (Supabase client parameterized queries)
- [ ] CORS configured on Storage bucket

---

## 14. Environment Configuration

```bash
# .env.example

# Supabase (Phase 2+)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (Edge Functions, never in SPA)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 15. What NOT to Build Yet

- Admin dashboard UI
- Supabase project / migrations
- Edge Functions
- Contact form backend
- Product/review CRUD
- User registration
- Real-time subscriptions
- Full-text search

These are documented for planning purposes only.
