import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { GradientBackground } from '@/components/ui/GradientBackground'
import { AdminGuard } from '@/lib/auth/auth-guards'
import { useAuth } from '@/lib/auth/use-auth'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/blog', label: 'Blog', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
  { to: '/admin/media', label: 'Media', end: false },
]

function AdminFrame() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const identity = user?.email || 'Site owner'

  return (
    <GradientBackground variant="category" className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
        <header className="flex flex-col gap-4 border-b border-white/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-white/60">GameGear Nexus CMS</p>
            <h1 className="font-display text-2xl text-white sm:text-3xl">Site owner</h1>
            <p className="mt-1 font-body text-sm text-white/75">{identity}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="CMS">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full border px-4 py-2 font-body text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive ? 'border-white bg-white text-black' : 'border-white/30 text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              className="rounded-full border border-white/30 px-4 py-2 font-body text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => {
                void signOut().then(() => navigate('/admin/login', { replace: true }))
              }}
            >
              Logout
            </button>
          </nav>
        </header>
        <div className="py-6">
          <Outlet />
        </div>
      </div>
    </GradientBackground>
  )
}

export default function AdminLayout() {
  return (
    <AdminGuard>
      <AdminFrame />
    </AdminGuard>
  )
}
