import { useEffect, useState, type FormEvent } from 'react'
import { deleteMediaAsset, loadMediaLibrary, uploadMediaFile } from '@/lib/cms/media-admin-api'
import type { MediaItem } from '@/lib/cms/media-admin.mjs'
import { AdminButton, AdminField } from '@/pages/admin/admin-ui'
import { adminControlClass } from '@/pages/admin/admin-controls'

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => loadMediaLibrary())
      .then((rows) => {
        if (!cancelled) setItems(rows)
      })
      .catch(() => {
        if (!cancelled) setError('Media could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const file = new FormData(form).get('file')
    if (!(file instanceof File) || file.size === 0) {
      setError('Choose an image.')
      return
    }
    setUploading(true)
    setError(null)
    setNotice(null)
    const result = await uploadMediaFile(file, altText)
    setUploading(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setItems((current) => [result.item, ...(current ?? [])])
    setAltText('')
    form.reset()
    setNotice('Image added to the media library.')
  }

  return (
    <section>
      <h2 className="font-display text-xl text-white">Media</h2>
      <p className="mt-2 max-w-2xl font-body text-sm text-white/75">
        Public website images are stored in the media bucket. The private uploads bucket is not used here.
      </p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onUpload}>
        <AdminField label="Image" error={null}>
          <input
            className={`${adminControlClass()} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-sm file:text-black`}
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            required
          />
        </AdminField>
        <AdminField label="Alt text" error={null}>
          <input className={adminControlClass()} value={altText} onChange={(event) => setAltText(event.target.value)} />
        </AdminField>
        <AdminButton type="submit" disabled={uploading}>
          {uploading ? 'Uploading' : 'Upload'}
        </AdminButton>
      </form>
      {error ? (
        <p className="mt-4 font-body text-sm text-white" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 font-body text-sm text-white" role="status">
          {notice}
        </p>
      ) : null}
      {items === null && !error ? (
        <p className="mt-6 font-body text-sm text-white/70" role="status">
          Loading
        </p>
      ) : null}
      {items && items.length === 0 ? <p className="mt-6 font-body text-sm text-white/75">No media assets yet.</p> : null}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(items ?? []).map((item) => (
          <li key={item.id} className="overflow-hidden rounded-lg border border-white/15">
            <img src={item.url} alt={item.altText || ''} className="h-36 w-full object-cover" />
            <div className="p-3">
              <p className="truncate font-body text-sm text-white">{item.fileName}</p>
              <p className="mt-1 truncate font-body text-xs text-white/55">{item.storagePath}</p>
              <div className="mt-3">
                {pendingDelete === item.id ? (
                  <div className="flex flex-wrap gap-2">
                    <AdminButton
                      tone="danger"
                      onClick={() => {
                        void deleteMediaAsset(item.id, item.storagePath).then((result) => {
                          setPendingDelete(null)
                          if (!result.ok) {
                            setError(result.message)
                            return
                          }
                          setItems((current) => (current ?? []).filter((entry) => entry.id !== item.id))
                          setNotice(result.message || 'Image deleted.')
                        })
                      }}
                    >
                      Confirm delete
                    </AdminButton>
                    <AdminButton onClick={() => setPendingDelete(null)}>Cancel</AdminButton>
                  </div>
                ) : (
                  <AdminButton tone="danger" onClick={() => setPendingDelete(item.id)}>
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
