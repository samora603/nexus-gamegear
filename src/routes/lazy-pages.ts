import { lazy } from 'react'

export const HomePage = lazy(() => import('@/pages/HomePage'))
export const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
export const BlogIndexPage = lazy(() => import('@/pages/BlogIndexPage'))
export const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
