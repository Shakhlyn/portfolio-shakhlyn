/**
 * Scrolls a section into view and moves keyboard focus to its heading.
 *
 * "Scrolling moves the eye, not the keyboard" (docs/4-interaction-design.md §4).
 * Without the focus move, a keyboard user who activates a nav anchor is left at
 * the top of the document — the most common serious failure in one-page sites.
 *
 * `preventScroll` matters: a scroll is already in flight from scrollIntoView,
 * and focusing without it would queue a second, competing scroll.
 *
 * Smooth behaviour is inherited from `scroll-behavior` on `html`, which is
 * already disabled under prefers-reduced-motion in src/styles/index.css — so
 * there is deliberately no motion branch here.
 *
 * Returns false when the id does not resolve, so callers can decide what to do
 * instead of failing silently.
 */
export const focusSection = (sectionId: string): boolean => {
  const section = document.getElementById(sectionId);

  if (!section) return false;

  section.scrollIntoView();

  // Sections carry tabIndex={-1} on their heading (Section primitive, E05-T03).
  const heading = section.querySelector<HTMLElement>('h1, h2') ?? section;
  heading.focus({ preventScroll: true });

  return true;
};
