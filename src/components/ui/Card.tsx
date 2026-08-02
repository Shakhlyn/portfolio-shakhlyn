import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  /**
   * Applies hover treatment. Only set this when the whole card is a single
   * interactive surface — never alongside nested links or buttons, which is
   * invalid HTML and breaks the inner controls.
   */
  interactive?: boolean;
}

/**
 * Elevation level 1 (docs/3-style-preference.md §4.4, §5.2).
 *
 * Tailwind v4's `hover:` variant already resolves to `@media (hover: hover)`,
 * so hover styles do not fire on touch — where they would otherwise trigger on
 * tap and stick until the next tap elsewhere (docs/4-interaction-design.md §6).
 *
 * No scale transforms, no shadow bloom.
 */
export const Card = ({
  children,
  className,
  interactive = false,
}: CardProps): ReactElement => (
  <div
    className={cn(
      'rounded-lg border border-border bg-surface p-5 md:p-6',
      interactive &&
        'transition duration-150 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface-hover',
      className,
    )}
  >
    {children}
  </div>
);
