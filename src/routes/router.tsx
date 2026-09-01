import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLayout } from '@/layouts/PageLayout'
import { CategoryPage, HomePage, NotFoundPage } from '@/routes/lazy-pages'

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
