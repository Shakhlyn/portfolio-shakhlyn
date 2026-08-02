import type { NavItemType } from '@/types/navigation.types';

/**
 * The six nav items from docs/4-interaction-design.md §1, in scroll order.
 *
 * Order must mirror DOM order. A nav whose order disagrees with the page order
 * makes the scroll-spy indicator appear to jump backwards, which reads as a bug.
 *
 * This is the single source of truth for nav targets — no component hardcodes
 * a section id or a route path.
 */
export const NAV_ITEMS: readonly NavItemType[] = [
  { kind: 'anchor', label: 'Home', sectionId: 'home' },
  { kind: 'anchor', label: 'Projects', sectionId: 'projects' },
  { kind: 'anchor', label: 'About', sectionId: 'about' },
  { kind: 'route', label: 'Blog', path: '/writing' },
  { kind: 'anchor', label: 'Contact', sectionId: 'contact' },
  { kind: 'route', label: 'Resume', path: '/resume', emphasised: true },
];

/** Targets offered by the 404 page (docs/3-style-preference.md §6.13). */
export const NOT_FOUND_LINKS: readonly NavItemType[] = [
  { kind: 'route', label: 'Home', path: '/' },
  { kind: 'anchor', label: 'Projects', sectionId: 'projects' },
  { kind: 'route', label: 'Resume', path: '/resume' },
  { kind: 'anchor', label: 'Contact', sectionId: 'contact' },
];
