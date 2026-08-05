import { AnimatePresence, m } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useMotionVariants } from '@/hooks/useMotionVariants';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Animation 5 (docs/4-interaction-design.md §8): confirms the page changed.
 *
 * Keyed on pathname only. An in-page anchor jump is not a page change, and
 * fading the whole page out for one would be both wrong and disorienting.
 *
 * **The first load must not fade the whole page in**, but that is expressed on
 * this component alone. `<AnimatePresence initial={false}>` looks like the way
 * to say it and is not: it sets `PresenceContext.initial = false`, which makes
 * **every descendant** motion component skip its own `initial` prop. With it in
 * place the hero rendered at its final state instead of animating on mount, and
 * every `whileInView` reveal on the site had no `hidden` state to animate from —
 * eleven animations silently disabled by one prop on an unrelated component.
 *
 * Scoping it to this element's own `initial` keeps the first paint calm without
 * reaching into the subtree.
 */
/**
 * Whether the app has painted once. Module scope rather than a ref or state
 * because the React Compiler rules forbid both reading a ref during render and
 * setting state from an effect, and this value is needed *during* render. It is
 * write-once for the lifetime of the tab, and nothing re-renders when it flips —
 * it is only read when a keyed child mounts, which next happens on a route
 * change, by which time it is already `true`.
 */
let hasPaintedOnce = false;

export const PageTransition = ({ children }: PageTransitionProps): ReactElement => {
  const { pathname } = useLocation();
  const { pageTransition } = useMotionVariants();

  const isFirstPaint = !hasPaintedOnce;
  useEffect(() => {
    hasPaintedOnce = true;
  }, []);

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        variants={pageTransition}
        // `false` renders at the animate state: no page-level fade on arrival,
        // while children keep their own mount and scroll-reveal animations.
        initial={isFirstPaint ? false : 'initial'}
        animate="animate"
        exit="exit"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};
