CREATE TABLE public.category_collages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL UNIQUE REFERENCES public.categories (id) ON DELETE CASCADE,
  container_variant text NOT NULL DEFAULT 'default',
  overlay_primary text,
  overlay_secondary text,
  overlay_pos_left_pct numeric(5, 2) CHECK (
    overlay_pos_left_pct IS NULL
    OR (overlay_pos_left_pct >= 0 AND overlay_pos_left_pct <= 100)
  ),
  overlay_pos_top_pct numeric(5, 2) CHECK (
    overlay_pos_top_pct IS NULL
    OR (overlay_pos_top_pct >= 0 AND overlay_pos_top_pct <= 100)
  ),
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT category_collages_container_variant_check CHECK (
    container_variant IN ('default')
  )
);

CREATE TRIGGER category_collages_set_updated_at
  BEFORE UPDATE ON public.category_collages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
