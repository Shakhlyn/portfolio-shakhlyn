import type { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { HEADER_SCROLL_THRESHOLD } from '@/constants/site';
import { FOCUS_RING } from '@/constants/styles';
import { ANCHOR_SECTION_IDS } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { cn } from '@/lib/cn';

const HOME_PATH = '/';

/**
 * Fixed header (docs/4-interaction-design.md §3).
 *
 * Blur is unconditional; only the bottom border fades in past scrollY > 8 —
 * animation 10 in the closed inventory (§8) lists "Header border / opacity" and
 * nothing else. The border element is always present and only its opacity
 * animates, so its appearance cannot shift layout (§4).
 *
 * Deliberately does not auto-hide on scroll-down (§3): that saves 64px and
 * costs a recruiter deep in Projects their route to Contact.
 */
export const Header = (): ReactElement => {
  const scrolled = useScrolledPast(HEADER_SCROLL_THRESHOLD);
  const { pathname } = useLocation();

  // The spy runs only on the home route (§3) — no observer is constructed off it.
  const activeSectionId = useActiveSection(ANCHOR_SECTION_IDS, pathname === HOME_PATH);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 bg-bg/80 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border transition-opacity duration-150',
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
      />

      <Container className="flex h-full items-center justify-between gap-4">
        {/*
          Wordmark scrolls to #home, or navigates to / first when on another
          route (§3) — both covered by linking to /#home and letting
          useHashScroll resolve it. Styled at h3 scale but not a heading
          element: a real h3 here would sit above the page h1 and break the
          document outline fixed in 2-architecture.md §8.
        */}
        <Link
          to={`${HOME_PATH}#home`}
          className={cn(
            'rounded-sm text-h3 font-semibold whitespace-nowrap text-fg',
            FOCUS_RING,
          )}
        >
          {PROFILE.wordmark}
        </Link>

        <div className="flex items-center gap-2 lg:gap-6">
          <Navigation activeSectionId={activeSectionId} className="hidden lg:block" />
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
};
