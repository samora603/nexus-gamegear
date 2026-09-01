CREATE TABLE public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  image_alt text NOT NULL,
  media_id uuid NOT NULL REFERENCES public.media_assets (id) ON DELETE RESTRICT,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER features_set_updated_at
  BEFORE UPDATE ON public.features
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
