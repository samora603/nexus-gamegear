import assert from 'node:assert/strict'
import test from 'node:test'

import { isPublicBlogPost, mapBlogIndex, mapBlogPost, readPublishedPosts } from './blog.mjs'
import { CmsError } from './read-cms.mjs'
import { slugify } from './slug.mjs'

const now = new Date('2026-10-08T08:00:00.000Z')
const url = 'https://example.supabase.co'

const published = {
  title: 'Best Gaming Headsets in Kenya',
  slug: 'best-gaming-headsets-in-kenya',
  excerpt: 'A short buying note.',
  content: 'First paragraph.\n\nSecond paragraph.',
  status: 'published',
  published_at: '2026-10-01T00:00:00.000Z',
  seo_title: null,
  seo_description: null,
  featured_image: {
    storage_path: 'categories/entertainment-gadgets/headphones.webp',
    alt_text: 'Headphones',
  },
  author: { key: 'site-owner', display_name: 'GameGear Nexus' },
}

test('slugify builds a unique-safe slug and rejects blanks', () => {
  assert.equal(slugify('Best Gaming Headsets in Kenya'), 'best-gaming-headsets-in-kenya')
  assert.throws(() => slugify('   '), (error) => error instanceof CmsError && error.code === 'CMS_CATEGORY_MAPPING_FAILED')
})

test('maps a published post and falls back SEO fields', () => {
  const post = mapBlogPost(published, url, now)
  assert.equal(post.slug, 'best-gaming-headsets-in-kenya')
  assert.equal(post.seoTitle, 'Best Gaming Headsets in Kenya')
  assert.equal(post.seoDescription, 'A short buying note.')
  assert.equal(post.publishedAt, '2026-10-01T00:00:00.000Z')
  assert.deepEqual(post.paragraphs, ['First paragraph.', 'Second paragraph.'])
  assert.equal(
    post.featuredImage.url,
    'https://example.supabase.co/storage/v1/object/public/media/categories/entertainment-gadgets/headphones.webp',
  )
})

test('a missing featured image stays null', () => {
  const post = mapBlogPost({ ...published, featured_image: null }, url, now)
  assert.equal(post.featuredImage, null)
})

test('drafts and future posts are not public', () => {
  const draft = { ...published, status: 'draft', published_at: null }
  const future = { ...published, published_at: '2026-12-01T00:00:00.000Z' }
  assert.equal(isPublicBlogPost(draft, now), false)
  assert.equal(isPublicBlogPost(future, now), false)
  assert.deepEqual(mapBlogIndex([draft, future, published], url, now).map((post) => post.slug), [
    'best-gaming-headsets-in-kenya',
  ])
  assert.throws(() => mapBlogPost(draft, url, now), (error) => error.code === 'CMS_QUERY_FAILED')
})

test('a failed blog query does not return partial posts', async () => {
  const fetchImpl = async () => new Response('secret', { status: 500 })
  await assert.rejects(readPublishedPosts(url, 'anon-key-value', fetchImpl, now), (error) => {
    assert.equal(error.code, 'CMS_QUERY_FAILED')
    assert.equal(error.message.includes('anon-key-value'), false)
    assert.equal(error.message.includes('secret'), false)
    return true
  })
})
