import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLayout } from '@/layouts/PageLayout'
import {
  AdminBlogEditorPage,
  AdminBlogListPage,
  AdminCategoryEditorPage,
  AdminCategoryListPage,
  AdminDashboardPage,
  AdminLayout,
  AdminLoginPage,
  AdminMediaPage,
  BlogIndexPage,
  BlogPostPage,
  CategoryPage,
  HomePage,
  NotFoundPage,
} from '@/routes/lazy-pages'

export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'contact',
        element: <Navigate to="/#contact" replace />,
      },
      {
        path: 'blog',
        element: <BlogIndexPage />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />,
      },
      {
        path: 'admin/login',
        element: <AdminLoginPage />,
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'blog', element: <AdminBlogListPage /> },
          { path: 'blog/new', element: <AdminBlogEditorPage /> },
          { path: 'blog/:id', element: <AdminBlogEditorPage /> },
          { path: 'categories', element: <AdminCategoryListPage /> },
          { path: 'categories/:id', element: <AdminCategoryEditorPage /> },
          { path: 'media', element: <AdminMediaPage /> },
        ],
      },
      {
        path: ':categorySlug',
        element: <CategoryPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
