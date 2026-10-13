# Project Status — GameGear Nexus

> Last updated: owner App Metadata role (2026-10-13)

---

## Current Phase

**Phase 2H — authenticated CMS owner verification**

The existing confirmed Auth user on `pdqwaftiflaaelwzzypp` now has App Metadata `role` set to `admin`. `provider` and `providers` were kept. User Metadata was not changed. `public.is_admin()` still reads `auth.jwt() -> app_metadata ->> role`.

No sign-in was performed. The role is stored on the account and will be present in a JWT issued after the next successful sign-in. Dashboard counts, session refresh, blog create/edit/publish/unpublish/delete, media upload, and logout after a real session remain unverified.

The homepage remains static. Category pages and the public blog read path are unchanged. Seeded content was not modified: 1 blog post (`development-seed-draft`) and 38 media assets.

---

## Completed

### Static frontend
- [x] Homepage
- [x] Reusable category template for all six category pages

### Remote schema
- [x] Project `pdqwaftiflaaelwzzypp` (`https://pdqwaftiflaaelwzzypp.supabase.co`)
- [x] Migrations `20250901000000` through `20250901000014` applied
- [x] RLS on all 10 application tables
- [x] Buckets `media` (public) and `uploads` (private)

### CMS seed
- [x] Script: `scripts/seed-cms.mjs` (`npm run seed:cms`)
- [x] 38 WebP files in the `media` bucket
- [x] 38 `media_assets` rows, paths `home/<file>.webp` and `categories/<slug>/<file>.webp`
- [x] Tables seeded and re-checked after a second run: site_settings 1, social_links 3, features 3, content_blocks 2, categories 6, category_pills 19, category_collages 6, collage_layers 31, contact_grid_images 1
- [x] Foreign keys resolve; no duplicate storage paths
- [x] Anonymous clients can read published rows and public media URLs
- [x] Anonymous insert/update/delete and storage writes were denied
- [x] Unpublished probe row was not visible to the anon key, then removed

The seed uses `SUPABASE_SERVICE_ROLE_KEY` when it is present. That key is not in the repository. A short-lived function `cms-seed-relay` was used for the first two runs and then replaced with a handler that returns HTTP 410. It does not seed anymore.

### Read-only mapper
- [x] `src/lib/cms/` selects published rows and maps them without writing
- [x] `npm run cms:parity` compared that snapshot with the static semantic model on project `pdqwaftiflaaelwzzypp` and reported MATCH

### Category CMS integration
- [x] All six category routes are CMS-backed: communication, entertainment, computer, wearable, photography, and power-charging
- [x] Homepage remains on `src/data/*`
- [x] Browser check: each category rendered `data-category-source="cms"` and public `media` bucket images
- [x] Browser check: a blocked CMS request rendered `static-fallback` with local images for all six categories, then fresh loads returned to CMS
- [x] `npm run test:cms` (20 passed), `npm run cms:parity` (`MATCH`), `npm run lint`, and `npm run build` passed

### Single-author blog
- [x] `blog_authors` and `blog_posts` with RLS: anonymous clients can select published posts only
- [x] One site-owner author. No author management and no authentication
- [x] Article body is plain text. Featured images use `media_assets` and the public media URL resolver
- [x] `/blog` and `/blog/:slug` are public. A CMS failure shows an unavailable message and does not invent posts
- [x] The only seeded post is the unpublished `development-seed-draft`. Anonymous reads return no rows
- [x] Browser check: `/blog` shows “No published articles yet.” The draft slug shows the existing not-found page
- [x] Browser check: `/`, `/communication-gadgets`, and `/computer-gadgets` still behave as before

### Phase 2F authentication
- [x] `/admin/login` and `/admin` authorization shell. No CMS forms
- [x] Frontend admin check reads `app_metadata.role === 'admin'`
- [x] RLS `is_admin()` is unchanged and remains the database boundary
- [x] `auth.users` count is 0. No owner account was created by this change
- [x] Logged-out browser check: `/admin` redirects to `/admin/login?next=%2Fadmin` and does not show the admin shell

### Phase 2G CMS admin
- [x] Dashboard, blog list/editor, and media library under `/admin`
- [x] Posts use the existing `site-owner` author, draft/published constraint, and `featured_image_id`
- [x] Uploads go to the public `media` bucket under `admin/<uuid>.<ext>`
- [x] Referenced media is blocked before delete
- [x] Anonymous blog, media, and storage writes were denied. The seed draft title was unchanged
- [ ] Owner sign-in and live create/publish/upload were not run

### Phase 2H verification
- [x] Anonymous blog, media, and storage writes denied again (`npm run test:admin`)
- [x] Logged-out `/admin` still redirects to `/admin/login?next=%2Fadmin`
- [x] Public `/`, six category routes, and `/blog` still load. Categories stay `cms` with remote images. The journal is still empty
- [ ] Admin session, dashboard, blog workflow, and media upload remain unverified
- [ ] Authenticated non-admin writes remain unverified. No second account was created

---

## In Progress

The owner role is stored. The CMS workflow still needs a real sign-in before it is verified.

---

## Remaining

- Sign in at `/admin/login` and confirm the session reaches `/admin`
- Confirm draft, publish, unpublish, delete, and media upload in the browser
- Admin JWT write tests
- Authenticated non-admin write tests
- Blog categories/tags were not added. Product categories stay separate

---

## Not done

- Multi-author management
- Supabase-backed homepage
- Category, feature, and site-settings editors

---

## Next Action

Sign in as the existing owner and repeat the Phase 2H browser workflow. Homepage CMS waits until that gate passes.

---

## Known seed limits

- Overlay text is stored. Its Tailwind position is not, because the text box has no width in the schema.
- The communication primary clip is a bottom-right chamfer. The schema only has `chamfer_bottom_left` and `notch_top_right`, so that clip is stored as `none`.
- The dark overlay skew is not stored. `rotation_deg` is 0.
- Layers positioned with `bottom` and no height use a square-box fallback for `pos_top_pct`. `height_pct` stays null.
- `designFile` and `contactAnchor` are not database columns.
- `docs/SUPABASE_SETUP.md` still describes the earlier empty-project setup.

---

## Cursor State

Remote content verified on `pdqwaftiflaaelwzzypp`. Category pages are CMS-backed. The public blog reads published posts only. The existing Auth user has App Metadata `role` `admin`. A live owner sign-in has not been run. The homepage remains static.
