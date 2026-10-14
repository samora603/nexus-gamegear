import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildPostRecord,
  filterPosts,
  interpretDelete,
  interpretPostLoad,
  mapWriteError,
  normalizePostSlug,
  publicationFields,
  requireSiteOwner,
} from './blog-admin.mjs'

const now = new Date('2026-10-08T09:00:00.000Z')
const authorId = '11111111-1111-4111-8111-111111111111'
const url = 'https://example.supabase.co'

const input = {
  title: 'Best Gaming Keyboards for 2026',
  slug: 'Best Gaming Keyboards for 2026',
  excerpt: 'A buying note.',
  content: 'First paragraph.\n\nSecond paragraph.',
  seoTitle: '',
  seoDescription: '  ',
  featuredImageId: '',
}

test('slug generation and normalization', () => {
  assert.equal(normalizePostSlug('Best Gaming Keyboards for 2026'), 'best-gaming-keyboards-for-2026')
  assert.equal(normalizePostSlug('  Hello---World!! '), 'hello-world')
  assert.equal(normalizePostSlug('???'), null)
})

test('draft creation clears the publish timestamp', () => {
  const record = buildPostRecord({ input, authorId, existingPublishedAt: now.toISOString(), now })
  assert.equal(record.ok, true)
  if (!record.ok) return
  assert.equal(record.value.status, 'draft')
  assert.equal(record.value.published_at, null)
  assert.equal(record.value.slug, 'best-gaming-keyboards-for-2026')
  assert.equal(record.value.author_id, authorId)
  assert.equal(record.value.seo_title, null)
  assert.equal(record.value.seo_description, null)
  assert.equal(record.value.featured_image_id, null)
})

test('publishing a new post stamps the current time', () => {
  const record = buildPostRecord({
    input: { ...input, action: 'publish' },
    authorId,
    existingPublishedAt: null,
    now,
  })
  assert.equal(record.ok, true)
  if (!record.ok) return
  assert.deepEqual(record.value.status, 'published')
  assert.equal(record.value.published_at, now.toISOString())
})

test('publishing again keeps the original timestamp', () => {
  const fields = publicationFields({
    action: 'publish',
    publishedAt: '2026-01-02T00:00:00.000Z',
    now,
  })
  assert.deepEqual(fields, { status: 'published', published_at: '2026-01-02T00:00:00.000Z' })
})

test('returning a post to draft clears published_at', () => {
  const fields = publicationFields({
    action: 'draft',
    publishedAt: '2026-01-02T00:00:00.000Z',
    now,
  })
  assert.deepEqual(fields, { status: 'draft', published_at: null })
})

test('a missing site owner is a configuration error', () => {
  const missing = requireSiteOwner(null)
  assert.equal(missing.ok, false)
  const other = requireSiteOwner({ id: authorId, key: 'guest', display_name: 'Guest' })
  assert.equal(other.ok, false)
})

test('a duplicate slug is reported without overwriting', () => {
  const error = mapWriteError({ code: '23505', message: 'duplicate key value violates unique constraint blog_posts_slug_key' })
  assert.equal(error?.field, 'slug')
  assert.match(error?.message ?? '', /already exists/)
})

test('a missing post is not treated as an empty draft', () => {
  const missing = interpretPostLoad(null, null, url)
  assert.equal(missing.status, 'not-found')
  const failed = interpretPostLoad(null, { message: 'denied' }, url)
  assert.equal(failed.status, 'error')
})

test('update mapping keeps plain text and the featured image id', () => {
  const imageId = '22222222-2222-4222-8222-222222222222'
  const record = buildPostRecord({
    input: { ...input, action: 'publish', featuredImageId: imageId, content: 'Line one\n\nLine two' },
    authorId,
    existingPublishedAt: '2026-01-02T00:00:00.000Z',
    now,
  })
  assert.equal(record.ok, true)
  if (!record.ok) return
  assert.equal(record.value.content, 'Line one\n\nLine two')
  assert.equal(record.value.featured_image_id, imageId)
  assert.equal(record.value.published_at, '2026-01-02T00:00:00.000Z')
})

test('delete handling distinguishes denial from other failures', () => {
  assert.equal(interpretDelete({ code: '42501' }, [{ id: 'post' }]).ok, false)
  assert.match(interpretDelete({ code: '42501' }, null).message, /denied/)
  assert.match(interpretDelete({ code: 'XX000' }, null).message, /could not be deleted/)
  assert.equal(interpretDelete(null, []).ok, false)
  assert.match(interpretDelete(null, []).message, /denied/)
  assert.equal(interpretDelete(null, [{ id: 'post' }]).ok, true)
  assert.equal(interpretDelete(null, [{ id: 'post' }]).message, '')
})

test('filters separate published posts from drafts', () => {
  const posts = [
    { status: 'draft', slug: 'a' },
    { status: 'published', slug: 'b' },
  ]
  assert.equal(filterPosts(posts, 'all').length, 2)
  assert.equal(filterPosts(posts, 'published')[0].slug, 'b')
  assert.equal(filterPosts(posts, 'draft')[0].slug, 'a')
})
