import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useMotionVariants } from '@/hooks/useMotionVariants';

interface CarouselState {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  hasOverflow: boolean;
}

interface UseCarouselResult extends CarouselState {
  trackRef: RefObject<HTMLDivElement | null>;
  scrollPrev: () => void;
  scrollNext: () => void;
}

/**
 * Absorbs sub-pixel rounding. Without it the right arrow stays enabled at the
 * true end, because `scrollLeft` lands on 1247.5 against a 1248 maximum
 * (docs/4-interaction-design.md §6).
 */
const END_TOLERANCE = 1;

const INITIAL: CarouselState = {
  canScrollPrev: false,
  canScrollNext: false,
  hasOverflow: false,
};

/**
 * Scroll position and arrow state for one carousel track
 * (docs/2-architecture.md §6, docs/4-interaction-design.md §6).
 *
 * One `evaluate()` derives all three flags from one set of measurements, called
 * from three places: mount, the scroll listener, and the resize observer. A
 * single reader is why the flags cannot disagree with each other.
 *
 * Resize re-evaluation uses a **`ResizeObserver` on the track**, not a
 * `window.resize` listener. A window listener misses every change that alters
 * the track's width without altering the viewport's — browser zoom, font-size
 * changes, the mobile nav sheet opening — and arrows that lie after any of those
 * are the failure this hook exists to prevent.
 */
export const useCarousel = (): UseCarouselResult => {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState<CarouselState>(INITIAL);
  const { reducedMotion } = useMotionVariants();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const evaluate = (): void => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const next: CarouselState = {
        hasOverflow: maxScroll > END_TOLERANCE,
        canScrollPrev: track.scrollLeft > 0,
        canScrollNext: track.scrollLeft < maxScroll - END_TOLERANCE,
      };

      // Scroll fires far faster than paint; bail out when nothing changed so a
      // drag does not re-render the section on every frame.
      setState((prev) =>
        prev.hasOverflow === next.hasOverflow &&
        prev.canScrollPrev === next.canScrollPrev &&
        prev.canScrollNext === next.canScrollNext
          ? prev
          : next,
      );
    };

    const handleScroll = (): void => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        evaluate();
      });
    };

    evaluate();
    track.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new ResizeObserver(evaluate);
    observer.observe(track);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

  /**
   * One card plus one gap, measured from the DOM rather than passed in. The card
   * width is a `calc()` that changes at two breakpoints, and a duplicated
   * constant here is how the arrow step silently stops matching the layout.
   */
  const stepDistance = (track: HTMLDivElement): number => {
    const firstCard = track.firstElementChild;
    if (!firstCard) return track.clientWidth;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap);
    return firstCard.getBoundingClientRect().width + (Number.isNaN(gap) ? 0 : gap);
  };

  const scrollByCard = (direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * stepDistance(track),
      // Animation 9 becomes an instant jump under reduced motion (§8).
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return {
    ...state,
    trackRef,
    scrollPrev: () => scrollByCard(-1),
    scrollNext: () => scrollByCard(1),
  };
};
