import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True when both browser-safe Supabase env vars are set. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

let client: SupabaseClient<Database> | null = null

/**
 * Returns the shared Supabase browser client.
 * Throws if required env vars are missing — call only when Supabase is enabled.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.',
    )
  }

  if (!client) {
    client = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  }

  return client
}
