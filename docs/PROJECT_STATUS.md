# Project Status — GameGear Nexus

> Last updated: authenticated CMS admin (2026-10-08)

---

## Current Phase

**Phase 2G — authenticated CMS admin**

`/admin` is the site-owner CMS: dashboard counts, blog drafts and publishing, and media uploads into the public `media` bucket. Writes use the signed-in Supabase browser client. `is_admin()` and RLS still decide whether a write succeeds.

`auth.users` is still empty, so sign-in, publish, and upload were not exercised in the browser. Create the owner in the Supabase dashboard and set App Metadata, not User Metadata, to `{ "role": "admin" }`. Do not put the password in the repository.

The homepage remains static. Category pages and the public blog read path are unchanged.

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
- [ ] Owner sign-in and live create/publish/upload were not run. No Auth user exists

---

## In Progress

The CMS screens are in the app. They stay unused until the owner Auth user exists.

---

## Remaining

- Create the owner user and set App Metadata `role` to `admin`
- Sign in and confirm draft, publish, unpublish, delete, and media upload in the browser
- Admin JWT write tests (not run; no admin user exists)
- Authenticated non-admin write tests (no second user was created)
- Blog categories/tags were not added. Product categories stay separate

---

## Not done

- Multi-author management
- Supabase-backed homepage
- Category, feature, and site-settings editors

---

## Next Action

Create the owner in the Supabase dashboard, then confirm the CMS mutations with that session. After that, the next content area is the homepage.

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

Remote content verified on `pdqwaftiflaaelwzzypp`. Category pages are CMS-backed. The public blog reads published posts only. The admin CMS is implemented, and no Auth user has been created. The homepage remains static.
