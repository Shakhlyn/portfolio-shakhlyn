import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { focusSection } from '@/lib/focusSection';
import { whenElementReady } from '@/lib/whenElementReady';

/**
 * Resolves `/#section` after paint, on mount and on hash change.
 *
 * This is "the case that breaks naively-built hybrid sites"
 * (docs/4-interaction-design.md §3): on /writing, clicking About must navigate
 * to /#about, wait for the home route to mount, and only then scroll. A direct
 * external hit on https://site/#contact must behave identically.
 *
 * Waits for the target to exist rather than for a fixed number of frames —
 * PageTransition's `mode="wait"` keeps the incoming route unmounted for the
 * length of the outgoing exit animation, so a fixed wait looks too early, finds
 * nothing, and leaves the visitor at the top of the page.
 */
export const useHashScroll = (): void => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const sectionId = hash.slice(1);

    return whenElementReady({
      find: () => document.getElementById(sectionId),
      run: () => {
        focusSection(sectionId);
      },
    });
  }, [pathname, hash]);
};
