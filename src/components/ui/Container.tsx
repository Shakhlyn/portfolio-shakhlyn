import type { ElementType, ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Rendered element. Defaults to `div`. */
  as?: ElementType;
}

/**
 * Owns the page shell width and gutters (docs/3-style-preference.md §4.2).
 * No section reimplements this — a second copy is how one section ends up 4px
 * off at `lg` and nobody can find why.
 */
export const Container = ({
  children,
  className,
  as: Component = 'div',
}: ContainerProps): ReactElement => (
  <Component
    className={cn(
      'mx-auto w-full max-w-container px-5 sm:px-6 lg:px-8 2xl:max-w-container-wide',
      className,
    )}
  >
    {children}
  </Component>
);
