import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadDashboardCounts } from '@/lib/cms/blog-admin-api'
import { useAuth } from '@/lib/auth/use-auth'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; published: number; drafts: number; media: number }
  >({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => loadDashboardCounts())
      .then((result) => {
        if (cancelled) return
        if (!result.ok) {
          setState({ status: 'error', message: result.message })
          return
        }
        setState({
          status: 'ready',
          published: result.published,
          drafts: result.drafts,
          media: result.media,
        })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', message: 'Dashboard totals could not be loaded.' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <h2 className="font-display text-xl text-white">Dashboard</h2>
      <p className="mt-2 max-w-2xl font-body text-sm text-white/75">
        Signed in as {user?.email || 'the site owner'}. This account is the admin for GameGear Nexus.
      </p>
      {state.status === 'loading' ? (
        <p className="mt-6 font-body text-sm text-white/70" role="status">
          Loading
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p className="mt-6 font-body text-sm text-white" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === 'ready' ? (
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['Published posts', state.published],
            ['Draft posts', state.drafts],
            ['Media assets', state.media],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white/15 px-4 py-3">
              <dt className="font-body text-xs uppercase tracking-wide text-white/60">{label}</dt>
              <dd className="mt-1 font-display text-2xl text-white">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-4 font-body text-sm">
        <Link className="text-white underline-offset-4 hover:underline" to="/admin/blog">
          Manage blog
        </Link>
        <Link className="text-white underline-offset-4 hover:underline" to="/admin/media">
          Manage media
        </Link>
      </div>
    </section>
  )
}
