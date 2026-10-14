import { getSupabaseClient } from '@/lib/supabase'

import {
  displayFileName,
  removeConfirmedMedia,
  mapMediaItem,
  mediaDeleteDecision,
  MEDIA_BUCKET,
  safeStoragePath,
  validateMediaFile,
  type MediaItem,
  type MediaUsage,
} from './media-admin.mjs'

function supabaseUrl() {
  return String(import.meta.env.VITE_SUPABASE_URL ?? '')
}

async function countWhere(query: PromiseLike<{ count: number | null; error: { message: string } | null }>) {
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

export async function loadMediaLibrary(): Promise<MediaItem[]> {
  const { data, error } = await getSupabaseClient()
    .from('media_assets')
    .select('id,file_name,alt_text,mime_type,width,height,storage_path,created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error('Media could not be loaded.')
  return (data ?? []).map((row) => mapMediaItem(row, supabaseUrl()))
}

async function imageSize(file: File) {
  if (file.type === 'image/svg+xml') return { width: null, height: null }
  try {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  } catch {
    return { width: null, height: null }
  }
}

export async function uploadMediaFile(file: File, altText: string) {
  const checked = validateMediaFile({ type: file.type, size: file.size })
  if (!checked.ok) return checked

  const storagePath = safeStoragePath(file.type, crypto.randomUUID())
  const client = getSupabaseClient()
  const uploaded = await client.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  })
  if (uploaded.error) return { ok: false as const, message: 'The image could not be uploaded.' }

  const size = await imageSize(file)
  const inserted = await client
    .from('media_assets')
    .insert({
      storage_path: storagePath,
      file_name: displayFileName(file.name),
      mime_type: file.type,
      alt_text: altText.trim() || null,
      width: size.width,
      height: size.height,
      file_size_bytes: file.size,
    })
    .select('id,file_name,alt_text,mime_type,width,height,storage_path,created_at')
    .single()

  if (inserted.error || !inserted.data) {
    await client.storage.from(MEDIA_BUCKET).remove([storagePath])
    return {
      ok: false as const,
      message: 'The image uploaded, but its library record could not be saved. The file was removed.',
    }
  }

  return { ok: true as const, item: mapMediaItem(inserted.data, supabaseUrl()) }
}

async function usageFor(id: string): Promise<MediaUsage> {
  const client = getSupabaseClient()
  const [features, collageLayers, contactGrid, categories, contentBlocks, blogPosts, settings] = await Promise.all([
    countWhere(client.from('features').select('id', { count: 'exact', head: true }).eq('media_id', id)),
    countWhere(client.from('collage_layers').select('id', { count: 'exact', head: true }).eq('media_id', id)),
    countWhere(client.from('contact_grid_images').select('id', { count: 'exact', head: true }).eq('media_id', id)),
    countWhere(client.from('categories').select('id', { count: 'exact', head: true }).eq('card_media_id', id)),
    countWhere(client.from('content_blocks').select('id', { count: 'exact', head: true }).eq('media_id', id)),
    countWhere(client.from('blog_posts').select('id', { count: 'exact', head: true }).eq('featured_image_id', id)),
    client
      .from('site_settings')
      .select('id', { count: 'exact', head: true })
      .or(`hero_background_media_id.eq.${id},hero_phone_media_id.eq.${id},logo_media_id.eq.${id}`),
  ])
  if (settings.error) throw settings.error
  return {
    features,
    collageLayers,
    contactGrid,
    categories,
    contentBlocks,
    blogPosts,
    siteSettings: settings.count ?? 0,
  }
}

export async function deleteMediaAsset(id: string, storagePath: string) {
  let usage: MediaUsage
  try {
    usage = await usageFor(id)
  } catch {
    return { ok: false as const, message: 'References could not be checked, so the file was not deleted.' }
  }
  const decision = mediaDeleteDecision(usage)
  if (!decision.allowed) return { ok: false as const, message: decision.message }

  const client = getSupabaseClient()
  return removeConfirmedMedia({
    removeRow: () => client.from('media_assets').delete().eq('id', id).select('id'),
    removeObject: () => client.storage.from(MEDIA_BUCKET).remove([storagePath]),
  })
}
