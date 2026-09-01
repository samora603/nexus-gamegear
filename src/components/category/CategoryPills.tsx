import type { SubCategory } from '@/types/category'
import { PillButton } from '@/components/ui/PillButton'

export interface CategoryPillsProps {
  subCategories: SubCategory[]
  categoryName: string
}

/** Decorative sub-category pills — non-navigational per Phase 1 decision. */
export function CategoryPills({
  subCategories,
  categoryName,
}: CategoryPillsProps) {
  return (
    <nav aria-label={`${categoryName} sub-categories`}>
      <ul className="flex flex-col gap-4 sm:gap-5">
        {subCategories.map((subCategory) => (
          <li key={subCategory.slug}>
            <PillButton decorative>{subCategory.name}</PillButton>
          </li>
        ))}
      </ul>
    </nav>
  )
}
