import { useCallback, useEffect, useState } from 'react';

import { DARK_CLASS, PREFERS_DARK_QUERY, THEME_STORAGE_KEY } from '@/constants/theme';
import type { Theme } from '@/types/theme.types';

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Reads the theme the pre-paint script already resolved, rather than
 * re-resolving from localStorage. Re-resolving invites the two to disagree.
 */
const readAppliedTheme = (): Theme =>
  document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';

const hasStoredPreference = (): boolean => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    // localStorage throws in Safari private mode and some embedded webviews.
    return false;
  }
};

export const useTheme = (): UseThemeResult => {
  const [theme, setTheme] = useState<Theme>(readAppliedTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Persistence is best-effort; the session still works without it.
    }
  }, [theme]);

  useEffect(() => {
    const query = window.matchMedia(PREFERS_DARK_QUERY);

    const handleChange = (event: MediaQueryListEvent): void => {
      /*
       * Follow the OS only while the visitor has never made an explicit choice.
       * Following it afterwards would override the user, which is worse than
       * not following it at all.
       */
      if (hasStoredPreference()) return;

      setTheme(event.matches ? 'dark' : 'light');
    };

    query.addEventListener('change', handleChange);

    return () => {
      query.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = useCallback((): void => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
};
