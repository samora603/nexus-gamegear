/** Pure admin-route decisions. Database access still depends on is_admin() in RLS. */

export function isAdminUser(user) {
  return user?.app_metadata?.role === 'admin'
}

/** Only same-origin admin paths. Rejects external and protocol-relative URLs. */
export function safeAdminNext(value) {
  if (typeof value !== 'string') return '/admin'
  if (!value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//') || value.includes('\\') || value.includes('://')) return '/admin'
  if (value === '/admin/login' || value.startsWith('/admin/login?') || value.startsWith('/admin/login#')) {
    return '/admin'
  }
  return value
}

export function resolveAdminAccess({ loading, authenticated, admin, pathname, next }) {
  if (loading) return { type: 'loading' }
  const onLogin = pathname === '/admin/login'
  if (onLogin) {
    if (authenticated && admin) return { type: 'redirect', to: safeAdminNext(next) }
    if (authenticated && !admin) return { type: 'unauthorized' }
    return { type: 'login' }
  }
  if (!authenticated) {
    const target = safeAdminNext(pathname)
    return { type: 'redirect', to: `/admin/login?next=${encodeURIComponent(target)}` }
  }
  if (!admin) return { type: 'unauthorized' }
  return { type: 'allow' }
}
