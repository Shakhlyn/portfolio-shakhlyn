import { useEffect } from 'react';

/**
 * Locks page scroll, restoring the exact prior position on release
 * (docs/4-interaction-design.md §3).
 *
 * "Exact" is what rules out toggling `overflow: hidden` alone — iOS Safari
 * discards the scroll position under that approach. Pinning the body with a
 * negative `top` and scrolling back on release survives it.
 *
 * `overflow-y: scroll` is held during the lock so the scrollbar gutter does not
 * disappear: content shifting sideways when the menu opens is the same CLS
 * defect §4 forbids for scroll-linked effects.
 */
export const useScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflowY = 'scroll';

    // Also runs on unmount, so a route change while the sheet is open cannot
    // leave the page permanently unscrollable.
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflowY = previous.overflowY;
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    };
  }, [locked]);
};
