import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/components/layout/RootLayout';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * All route config lives here and nowhere else (AGENTS.md §8).
 *
 * Home is eager — it is the LCP route. Everything else is lazy via the router's
 * native `lazy:`, which resolves before rendering, so there is no Suspense
 * fallback flash between routes.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'projects/:slug',
        lazy: async () => {
          const { ProjectPage } = await import('@/pages/ProjectPage');
          return { Component: ProjectPage };
        },
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'resume',
        lazy: async () => {
          const { ResumePage } = await import('@/pages/ResumePage');
          return { Component: ResumePage };
        },
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'writing',
        lazy: async () => {
          const { WritingPage } = await import('@/pages/WritingPage');
          return { Component: WritingPage };
        },
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'writing/:slug',
        lazy: async () => {
          const { WritingPostPage } = await import('@/pages/WritingPostPage');
          return { Component: WritingPostPage };
        },
        errorElement: <RouteErrorBoundary />,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
