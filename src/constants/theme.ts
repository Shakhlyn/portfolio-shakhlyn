/**
 * localStorage key for the theme preference.
 *
 * The pre-paint inline script in index.html mirrors this literal — it runs
 * before any module loads and so cannot import it. Change one, change both.
 */
export const THEME_STORAGE_KEY = 'portfolio-theme';

export const DARK_CLASS = 'dark';

export const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';
