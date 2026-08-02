import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { NAV_CLICK_SUPPRESS_MS, SCROLL_SPY_ROOT_MARGIN } from '@/constants/site';

/**
 * Scroll spy driving the active nav item (docs/4-interaction-design.md §3).
 *
 * Suppression is keyed off `location.hash`, not off a callback from the click
 * handler: §4 states every nav click updates the URL hash, so the hash change
 * *is* the nav-click signal. That keeps this hook fully decoupled from
 * Navigation — no shared refs, no prop threading.
 *
 * Suppression works by *overriding* rather than by pausing the observer. The
 * observer keeps updating `spyId` in the background during the window; the
 * override simply wins while it lasts, so when it expires `spyId` is already
 * correct and there is no catch-up frame where the wrong item is lit.
 *
 * @param sectionIds Anchor targets in DOM order. Only ids that have a nav entry
 *   belong here — #current-role, #skills, and #resume have no nav item (§1).
 * @param enabled False off the home route. The spy "runs only on the home
 *   route" (§3), so no observer is constructed elsewhere at all.
 */
export const useActiveSection = (
  sectionIds: readonly string[],
  enabled: boolean,
): string | null => {
  const [spyId, setSpyId] = useState<string | null>(null);
  const [override, setOverride] = useState<string | null>(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const sectionId = hash.slice(1);

    // Sections passed through during a smooth scroll must not flicker the
    // indicator, so the clicked item wins for ~700ms after the click (§3).
    const frame = requestAnimationFrame(() => setOverride(sectionId));
    const timer = setTimeout(() => setOverride(null), NAV_CLICK_SUPPRESS_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [hash]);

  useEffect(() => {
    if (!enabled) return;

    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }

        // Topmost wins when several sections intersect (§3). sectionIds is in
        // DOM order, so the first match is the topmost.
        const topmost = sectionIds.find((id) => intersecting.has(id));

        // When nothing intersects — scrolling through #current-role or #skills,
        // which have no nav entry — keep the previous item active rather than
        // clearing every item.
        if (topmost) setSpyId(topmost);
      },
      { rootMargin: SCROLL_SPY_ROOT_MARGIN },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled, sectionIds]);

  if (!enabled) return null;

  return override ?? spyId;
};
