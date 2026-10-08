import type { CmsSnapshot } from './types'

export class CmsError extends Error {
  code: 'CMS_QUERY_FAILED' | 'CMS_MEDIA_RESOLUTION_FAILED' | 'CMS_CATEGORY_MAPPING_FAILED'
  constructor(
    code: 'CMS_QUERY_FAILED' | 'CMS_MEDIA_RESOLUTION_FAILED' | 'CMS_CATEGORY_MAPPING_FAILED',
    message: string,
  )
}

export function publicMediaUrl(
  supabaseUrl: string | null | undefined,
  storagePath: string | null | undefined,
): string | null

export function mapCmsRows(rows: Record<string, unknown>, supabaseUrl: string): CmsSnapshot

export function readCms(
  supabaseUrl: string,
  anonKey: string,
  fetchImpl?: typeof fetch,
): Promise<CmsSnapshot>
