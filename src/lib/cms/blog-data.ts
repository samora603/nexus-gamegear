import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

import { readPublishedPostBySlug, readPublishedPosts } from './blog.mjs'
import type { BlogPost } from './blog.d.mts'
import { CmsError } from './read-cms.mjs'

export type BlogIndexState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; posts: BlogPost[] }

export type BlogArticleState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'ready'; post: BlogPost }

function reportBlogFailure(error: unknown) {
  if (!import.meta.env.DEV) return
  const code = error instanceof CmsError ? error.code : 'CMS_QUERY_FAILED'
  console.error(`Blog CMS read failed (${code}).`)
}

function clientConfig() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!isSupabaseConfigured()) {
    throw new CmsError(
      'CMS_QUERY_FAILED',
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return { supabaseUrl, anonKey }
}

export function useBlogIndex(): BlogIndexState {
  const [state, setState] = useState<BlogIndexState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => {
        const { supabaseUrl, anonKey } = clientConfig()
        return readPublishedPosts(supabaseUrl, anonKey)
      })
      .then((posts) => {
        if (!cancelled) setState({ status: 'ready', posts })
      })
      .catch((error: unknown) => {
        reportBlogFailure(error)
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function useBlogArticle(slug: string): BlogArticleState {
  const [state, setState] = useState<BlogArticleState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => {
        const { supabaseUrl, anonKey } = clientConfig()
        return readPublishedPostBySlug(supabaseUrl, anonKey, slug)
      })
      .then((post) => {
        if (cancelled) return
        setState(post ? { status: 'ready', post } : { status: 'not-found' })
      })
      .catch((error: unknown) => {
        reportBlogFailure(error)
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}
