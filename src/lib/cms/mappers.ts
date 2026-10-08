import { publicMediaUrl } from './read-cms.mjs'

export { CmsError, mapCmsRows, publicMediaUrl, readCms } from './read-cms.mjs'
export type { CmsSnapshot } from './types'

/** Browser-safe public URL for one media row. Null when there is no asset. */
export function mediaPublicUrl(
  storagePath: string | null | undefined,
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL,
): string | null {
  return publicMediaUrl(supabaseUrl, storagePath)
}
