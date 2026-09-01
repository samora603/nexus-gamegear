CREATE TABLE public.category_pills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  slug text NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

CREATE TRIGGER category_pills_set_updated_at
  BEFORE UPDATE ON public.category_pills
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
