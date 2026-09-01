import NotFoundPage from '@/pages/NotFoundPage'
import { categories } from '@/data/categories'
import { getCategoryBySlug } from '@/types/category'
import { CategoryLayout } from '@/layouts/CategoryLayout'
import { PillButton } from '@/components/ui/PillButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useParams } from 'react-router-dom'

/** Development placeholder — full category UI in Phase 1C. */
export default function CategoryPage() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>()
  const category = getCategoryBySlug(categorySlug, categories)

  if (!category) {
    return <NotFoundPage />
  }

  return (
    <CategoryLayout>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="space-y-6">
          <SectionHeading as="h1" size="section">
            {category.name}
          </SectionHeading>

          <nav aria-label={`${category.name} sub-categories`}>
            <ul className="flex flex-col gap-4">
              {category.subCategories.map((subCategory) => (
                <li key={subCategory.slug}>
                  <PillButton decorative aria-label={subCategory.name}>
                    {subCategory.name}
                  </PillButton>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-body text-sm text-white/60">
            Phase 1A — sub-category pills are visual only (no placeholder
            routes). Design reference: {category.designFile}.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="flex min-h-[16rem] items-center justify-center rounded-collage border border-dashed border-white/20 bg-black/20"
        >
          <p className="font-body text-sm text-white/40">
            Image collage placeholder
          </p>
        </div>
      </div>
    </CategoryLayout>
  )
}
