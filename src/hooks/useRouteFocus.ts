import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolling moves the eye, not the keyboard.
 *
 * On route change, resets scroll and moves focus to the new page's h1. Without
 * this a keyboard or screen reader user is left at the old page's position and
 * hears nothing announced — the most common serious accessibility failure in
 * SPAs (docs/2-architecture.md §8).
 *
 * Keyed on pathname only. Hash navigation is in-page and is handled by
 * useHashScroll (E07); running both would make them fight.
 */
export const useRouteFocus = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    /*
     * Wait a frame so the new route has painted and its h1 exists — a
     * setTimeout guess would race the router's commit.
     */
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });

      const target =
        document.querySelector<HTMLElement>('main h1') ??
        document.querySelector<HTMLElement>('main');

      // Falling back to <main> means focus is never simply lost.
      target?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
};
