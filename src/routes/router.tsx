import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLayout } from '@/layouts/PageLayout'
import { BlogIndexPage, BlogPostPage, CategoryPage, HomePage, NotFoundPage } from '@/routes/lazy-pages'

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
