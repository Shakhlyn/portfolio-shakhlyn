import type { ReactElement, ReactNode } from 'react';

import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

interface SectionProps {
  /** In-page anchor target, e.g. `projects`. */
  id: string;
  title: string;
  children: ReactNode;
  /** Optional mono uppercase label above the title. */
  eyebrow?: string;
  description?: string;
  className?: string;
}

/**
 * Owns section vertical rhythm, the anchor id, and the h2
 * (docs/3-style-preference.md §5.4).
 *
 * `scroll-mt-20` (80px) keeps an anchored jump clear of the fixed h-16 header —
 * without it every nav click lands on a heading hidden behind the header.
 *
 * Section renders its own Container; callers must not wrap children in a second
 * one.
 */
export const Section = ({
  id,
  title,
  children,
  eyebrow,
  description,
  className,
}: SectionProps): ReactElement => (
  <section
    id={id}
    aria-labelledby={`${id}-heading`}
    className={cn('scroll-mt-20 py-16 md:py-20 lg:py-24', className)}
  >
    <Container>
      {eyebrow ? (
        <p className="mb-3 font-mono text-eyebrow text-accent uppercase">{eyebrow}</p>
      ) : null}

      {/* tabIndex -1 so anchor navigation can move focus here without adding a tab stop. */}
      <h2
        id={`${id}-heading`}
        tabIndex={-1}
        className="text-h2 text-fg focus-visible:outline-none md:text-h2-md"
      >
        {title}
      </h2>

      {description ? (
        <p className="mt-3 max-w-content text-body text-fg-muted md:text-body-md">
          {description}
        </p>
      ) : null}

      <div className="mt-8 md:mt-12">{children}</div>
    </Container>
  </section>
);
