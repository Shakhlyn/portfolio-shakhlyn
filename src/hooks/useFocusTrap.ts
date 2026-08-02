import type { RefObject } from 'react';
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps Tab within `containerRef` while active, and restores focus to whatever
 * was focused before on deactivate.
 *
 * Restoring is part of the trap because the trap is what captured focus —
 * splitting restore into the consuming component would mean two places
 * reasoning about the same focus stack, and "on close, focus returns to the
 * hamburger" (docs/4-interaction-design.md §3) is the criterion that breaks
 * when they disagree.
 *
 * 1-prd.md §5's "no keyboard traps" forbids traps with no escape. A modal trap
 * that releases on close is the required pattern, not a violation of it.
 */
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void => {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement;

    const getFocusable = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef]);
};
