import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import { loadAdminPost, loadSiteOwner, saveAdminPost, deleteAdminPost } from '@/lib/cms/blog-admin-api'
import { normalizePostSlug, type BlogAction } from '@/lib/cms/blog-admin.mjs'
import { loadMediaLibrary } from '@/lib/cms/media-admin-api'
import type { MediaItem } from '@/lib/cms/media-admin.mjs'
import { AdminButton, AdminField } from '@/pages/admin/admin-ui'
import { adminControlClass } from '@/pages/admin/admin-controls'

interface DraftFields {
  title: string
  slug: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
  featuredImageId: string
}

const emptyFields: DraftFields = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  featuredImageId: '',
}

export default function AdminBlogEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const slugEdited = useRef(false)
  const dirtyRef = useRef(false)
  const [fields, setFields] = useState<DraftFields>(emptyFields)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [authorId, setAuthorId] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [page, setPage] = useState<'loading' | 'ready' | 'error' | 'not-found' | 'config'>('loading')
  const [configMessage, setConfigMessage] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [fieldName, setFieldName] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [dirty, setDirty] = useState(false)
  const blocker = useBlocker(() => dirtyRef.current)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(async () => {
        const owner = await loadSiteOwner()
        if (!owner.ok) {
          if (!cancelled) {
            setConfigMessage(owner.message)
            setPage('config')
          }
          return
        }
        const library = await loadMediaLibrary().catch(() => [])
        if (cancelled) return
        setAuthorId(owner.author.id)
        setMedia(library)
        if (!id) {
          setPage('ready')
          return
        }
        const loaded = await loadAdminPost(id)
        if (cancelled) return
        if (loaded.status !== 'ready') {
          setPage(loaded.status)
          return
        }
        slugEdited.current = true
        setFields({
          title: loaded.post.title,
          slug: loaded.post.slug,
          excerpt: loaded.post.excerpt,
          content: loaded.post.content,
          seoTitle: loaded.post.seoTitle,
          seoDescription: loaded.post.seoDescription,
          featuredImageId: loaded.post.featuredImageId ?? '',
        })
        setStatus(loaded.post.status)
        setPublishedAt(loaded.post.publishedAt)
        setPage('ready')
      })
      .catch(() => {
        if (!cancelled) setPage('error')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!dirty) return
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  function update(next: Partial<DraftFields>) {
    dirtyRef.current = true
    setDirty(true)
    setFields((current) => ({ ...current, ...next }))
    setNotice(null)
  }

  async function persist(action: BlogAction) {
    if (!authorId) return
    setSaving(true)
    setFieldError(null)
    setNotice(null)
    const result = await saveAdminPost(
      id ?? null,
      { ...fields, action },
      authorId,
      action === 'publish' ? publishedAt : null,
    )
    setSaving(false)
    if (!result.ok) {
      setFieldName(result.field ?? null)
      setFieldError(result.message)
      return
    }
    dirtyRef.current = false
    setDirty(false)
    setStatus(result.post.status)
    setPublishedAt(result.post.publishedAt)
    setFields((current) => ({ ...current, slug: result.post.slug }))
    setNotice(result.post.status === 'published' ? 'Published.' : 'Draft saved.')
    if (!id) navigate(`/admin/blog/${result.post.id}`, { replace: true })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void persist(status === 'published' ? 'publish' : 'draft')
  }

  if (page === 'loading') {
    return (
      <p className="font-body text-sm text-white/70" role="status">
        Loading
      </p>
    )
  }
  if (page === 'config') {
    return (
      <p className="font-body text-sm text-white" role="alert">
        {configMessage}
      </p>
    )
  }
  if (page === 'not-found') {
    return (
      <div>
        <h2 className="font-display text-xl text-white">Post not found</h2>
        <Link className="mt-4 inline-block font-body text-sm text-white underline" to="/admin/blog">
          Back to blog
        </Link>
      </div>
    )
  }
  if (page === 'error') {
    return (
      <p className="font-body text-sm text-white" role="alert">
        This post could not be loaded.
      </p>
    )
  }

  const control = adminControlClass()

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-white">{id ? 'Edit post' : 'New post'}</h2>
        <Link className="font-body text-sm text-white/80 underline-offset-4 hover:underline" to="/admin/blog">
          Back to blog
        </Link>
      </div>
      <p className="mt-2 font-body text-sm text-white/70">
        Status: {status}
        {publishedAt ? ` · Published ${publishedAt}` : ''}
      </p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <AdminField label="Title" error={fieldName === 'title' ? fieldError : null}>
          <input
            className={control}
            value={fields.title}
            required
            onChange={(event) => {
              const title = event.target.value
              const slug = slugEdited.current ? fields.slug : (normalizePostSlug(title) ?? '')
              update({ title, slug })
            }}
          />
        </AdminField>
        <AdminField label="Slug" error={fieldName === 'slug' ? fieldError : null}>
          <input
            className={control}
            value={fields.slug}
            required
            onChange={(event) => {
              slugEdited.current = true
              update({ slug: event.target.value })
            }}
          />
        </AdminField>
        <AdminField label="Excerpt" error={fieldName === 'excerpt' ? fieldError : null}>
          <textarea className={`${control} min-h-20`} value={fields.excerpt} required onChange={(event) => update({ excerpt: event.target.value })} />
        </AdminField>
        <AdminField label="Content" error={fieldName === 'content' ? fieldError : null}>
          <textarea
            className={`${control} min-h-48`}
            value={fields.content}
            required
            onChange={(event) => update({ content: event.target.value })}
          />
        </AdminField>
        <fieldset>
          <legend className="font-body text-sm text-white/80">Featured image</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <button
              type="button"
              aria-pressed={fields.featuredImageId === ''}
              className={`rounded border p-2 text-left font-body text-xs text-white ${
                fields.featuredImageId === '' ? 'border-white' : 'border-white/20'
              }`}
              onClick={() => update({ featuredImageId: '' })}
            >
              None
            </button>
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={fields.featuredImageId === item.id}
                className={`overflow-hidden rounded border text-left ${
                  fields.featuredImageId === item.id ? 'border-white' : 'border-white/20'
                }`}
                onClick={() => update({ featuredImageId: item.id })}
              >
                <img src={item.url} alt="" className="h-20 w-full object-cover" />
                <span className="block truncate px-2 py-1 font-body text-xs text-white/80">{item.fileName}</span>
              </button>
            ))}
          </div>
          {fieldName === 'featuredImageId' && fieldError ? (
            <p className="mt-1 font-body text-sm text-white" role="alert">
              {fieldError}
            </p>
          ) : null}
        </fieldset>
        <AdminField label="SEO title" error={null}>
          <input className={control} value={fields.seoTitle} onChange={(event) => update({ seoTitle: event.target.value })} />
        </AdminField>
        <AdminField label="SEO description" error={null}>
          <textarea
            className={`${control} min-h-20`}
            value={fields.seoDescription}
            onChange={(event) => update({ seoDescription: event.target.value })}
          />
        </AdminField>
        {fieldError && !fieldName ? (
          <p className="font-body text-sm text-white" role="alert">
            {fieldError}
          </p>
        ) : null}
        {notice ? (
          <p className="font-body text-sm text-white" role="status">
            {notice}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <AdminButton type="submit" disabled={saving}>
            {saving ? 'Saving' : status === 'published' ? 'Save' : 'Save draft'}
          </AdminButton>
          <AdminButton type="button" disabled={saving} onClick={() => void persist('publish')}>
            Publish
          </AdminButton>
          {status === 'published' ? (
            <AdminButton type="button" disabled={saving} onClick={() => void persist('draft')}>
              Return to draft
            </AdminButton>
          ) : null}
        </div>
      </form>
      {id ? (
        <div className="mt-8 border-t border-white/15 pt-4">
          {confirmDelete ? (
            <div className="flex flex-wrap gap-2">
              <p className="w-full font-body text-sm text-white">Delete this post permanently?</p>
              <AdminButton
                tone="danger"
                onClick={() => {
                  dirtyRef.current = false
                  setDirty(false)
                  void deleteAdminPost(id).then((result) => {
                    if (!result.ok) {
                      setFieldError(result.message)
                      setFieldName(null)
                      setConfirmDelete(false)
                      return
                    }
                    navigate('/admin/blog', { replace: true })
                  })
                }}
              >
                Confirm delete
              </AdminButton>
              <AdminButton onClick={() => setConfirmDelete(false)}>Cancel</AdminButton>
            </div>
          ) : (
            <AdminButton tone="danger" onClick={() => setConfirmDelete(true)}>
              Delete post
            </AdminButton>
          )}
        </div>
      ) : null}
      {blocker.state === 'blocked' ? (
        <div className="mt-6 rounded-lg border border-white/20 p-4" role="alertdialog" aria-label="Unsaved changes">
          <p className="font-body text-sm text-white">Leave this page without saving?</p>
          <div className="mt-3 flex gap-2">
            <AdminButton
              onClick={() => {
                dirtyRef.current = false
                setDirty(false)
                blocker.proceed()
              }}
            >
              Leave
            </AdminButton>
            <AdminButton onClick={() => blocker.reset()}>Stay</AdminButton>
          </div>
        </div>
      ) : null}
    </section>
  )
}
