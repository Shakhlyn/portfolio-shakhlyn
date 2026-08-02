import type { ReactElement } from 'react';

import { MoonIcon } from '@/components/ui/icons/MoonIcon';
import { SunIcon } from '@/components/ui/icons/SunIcon';
import { FOCUS_RING } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

/**
 * Lives in layout/, not ui/ — it owns theme behaviour and calls a hook, which
 * fails the components/ui bar of "dumb, reusable, no business logic"
 * (AGENTS.md §3). The sun and moon icons themselves are content-agnostic ui/.
 */
export const ThemeToggle = (): ReactElement => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      /*
       * The label describes the action, not the current state. Labelling it
       * with the state tells a screen reader user what they already have
       * rather than what the button does.
       */
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors duration-150 hover:bg-surface-hover hover:text-fg',
        FOCUS_RING,
      )}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
