import assert from 'node:assert/strict'
import test from 'node:test'

import { CmsError, mapCmsRows, publicMediaUrl, readCms } from './read-cms.mjs'

const url = 'https://example.supabase.co'

test('builds a public media URL without doubling the bucket', () => {
  assert.equal(
    publicMediaUrl(url, 'home/hero-background.webp'),
    'https://example.supabase.co/storage/v1/object/public/media/home/hero-background.webp',
  )
  assert.equal(
    publicMediaUrl(`${url}/`, '/categories/communication-gadgets/primary-collage.webp'),
    'https://example.supabase.co/storage/v1/object/public/media/categories/communication-gadgets/primary-collage.webp',
  )
})

test('null media and unsafe paths', () => {
  assert.equal(publicMediaUrl(url, null), null)
  assert.equal(publicMediaUrl(url, ''), null)
  assert.throws(() => publicMediaUrl(url, 'media/home/hero.webp'), (error) => {
    assert.equal(error.code, 'CMS_MEDIA_RESOLUTION_FAILED')
    return true
  })
  assert.throws(() => publicMediaUrl('', 'home/hero.webp'), (error) => {
    assert.equal(error.code, 'CMS_MEDIA_RESOLUTION_FAILED')
    return true
  })
})

test('maps categories, pills, collage order, and numeric fields', () => {
  const snapshot = mapCmsRows(sampleRows(), url)
  assert.equal(snapshot.categories.length, 1)
  assert.deepEqual(snapshot.categories[0].pills, [
    { slug: 'smartphones', name: 'Smartphones' },
    { slug: 'tablets', name: 'Tablets' },
  ])
  assert.deepEqual(
    snapshot.categories[0].collage.layers.map((layer) => layer.key),
    ['dark-overlay', 'primary'],
  )
  const primary = snapshot.categories[0].collage.layers[1]
  assert.equal(primary.posLeftPct, 34)
  assert.equal(primary.posTopPct, 4)
  assert.equal(primary.widthPct, 52)
  assert.equal(primary.heightPct, null)
  assert.equal(primary.opacity, 0.9)
  assert.equal(primary.rotationDeg, -6)
  assert.equal(primary.clipVariant, 'none')
  assert.equal(primary.storagePath, 'categories/communication-gadgets/primary-collage.webp')
  assert.equal(snapshot.site.heroHeadline, 'Next-Gen Gear, Expertly Reviewed.')
  assert.equal(snapshot.features[0].storagePath, 'home/feature-ai.webp')
  assert.equal(snapshot.socialLinks[0].href, '#')
})

test('empty related lists stay empty except a required collage', () => {
  const rows = sampleRows()
  rows.pills = []
  rows.socialLinks = []
  const snapshot = mapCmsRows(rows, url)
  assert.deepEqual(snapshot.categories[0].pills, [])
  assert.deepEqual(snapshot.socialLinks, [])
})

test('missing collage or media fails clearly', () => {
  const missingCollage = sampleRows()
  missingCollage.collages = []
  assert.throws(() => mapCmsRows(missingCollage, url), (error) => {
    assert.equal(error.code, 'CMS_CATEGORY_MAPPING_FAILED')
    return true
  })

  const missingMedia = sampleRows()
  missingMedia.media = []
  assert.throws(() => mapCmsRows(missingMedia, url), (error) => {
    assert.equal(error.code, 'CMS_MEDIA_RESOLUTION_FAILED')
    return true
  })
})

test('query failures do not include credentials', async () => {
  const fetchImpl = async () => new Response('secret-body', { status: 500 })
  await assert.rejects(readCms(url, 'anon-key-value', fetchImpl), (error) => {
    assert.ok(error instanceof CmsError)
    assert.equal(error.code, 'CMS_QUERY_FAILED')
    assert.equal(error.message.includes('anon-key-value'), false)
    assert.equal(error.message.includes('secret-body'), false)
    return true
  })
})

function sampleRows() {
  return {
    media: [
      { id: 'bg', storage_path: 'home/hero-background.webp' },
      { id: 'phone', storage_path: 'home/hero-phone.webp' },
      { id: 'ai', storage_path: 'home/feature-ai.webp' },
      { id: 'card', storage_path: 'home/category-communication.webp' },
      { id: 'primary', storage_path: 'categories/communication-gadgets/primary-collage.webp' },
      { id: 'section', storage_path: 'home/feature-section-bg.webp' },
      { id: 'contact', storage_path: 'home/contact-grid.webp' },
    ],
    siteSettings: [
      {
        site_name: 'GameGear Nexus',
        tagline: 'DISCOVER. COMPARE. DOMINATE.',
        hero_headline: 'Next-Gen Gear, Expertly Reviewed.',
        hero_cta_text: 'VIEW PROPERTIES',
        hero_cta_href: '#explore-solutions',
        hero_background_media_id: 'bg',
        hero_phone_media_id: 'phone',
        about_heading: 'What we are about',
        about_body: 'Body',
        explore_heading: 'Explore our solutions',
        promo_banner_text: 'Promo',
        contact_heading: 'CONTACT US!',
        contact_phone: '0793510481',
        contact_email: 'jetagakoi@gmail.com',
      },
    ],
    socialLinks: [{ platform: 'facebook', label: 'Facebook', url: '#', sort_order: 0 }],
    features: [
      {
        key: 'ai-power',
        title: 'On-device and generative AI power',
        description: 'Description',
        image_alt: 'Alt',
        media_id: 'ai',
        sort_order: 0,
      },
    ],
    contentBlocks: [{ key: 'feature_section_bg', body: null, media_id: 'section' }],
    categories: [
      {
        id: 'cat',
        slug: 'communication-gadgets',
        name: 'Communication Gadgets',
        display_title: 'COMMUNICATION GADGETS',
        card_label: 'Communication gadgets',
        card_media_id: 'card',
        offset_card: false,
        sort_order: 0,
      },
    ],
    pills: [
      { category_id: 'cat', slug: 'tablets', label: 'Tablets', sort_order: 1 },
      { category_id: 'cat', slug: 'smartphones', label: 'Smartphones', sort_order: 0 },
    ],
    collages: [
      {
        id: 'collage',
        category_id: 'cat',
        container_variant: 'default',
        overlay_primary: 'iPhone G',
        overlay_secondary: 'NEXT GENERATION CONCEPT',
      },
    ],
    layers: [
      {
        collage_id: 'collage',
        layer_key: 'primary',
        layer_type: 'image',
        media_id: 'primary',
        panel_variant: null,
        clip_variant: 'none',
        alt_text: 'Portrait',
        pos_left_pct: '34.00',
        pos_top_pct: '4.00',
        width_pct: '52.00',
        height_pct: null,
        z_index: 10,
        rotation_deg: '-6.00',
        opacity: '0.90',
        sort_order: 1,
      },
      {
        collage_id: 'collage',
        layer_key: 'dark-overlay',
        layer_type: 'panel',
        media_id: null,
        panel_variant: 'dark_overlay',
        clip_variant: null,
        alt_text: null,
        pos_left_pct: 60,
        pos_top_pct: 24,
        width_pct: 36,
        height_pct: 58,
        z_index: 20,
        rotation_deg: 0,
        opacity: 1,
        sort_order: 0,
      },
    ],
    contactImages: [{ alt_text: 'Contact', media_id: 'contact', sort_order: 0 }],
  }
}
