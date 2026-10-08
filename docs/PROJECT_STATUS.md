# Project Status — GameGear Nexus

> Last updated: remote Supabase synchronization (2026-10-08)

---

## Current Phase

**CMS integration — next**

The static frontend is unchanged. The remote database foundation is in place and verified. Pages still read `src/data/*`.

---

## Completed

### Phase 1 — Static Frontend MVP
- [x] Project foundation
- [x] Homepage
- [x] Reusable category template for all six category pages

### CMS architecture
- [x] `docs/DATABASE_PLAN.md`
- [x] `docs/CMS_ARCHITECTURE.md`
- [x] Collage model (percentages and variant enums, no CSS in the database)

### Remote Supabase foundation
- [x] Linked remote project `pdqwaftiflaaelwzzypp` (`https://pdqwaftiflaaelwzzypp.supabase.co`)
- [x] Repository migrations applied to that remote project
- [x] Remote migration history matches `supabase/migrations/` versions `20250901000000` through `20250901000013`
- [x] 10 public application tables verified remotely
- [x] Foreign keys verified remotely
- [x] RLS enabled on all 10 application tables
- [x] Public read / admin write policies verified remotely
- [x] `is_admin()` and `set_updated_at()` verified remotely
- [x] Storage buckets `media` (public read) and `uploads` (not public) verified remotely
- [x] Storage policies verified remotely
- [x] Browser client foundation in `src/lib/supabase.ts` (not used by pages yet)
- [x] Gitignored `.env.local` holds the project URL and anon key

The Supabase CLI on this machine cannot access this project (privilege error). Migrations were applied through the authenticated project connection, then the remote migration versions were aligned to the repository filenames. No content was seeded.

---

## In Progress

Nothing in the frontend. The next stage is CMS integration.

---

## Remaining

- Connect a frontend data layer to Supabase
- Seed CMS content from the current static data (separate task; not done)
- Replace static data where appropriate, after seeding
- Implement authentication and admin authorization in the app
- Build the CMS dashboard
- Test anonymous reads and admin writes against RLS

---

## Not done

- Authentication UI
- Admin dashboard
- Content seeding
- Supabase-backed pages

---

## Next Action

Seed the empty remote tables from the existing static content, without changing page components until the seed is verified.

---

## Cursor State

Remote schema verified on `pdqwaftiflaaelwzzypp`. Frontend remains static.
