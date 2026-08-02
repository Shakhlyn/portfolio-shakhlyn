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
 *
 * The left gutter widens to 56px from `sm` to `lg` to clear the 48px social
 * rail (docs/4-interaction-design.md §7), which is fixed at x=0 over that
 * range. From `xl` the centred container already starts well right of 48px, so
 * the gutter returns to normal. `lg:pl-14` is not redundant with `sm:pl-14`:
 * `lg:px-8` sits in a later media block and would otherwise win.
 */
export const Container = ({
  children,
  className,
  as: Component = 'div',
}: ContainerProps): ReactElement => (
  <Component
    className={cn(
      'mx-auto w-full max-w-container px-5 sm:px-6 lg:px-8 2xl:max-w-container-wide',
      'sm:pl-14 lg:pl-14 xl:pl-8',
      className,
    )}
  >
    {children}
  </Component>
);
