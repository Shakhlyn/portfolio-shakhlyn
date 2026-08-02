import type { Variants } from 'motion/react';
import { useReducedMotion } from 'motion/react';

import {
  fadeUp,
  pageTransition,
  reducedFadeUp,
  reducedPageTransition,
  staggerContainer,
} from '@/lib/motion';

interface UseMotionVariantsResult {
  fadeUp: Variants;
  pageTransition: Variants;
  staggerContainer: (staggerChildren?: number) => Variants;
  /**
   * True when the visitor prefers reduced motion. Exposed for the two cases the
   * variants cannot cover: carousel scroll behaviour (animation 9) and the form
   * spinner (animation 11).
   */
  reducedMotion: boolean;
}

/**
 * The reduced-motion check, written once rather than eleven times. Eleven
 * independent useReducedMotion() calls is eleven chances to forget one, and the
 * one you forget is the one that makes a vestibular-sensitive visitor close the
 * tab.
 *
 * Reduced motion means the final state immediately — visible, never hidden,
 * never non-functional (docs/4-interaction-design.md §8). Hover colour
 * transitions (animation 8) are deliberately kept: they convey interactive
 * state and are not vestibular triggers, so they live in CSS and never pass
 * through here.
 */
export const useMotionVariants = (): UseMotionVariantsResult => {
  const prefersReducedMotion = useReducedMotion() ?? false;

  if (prefersReducedMotion) {
    return {
      fadeUp: reducedFadeUp,
      pageTransition: reducedPageTransition,
      staggerContainer: () => ({ hidden: {}, visible: {} }),
      reducedMotion: true,
    };
  }

  return {
    fadeUp,
    pageTransition,
    staggerContainer,
    reducedMotion: false,
  };
};
