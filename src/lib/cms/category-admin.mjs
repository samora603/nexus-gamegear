/**
 * Category admin decisions. Writes still go through the authenticated client and RLS.
 * Category slugs and pill slugs of existing rows are not rewritten.
 */
import { slugify } from './slug.mjs'

export function validateCategoryEdit(input) {
  const name = String(input?.name ?? '').trim()
  const displayTitle = String(input?.displayTitle ?? '').trim()
  const cardLabel = String(input?.cardLabel ?? '').trim()
  const sortOrder = Number(input?.sortOrder)
  if (!name) return { ok: false, field: 'name', message: 'Enter a category name.' }
  if (!displayTitle) return { ok: false, field: 'displayTitle', message: 'Enter a display title.' }
  if (!cardLabel) return { ok: false, field: 'cardLabel', message: 'Enter a card label.' }
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { ok: false, field: 'sortOrder', message: 'Sort order must be a whole number from 0 upward.' }
  }
  return {
    ok: true,
    value: {
      name,
      display_title: displayTitle,
      card_label: cardLabel,
      sort_order: sortOrder,
      published: Boolean(input?.published),
    },
  }
}

export function movePill(pills, index, direction) {
  const target = index + direction
  if (target < 0 || target >= pills.length) return pills
  const next = pills.slice()
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

export function planPillWrites(existing, drafts) {
  const errors = []
  const updates = []
  const inserts = []
  const kept = new Set()
  const slugs = new Set()

  drafts.forEach((draft, index) => {
    const label = String(draft?.label ?? '').trim()
    if (!label) {
      errors.push({ index, message: 'Enter a pill label.' })
      return
    }
    if (draft?.id) {
      const current = existing.find((pill) => pill.id === draft.id)
      if (!current) {
        errors.push({ index, message: 'This pill is no longer on the category.' })
        return
      }
      if (slugs.has(current.slug)) {
        errors.push({ index, message: 'This pill is listed twice.' })
        return
      }
      slugs.add(current.slug)
      kept.add(current.id)
      updates.push({
        id: current.id,
        label,
        sort_order: index,
        published: Boolean(draft.published),
      })
      return
    }
    let slug = null
    try {
      slug = slugify(label)
    } catch {
      slug = null
    }
    if (!slug) {
      errors.push({ index, message: 'The pill label needs letters or numbers.' })
      return
    }
    if (slugs.has(slug)) {
      errors.push({ index, message: 'Another pill already uses this label.' })
      return
    }
    slugs.add(slug)
    inserts.push({
      slug,
      label,
      sort_order: index,
      published: draft?.published !== false,
    })
  })

  if (errors.length > 0) return { ok: false, errors }
  return {
    ok: true,
    updates,
    inserts,
    deletes: existing.filter((pill) => !kept.has(pill.id)).map((pill) => pill.id),
  }
}

export function mapCategoryWriteError(error) {
  if (!error) return null
  const code = String(error.code ?? '')
  if (code === '23505') return 'A pill with this label already exists on the category.'
  if (code === '42501' || code === 'PGRST301') return 'The database denied this change.'
  return 'The category could not be saved.'
}
