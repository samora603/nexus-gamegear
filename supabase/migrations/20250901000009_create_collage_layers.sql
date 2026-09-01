CREATE TABLE public.collage_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collage_id uuid NOT NULL REFERENCES public.category_collages (id) ON DELETE CASCADE,
  layer_key text NOT NULL,
  layer_type text NOT NULL,
  media_id uuid REFERENCES public.media_assets (id) ON DELETE RESTRICT,
  panel_variant text,
  clip_variant text,
  alt_text text,
  pos_left_pct numeric(5, 2) NOT NULL,
  pos_top_pct numeric(5, 2) NOT NULL,
  width_pct numeric(5, 2) NOT NULL,
  height_pct numeric(5, 2),
  z_index integer NOT NULL DEFAULT 0,
  rotation_deg numeric(5, 2) NOT NULL DEFAULT 0,
  opacity numeric(3, 2) NOT NULL DEFAULT 1.0,
  decorative boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (collage_id, layer_key),
  CONSTRAINT collage_layers_layer_type_check CHECK (layer_type IN ('image', 'panel')),
  CONSTRAINT collage_layers_pos_left_pct_check CHECK (
    pos_left_pct >= 0 AND pos_left_pct <= 100
  ),
  CONSTRAINT collage_layers_pos_top_pct_check CHECK (
    pos_top_pct >= 0 AND pos_top_pct <= 100
  ),
  CONSTRAINT collage_layers_width_pct_check CHECK (
    width_pct >= 0 AND width_pct <= 100
  ),
  CONSTRAINT collage_layers_height_pct_check CHECK (
    height_pct IS NULL OR (height_pct >= 0 AND height_pct <= 100)
  ),
  CONSTRAINT collage_layers_opacity_check CHECK (
    opacity >= 0 AND opacity <= 1
  ),
  CONSTRAINT collage_layers_rotation_deg_check CHECK (
    rotation_deg >= -360 AND rotation_deg <= 360
  ),
  CONSTRAINT collage_layers_panel_variant_check CHECK (
    panel_variant IS NULL
    OR panel_variant IN (
      'dark_overlay',
      'white_window',
      'burgundy',
      'white_panel',
      'wood_surface',
      'grey_accent',
      'glass_frame'
    )
  ),
  CONSTRAINT collage_layers_clip_variant_check CHECK (
    clip_variant IS NULL
    OR clip_variant IN ('none', 'chamfer_bottom_left', 'notch_top_right')
  ),
  CONSTRAINT collage_layers_type_fields_check CHECK (
    (
      layer_type = 'image'
      AND media_id IS NOT NULL
      AND panel_variant IS NULL
    )
    OR (
      layer_type = 'panel'
      AND panel_variant IS NOT NULL
      AND media_id IS NULL
    )
  )
);

CREATE TRIGGER collage_layers_set_updated_at
  BEFORE UPDATE ON public.collage_layers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.collage_layers IS 'Collage images and decorative panels with percentage-based layout (no CSS/Tailwind in DB).';
