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

test('communication and entertainment select CMS; other routes stay static', () => {
  assert.equal(resolveCategorySource('communication-gadgets'), 'cms')
  assert.equal(resolveCategorySource('entertainment-gadgets'), 'cms')
  for (const slug of [
    'computer-gadgets',
    'wearable-gadgets',
    'photography-gadgets',
    'power-charging-gadgets',
    '',
    '/',
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

const entertainmentStatic = {
  category: {
    slug: 'entertainment-gadgets',
    name: 'Entertainment Gadgets',
    displayTitle: 'STATIC ENTERTAINMENT',
    cardLabel: 'Entertainment gadgets',
    designFile: '3.png',
    subCategories: [],
  },
  collage: {
    containerClassName: 'min-h-[22rem]',
    images: [
      {
        id: 'vintage-tvs',
        src: '/local/vintage.webp',
        alt: 'Local vintage',
        className: 'absolute right-[2%] top-[0%] z-10 w-[32%] opacity-90',
      },
      {
        id: 'headphones',
        src: '/local/headphones.webp',
        alt: 'Local headphones',
        className:
          'absolute bottom-[4%] left-[24%] z-30 w-[28%] rounded-glass border border-white/10 bg-white/10 p-1 backdrop-blur-sm',
      },
    ],
  },
}

const entertainmentCms = {
  slug: 'entertainment-gadgets',
  name: 'Entertainment Gadgets',
  displayTitle: 'ENTERTAINMENT GADGETS',
  cardLabel: 'Entertainment gadgets',
  offsetCard: false,
  pills: [
    { slug: 'tv', name: 'TV' },
    { slug: 'gaming-consoles', name: 'Gaming Consoles' },
    { slug: 'headphones', name: 'Headphones' },
    { slug: 'speakers', name: 'Speakers' },
  ],
  collage: {
    overlayPrimary: null,
    overlaySecondary: null,
    layers: [
      {
        key: 'headphones',
        type: 'image',
        storagePath: 'categories/entertainment-gadgets/headphones.webp',
        alt: 'Remote headphones',
      },
      {
        key: 'vintage-tvs',
        type: 'image',
        storagePath: 'categories/entertainment-gadgets/vintage-tvs.webp',
        alt: 'Remote vintage',
      },
    ],
  },
}

test('entertainment keeps collage CSS and does not invent overlay text', () => {
  const merged = mergeCanaryCategory(
    entertainmentStatic,
    entertainmentCms,
    (path) => `https://cdn.test/media/${path}`,
  )
  assert.equal(merged.category.displayTitle, 'ENTERTAINMENT GADGETS')
  assert.equal(merged.category.designFile, '3.png')
  assert.deepEqual(
    merged.collage.images.map((image) => image.id),
    ['vintage-tvs', 'headphones'],
  )
  assert.equal(
    merged.collage.images[0].src,
    'https://cdn.test/media/categories/entertainment-gadgets/vintage-tvs.webp',
  )
  assert.equal(merged.collage.images[1].className, entertainmentStatic.collage.images[1].className)
  assert.equal(merged.collage.overlayText, undefined)
  assert.equal(entertainmentStatic.collage.images[0].src, '/local/vintage.webp')
})

test('an entertainment CMS failure keeps the static collage', () => {
  const result = presentCanary(entertainmentStatic, { ok: false })
  assert.equal(result.source, 'static-fallback')
  assert.equal(result.view.collage.images[1].className.includes('rounded-glass'), true)
  assert.equal(result.view.collage.images[0].src, '/local/vintage.webp')
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
