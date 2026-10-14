/**
 * Blog admin decisions. Writes still go through the authenticated Supabase client and RLS.
 */
import { CmsError, publicMediaUrl } from './read-cms.mjs'
import { slugify } from './slug.mjs'

export const SITE_OWNER_AUTHOR_KEY = 'site-owner'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function blankToNull(value) {
  const text = String(value ?? '').trim()
  return text ? text : null
}

export function normalizePostSlug(value) {
  try {
    return slugify(value)
  } catch {
    return null
  }
}

export function validateBlogInput(input) {
  const title = String(input?.title ?? '').trim()
  const excerpt = String(input?.excerpt ?? '').trim()
  const content = String(input?.content ?? '').trim()
  const slug = normalizePostSlug(input?.slug || title)
  const featured = blankToNull(input?.featuredImageId)

  if (!title) return { ok: false, field: 'title', message: 'Enter a title.' }
  if (!slug) return { ok: false, field: 'slug', message: 'Enter a slug that uses letters or numbers.' }
  if (!excerpt) return { ok: false, field: 'excerpt', message: 'Enter an excerpt.' }
  if (!content) return { ok: false, field: 'content', message: 'Enter the article text.' }
  if (featured && !UUID_PATTERN.test(featured)) {
    return { ok: false, field: 'featuredImageId', message: 'Choose a featured image from the media library.' }
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      excerpt,
      content,
      featuredImageId: featured,
      seoTitle: blankToNull(input?.seoTitle),
      seoDescription: blankToNull(input?.seoDescription),
    },
  }
}

/** Drafts have no publish timestamp. Publishing keeps an existing timestamp. */
export function publicationFields({ action, publishedAt, now }) {
  if (action === 'publish') {
    const stamp = publishedAt || now.toISOString()
    return { status: 'published', published_at: stamp }
  }
  return { status: 'draft', published_at: null }
}

export function requireSiteOwner(row) {
  if (!row || row.key !== SITE_OWNER_AUTHOR_KEY || !row.id) {
    return {
      ok: false,
      message: 'The site-owner author record is missing. The CMS will not create a replacement author.',
    }
  }
  return {
    ok: true,
    author: {
      id: row.id,
      key: row.key,
      displayName: row.display_name || 'GameGear Nexus',
    },
  }
}

export function buildPostRecord({ input, authorId, existingPublishedAt, now }) {
  const ownerId = blankToNull(authorId)
  if (!ownerId || !UUID_PATTERN.test(ownerId)) {
    return requireSiteOwner(null)
  }
  const validated = validateBlogInput(input)
  if (!validated.ok) return validated
  const action = input?.action === 'publish' ? 'publish' : 'draft'
  return {
    ok: true,
    value: {
      author_id: ownerId,
      title: validated.value.title,
      slug: validated.value.slug,
      excerpt: validated.value.excerpt,
      content: validated.value.content,
      featured_image_id: validated.value.featuredImageId,
      seo_title: validated.value.seoTitle,
      seo_description: validated.value.seoDescription,
      ...publicationFields({ action, publishedAt: existingPublishedAt ?? null, now }),
    },
  }
}

export function mapWriteError(error) {
  if (!error) return null
  const code = String(error.code ?? '')
  const detail = `${error.message ?? ''} ${error.details ?? ''}`
  if (code === '23505' && /slug/i.test(detail)) {
    return { field: 'slug', message: 'A post with this slug already exists.' }
  }
  if (code === '42501' || code === 'PGRST301') {
    return { field: null, message: 'The database denied this change.' }
  }
  return { field: null, message: 'The post could not be saved.' }
}

export function interpretDelete(error, affectedRows) {
  if (error) {
    if (error.code === '42501' || error.code === 'PGRST301') {
      return { ok: false, message: 'The database denied this delete.' }
    }
    return { ok: false, message: 'The post could not be deleted.' }
  }
  if (!Array.isArray(affectedRows) || affectedRows.length !== 1) {
    return { ok: false, message: 'The database denied this delete.' }
  }
  return { ok: true, message: '' }
}

export function filterPosts(posts, filter) {
  if (filter === 'published') return posts.filter((post) => post.status === 'published')
  if (filter === 'draft') return posts.filter((post) => post.status === 'draft')
  return posts
}

export function mapAdminPost(row, supabaseUrl) {
  if (!row?.id || !row.title || !row.slug) {
    throw new CmsError('CMS_QUERY_FAILED', 'Blog post is missing admin fields')
  }
  const image = row.featured_image
  const storagePath = image?.storage_path ?? null
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    status: row.status === 'published' ? 'published' : 'draft',
    publishedAt: row.published_at ?? null,
    updatedAt: row.updated_at ?? null,
    seoTitle: row.seo_title ?? '',
    seoDescription: row.seo_description ?? '',
    featuredImageId: row.featured_image_id ?? image?.id ?? null,
    featuredImage: storagePath
      ? {
          id: image.id ?? row.featured_image_id,
          url: publicMediaUrl(supabaseUrl, storagePath),
          alt: image.alt_text || row.title,
          fileName: image.file_name || storagePath,
        }
      : null,
  }
}

export function interpretPostLoad(row, error, supabaseUrl) {
  if (error) return { status: 'error', post: null }
  if (!row) return { status: 'not-found', post: null }
  return { status: 'ready', post: mapAdminPost(row, supabaseUrl) }
}
