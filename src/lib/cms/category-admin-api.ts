import { getSupabaseClient } from '@/lib/supabase'

import {
  confirmAffectedRows,
  mapCategoryWriteError,
  planPillWrites,
  validateCategoryEdit,
  type CategoryEditInput,
  type PillDraft,
} from './category-admin.mjs'

const categoryColumns = 'id,slug,name,display_title,card_label,published,sort_order'

export interface AdminCategorySummary {
  id: string
  slug: string
  name: string
  displayTitle: string
  cardLabel: string
  published: boolean
  sortOrder: number
}

export interface AdminPill {
  id: string
  slug: string
  label: string
  sortOrder: number
  published: boolean
}

function mapCategory(row: {
  id: string
  slug: string
  name: string
  display_title: string
  card_label: string
  published: boolean
  sort_order: number
}): AdminCategorySummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    displayTitle: row.display_title,
    cardLabel: row.card_label,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export async function loadAdminCategories(): Promise<AdminCategorySummary[]> {
  const { data, error } = await getSupabaseClient()
    .from('categories')
    .select(categoryColumns)
    .order('sort_order', { ascending: true })
  if (error) throw new Error('Categories could not be loaded.')
  return (data ?? []).map(mapCategory)
}

export async function loadAdminCategory(id: string) {
  const client = getSupabaseClient()
  const categoryResult = await client.from('categories').select(categoryColumns).eq('id', id).maybeSingle()
  if (categoryResult.error) return { status: 'error' as const, category: null, pills: [] }
  if (!categoryResult.data) return { status: 'not-found' as const, category: null, pills: [] }
  const pillsResult = await client
    .from('category_pills')
    .select('id,slug,label,sort_order,published')
    .eq('category_id', id)
    .order('sort_order', { ascending: true })
  if (pillsResult.error) return { status: 'error' as const, category: null, pills: [] }
  const pills: AdminPill[] = (pillsResult.data ?? []).map((pill) => ({
    id: pill.id,
    slug: pill.slug,
    label: pill.label,
    sortOrder: pill.sort_order,
    published: pill.published,
  }))
  return { status: 'ready' as const, category: mapCategory(categoryResult.data), pills }
}

export async function saveAdminCategory(id: string, input: CategoryEditInput, drafts: PillDraft[], existing: { id: string; slug: string }[]) {
  const category = validateCategoryEdit(input)
  if (!category.ok) return category
  const pills = planPillWrites(existing, drafts)
  if (!pills.ok) return { ok: false as const, field: 'pills', message: pills.errors[0]?.message ?? 'Check the pills.', errors: pills.errors }

  const client = getSupabaseClient()
  // These requests are not one transaction. A later denial leaves the category row and any earlier pill writes saved.
  const updated = await client.from('categories').update(category.value).eq('id', id).select(categoryColumns).maybeSingle()
  const denied = mapCategoryWriteError(updated.error)
  if (denied) return { ok: false as const, field: null, message: denied }
  if (!updated.data) return { ok: false as const, field: null, message: 'The database denied this change.' }

  for (const pill of pills.updates) {
    const result = await client
      .from('category_pills')
      .update({ label: pill.label, sort_order: pill.sort_order, published: pill.published })
      .eq('id', pill.id)
      .eq('category_id', id)
      .select('id')
    const message = confirmAffectedRows(result.error, result.data, 1)
    if (message) return { ok: false as const, field: 'pills', message }
  }

  if (pills.deletes.length > 0) {
    const removed = await client
      .from('category_pills')
      .delete()
      .in('id', pills.deletes)
      .eq('category_id', id)
      .select('id')
    const message = confirmAffectedRows(removed.error, removed.data, pills.deletes.length)
    if (message) return { ok: false as const, field: 'pills', message }
  }

  if (pills.inserts.length > 0) {
    const inserted = await client
      .from('category_pills')
      .insert(
        pills.inserts.map((pill) => ({
          category_id: id,
          slug: pill.slug,
          label: pill.label,
          sort_order: pill.sort_order,
          published: pill.published,
        })),
      )
      .select('id')
    const message = confirmAffectedRows(inserted.error, inserted.data, pills.inserts.length)
    if (message) return { ok: false as const, field: 'pills', message }
  }

  return { ok: true as const, category: mapCategory(updated.data) }
}
