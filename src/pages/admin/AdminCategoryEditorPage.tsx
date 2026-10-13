import { useEffect, useRef, useState } from 'react'
import { Link, useBlocker, useParams } from 'react-router-dom'
import { loadAdminCategory, saveAdminCategory, type AdminPill } from '@/lib/cms/category-admin-api'
import { movePill } from '@/lib/cms/category-admin.mjs'
import { AdminButton, AdminField } from '@/pages/admin/admin-ui'
import { adminControlClass } from '@/pages/admin/admin-controls'

interface PillForm {
  key: string
  id: string | null
  slug: string | null
  label: string
  published: boolean
}

function toForm(pill: AdminPill): PillForm {
  return { key: pill.id, id: pill.id, slug: pill.slug, label: pill.label, published: pill.published }
}

export default function AdminCategoryEditorPage() {
  const { id = '' } = useParams()
  const dirtyRef = useRef(false)
  const [dirty, setDirty] = useState(false)
  const [page, setPage] = useState<'loading' | 'ready' | 'error' | 'not-found'>('loading')
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [displayTitle, setDisplayTitle] = useState('')
  const [cardLabel, setCardLabel] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [published, setPublished] = useState(true)
  const [pills, setPills] = useState<PillForm[]>([])
  const [existing, setExisting] = useState<{ id: string; slug: string }[]>([])
  const [field, setField] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const blocker = useBlocker(() => dirtyRef.current)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => loadAdminCategory(id))
      .then((result) => {
        if (cancelled) return
        if (result.status !== 'ready' || !result.category) {
          setPage(result.status === 'not-found' ? 'not-found' : 'error')
          return
        }
        setSlug(result.category.slug)
        setName(result.category.name)
        setDisplayTitle(result.category.displayTitle)
        setCardLabel(result.category.cardLabel)
        setSortOrder(String(result.category.sortOrder))
        setPublished(result.category.published)
        setPills(result.pills.map(toForm))
        setExisting(result.pills.map((pill) => ({ id: pill.id, slug: pill.slug })))
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

  function markDirty() {
    dirtyRef.current = true
    setDirty(true)
    setNotice(null)
  }

  async function onSave() {
    setSaving(true)
    setMessage(null)
    setNotice(null)
    const result = await saveAdminCategory(
      id,
      { name, displayTitle, cardLabel, sortOrder: Number(sortOrder), published },
      pills.map((pill) => ({ id: pill.id, label: pill.label, published: pill.published })),
      existing,
    )
    setSaving(false)
    if (!result.ok) {
      setField(result.field ?? null)
      setMessage(result.message)
      return
    }
    dirtyRef.current = false
    setDirty(false)
    setNotice('Saved.')
    const reloaded = await loadAdminCategory(id)
    if (reloaded.status === 'ready' && reloaded.category) {
      setPills(reloaded.pills.map(toForm))
      setExisting(reloaded.pills.map((pill) => ({ id: pill.id, slug: pill.slug })))
      setName(reloaded.category.name)
      setDisplayTitle(reloaded.category.displayTitle)
      setCardLabel(reloaded.category.cardLabel)
      setSortOrder(String(reloaded.category.sortOrder))
      setPublished(reloaded.category.published)
    }
  }

  if (page === 'loading') {
    return (
      <p className="font-body text-sm text-white/70" role="status">
        Loading
      </p>
    )
  }
  if (page === 'not-found') {
    return (
      <div>
        <h2 className="font-display text-xl text-white">Category not found</h2>
        <Link className="mt-4 inline-block font-body text-sm text-white underline" to="/admin/categories">
          Back to categories
        </Link>
      </div>
    )
  }
  if (page === 'error') {
    return (
      <p className="font-body text-sm text-white" role="alert">
        This category could not be loaded.
      </p>
    )
  }

  const control = adminControlClass()

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-white">Edit category</h2>
        <Link className="font-body text-sm text-white/80 underline-offset-4 hover:underline" to="/admin/categories">
          Back to categories
        </Link>
      </div>
      <p className="mt-2 font-body text-sm text-white/70">Slug: {slug}</p>
      <p className="mt-1 max-w-2xl font-body text-sm text-white/60">
        There is no description column. The public page uses the display title, card label, and pill labels.
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSave()
        }}
      >
        <AdminField label="Name" error={field === 'name' ? message : null}>
          <input className={control} value={name} required onChange={(event) => { markDirty(); setName(event.target.value) }} />
        </AdminField>
        <AdminField label="Display title" error={field === 'displayTitle' ? message : null}>
          <input className={control} value={displayTitle} required onChange={(event) => { markDirty(); setDisplayTitle(event.target.value) }} />
        </AdminField>
        <AdminField label="Card label" error={field === 'cardLabel' ? message : null}>
          <input className={control} value={cardLabel} required onChange={(event) => { markDirty(); setCardLabel(event.target.value) }} />
        </AdminField>
        <AdminField label="Sort order" error={field === 'sortOrder' ? message : null}>
          <input className={control} inputMode="numeric" value={sortOrder} onChange={(event) => { markDirty(); setSortOrder(event.target.value) }} />
        </AdminField>
        <label className="flex items-center gap-2 font-body text-sm text-white/80">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => {
              markDirty()
              setPublished(event.target.checked)
            }}
          />
          Published
        </label>
        <fieldset>
          <legend className="font-body text-sm text-white/80">Pills</legend>
          {pills.length === 0 ? <p className="mt-2 font-body text-sm text-white/60">No pills on this category.</p> : null}
          <ul className="mt-3 flex flex-col gap-3">
            {pills.map((pill, index) => (
              <li key={pill.key} className="rounded-lg border border-white/15 p-3">
                <AdminField label={pill.slug ? `Label (${pill.slug})` : 'Label'} error={null}>
                  <input
                    className={control}
                    value={pill.label}
                    onChange={(event) => {
                      markDirty()
                      setPills((current) => current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: event.target.value } : entry)))
                    }}
                  />
                </AdminField>
                <label className="mt-3 flex items-center gap-2 font-body text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={pill.published}
                    onChange={(event) => {
                      markDirty()
                      setPills((current) => current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, published: event.target.checked } : entry)))
                    }}
                  />
                  Published
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AdminButton type="button" onClick={() => { markDirty(); setPills((current) => movePill(current, index, -1)) }}>
                    Move up
                  </AdminButton>
                  <AdminButton type="button" onClick={() => { markDirty(); setPills((current) => movePill(current, index, 1)) }}>
                    Move down
                  </AdminButton>
                  <AdminButton
                    type="button"
                    tone="danger"
                    onClick={() => {
                      if (!window.confirm('Remove this pill?')) return
                      markDirty()
                      setPills((current) => current.filter((_, entryIndex) => entryIndex !== index))
                    }}
                  >
                    Remove
                  </AdminButton>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
          <AdminButton
            type="button"
            onClick={() => {
              markDirty()
              setPills((current) => [...current, { key: crypto.randomUUID(), id: null, slug: null, label: '', published: true }])
            }}
          >
            Add pill
          </AdminButton>
          </div>
        </fieldset>
        {message && field !== 'name' && field !== 'displayTitle' && field !== 'cardLabel' && field !== 'sortOrder' ? (
          <p className="font-body text-sm text-white" role="alert">
            {message}
          </p>
        ) : null}
        {notice ? (
          <p className="font-body text-sm text-white" role="status">
            {notice}
          </p>
        ) : null}
        <AdminButton type="submit" disabled={saving}>
          {saving ? 'Saving' : 'Save'}
        </AdminButton>
      </form>
      {blocker.state === 'blocked' ? (
        <div className="mt-6 rounded-lg border border-white/20 p-4" role="alertdialog" aria-label="Unsaved changes">
          <p className="font-body text-sm text-white">Leave this page without saving?</p>
          <div className="mt-3 flex gap-2">
            <AdminButton
              type="button"
              onClick={() => {
                dirtyRef.current = false
                setDirty(false)
                blocker.proceed()
              }}
            >
              Leave
            </AdminButton>
            <AdminButton type="button" onClick={() => blocker.reset()}>
              Stay
            </AdminButton>
          </div>
        </div>
      ) : null}
    </section>
  )
}
