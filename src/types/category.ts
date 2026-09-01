export interface SubCategory {
  slug: string
  name: string
}

export interface Category {
  slug: string
  name: string
  cardLabel: string
  cardImage?: string
  designFile: string
  offsetCard?: boolean
  subCategories: SubCategory[]
}

export function isCategorySlug(slug: string, categories: Category[]): boolean {
  return categories.some((category) => category.slug === slug)
}

export function getCategoryBySlug(
  slug: string,
  categories: Category[],
): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
