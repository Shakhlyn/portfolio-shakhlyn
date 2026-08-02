import { useEffect, useState } from 'react';

/**
 * True once the page is scrolled beyond `threshold` pixels.
 *
 * The scroll listener is throttled with requestAnimationFrame:
 * docs/4-interaction-design.md §4 permits exactly two scroll-linked effects and
 * calls them "both cheap", which an unthrottled scroll handler is not.
 */
export const useScrolledPast = (threshold: number): boolean => {
  // Read synchronously so a page loaded already-scrolled (browser scroll
  // restoration, or a /#contact cold hit) never renders the wrong state first.
  const [scrolledPast, setScrolledPast] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    let frame = 0;

    const read = (): void => {
      frame = 0;
      setScrolledPast(window.scrollY > threshold);
    };

    const handleScroll = (): void => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(read);
    };

    // No synchronous read here — the useState initializer above already covers
    // mount, and calling setState in an effect body triggers a cascading render.
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolledPast;
};
