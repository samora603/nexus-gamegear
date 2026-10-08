export interface BlogFeaturedImage {
  url: string
  alt: string
}

export interface BlogPost {
  title: string
  slug: string
  excerpt: string
  paragraphs: string[]
  seoTitle: string
  seoDescription: string
  publishedAt: string
  authorName: string
  featuredImage: BlogFeaturedImage | null
}

export function isPublicBlogPost(
  row: {
    status?: string | null
    published_at?: string | null
  } | null,
  now?: Date,
): boolean

export function mapBlogPost(
  row: Record<string, unknown>,
  supabaseUrl: string,
  now?: Date,
): BlogPost

export function mapBlogIndex(
  rows: Record<string, unknown>[],
  supabaseUrl: string,
  now?: Date,
): BlogPost[]

export function readPublishedPosts(
  supabaseUrl: string,
  anonKey: string,
  fetchImpl?: typeof fetch,
  now?: Date,
): Promise<BlogPost[]>

export function readPublishedPostBySlug(
  supabaseUrl: string,
  anonKey: string,
  slug: string,
  fetchImpl?: typeof fetch,
  now?: Date,
): Promise<BlogPost | null>
