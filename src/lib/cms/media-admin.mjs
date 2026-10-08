/**
 * Media admin decisions for the public media bucket.
 * Uploads use the authenticated client. The private uploads bucket stays private.
 */
import { publicMediaUrl } from './read-cms.mjs'

export const MEDIA_BUCKET = 'media'
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

const EXTENSION_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateMediaFile({ type, size }) {
  if (!EXTENSION_BY_MIME[type]) {
    return { ok: false, message: 'Use a JPEG, PNG, WebP, GIF, or SVG image.' }
  }
  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, message: 'The file is empty.' }
  }
  if (size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: 'Image must be 8 MB or smaller.' }
  }
  return { ok: true }
}

/** Storage path is generated. The original filename is never used as the object key. */
export function safeStoragePath(mimeType, id) {
  const extension = EXTENSION_BY_MIME[mimeType]
  if (!extension) throw new Error('Unsupported image type')
  if (!UUID_PATTERN.test(id)) throw new Error('Invalid storage id')
  return `admin/${id}.${extension}`
}

export function displayFileName(name) {
  const base = String(name ?? 'image')
    .split(/[/\\]/)
    .pop()
  const cleaned = String(base ?? '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return (cleaned || 'image').slice(0, 120)
}

export function mapMediaItem(row, supabaseUrl) {
  return {
    id: row.id,
    fileName: row.file_name,
    altText: row.alt_text ?? '',
    mimeType: row.mime_type,
    width: row.width ?? null,
    height: row.height ?? null,
    storagePath: row.storage_path,
    url: publicMediaUrl(supabaseUrl, row.storage_path),
    createdAt: row.created_at,
  }
}

export function mediaDeleteDecision(usage) {
  const usedBy = []
  if (usage.features) usedBy.push('features')
  if (usage.collageLayers) usedBy.push('collage layers')
  if (usage.contactGrid) usedBy.push('contact images')
  if (usage.categories) usedBy.push('categories')
  if (usage.contentBlocks) usedBy.push('content blocks')
  if (usage.siteSettings) usedBy.push('site settings')
  if (usage.blogPosts) usedBy.push('blog posts')
  if (usedBy.length === 0) return { allowed: true, message: '' }
  return {
    allowed: false,
    message: `This file is still used by ${usedBy.join(', ')}. Remove those references before deleting it.`,
  }
}

export function interpretMediaDelete(error) {
  if (!error) return { ok: true, message: '' }
  if (error.code === '23503') {
    return {
      ok: false,
      message: 'This file is still referenced by other CMS content and was not deleted.',
    }
  }
  if (error.code === '42501' || error.code === 'PGRST301') {
    return { ok: false, message: 'The database denied this delete.' }
  }
  return { ok: false, message: 'The file could not be deleted.' }
}
