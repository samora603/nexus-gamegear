import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth/auth-context'
import { router } from '@/routes/router'

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nexus-indigo-950">
      <p className="font-body text-sm text-white/70">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  )
}
