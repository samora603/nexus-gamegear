# Project Status — GameGear Nexus

> Last updated: read-only CMS mapper (2026-10-08)

---

## Current Phase

**Phase 2C — read-only CMS mapper**

`src/lib/cms/` can load published Supabase rows and map them to a semantic snapshot. Pages still render only from `src/data/*`. Switching the React app to this mapper is deferred.

---

## Completed

### Static frontend
- [x] Homepage
- [x] Reusable category template for all six category pages

### Remote schema
- [x] Project `pdqwaftiflaaelwzzypp` (`https://pdqwaftiflaaelwzzypp.supabase.co`)
- [x] Migrations `20250901000000` through `20250901000013` applied
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
- [x] Frontend cutover intentionally deferred

---

## In Progress

Nothing in the React app. The mapper is not imported by pages or components.

---

## Remaining

- Switch pages off `src/data/*` only after a visual cutover is approved
- Authentication and admin role assignment
- CMS dashboard
- Admin write tests (not run; no admin user was created)

---

## Not done

- Authentication UI
- Admin dashboard
- Supabase-backed pages

---

## Next Action

Keep pages on `src/data/*`. The next product step is an explicit visual cutover, one surface at a time, after the known collage CSS gaps are accepted or redesigned.

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

Remote content verified on `pdqwaftiflaaelwzzypp`. Semantic CMS parity matched. Frontend remains static.
