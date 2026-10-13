/**
 * Anonymous writes against the remote project. Does not print credentials or response bodies.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

function readEnv(name) {
  const text = readFileSync(path.join(root, '.env.local'), 'utf8')
  const line = text.split('\n').find((entry) => entry.startsWith(`${name}=`))
  if (!line) throw new Error(`Missing ${name}`)
  return line.slice(name.length + 1).trim()
}

function headers(anonKey) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

test('anonymous clients cannot write blog posts, media rows, or storage objects', async () => {
  const supabaseUrl = readEnv('VITE_SUPABASE_URL').replace(/\/+$/, '')
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY')
  const requestHeaders = headers(anonKey)

  const insertPost = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      author_id: '11111111-1111-4111-8111-111111111111',
      title: 'Anonymous write probe',
      slug: 'anonymous-write-probe',
      excerpt: 'This row must not be created.',
      content: 'This row must not be created.',
      status: 'draft',
    }),
  })
  assert.ok(insertPost.status === 401 || insertPost.status === 403)

  const updatePost = await fetch(`${supabaseUrl}/rest/v1/blog_posts?slug=eq.development-seed-draft`, {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify({ title: 'Anonymous title change' }),
  })
  assert.equal(updatePost.status, 200)
  assert.deepEqual(await updatePost.json(), [])

  const deletePost = await fetch(`${supabaseUrl}/rest/v1/blog_posts?slug=eq.development-seed-draft`, {
    method: 'DELETE',
    headers: requestHeaders,
  })
  assert.equal(deletePost.status, 200)
  assert.deepEqual(await deletePost.json(), [])

  const insertMedia = await fetch(`${supabaseUrl}/rest/v1/media_assets`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      storage_path: 'admin/anonymous-probe.png',
      file_name: 'anonymous-probe.png',
      mime_type: 'image/png',
    }),
  })
  assert.ok(insertMedia.status === 401 || insertMedia.status === 403)

  const upload = await fetch(`${supabaseUrl}/storage/v1/object/media/admin/anonymous-probe.png`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'image/png',
    },
    body: new Uint8Array([1, 2, 3]),
  })
  assert.ok(upload.status === 400 || upload.status === 401 || upload.status === 403)

  const updateCategory = await fetch(`${supabaseUrl}/rest/v1/categories?slug=eq.communication-gadgets`, {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify({ name: 'Anonymous category change' }),
  })
  assert.equal(updateCategory.status, 200)
  assert.deepEqual(await updateCategory.json(), [])

  const insertPill = await fetch(`${supabaseUrl}/rest/v1/category_pills`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      category_id: '11111111-1111-4111-8111-111111111111',
      slug: 'anonymous-pill',
      label: 'Anonymous pill',
    }),
  })
  assert.ok(insertPill.status === 401 || insertPill.status === 403)
})
