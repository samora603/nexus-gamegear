import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadAdminCategories, type AdminCategorySummary } from '@/lib/cms/category-admin-api'

export default function AdminCategoryListPage() {
  const [categories, setCategories] = useState<AdminCategorySummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => loadAdminCategories())
      .then((rows) => {
        if (!cancelled) setCategories(rows)
      })
      .catch(() => {
        if (!cancelled) setError('Categories could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <h2 className="font-display text-xl text-white">Categories</h2>
      <p className="mt-2 max-w-2xl font-body text-sm text-white/75">
        Titles, card labels, publication, and pills. Slugs, card images, and collage layouts stay fixed.
      </p>
      {categories === null && !error ? (
        <p className="mt-6 font-body text-sm text-white/70" role="status">
          Loading
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 font-body text-sm text-white" role="alert">
          {error}
        </p>
      ) : null}
      {categories && categories.length === 0 ? (
        <p className="mt-6 font-body text-sm text-white/75">No categories yet.</p>
      ) : null}
      <ul className="mt-4 flex flex-col gap-3">
        {(categories ?? []).map((category) => (
          <li key={category.id} className="rounded-lg border border-white/15 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-body text-base text-white">{category.displayTitle}</h3>
                <p className="mt-1 break-all font-body text-xs text-white/60">{category.slug}</p>
                <p className="mt-2 font-body text-xs text-white/70">
                  {category.published ? 'Published' : 'Unpublished'} · Sort {category.sortOrder}
                </p>
              </div>
              <Link
                to={`/admin/categories/${category.id}`}
                className="w-fit rounded-full border border-white px-4 py-2 font-body text-sm text-white"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
