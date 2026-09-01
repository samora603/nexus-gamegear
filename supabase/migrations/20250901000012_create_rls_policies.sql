-- Row Level Security per DATABASE_PLAN.md §7
-- Admin authorization via auth.jwt() -> app_metadata -> role = 'admin'

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true when JWT app_metadata.role is admin. Never use user_metadata for authorization.';

-- media_assets: public read all rows (paths resolve via public Storage bucket)
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY media_assets_public_read
  ON public.media_assets
  FOR SELECT
  USING (true);

CREATE POLICY media_assets_admin_all
  ON public.media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_settings_public_read
  ON public.site_settings
  FOR SELECT
  USING (published = true);

CREATE POLICY site_settings_admin_all
  ON public.site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_links_public_read
  ON public.social_links
  FOR SELECT
  USING (published = true);

CREATE POLICY social_links_admin_all
  ON public.social_links
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- features
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY features_public_read
  ON public.features
  FOR SELECT
  USING (published = true);

CREATE POLICY features_admin_all
  ON public.features
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- content_blocks
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_blocks_public_read
  ON public.content_blocks
  FOR SELECT
  USING (published = true);

CREATE POLICY content_blocks_admin_all
  ON public.content_blocks
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_public_read
  ON public.categories
  FOR SELECT
  USING (published = true);

CREATE POLICY categories_admin_all
  ON public.categories
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- category_pills
ALTER TABLE public.category_pills ENABLE ROW LEVEL SECURITY;

CREATE POLICY category_pills_public_read
  ON public.category_pills
  FOR SELECT
  USING (published = true);

CREATE POLICY category_pills_admin_all
  ON public.category_pills
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- category_collages
ALTER TABLE public.category_collages ENABLE ROW LEVEL SECURITY;

CREATE POLICY category_collages_public_read
  ON public.category_collages
  FOR SELECT
  USING (published = true);

CREATE POLICY category_collages_admin_all
  ON public.category_collages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- collage_layers
ALTER TABLE public.collage_layers ENABLE ROW LEVEL SECURITY;

CREATE POLICY collage_layers_public_read
  ON public.collage_layers
  FOR SELECT
  USING (published = true);

CREATE POLICY collage_layers_admin_all
  ON public.collage_layers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- contact_grid_images
ALTER TABLE public.contact_grid_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_grid_images_public_read
  ON public.contact_grid_images
  FOR SELECT
  USING (published = true);

CREATE POLICY contact_grid_images_admin_all
  ON public.contact_grid_images
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
