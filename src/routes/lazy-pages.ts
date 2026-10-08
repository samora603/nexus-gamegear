import { lazy } from 'react'

export const HomePage = lazy(() => import('@/pages/HomePage'))
export const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
export const BlogIndexPage = lazy(() => import('@/pages/BlogIndexPage'))
export const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
export const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
export const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
export const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
export const AdminBlogListPage = lazy(() => import('@/pages/admin/AdminBlogListPage'))
export const AdminBlogEditorPage = lazy(() => import('@/pages/admin/AdminBlogEditorPage'))
export const AdminMediaPage = lazy(() => import('@/pages/admin/AdminMediaPage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
