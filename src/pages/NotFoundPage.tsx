import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/ui/Container';
import { FOCUS_RING } from '@/constants/styles';
import { NOT_FOUND_LINKS } from '@/data/navigation';
import { cn } from '@/lib/cn';

/**
 * docs/3-style-preference.md §6.13. Renders inside RootLayout, so header,
 * footer, and theme are preserved — "no dead ends" (AGENTS.md §8).
 */
export const NotFoundPage = (): ReactElement => (
  <Container as="section" className="py-32 text-center">
    {/* Decorative. The h1 below is the accessible page title. */}
    <p aria-hidden="true" className="text-display text-fg-subtle md:text-display-md">
      404
    </p>

    <h1
      tabIndex={-1}
      className="mt-4 text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      Page Not Found
    </h1>

    <p className="mx-auto mt-3 max-w-content text-body text-fg-muted md:text-body-md">
      That page does not exist. Here is where you probably meant to go.
    </p>

    <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      {NOT_FOUND_LINKS.map((item) => (
        <li key={item.label}>
          <Link
            to={item.kind === 'route' ? item.path : `/#${item.sectionId}`}
            className={cn(
              'rounded-sm text-body-sm text-accent underline decoration-1 underline-offset-4',
              FOCUS_RING,
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </Container>
);
