-- Central registry for Supabase Storage file metadata (no binary data in Postgres)

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  alt_text text,
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  file_size_bytes integer CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.media_assets IS 'Metadata registry for files stored in Supabase Storage buckets.';
COMMENT ON COLUMN public.media_assets.storage_path IS 'Relative path within the media bucket, e.g. hero/background.webp';
