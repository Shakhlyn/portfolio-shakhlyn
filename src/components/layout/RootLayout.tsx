import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { PageTransition } from '@/components/layout/PageTransition';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { FOCUS_RING } from '@/constants/styles';
import { PROFILE } from '@/data/profile';
import { useRouteFocus } from '@/hooks/useRouteFocus';
import { cn } from '@/lib/cn';

/**
 * The app shell. Header and Footer are minimal semantic placeholders here —
 * the real Navigation, MobileNavigation, and SocialRail are E07 and E08.
 */
export const RootLayout = (): ReactElement => {
  useRouteFocus();

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

      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-bg/80 backdrop-blur-sm">
        <Container className="flex h-full items-center justify-between">
          <span className="text-h3 font-semibold text-fg">{PROFILE.name}</span>
          <ThemeToggle />
        </Container>
      </header>

      {/* pt-16 clears the fixed header so content is never underneath it. */}
      <main id="main" tabIndex={-1} className="pt-16 focus-visible:outline-none">
        <ErrorBoundary>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </ErrorBoundary>
      </main>

      <footer className="border-t border-border py-12">
        <Container className="text-body-sm text-fg-subtle">
          {PROFILE.name} · {new Date().getFullYear()}
        </Container>
      </footer>
    </>
  );
};
