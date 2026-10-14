import { getSupabaseClient } from '@/lib/supabase'

import {
  buildPostRecord,
  interpretDelete,
  interpretPostLoad,
  mapAdminPost,
  mapWriteError,
  requireSiteOwner,
  SITE_OWNER_AUTHOR_KEY,
  type AdminBlogPost,
  type BlogInput,
} from './blog-admin.mjs'

const listColumns =
  'id,title,slug,excerpt,content,status,published_at,updated_at,seo_title,seo_description,featured_image_id,featured_image:media_assets(id,storage_path,alt_text,file_name)'

function supabaseUrl() {
  return String(import.meta.env.VITE_SUPABASE_URL ?? '')
}

export async function loadDashboardCounts() {
  const client = getSupabaseClient()
  const [published, drafts, media] = await Promise.all([
    client.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    client.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    client.from('media_assets').select('id', { count: 'exact', head: true }),
  ])
  if (published.error || drafts.error || media.error) {
    return { ok: false as const, message: 'Dashboard totals could not be loaded.' }
  }
  return {
    ok: true as const,
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
    media: media.count ?? 0,
  }
}

export async function loadSiteOwner() {
  const { data, error } = await getSupabaseClient()
    .from('blog_authors')
    .select('id,key,display_name')
    .eq('key', SITE_OWNER_AUTHOR_KEY)
    .maybeSingle()
  if (error) {
    return { ok: false as const, message: 'The site owner author could not be loaded.' }
  }
  return requireSiteOwner(data)
}

export async function loadAdminPosts(): Promise<AdminBlogPost[]> {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .select(listColumns)
    .order('updated_at', { ascending: false })
  if (error) throw new Error('Blog posts could not be loaded.')
  return (data ?? []).map((row) => mapAdminPost(row, supabaseUrl()))
}

export async function loadAdminPost(id: string) {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .select(listColumns)
    .eq('id', id)
    .maybeSingle()
  return interpretPostLoad(data, error, supabaseUrl())
}

export async function saveAdminPost(id: string | null, input: BlogInput, authorId: string, existingPublishedAt: string | null) {
  const built = buildPostRecord({
    input,
    authorId,
    existingPublishedAt,
    now: new Date(),
  })
  if (!built.ok) return built

  const client = getSupabaseClient()
  const query = id
    ? client.from('blog_posts').update(built.value).eq('id', id).select(listColumns).maybeSingle()
    : client.from('blog_posts').insert(built.value).select(listColumns).maybeSingle()
  const { data, error } = await query
  const mapped = mapWriteError(error)
  if (mapped) return { ok: false as const, field: mapped.field, message: mapped.message }
  if (!data) return { ok: false as const, field: null, message: 'The database denied this change.' }
  return { ok: true as const, post: mapAdminPost(data, supabaseUrl()) }
}

export async function deleteAdminPost(id: string) {
  const { data, error } = await getSupabaseClient().from('blog_posts').delete().eq('id', id).select('id')
  return interpretDelete(error, data)
}
