-- Single-author blog. The site owner is one stable author row, not copied onto every post.
-- Public reads are published posts only. Writes require public.is_admin().

CREATE TABLE public.blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_authors_key_format CHECK (key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE public.blog_authors IS 'Stable author identities. The initial row is the site owner, not a personal profile.';

CREATE TRIGGER blog_authors_set_updated_at
  BEFORE UPDATE ON public.blog_authors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.blog_authors (id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image_id uuid REFERENCES public.media_assets (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published')),
  CONSTRAINT blog_posts_publication_check CHECK (
    (status = 'draft' AND published_at IS NULL)
    OR (status = 'published' AND published_at IS NOT NULL)
  ),
  CONSTRAINT blog_posts_content_not_blank CHECK (length(btrim(content)) > 0)
);

COMMENT ON TABLE public.blog_posts IS 'Single-author articles. Public clients can read published rows only.';
COMMENT ON COLUMN public.blog_posts.content IS 'Plain text paragraphs separated by blank lines. Not HTML.';
COMMENT ON COLUMN public.blog_posts.featured_image_id IS 'Optional media_assets row in the public media bucket.';

CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX blog_posts_published_listing
  ON public.blog_posts (published_at DESC)
  WHERE status = 'published';

ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_authors_public_read
  ON public.blog_authors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.blog_posts AS post
      WHERE post.author_id = blog_authors.id
        AND post.status = 'published'
        AND post.published_at IS NOT NULL
        AND post.published_at <= now()
    )
  );

CREATE POLICY blog_authors_admin_all
  ON public.blog_authors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY blog_posts_public_read
  ON public.blog_posts
  FOR SELECT
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY blog_posts_admin_all
  ON public.blog_posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

INSERT INTO public.blog_authors (key, display_name)
VALUES ('site-owner', 'GameGear Nexus')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.blog_posts (
  author_id,
  title,
  slug,
  excerpt,
  content,
  status,
  published_at
)
SELECT
  author.id,
  'Development seed draft',
  'development-seed-draft',
  'Unpublished structural test data. This is not a production article.',
  'Development seed draft. This row stays unpublished so anonymous clients cannot read it.',
  'draft',
  NULL
FROM public.blog_authors AS author
WHERE author.key = 'site-owner'
  AND NOT EXISTS (
    SELECT 1 FROM public.blog_posts WHERE slug = 'development-seed-draft'
  );
