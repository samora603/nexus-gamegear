-- Storage buckets and object policies per DATABASE_PLAN.md §8 and CMS_ARCHITECTURE.md §10

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- media bucket: anonymous read
CREATE POLICY storage_media_public_read
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- media bucket: admin write/update/delete (includes SELECT for upsert)
CREATE POLICY storage_media_admin_all
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

-- uploads bucket: admin only (no anonymous access)
CREATE POLICY storage_uploads_admin_all
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'uploads' AND public.is_admin())
  WITH CHECK (bucket_id = 'uploads' AND public.is_admin());
