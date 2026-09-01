import type { Category } from '@/types/category'
import type { CategoryCollageConfig } from '@/types/collage'
import { CategoryImageCollage } from '@/components/category/CategoryImageCollage'
import { CategoryPills } from '@/components/category/CategoryPills'
import { CategoryTitle } from '@/components/category/CategoryTitle'

export interface CategoryPageContentProps {
  category: Category
  collage: CategoryCollageConfig
}

/** Reusable category page body — title, pills, and image collage. */
export function CategoryPageContent({
  category,
  collage,
}: CategoryPageContentProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,24rem)_1fr] xl:gap-8">
      <div className="flex flex-col gap-8 lg:gap-10 lg:pt-2">
        <CategoryTitle title={category.displayTitle} />
        <CategoryPills
          subCategories={category.subCategories}
          categoryName={category.name}
        />
      </div>

      <CategoryImageCollage config={collage} className="lg:-mr-4 xl:-mr-8" />
    </div>
  )
}
