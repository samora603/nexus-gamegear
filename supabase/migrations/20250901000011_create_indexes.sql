-- Secondary indexes per DATABASE_PLAN.md §6

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories (sort_order)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_category_pills_category ON public.category_pills (category_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_category_pills_slug ON public.category_pills (category_id, slug);

CREATE UNIQUE INDEX IF NOT EXISTS idx_category_collages_category ON public.category_collages (category_id);
CREATE INDEX IF NOT EXISTS idx_collage_layers_collage ON public.collage_layers (collage_id);
CREATE INDEX IF NOT EXISTS idx_collage_layers_sort ON public.collage_layers (collage_id, z_index, sort_order);

CREATE UNIQUE INDEX IF NOT EXISTS idx_features_key ON public.features (key);
CREATE INDEX IF NOT EXISTS idx_features_sort ON public.features (sort_order)
  WHERE published = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_assets_path ON public.media_assets (storage_path);

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_blocks_key ON public.content_blocks (key);

CREATE INDEX IF NOT EXISTS idx_social_links_sort ON public.social_links (sort_order)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_contact_grid_images_sort ON public.contact_grid_images (sort_order)
  WHERE published = true;
