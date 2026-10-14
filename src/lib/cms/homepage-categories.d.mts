export interface StaticHomepageCategory {
  slug: string
  name: string
  displayTitle: string
  cardLabel: string
  cardImage?: string
  designFile: string
  offsetCard?: boolean
  subCategories: { slug: string; name: string }[]
}

export interface HomepageCard {
  slug: string
  name: string
  displayTitle: string
  cardLabel: string
  cardImage?: string
  designFile: string
  offsetCard: boolean
  subCategories: { slug: string; name: string }[]
}

export interface HomepageCategoryView {
  status: 'loading' | 'error' | 'empty' | 'ready'
  source: 'static' | 'static-fallback' | 'cms'
  categories: HomepageCard[]
}

export function compareHomepageCategories(
  left: { sortOrder?: number; slug?: string },
  right: { sortOrder?: number; slug?: string },
): number

export function presentHomepageCategories(
  staticCategories: StaticHomepageCategory[],
  cmsCategories: {
    slug?: string
    name?: string
    displayTitle?: string
    cardLabel?: string
    offsetCard?: boolean
    sortOrder?: number
  }[],
): HomepageCard[]

export function homepageCategoryView(
  phase: 'loading' | 'error' | 'ready',
  staticCategories: StaticHomepageCategory[],
  cmsCategories: Parameters<typeof presentHomepageCategories>[1],
): HomepageCategoryView

export function splitHomepageCards(categories: HomepageCard[]): {
  offset: HomepageCard | null
  main: HomepageCard[]
}
