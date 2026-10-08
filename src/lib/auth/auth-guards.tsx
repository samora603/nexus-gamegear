import type { ReactNode } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth/use-auth'
import { resolveAdminAccess } from '@/lib/auth/auth-access.mjs'

function AccessStatus({ label }: { label: string }) {
  return (
    <p className="font-body text-sm text-white/70" role="status">
      {label}
    </p>
  )
}

export function AdminUnauthorized() {
  const { signOut, isAuthenticated } = useAuth()
  return (
    <div className="mx-auto flex min-h-screen max-w-design flex-col items-start justify-center px-4">
      <h1 className="font-display text-3xl text-white">Unauthorized</h1>
      <p className="mt-4 max-w-md font-body text-white/75">
        This account is signed in, but it does not have admin access.
      </p>
      {isAuthenticated ? (
        <button
          type="button"
          className="mt-8 rounded-full border border-white px-6 py-2 font-body text-sm text-white"
          onClick={() => {
            void signOut()
          }}
        >
          Sign out
        </button>
      ) : null}
    </div>
  )
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const location = useLocation()
  const decision = resolveAdminAccess({
    loading: auth.loading,
    authenticated: auth.isAuthenticated,
    admin: auth.isAdmin,
    pathname: location.pathname,
  })
  if (decision.type === 'loading') return <AccessStatus label="Checking access" />
  if (decision.type === 'redirect') return <Navigate to={decision.to} replace />
  if (decision.type === 'unauthorized') return <AdminUnauthorized />
  return children
}

export function AdminLoginGate({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [params] = useSearchParams()
  const decision = resolveAdminAccess({
    loading: auth.loading,
    authenticated: auth.isAuthenticated,
    admin: auth.isAdmin,
    pathname: '/admin/login',
    next: params.get('next'),
  })
  if (decision.type === 'loading') return <AccessStatus label="Checking access" />
  if (decision.type === 'redirect') return <Navigate to={decision.to} replace />
  if (decision.type === 'unauthorized') return <AdminUnauthorized />
  return children
}
