import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'accent' | 'neutral';
  className?: string;
}

/**
 * Tech tags and skill chips (docs/3-style-preference.md §5.3).
 *
 * Badges are never interactive in v1 — there is no filtering
 * (docs/2-architecture.md §12). The props type deliberately has no onClick or
 * href: a badge that looks clickable and is not is a credibility leak on a site
 * whose whole argument is attention to detail.
 */
export const Badge = ({
  children,
  variant = 'accent',
  className,
}: BadgeProps): ReactElement => (
  <span
    className={cn(
      'inline-flex items-center rounded-sm px-2 py-0.5 text-body-sm font-medium',
      variant === 'accent'
        ? 'bg-accent-soft text-accent-strong'
        : 'border border-border bg-surface text-fg-muted',
      className,
    )}
  >
    {children}
  </span>
);
