export const MEDIA_BUCKET: 'media'
export const MAX_UPLOAD_BYTES: number

export interface MediaItem {
  id: string
  fileName: string
  altText: string
  mimeType: string
  width: number | null
  height: number | null
  storagePath: string
  url: string
  createdAt: string
}

export interface MediaUsage {
  features: number
  collageLayers: number
  contactGrid: number
  categories: number
  contentBlocks: number
  siteSettings: number
  blogPosts: number
}

export function validateMediaFile(file: { type: string; size: number }): { ok: true } | { ok: false; message: string }

export function safeStoragePath(mimeType: string, id: string): string

export function displayFileName(name: string): string

export function mapMediaItem(
  row: {
    id: string
    file_name: string
    alt_text?: string | null
    mime_type: string
    width?: number | null
    height?: number | null
    storage_path: string
    created_at: string
  },
  supabaseUrl: string,
): MediaItem

export function mediaDeleteDecision(usage: MediaUsage): { allowed: boolean; message: string }

export function interpretMediaDelete(error: { code?: string; message?: string } | null): {
  ok: boolean
  message: string
}
