import { useEffect, useMemo, useState } from 'react'
import { categories } from '@/data/categories'
import { getCategoryCollage } from '@/data/category-collages'
import type { Category } from '@/types/category'
import type { CategoryCollageConfig } from '@/types/collage'

import { presentCanary, resolveCategorySource } from './category-source.mjs'
import { mediaPublicUrl } from './mappers'
import { CmsError } from './read-cms.mjs'
import { loadPublishedCms } from './queries'

export interface CategoryView {
  category: Category
  collage: CategoryCollageConfig
}

export type CategoryPageData =
  | { status: 'not-found' }
  | { status: 'loading' }
  | { status: 'ready'; source: 'static' | 'cms' | 'static-fallback'; view: CategoryView }

export function readStaticCategory(slug: string): CategoryView | null {
  const category = categories.find((entry) => entry.slug === slug)
  const collage = category ? getCategoryCollage(category.slug) : undefined
  if (!category || !collage) return null
  return { category, collage }
}

function reportCanaryFailure(categoryName: string, error: unknown) {
  if (!import.meta.env.DEV) return
  const code = error instanceof CmsError ? error.code : 'CMS_QUERY_FAILED'
  console.error(`${categoryName} CMS canary failed (${code}). Using static data.`)
}

export async function loadCanaryCategory(staticView: CategoryView): Promise<CategoryPageData> {
  try {
    const snapshot = await loadPublishedCms()
    const cmsCategory = snapshot.categories.find((entry) => entry.slug === staticView.category.slug)
    if (!cmsCategory) throw new CmsError('CMS_CATEGORY_MAPPING_FAILED', 'Canary category was not published')
    const presented = presentCanary(staticView, {
      ok: true,
      category: cmsCategory,
      resolveUrl: (storagePath) => mediaPublicUrl(storagePath),
    })
    return { status: 'ready', source: presented.source, view: presented.view }
  } catch (error) {
    reportCanaryFailure(staticView.category.name, error)
    return { status: 'ready', source: 'static-fallback', view: staticView }
  }
}

/** Static categories resolve immediately. Only canary slugs wait on Supabase. */
export function useCategoryPageData(slug: string): CategoryPageData {
  const usesCms = resolveCategorySource(slug) === 'cms'
  const staticView = useMemo(() => readStaticCategory(slug), [slug])
  const [canary, setCanary] = useState<{ slug: string; data: CategoryPageData } | null>(null)

  useEffect(() => {
    if (!usesCms || !staticView) return
    let cancelled = false
    loadCanaryCategory(staticView).then((result) => {
      if (!cancelled) setCanary({ slug, data: result })
    })
    return () => {
      cancelled = true
    }
  }, [slug, usesCms, staticView])

  if (!staticView) return { status: 'not-found' }
  if (!usesCms) return { status: 'ready', source: 'static', view: staticView }
  if (!canary || canary.slug !== slug) return { status: 'loading' }
  return canary.data
}
