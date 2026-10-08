/**
 * Public blog reads. Drafts are excluded here and by RLS.
 * Article content is plain text, rendered as React text nodes.
 */
import { CmsError, publicMediaUrl } from './read-cms.mjs'

const postColumns = [
  'title',
  'slug',
  'excerpt',
  'content',
  'status',
  'published_at',
  'seo_title',
  'seo_description',
  'featured_image:media_assets(storage_path,alt_text)',
  'author:blog_authors(key,display_name)',
].join(',')

export function isPublicBlogPost(row, now = new Date()) {
  if (!row || row.status !== 'published' || !row.published_at) return false
  const publishedAt = new Date(row.published_at)
  return !Number.isNaN(publishedAt.getTime()) && publishedAt.getTime() <= now.getTime()
}

export function mapBlogPost(row, supabaseUrl, now = new Date()) {
  if (!isPublicBlogPost(row, now)) {
    throw new CmsError('CMS_QUERY_FAILED', 'Blog post is not publicly visible')
  }
  if (!row.slug || !row.title || !row.excerpt || !row.content) {
    throw new CmsError('CMS_QUERY_FAILED', 'Blog post is missing required public fields')
  }
  const image = row.featured_image
  const storagePath = image?.storage_path ?? null
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    paragraphs: String(row.content)
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    publishedAt: row.published_at,
    authorName: row.author?.display_name || 'GameGear Nexus',
    featuredImage: storagePath
      ? {
          url: publicMediaUrl(supabaseUrl, storagePath),
          alt: image.alt_text || row.title,
        }
      : null,
  }
}

export function mapBlogIndex(rows, supabaseUrl, now = new Date()) {
  return rows.filter((row) => isPublicBlogPost(row, now)).map((row) => mapBlogPost(row, supabaseUrl, now))
}

async function getJson(url, anonKey, fetchImpl, label) {
  let response
  try {
    response = await fetchImpl(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network failure'
    throw new CmsError('CMS_QUERY_FAILED', `${label} request failed: ${message}`)
  }
  if (!response.ok) throw new CmsError('CMS_QUERY_FAILED', `${label} failed with HTTP ${response.status}`)
  return response.json()
}

function postsUrl(supabaseUrl, filters) {
  const base = supabaseUrl.replace(/\/+$/, '')
  return `${base}/rest/v1/blog_posts?select=${encodeURIComponent(postColumns)}&${filters}`
}

export async function readPublishedPosts(supabaseUrl, anonKey, fetchImpl = fetch, now = new Date()) {
  if (!supabaseUrl || !anonKey) throw new CmsError('CMS_QUERY_FAILED', 'Supabase URL and anon key are required')
  const rows = await getJson(
    postsUrl(supabaseUrl, 'order=published_at.desc'),
    anonKey,
    fetchImpl,
    'blog_posts',
  )
  return mapBlogIndex(rows, supabaseUrl, now)
}

export async function readPublishedPostBySlug(supabaseUrl, anonKey, slug, fetchImpl = fetch, now = new Date()) {
  if (!slug) throw new CmsError('CMS_QUERY_FAILED', 'Blog slug is required')
  const rows = await getJson(
    postsUrl(supabaseUrl, `slug=eq.${encodeURIComponent(slug)}`),
    anonKey,
    fetchImpl,
    'blog_posts',
  )
  const visible = rows.filter((row) => isPublicBlogPost(row, now))
  if (visible.length !== 1) return null
  return mapBlogPost(visible[0], supabaseUrl, now)
}
