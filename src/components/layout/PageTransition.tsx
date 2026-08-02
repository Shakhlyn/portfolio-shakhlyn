import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';
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
 */
export const PageTransition = ({ children }: PageTransitionProps): ReactElement => {
  const { pathname } = useLocation();
  const { pageTransition } = useMotionVariants();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
