import assert from 'node:assert/strict'
import test from 'node:test'

import { mergeCanaryCategory, presentCanary, resolveCategorySource } from './category-source.mjs'

const staticView = {
  category: {
    slug: 'communication-gadgets',
    name: 'Static name',
    displayTitle: 'STATIC',
    cardLabel: 'Static',
    designFile: '2.png',
    cardImage: '/local/card.webp',
    subCategories: [{ slug: 'old', name: 'Old' }],
  },
  collage: {
    containerClassName: 'min-h-[22rem]',
    panels: [
      {
        id: 'dark-overlay',
        className: 'absolute right-[4%] top-[24%] z-20 -skew-x-6',
      },
    ],
    images: [
      {
        id: 'primary',
        src: '/local/primary.webp',
        alt: 'Local primary',
        className: 'absolute left-[34%] top-[4%] [clip-path:polygon(0_0,100%_0,100%_88%,88%_100%,0_100%)]',
      },
    ],
    overlayText: {
      primary: 'Local title',
      secondary: 'LOCAL',
      className: 'absolute bottom-[22%] right-[6%]',
    },
  },
}

const cmsCategory = {
  slug: 'communication-gadgets',
  name: 'Communication Gadgets',
  displayTitle: 'COMMUNICATION GADGETS',
  cardLabel: 'Communication gadgets',
  offsetCard: false,
  pills: [{ slug: 'smartphones', name: 'Smartphones' }],
  collage: {
    overlayPrimary: 'iPhone G',
    overlaySecondary: 'NEXT GENERATION CONCEPT',
    layers: [
      {
        key: 'dark-overlay',
        type: 'panel',
        storagePath: null,
        alt: null,
      },
      {
        key: 'primary',
        type: 'image',
        storagePath: 'categories/communication-gadgets/primary-collage.webp',
        alt: 'Remote portrait',
      },
    ],
  },
}

test('only communication gadgets selects the CMS source', () => {
  assert.equal(resolveCategorySource('communication-gadgets'), 'cms')
  for (const slug of [
    'entertainment-gadgets',
    'computer-gadgets',
    'wearable-gadgets',
    'photography-gadgets',
    'power-charging-gadgets',
    '',
  ]) {
    assert.equal(resolveCategorySource(slug), 'static')
  }
})

test('canary merge keeps presentation CSS and swaps the media URL', () => {
  const merged = mergeCanaryCategory(staticView, cmsCategory, (path) => `https://cdn.test/media/${path}`)
  assert.equal(merged.category.designFile, '2.png')
  assert.equal(merged.category.cardImage, '/local/card.webp')
  assert.equal(merged.category.displayTitle, 'COMMUNICATION GADGETS')
  assert.deepEqual(merged.category.subCategories, [{ slug: 'smartphones', name: 'Smartphones' }])
  assert.equal(
    merged.collage.images[0].src,
    'https://cdn.test/media/categories/communication-gadgets/primary-collage.webp',
  )
  assert.equal(merged.collage.images[0].className, staticView.collage.images[0].className)
  assert.equal(merged.collage.panels[0].className, staticView.collage.panels[0].className)
  assert.equal(merged.collage.overlayText.className, staticView.collage.overlayText.className)
  assert.equal(merged.collage.overlayText.primary, 'iPhone G')
  assert.equal(staticView.collage.images[0].src, '/local/primary.webp')
})

test('a CMS failure keeps the static view', () => {
  const result = presentCanary(staticView, { ok: false })
  assert.equal(result.source, 'static-fallback')
  assert.equal(result.view, staticView)
})

test('an image without presentation CSS fails closed', () => {
  const extra = structuredClone(cmsCategory)
  extra.collage.layers.push({
    key: 'unmapped',
    type: 'image',
    storagePath: 'categories/communication-gadgets/extra.webp',
    alt: 'Extra',
  })
  assert.throws(
    () => mergeCanaryCategory(staticView, extra, (path) => path),
    (error) => error.code === 'CMS_CATEGORY_MAPPING_FAILED',
  )
})
