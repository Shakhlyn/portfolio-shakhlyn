import { useEffect, useState } from 'react';

/**
 * Tracks a media query. Needed because the mobile sheet closes when the
 * viewport crosses `lg` (docs/4-interaction-design.md §3), which requires
 * observing the breakpoint rather than reading it once.
 */
export const useMediaQuery = (query: string): boolean => {
  // Read synchronously so the first render is already correct — a false initial
  // value that corrects a frame later would flash the wrong navigation.
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // No synchronous read here — the useState initializer already covers mount.
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};
