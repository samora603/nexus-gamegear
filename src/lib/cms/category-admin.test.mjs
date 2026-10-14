import assert from 'node:assert/strict'
import test from 'node:test'

import { presentPublishedCategory } from './category-source.mjs'
import { confirmAffectedRows, mapCategoryWriteError, movePill, planPillWrites, validateCategoryEdit } from './category-admin.mjs'

const staticView = {
  category: { slug: 'communication-gadgets', name: 'Static' },
  collage: { images: [], panels: [] },
}

test('category copy and publication are validated from existing fields', () => {
  const saved = validateCategoryEdit({
    name: ' Communication Gadgets ',
    displayTitle: 'COMMUNICATION GADGETS',
    cardLabel: 'Communication gadgets',
    sortOrder: 0,
    published: false,
  })
  assert.equal(saved.ok, true)
  if (!saved.ok) return
  assert.equal(saved.value.published, false)
  assert.equal(saved.value.name, 'Communication Gadgets')
  assert.equal(validateCategoryEdit({ name: '', displayTitle: 'T', cardLabel: 'C', sortOrder: 0 }).ok, false)
  assert.equal(validateCategoryEdit({ name: 'N', displayTitle: 'T', cardLabel: 'C', sortOrder: -1 }).ok, false)
})

test('pill edits keep existing slugs and assign slugs only to new pills', () => {
  const plan = planPillWrites(
    [
      { id: 'a', slug: 'smartphones' },
      { id: 'b', slug: 'tablets' },
    ],
    [
      { id: 'b', label: 'Tablet devices', published: true },
      { id: 'a', label: 'Smartphones', published: false },
      { label: 'Headsets', published: true },
    ],
  )
  assert.equal(plan.ok, true)
  if (!plan.ok) return
  assert.deepEqual(plan.updates, [
    { id: 'b', label: 'Tablet devices', sort_order: 0, published: true },
    { id: 'a', label: 'Smartphones', sort_order: 1, published: false },
  ])
  assert.deepEqual(plan.inserts, [{ slug: 'headsets', label: 'Headsets', sort_order: 2, published: true }])
  assert.deepEqual(plan.deletes, [])
})

test('removing a pill plans a delete and reordering persists as sort order', () => {
  const moved = movePill([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 2, -1)
  assert.deepEqual(moved.map((pill) => pill.id), ['a', 'c', 'b'])
  const plan = planPillWrites(
    [
      { id: 'a', slug: 'smartphones' },
      { id: 'b', slug: 'tablets' },
    ],
    [{ id: 'a', label: 'Smartphones', published: true }],
  )
  assert.equal(plan.ok, true)
  if (!plan.ok) return
  assert.deepEqual(plan.deletes, ['b'])
  assert.equal(plan.updates[0].sort_order, 0)
})

test('blank and duplicate pill labels are rejected', () => {
  const blank = planPillWrites([], [{ label: '   ' }])
  assert.equal(blank.ok, false)
  const duplicate = planPillWrites([{ id: 'a', slug: 'smartphones' }], [
    { id: 'a', label: 'Phones', published: true },
    { label: 'Smartphones', published: true },
  ])
  assert.equal(duplicate.ok, false)
})

test('authorization and unique failures stay generic', () => {
  assert.match(mapCategoryWriteError({ code: '42501' }) ?? '', /denied/)
  assert.match(mapCategoryWriteError({ code: '23505' }) ?? '', /already exists/)
  assert.equal(mapCategoryWriteError(null), null)
})

test('pill mutations require the intended affected rows', () => {
  assert.match(confirmAffectedRows({ code: '42501' }, [{ id: 'a' }], 1) ?? '', /denied/)
  assert.match(confirmAffectedRows(null, [], 1) ?? '', /denied/)
  assert.equal(confirmAffectedRows(null, [{ id: 'a' }], 1), null)
  assert.equal(confirmAffectedRows(null, [{ id: 'a' }, { id: 'b' }], 2), null)
  assert.match(confirmAffectedRows(null, [{ id: 'a' }], 2) ?? '', /denied/)
  assert.match(confirmAffectedRows(null, undefined, 1) ?? '', /denied/)
})

test('an unpublished category is not replaced by the static page', () => {
  const hidden = presentPublishedCategory(staticView, [], (path) => path)
  assert.equal(hidden.status, 'not-found')
})

test('a published category still resolves through the CMS merge', () => {
  const shown = presentPublishedCategory(
    {
      category: {
        slug: 'communication-gadgets',
        name: 'Static',
        displayTitle: 'STATIC',
        cardLabel: 'Static',
        designFile: '2.png',
        cardImage: '/local.webp',
        subCategories: [],
      },
      collage: {
        containerClassName: 'grid',
        images: [{ id: 'primary', src: '/local.webp', alt: 'Local', className: 'absolute' }],
        panels: [],
      },
    },
    [
      {
        slug: 'communication-gadgets',
        name: 'Communication Gadgets',
        displayTitle: 'COMMUNICATION GADGETS',
        cardLabel: 'Communication gadgets',
        offsetCard: false,
        pills: [{ slug: 'smartphones', name: 'Smartphones' }],
        collage: { overlayPrimary: null, overlaySecondary: null, layers: [{ key: 'primary', type: 'image', storagePath: 'categories/communication-gadgets/primary-collage.webp', alt: 'Phone' }] },
      },
    ],
    (path) => `https://example.supabase.co/storage/v1/object/public/media/${path}`,
  )
  assert.equal(shown.status, 'ready')
  if (shown.status !== 'ready') return
  assert.equal(shown.source, 'cms')
  assert.equal(shown.view.category.displayTitle, 'COMMUNICATION GADGETS')
})
