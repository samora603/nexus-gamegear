import NotFoundPage from '@/pages/NotFoundPage'
import { useCategoryPageData } from '@/lib/cms/category-data'
import { CategoryLayout } from '@/layouts/CategoryLayout'
import { CategoryPageContent } from '@/components/category/CategoryPageContent'
import { useParams } from 'react-router-dom'

export default function CategoryPage() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>()
  const page = useCategoryPageData(categorySlug)

  if (page.status === 'not-found') {
    return <NotFoundPage />
  }

  return (
    <CategoryLayout>
      {page.status === 'loading' ? (
        <p className="font-body text-sm text-white/70" role="status">
          Loading category
        </p>
      ) : (
        <CategoryPageContent
          category={page.view.category}
          collage={page.view.collage}
          source={page.source}
        />
      )}
    </CategoryLayout>
  )
}
