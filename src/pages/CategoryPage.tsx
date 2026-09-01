import NotFoundPage from '@/pages/NotFoundPage'
import { categories } from '@/data/categories'
import { getCategoryCollage } from '@/data/category-collages'
import { getCategoryBySlug } from '@/types/category'
import { CategoryLayout } from '@/layouts/CategoryLayout'
import { CategoryPageContent } from '@/components/category/CategoryPageContent'
import { useParams } from 'react-router-dom'

export default function CategoryPage() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>()
  const category = getCategoryBySlug(categorySlug, categories)
  const collage = category ? getCategoryCollage(category.slug) : undefined

  if (!category || !collage) {
    return <NotFoundPage />
  }

  return (
    <CategoryLayout>
      <CategoryPageContent category={category} collage={collage} />
    </CategoryLayout>
  )
}
