import type { Variants } from 'motion/react';

import {
  DURATION_PAGE,
  DURATION_REVEAL,
  EASE_OUT,
  EASE_REVEAL,
  PAGE_OFFSET_Y,
  REVEAL_OFFSET_Y,
  STAGGER_CARDS,
} from '@/constants/motion';

/**
 * Shared motion vocabulary. Pure — no React imports (AGENTS.md §3).
 *
 * Only `opacity` and `transform` animate. Never width, height, top, left, or
 * box-shadow. The single documented `width` exception is the social rail
 * (docs/4-interaction-design.md §7) and is not defined here.
 */

/** Animations 1 and 2: hero mount and section scroll reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_REVEAL, ease: EASE_REVEAL },
  },
};

/**
 * Animations 3 and 4: grouped children. Stagger comes from the parent variants
 * object, never from hand-delaying individual children (AGENTS.md §7).
 */
export const staggerContainer = (staggerChildren = STAGGER_CARDS): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren },
  },
});

/** Animation 5: route change. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: PAGE_OFFSET_Y },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_PAGE, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: PAGE_OFFSET_Y,
    transition: { duration: DURATION_PAGE, ease: EASE_OUT },
  },
};

/** Final-state equivalents used when the visitor prefers reduced motion. */
export const reducedFadeUp: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export const reducedPageTransition: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0 } },
  exit: { opacity: 1, y: 0, transition: { duration: 0 } },
};
