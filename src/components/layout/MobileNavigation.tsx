import { m } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { MenuIcon } from '@/components/ui/icons/MenuIcon';
import { DURATION_MENU, EASE_OUT } from '@/constants/motion';
import { FOCUS_RING } from '@/constants/styles';
import { NAV_ITEMS } from '@/data/navigation';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMotionVariants } from '@/hooks/useMotionVariants';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/lib/cn';

/** `lg` — where the desktop nav and the social rail both appear (§2). */
const DESKTOP_QUERY = '(min-width: 1024px)';

const ROW_CLASSES =
  'text-body flex h-12 items-center rounded-md px-2 transition-colors duration-150';

/**
 * Hamburger and full-width sheet below `lg`.
 *
 * The sheet closes on all five triggers from docs/4-interaction-design.md §3:
 * item click, Escape, outside click, route change, and crossing `lg`. Each one
 * routes through the same `close()` so none can skip releasing the focus trap
 * or the scroll lock.
 *
 * ThemeToggle is deliberately not a sheet row — it stays in the header at every
 * width so theme works without opening the menu.
 */
export const MobileNavigation = (): ReactElement => {
  /**
   * Holds the pathname the sheet was opened on, or null when closed.
   *
   * Close triggers 4 (route change) and 5 (crossing `lg`) are *derived* from
   * that rather than run as effects: an effect calling setState synchronously
   * causes a cascading render, and "derive, don't duplicate" (AGENTS.md §5) is
   * the rule this was violating. Deriving also makes it impossible for those
   * two paths to skip releasing the focus trap or scroll lock, because both are
   * driven by the same `isOpen` value.
   */
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const { reducedMotion } = useMotionVariants();

  const isOpen = openedOnPath === pathname && !isDesktop;
  const close = (): void => setOpenedOnPath(null);

  useFocusTrap(sheetRef, isOpen);
  useScrollLock(isOpen);

  // Close triggers 2 and 3 — Escape and outside click.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpenedOnPath(null);
    };

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (sheetRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpenedOnPath(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const anchorItems = NAV_ITEMS.filter((item) => item.kind === 'anchor');
  const routeItems = NAV_ITEMS.filter(
    (item) => item.kind === 'route' && !item.emphasised,
  );
  const resumeItem = NAV_ITEMS.find((item) => item.kind === 'route' && item.emphasised);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={sheetId}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setOpenedOnPath(isOpen ? null : pathname)}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-md text-fg-muted transition-colors duration-150 hover:text-fg',
          FOCUS_RING,
        )}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {isOpen ? (
        <m.div
          ref={sheetRef}
          id={sheetId}
          // Animation 6: opacity + y −8, 200ms ease-out. Height is not animated (§3, §8).
          initial={reducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : DURATION_MENU, ease: EASE_OUT }}
          className="absolute inset-x-0 top-16 border-b border-border bg-surface shadow-lg"
        >
          <nav aria-label="Main" className="px-5 py-4 sm:px-6">
            <ul className="flex flex-col">
              {[...anchorItems, ...routeItems].map((item) => (
                <li key={item.label}>
                  {item.kind === 'anchor' ? (
                    <Link
                      to={`/#${item.sectionId}`}
                      onClick={close}
                      className={cn(
                        ROW_CLASSES,
                        'text-fg-muted hover:text-fg',
                        FOCUS_RING,
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={close}
                      className={({ isActive }) =>
                        cn(
                          ROW_CLASSES,
                          isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                          FOCUS_RING,
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            {resumeItem?.kind === 'route' ? (
              <div className="mt-3 border-t border-border pt-3">
                <Button
                  href={resumeItem.path}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  {resumeItem.label}
                </Button>
              </div>
            ) : null}

            <SocialLinks className="mt-4" />
          </nav>
        </m.div>
      ) : null}
    </div>
  );
};
