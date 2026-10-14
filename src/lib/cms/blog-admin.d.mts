export const SITE_OWNER_AUTHOR_KEY: string

export type BlogAction = 'draft' | 'publish'
export type BlogFilter = 'all' | 'published' | 'draft'

export interface BlogInput {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  featuredImageId?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  action?: BlogAction
}

export interface AdminFeaturedImage {
  id: string
  url: string
  alt: string
  fileName: string
}

export interface AdminBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  publishedAt: string | null
  updatedAt: string | null
  seoTitle: string
  seoDescription: string
  featuredImageId: string | null
  featuredImage: AdminFeaturedImage | null
}

export interface FieldError {
  field: string | null
  message: string
}

export function normalizePostSlug(value: string): string | null

export function validateBlogInput(
  input: BlogInput,
): { ok: true; value: Omit<Required<BlogInput>, 'action'> } | { ok: false; field: string; message: string }

export function publicationFields(input: {
  action: BlogAction
  publishedAt: string | null
  now: Date
}): { status: 'draft' | 'published'; published_at: string | null }

export function requireSiteOwner(row: { id?: string; key?: string; display_name?: string } | null):
  | { ok: true; author: { id: string; key: string; displayName: string } }
  | { ok: false; message: string }

export function buildPostRecord(input: {
  input: BlogInput
  authorId: string | null
  existingPublishedAt: string | null
  now: Date
}):
  | {
      ok: true
      value: {
        author_id: string
        title: string
        slug: string
        excerpt: string
        content: string
        featured_image_id: string | null
        seo_title: string | null
        seo_description: string | null
        status: 'draft' | 'published'
        published_at: string | null
      }
    }
  | { ok: false; field?: string; message: string }

export function mapWriteError(error: { code?: string; message?: string; details?: string } | null): FieldError | null

export function interpretDelete(
  error: { code?: string; message?: string } | null,
  affectedRows: { id?: string }[] | null | undefined,
): { ok: boolean; message: string }

export function filterPosts<T extends { status: string }>(posts: T[], filter: BlogFilter): T[]

export function mapAdminPost(row: Record<string, unknown>, supabaseUrl: string): AdminBlogPost

export function interpretPostLoad(
  row: Record<string, unknown> | null,
  error: { message?: string } | null,
  supabaseUrl: string,
): { status: 'ready'; post: AdminBlogPost } | { status: 'not-found' | 'error'; post: null }
