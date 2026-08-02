import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';
import { SocialRail } from '@/components/layout/SocialRail';
import { FOCUS_RING } from '@/constants/styles';
import { useHashScroll } from '@/hooks/useHashScroll';
import { useRouteFocus } from '@/hooks/useRouteFocus';
import { cn } from '@/lib/cn';

/**
 * The app shell.
 */
export const RootLayout = (): ReactElement => {
  useRouteFocus();
  useHashScroll();

  return (
    <>
      {/* First focusable element on every page (docs/4-interaction-design.md §9). */}
      <a
        href="#main"
        className={cn(
          'sr-only rounded-md border border-accent bg-bg px-4 py-2 text-fg focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50',
          FOCUS_RING,
        )}
      >
        Skip to content
      </a>

      <Header />

      {/* pt-16 clears the fixed header so content is never underneath it. */}
      <main id="main" tabIndex={-1} className="pt-16 focus-visible:outline-none">
        <ErrorBoundary>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </ErrorBoundary>
      </main>

      {/*
        After <main> and before <footer>, matching the tab order in
        docs/4-interaction-design.md §9. It renders visually left but is
        supplementary, so it must not sit between the header and page content in
        the tab order (§7). Outside PageTransition so it does not fade on route
        change (2-architecture.md §6).
      */}
      <SocialRail />

      <Footer />
    </>
  );
};
