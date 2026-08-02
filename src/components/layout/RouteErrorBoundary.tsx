import type { ReactElement } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ErrorFallback } from '@/components/layout/ErrorFallback';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * The router's errorElement. Catches loader errors, thrown responses, and lazy
 * chunk-load failures — the things a React error boundary never sees.
 *
 * A 404-shaped route error renders the NotFound content, not the crash
 * fallback: a mistyped URL is not a crash.
 */
export const RouteErrorBoundary = (): ReactElement => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  const detail =
    error instanceof Error ? (error.stack ?? error.message) : JSON.stringify(error);

  return <ErrorFallback detail={detail} />;
};
