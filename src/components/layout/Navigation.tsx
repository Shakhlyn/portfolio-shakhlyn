import type { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { FOCUS_RING } from '@/constants/styles';
import { NAV_ITEMS } from '@/data/navigation';
import { cn } from '@/lib/cn';

interface NavigationProps {
  /** Section id currently in view, from the scroll spy. Null off the home route. */
  activeSectionId: string | null;
  className?: string;
}

const ITEM_BASE = 'text-body-sm rounded-sm px-1 py-1 transition-colors duration-150';

/**
 * Desktop navigation, `lg` and up.
 *
 * Anchor items are plain links to `/#section`. That single form covers both
 * cases the docs require: on the home route it changes only the hash, and from
 * /writing or /resume it changes the pathname too — either way `useHashScroll`
 * resolves the scroll and focus after paint. There is deliberately no onClick
 * scroll handler, because a second code path would be a second thing that can
 * disagree with the URL.
 *
 * Blog and Resume use React Router's route-active state, never section state
 * (docs/4-interaction-design.md §3).
 */
export const Navigation = ({
  activeSectionId,
  className,
}: NavigationProps): ReactElement => (
  <nav aria-label="Main" className={className}>
    <ul className="flex items-center gap-6">
      {NAV_ITEMS.map((item) => {
        if (item.kind === 'route' && item.emphasised) {
          return (
            <li key={item.label}>
              {/* Resume leaves the page, so it looks like a different kind of action (§3). */}
              <Button href={item.path} variant="secondary" size="sm">
                {item.label}
              </Button>
            </li>
          );
        }

        if (item.kind === 'route') {
          return (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    ITEM_BASE,
                    FOCUS_RING,
                    isActive
                      ? 'border-b-2 border-accent text-fg'
                      : 'border-b-2 border-transparent text-fg-muted hover:text-fg',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          );
        }

        const isActive = activeSectionId === item.sectionId;

        return (
          <li key={item.label}>
            <Link
              to={`/#${item.sectionId}`}
              // Colour is never the sole indicator — the underline carries it too
              // (docs/3-style-preference.md §2.5).
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                ITEM_BASE,
                FOCUS_RING,
                isActive
                  ? 'border-b-2 border-accent text-fg'
                  : 'border-b-2 border-transparent text-fg-muted hover:text-fg',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);
