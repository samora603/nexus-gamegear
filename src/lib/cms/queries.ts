import { isSupabaseConfigured } from '@/lib/supabase'

import { CmsError, readCms } from './read-cms.mjs'
import type { CmsSnapshot } from './types'

/**
 * Load the published CMS snapshot with the anon key.
 * Selects only. This module is not imported by pages.
 */
export async function loadPublishedCms(): Promise<CmsSnapshot> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!isSupabaseConfigured()) {
    throw new CmsError(
      'CMS_QUERY_FAILED',
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return readCms(supabaseUrl, anonKey)
}
