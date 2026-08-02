import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { whenElementReady } from '@/lib/whenElementReady';

/**
 * Scrolling moves the eye, not the keyboard.
 *
 * On route change, resets scroll and moves focus to the new page's h1. Without
 * this a keyboard or screen reader user is left at the old page's position and
 * hears nothing announced — the most common serious accessibility failure in
 * SPAs (docs/2-architecture.md §8).
 */
export const useRouteFocus = (): void => {
  const { pathname, hash } = useLocation();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    const isFirstRender = previousPathRef.current === null;
    previousPathRef.current = pathname;

    /*
     * Nothing to manage on first load: the browser has already positioned the
     * document, and focus legitimately starts at the top. Forcing a scroll here
     * would also fight browser scroll restoration and native hash resolution.
     */
    if (isFirstRender) return;

    /*
     * The hash wins when one is present. Arriving at /#about from /writing is a
     * pathname change too, so both this hook and useHashScroll would fire —
     * and this one resets scroll to top, which would land a cross-route anchor
     * at the top of the home page. That is precisely the bug E07 exists to
     * prevent, so it is resolved explicitly rather than left to effect order.
     */
    if (hash) return;

    /*
     * The outgoing page is still mounted while PageTransition's mode="wait"
     * plays its exit animation, so `main h1` matches the *old* heading for the
     * first ~200ms. Focusing that one and then watching it unmount drops focus
     * to <body> — the exact failure this hook exists to prevent.
     *
     * Capturing the outgoing node and waiting for a different one is what makes
     * the wait mean "the new page has mounted" rather than "an h1 exists".
     */
    const outgoingHeading = document.querySelector<HTMLElement>('main h1');

    return whenElementReady({
      find: () => {
        const heading = document.querySelector<HTMLElement>('main h1');
        return heading && heading !== outgoingHeading ? heading : null;
      },
      run: (heading) => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        heading.focus({ preventScroll: true });
      },
      // Falling back to <main> means focus is never simply lost.
      onTimeout: () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
      },
    });
  }, [pathname, hash]);
};
