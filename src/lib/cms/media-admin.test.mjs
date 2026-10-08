import assert from 'node:assert/strict'
import test from 'node:test'

import { publicMediaUrl } from './read-cms.mjs'
import {
  displayFileName,
  mapMediaItem,
  mediaDeleteDecision,
  safeStoragePath,
  validateMediaFile,
  MAX_UPLOAD_BYTES,
} from './media-admin.mjs'

const id = '33333333-3333-4333-8333-333333333333'
const url = 'https://example.supabase.co'

test('storage paths ignore the original filename', () => {
  assert.equal(safeStoragePath('image/webp', id), `admin/${id}.webp`)
  assert.equal(displayFileName('../../secrets/hero phone.PNG'), 'hero-phone.PNG')
  assert.throws(() => safeStoragePath('image/webp', '../escape'))
  assert.throws(() => safeStoragePath('text/plain', id))
})

test('unsupported and oversized files are rejected', () => {
  assert.equal(validateMediaFile({ type: 'application/pdf', size: 100 }).ok, false)
  assert.equal(validateMediaFile({ type: 'image/png', size: MAX_UPLOAD_BYTES + 1 }).ok, false)
  assert.equal(validateMediaFile({ type: 'image/png', size: 0 }).ok, false)
  assert.equal(validateMediaFile({ type: 'image/jpeg', size: 1024 }).ok, true)
})

test('media URLs use the shared public resolver', () => {
  const item = mapMediaItem(
    {
      id,
      file_name: 'keyboard.webp',
      alt_text: 'Keyboard',
      mime_type: 'image/webp',
      width: 800,
      height: 600,
      storage_path: `admin/${id}.webp`,
      created_at: '2026-10-08T00:00:00.000Z',
    },
    url,
  )
  assert.equal(item.url, publicMediaUrl(url, `admin/${id}.webp`))
  assert.equal(item.url.includes('/object/public/media/admin/'), true)
})

test('referenced media is not deleted', () => {
  const blocked = mediaDeleteDecision({
    features: 0,
    collageLayers: 1,
    contactGrid: 0,
    categories: 0,
    contentBlocks: 0,
    siteSettings: 0,
    blogPosts: 0,
  })
  assert.equal(blocked.allowed, false)
  assert.match(blocked.message, /collage layers/)
  const free = mediaDeleteDecision({
    features: 0,
    collageLayers: 0,
    contactGrid: 0,
    categories: 0,
    contentBlocks: 0,
    siteSettings: 0,
    blogPosts: 0,
  })
  assert.equal(free.allowed, true)
})
