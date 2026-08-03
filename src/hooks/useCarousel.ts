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
 * One card plus one gap, measured from the DOM rather than passed in. The card
 * width is a `calc()` that changes at two breakpoints, and a duplicated constant
 * here is how the arrow step silently stops matching the layout.
 */
const stepDistance = (track: HTMLDivElement): number => {
  const firstCard = track.firstElementChild;
  if (!firstCard) return track.clientWidth;

  const gap = Number.parseFloat(window.getComputedStyle(track).columnGap);
  return firstCard.getBoundingClientRect().width + (Number.isNaN(gap) ? 0 : gap);
};

/** Wheel intent, in px, before the track steps one card. */
const WHEEL_STEP_THRESHOLD = 40;

/**
 * How long a step owns the gesture. Without it a single trackpad flick, which
 * arrives as dozens of events, traverses every card at once.
 */
const WHEEL_STEP_COOLDOWN_MS = 260;

/** Quiet time that ends a gesture, so the next one starts from zero. */
const WHEEL_IDLE_RESET_MS = 200;

/**
 * Wheel deltas arrive in three units. Treating a line-mode delta as pixels moves
 * the track by 3px per notch on the mice that report it.
 */
const wheelPixels = (event: WheelEvent, track: HTMLDivElement): number => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE)
    return event.deltaY * track.clientWidth;
  return event.deltaY;
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

  // The wheel and key handlers are bound once, so they read the current
  // preference through a ref rather than closing over a stale first render.
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

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

    // Gesture state for the wheel handler. Plain closure variables: the effect
    // runs once, nothing renders off them, and a ref would only add ceremony.
    let wheelIntent = 0;
    let lastWheelAt = 0;
    let stepLockedUntil = 0;

    /** True when the track still has somewhere to go in `direction`. */
    const canTravel = (direction: number): boolean => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= END_TOLERANCE) return false;

      return direction < 0
        ? track.scrollLeft > 0
        : track.scrollLeft < maxScroll - END_TOLERANCE;
    };

    /**
     * Vertical wheel over the track travels sideways until the track runs out,
     * then hands the gesture back to the page.
     *
     * The documented exception to §4's no-scroll-jacking rule, and deliberately
     * the narrowest form of it: nothing is pinned, the page's scroll position is
     * never locked, and moving the pointer off the track restores normal
     * scrolling mid-gesture. The page only refuses to move while the pointer is
     * over a carousel that can still travel.
     *
     * **It steps one card per gesture rather than following the pointer**,
     * because `scroll-snap-type: x mandatory` (§6) is not negotiable with. An
     * earlier version wrote `scrollLeft += delta` and moved nothing at all: a
     * real mouse notch is ~100px and a trackpad delta ~12px, neither reaches the
     * half-card mark that decides which snap point wins, so the browser re-snapped
     * to the card it started on every time. Accumulating intent and moving a whole
     * card lands exactly on the next snap point, and the cooldown stops one flick
     * from crossing the whole set.
     *
     * Horizontal gestures are left alone — the track already scrolls natively on
     * those, and intercepting them would fight trackpad inertia for no gain.
     */
    const handleWheel = (event: WheelEvent): void => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const delta = wheelPixels(event, track);
      if (!canTravel(delta)) {
        // Hand the gesture back to the page, and forget the intent behind it so
        // returning to this track later does not inherit a stale accumulation.
        wheelIntent = 0;
        return;
      }

      // Only now, once the gesture is certain to be consumed. Calling this at
      // the ends would swallow the scroll that should leave the section.
      event.preventDefault();

      const now = performance.now();
      const directionChanged =
        wheelIntent !== 0 && Math.sign(delta) !== Math.sign(wheelIntent);
      if (now - lastWheelAt > WHEEL_IDLE_RESET_MS || directionChanged) wheelIntent = 0;
      lastWheelAt = now;

      if (now < stepLockedUntil) return;

      wheelIntent += delta;
      if (Math.abs(wheelIntent) < WHEEL_STEP_THRESHOLD) return;

      const direction = wheelIntent > 0 ? 1 : -1;
      wheelIntent = 0;
      stepLockedUntil = now + WHEEL_STEP_COOLDOWN_MS;

      track.scrollBy({
        left: direction * stepDistance(track),
        behavior: reducedMotionRef.current ? 'auto' : 'smooth',
      });
    };

    /**
     * `ArrowDown`/`ArrowUp` on a focused track step one card sideways, matching
     * §9's `←`/`→` mapping. At either end the key is left alone so it scrolls
     * the page and the visitor is never trapped in the region.
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!canTravel(direction)) return;

      event.preventDefault();
      track.scrollBy({
        left: direction * stepDistance(track),
        behavior: reducedMotionRef.current ? 'auto' : 'smooth',
      });
    };

    evaluate();
    track.addEventListener('scroll', handleScroll, { passive: true });
    // Not passive: this one has to be able to preventDefault.
    track.addEventListener('wheel', handleWheel, { passive: false });
    track.addEventListener('keydown', handleKeyDown);

    const observer = new ResizeObserver(evaluate);
    observer.observe(track);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      track.removeEventListener('wheel', handleWheel);
      track.removeEventListener('keydown', handleKeyDown);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

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
