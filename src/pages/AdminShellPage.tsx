import { useNavigate } from 'react-router-dom'
import { GradientBackground } from '@/components/ui/GradientBackground'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AdminGuard } from '@/lib/auth/auth-guards'
import { useAuth } from '@/lib/auth/use-auth'

function AdminShell() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <GradientBackground variant="category" className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-design flex-col px-4 py-12">
        <SectionHeading as="h1" size="section">
          Admin
        </SectionHeading>
        <p className="mt-4 max-w-xl font-body text-white/80">
          Authorization shell for Phase 2F. Content editing is not available yet.
        </p>
        <button
          type="button"
          className="mt-8 w-fit rounded-full border border-white px-6 py-2 font-body text-sm text-white"
          onClick={() => {
            void signOut().then(() => navigate('/admin/login', { replace: true }))
          }}
        >
          Sign out
        </button>
      </main>
    </GradientBackground>
  )
}

export default function AdminShellPage() {
  return (
    <AdminGuard>
      <AdminShell />
    </AdminGuard>
  )
}
