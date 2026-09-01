CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT social_links_platform_check CHECK (
    platform IN ('facebook', 'twitter', 'instagram')
  )
);

CREATE TRIGGER social_links_set_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
