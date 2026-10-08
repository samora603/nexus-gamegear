import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { isAdminUser, resolveAdminAccess, safeAdminNext } from './auth-access.mjs'

test('admin detection reads only app_metadata.role', () => {
  assert.equal(isAdminUser({ app_metadata: { role: 'admin' } }), true)
  assert.equal(isAdminUser({ app_metadata: { role: 'editor' }, email: 'owner@example.com' }), false)
  assert.equal(isAdminUser({ user_metadata: { role: 'admin' } }), false)
  assert.equal(isAdminUser(null), false)
})

test('redirect targets stay inside admin routes', () => {
  assert.equal(safeAdminNext('/admin'), '/admin')
  assert.equal(safeAdminNext('/admin/posts'), '/admin/posts')
  assert.equal(safeAdminNext('https://evil.example/admin'), '/admin')
  assert.equal(safeAdminNext('//evil.example'), '/admin')
  assert.equal(safeAdminNext('/admin/login'), '/admin')
  assert.equal(safeAdminNext('/blog'), '/admin')
})

test('route decisions do not loop', () => {
  assert.deepEqual(
    resolveAdminAccess({
      loading: true,
      authenticated: false,
      admin: false,
      pathname: '/admin',
    }),
    { type: 'loading' },
  )
  assert.deepEqual(
    resolveAdminAccess({
      loading: false,
      authenticated: false,
      admin: false,
      pathname: '/admin/login',
    }),
    { type: 'login' },
  )
  const loggedOut = resolveAdminAccess({
    loading: false,
    authenticated: false,
    admin: false,
    pathname: '/admin',
  })
  assert.equal(loggedOut.type, 'redirect')
  assert.equal(loggedOut.to.includes('/admin/login'), true)
  assert.equal(loggedOut.to.includes(encodeURIComponent('/admin')), true)
  assert.deepEqual(
    resolveAdminAccess({
      loading: false,
      authenticated: true,
      admin: false,
      pathname: '/admin',
    }),
    { type: 'unauthorized' },
  )
  assert.deepEqual(
    resolveAdminAccess({
      loading: false,
      authenticated: true,
      admin: true,
      pathname: '/admin',
    }),
    { type: 'allow' },
  )
  assert.deepEqual(
    resolveAdminAccess({
      loading: false,
      authenticated: true,
      admin: true,
      pathname: '/admin/login',
      next: '/admin',
    }),
    { type: 'redirect', to: '/admin' },
  )
  assert.deepEqual(
    resolveAdminAccess({
      loading: false,
      authenticated: true,
      admin: true,
      pathname: '/admin/login',
      next: '/admin/login',
    }),
    { type: 'redirect', to: '/admin' },
  )
})

test('browser source does not authorize from storage, email, or the service role', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
  const files = []
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === 'dist') continue
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.(ts|tsx|mjs|js)$/.test(entry) && !entry.endsWith('.test.mjs')) files.push(full)
    }
  }
  walk(path.join(root, 'src'))
  const combined = files.map((file) => readFileSync(file, 'utf8')).join('\n')
  assert.equal(combined.includes('SUPABASE_SERVICE_ROLE'), false)
  assert.equal(combined.includes('localStorage'), false)
  assert.equal(combined.includes('sessionStorage'), false)
  assert.equal(/email\s*===/.test(combined), false)
})
