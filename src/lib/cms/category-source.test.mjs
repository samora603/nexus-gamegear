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

test('all six categories select CMS; the homepage slug does not', () => {
  for (const slug of [
    'communication-gadgets',
    'entertainment-gadgets',
    'computer-gadgets',
    'wearable-gadgets',
    'photography-gadgets',
    'power-charging-gadgets',
  ]) {
    assert.equal(resolveCategorySource(slug), 'cms')
  }
  assert.equal(resolveCategorySource(''), 'static')
  assert.equal(resolveCategorySource('/'), 'static')
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

const computerStatic = {
  category: {
    slug: 'computer-gadgets',
    name: 'Computer Gadgets',
    displayTitle: 'STATIC COMPUTER',
    cardLabel: 'Computer gadgets',
    designFile: '4.png',
    subCategories: [],
  },
  collage: {
    containerClassName: 'min-h-[22rem]',
    images: [
      {
        id: 'desk-setup',
        src: '/local/desk.webp',
        alt: 'Local desk',
        className: 'absolute left-[14%] top-[2%] z-10 w-[18%] shadow-collage',
      },
      {
        id: 'printer-main',
        src: '/local/printer.webp',
        alt: 'Local printer',
        className:
          'absolute left-[28%] top-[8%] z-30 w-[50%] [clip-path:polygon(0_0,82%_0,100%_14%,100%_100%,0_100%)]',
      },
      {
        id: 'floor-printer',
        src: '/local/floor.webp',
        alt: 'Local floor printer',
        className: 'absolute bottom-[0%] left-[36%] z-15 w-[30%] opacity-90',
      },
      {
        id: 'desktop-setup',
        src: '/local/desktop.webp',
        alt: 'Local desktop',
        className: 'absolute bottom-[6%] right-[2%] z-20 w-[34%]',
      },
    ],
  },
}

const computerCms = {
  slug: 'computer-gadgets',
  name: 'Computer Gadgets',
  displayTitle: 'COMPUTER GADGETS',
  cardLabel: 'Computer gadgets',
  offsetCard: false,
  pills: [
    { slug: 'laptops', name: 'Laptops' },
    { slug: 'desktops', name: 'Desktops' },
    { slug: 'printers', name: 'Printers' },
  ],
  collage: {
    overlayPrimary: null,
    overlaySecondary: null,
    layers: [
      {
        key: 'desktop-setup',
        type: 'image',
        storagePath: 'categories/computer-gadgets/desktop-setup.webp',
        alt: 'Remote desktop',
      },
      {
        key: 'printer-main',
        type: 'image',
        storagePath: 'categories/computer-gadgets/printer-main.webp',
        alt: 'Remote printer',
      },
      {
        key: 'floor-printer',
        type: 'image',
        storagePath: 'categories/computer-gadgets/floor-printer.webp',
        alt: 'Remote floor printer',
      },
      {
        key: 'desk-setup',
        type: 'image',
        storagePath: 'categories/computer-gadgets/desk-setup.webp',
        alt: 'Remote desk',
      },
    ],
  },
}

test('computer keeps collage CSS, clip path, and static image order', () => {
  const merged = mergeCanaryCategory(computerStatic, computerCms, (path) => `https://cdn.test/media/${path}`)
  assert.equal(merged.category.displayTitle, 'COMPUTER GADGETS')
  assert.equal(merged.category.designFile, '4.png')
  assert.deepEqual(
    merged.collage.images.map((image) => image.id),
    ['desk-setup', 'printer-main', 'floor-printer', 'desktop-setup'],
  )
  assert.equal(
    merged.collage.images[0].src,
    'https://cdn.test/media/categories/computer-gadgets/desk-setup.webp',
  )
  assert.equal(merged.collage.images[1].className, computerStatic.collage.images[1].className)
  assert.equal(merged.collage.images[1].className.includes('clip-path'), true)
  assert.equal(merged.collage.overlayText, undefined)
  assert.equal(computerStatic.collage.images[0].src, '/local/desk.webp')
})

test('a computer CMS failure keeps the static collage', () => {
  const result = presentCanary(computerStatic, { ok: false })
  assert.equal(result.source, 'static-fallback')
  assert.equal(result.view.collage.images[1].src, '/local/printer.webp')
  assert.equal(result.view.collage.images[1].className.includes('clip-path'), true)
})

const remaining = [
  {
    slug: 'wearable-gadgets',
    title: 'WEARABLE GADGETS',
    designFile: '5.png',
    image: { id: 'watch-main', className: 'absolute left-[36%] top-[12%] z-20 w-[46%] shadow-collage' },
    panel: { id: 'white-panel', className: 'absolute left-[34%] top-[10%] z-0 rounded-window bg-white/15' },
    file: 'watch-main.webp',
  },
  {
    slug: 'photography-gadgets',
    title: 'PHOTOGRAPHY GADGETS',
    designFile: '6.png',
    image: {
      id: 'drone-main',
      className: 'absolute left-[36%] top-[10%] z-20 w-[52%] rounded-collage shadow-collage',
    },
    panel: { id: 'white-window', className: 'absolute left-[32%] top-[6%] z-0 rounded-window bg-white/20 backdrop-blur-sm' },
    file: 'drone-main.webp',
  },
  {
    slug: 'power-charging-gadgets',
    title: 'POWER AND CHARGING GADGETS',
    designFile: '7.png',
    image: { id: 'wireless-charger', className: 'absolute left-[36%] top-[18%] z-30 w-[44%] shadow-collage' },
    panel: { id: 'wood-surface', className: 'absolute left-[30%] top-[8%] z-0 rounded-window bg-stone-300/25' },
    file: 'wireless-charger.webp',
  },
]

for (const entry of remaining) {
  const staticCategory = {
    category: {
      slug: entry.slug,
      name: entry.slug,
      displayTitle: 'STATIC',
      cardLabel: 'Static',
      designFile: entry.designFile,
      subCategories: [],
    },
    collage: {
      containerClassName: 'min-h-[22rem]',
      panels: [entry.panel],
      images: [{ id: entry.image.id, src: `/local/${entry.file}`, alt: 'Local', className: entry.image.className }],
    },
  }
  const cmsCategory = {
    slug: entry.slug,
    name: entry.slug,
    displayTitle: entry.title,
    cardLabel: entry.slug,
    offsetCard: false,
    pills: [{ slug: 'sample', name: 'Sample' }],
    collage: {
      overlayPrimary: null,
      overlaySecondary: null,
      layers: [
        { key: entry.panel.id, type: 'panel', storagePath: null, alt: null },
        {
          key: entry.image.id,
          type: 'image',
          storagePath: `categories/${entry.slug}/${entry.file}`,
          alt: 'Remote',
        },
      ],
    },
  }

  test(`${entry.slug} keeps presentation classes and swaps the media URL`, () => {
    const merged = mergeCanaryCategory(staticCategory, cmsCategory, (path) => `https://cdn.test/media/${path}`)
    assert.equal(merged.category.displayTitle, entry.title)
    assert.equal(merged.category.designFile, entry.designFile)
    assert.equal(merged.collage.images[0].className, entry.image.className)
    assert.equal(merged.collage.panels[0].className, entry.panel.className)
    assert.equal(merged.collage.images[0].src, `https://cdn.test/media/categories/${entry.slug}/${entry.file}`)
    assert.equal(merged.collage.overlayText, undefined)
    assert.equal(staticCategory.collage.images[0].src, `/local/${entry.file}`)
  })

  test(`${entry.slug} falls back to the static collage`, () => {
    const result = presentCanary(staticCategory, { ok: false })
    assert.equal(result.source, 'static-fallback')
    assert.equal(result.view, staticCategory)
  })
}

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
