-- Single-row global site configuration (homepage hero, contact, SEO)

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL,
  tagline text NOT NULL,
  hero_headline text NOT NULL,
  hero_cta_text text NOT NULL,
  hero_cta_href text NOT NULL,
  hero_background_media_id uuid REFERENCES public.media_assets (id) ON DELETE SET NULL,
  hero_phone_media_id uuid REFERENCES public.media_assets (id) ON DELETE SET NULL,
  about_heading text NOT NULL,
  about_body text NOT NULL,
  explore_heading text NOT NULL,
  promo_banner_text text NOT NULL,
  contact_heading text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  logo_media_id uuid REFERENCES public.media_assets (id) ON DELETE SET NULL,
  meta_title text,
  meta_description text,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
