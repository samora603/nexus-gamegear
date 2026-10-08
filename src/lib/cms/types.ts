import type { SubCategory } from '@/types/category'

/**
 * Semantic CMS snapshot. Collage CSS stays in `src/data/category-collages.ts`.
 * Communication Gadgets and Entertainment Gadgets read this snapshot.
 */
export interface CmsSiteSettings {
  siteName: string
  tagline: string
  heroHeadline: string
  heroCtaText: string
  heroCtaHref: string
  aboutHeading: string
  aboutBody: string
  exploreHeading: string
  promoBannerText: string
  contactHeading: string
  contactPhone: string
  contactEmail: string
  heroBackgroundPath: string | null
  heroPhonePath: string | null
}

export interface CmsSocialLink {
  platform: string
  label: string
  href: string
}

export interface CmsFeature {
  id: string
  title: string
  description: string
  imageAlt: string
  storagePath: string | null
}

export interface CmsContentBlock {
  key: string
  body: string | null
  storagePath: string | null
}

export interface CmsContactImage {
  alt: string | null
  storagePath: string | null
  sortOrder: number
}

export interface CmsCollageLayer {
  key: string
  type: 'image' | 'panel'
  storagePath: string | null
  alt: string | null
  panelVariant: string | null
  clipVariant: string | null
  posLeftPct: number
  posTopPct: number
  widthPct: number
  heightPct: number | null
  zIndex: number
  rotationDeg: number
  opacity: number
  sortOrder: number
}

export interface CmsCollage {
  containerVariant: string
  overlayPrimary: string | null
  overlaySecondary: string | null
  layers: CmsCollageLayer[]
}

export interface CmsCategory {
  slug: string
  name: string
  displayTitle: string
  cardLabel: string
  offsetCard: boolean
  cardPath: string | null
  pills: SubCategory[]
  collage: CmsCollage
}

export interface CmsSnapshot {
  site: CmsSiteSettings
  socialLinks: CmsSocialLink[]
  features: CmsFeature[]
  contentBlocks: CmsContentBlock[]
  contactImages: CmsContactImage[]
  mediaPaths: string[]
  categories: CmsCategory[]
}
