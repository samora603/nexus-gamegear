CREATE TABLE public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  body text,
  media_id uuid REFERENCES public.media_assets (id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER content_blocks_set_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
