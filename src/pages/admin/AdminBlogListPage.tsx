import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAdminPost, loadAdminPosts } from '@/lib/cms/blog-admin-api'
import { filterPosts, type AdminBlogPost, type BlogFilter } from '@/lib/cms/blog-admin.mjs'
import { AdminButton } from '@/pages/admin/admin-ui'

function formatWhen(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function AdminBlogListPage() {
  const [filter, setFilter] = useState<BlogFilter>('all')
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  function reload() {
    return loadAdminPosts()
      .then((rows) => {
        setPosts(rows)
        setError(null)
      })
      .catch(() => setError('Blog posts could not be loaded.'))
  }

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => loadAdminPosts())
      .then((rows) => {
        if (!cancelled) setPosts(rows)
      })
      .catch(() => {
        if (!cancelled) setError('Blog posts could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visible = posts ? filterPosts(posts, filter) : []

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl text-white">Blog</h2>
        <Link
          to="/admin/blog/new"
          className="w-fit rounded-full border border-white px-4 py-2 font-body text-sm text-white"
        >
          New post
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter posts">
        {(
          [
            ['all', 'All'],
            ['published', 'Published'],
            ['draft', 'Drafts'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            className={`rounded-full border px-3 py-1 font-body text-sm ${
              filter === value ? 'border-white bg-white text-black' : 'border-white/30 text-white'
            }`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {posts === null && !error ? (
        <p className="mt-6 font-body text-sm text-white/70" role="status">
          Loading
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 font-body text-sm text-white" role="alert">
          {error}
        </p>
      ) : null}
      {posts && visible.length === 0 ? (
        <p className="mt-6 font-body text-sm text-white/75">No posts in this view.</p>
      ) : null}
      <ul className="mt-4 flex flex-col gap-3">
        {visible.map((post) => (
          <li key={post.id} className="rounded-lg border border-white/15 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage.url}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded border border-white/15 font-body text-xs text-white/50">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-body text-base text-white">{post.title}</h3>
                <p className="mt-1 break-all font-body text-xs text-white/60">{post.slug}</p>
                <p className="mt-2 font-body text-xs text-white/70">
                  {post.status} · Published {formatWhen(post.publishedAt)} · Updated {formatWhen(post.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="rounded-full border border-white px-4 py-2 font-body text-sm text-white"
                >
                  Edit
                </Link>
                {pendingDelete === post.id ? (
                  <>
                    <AdminButton
                      tone="danger"
                      onClick={() => {
                        void deleteAdminPost(post.id).then((result) => {
                          if (!result.ok) {
                            setError(result.message)
                            setPendingDelete(null)
                            return
                          }
                          setPendingDelete(null)
                          void reload()
                        })
                      }}
                    >
                      Confirm delete
                    </AdminButton>
                    <AdminButton onClick={() => setPendingDelete(null)}>Cancel</AdminButton>
                  </>
                ) : (
                  <AdminButton tone="danger" onClick={() => setPendingDelete(post.id)}>
                    Delete
                  </AdminButton>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
