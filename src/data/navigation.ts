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
/**
 * Targets shared by the nav and by CTAs elsewhere on the page — the hero's two
 * buttons, and later the resume section. Exported so a second consumer links to
 * the same destination rather than retyping the path
 * (docs/2-architecture.md §11).
 */
export const RESUME_ROUTE = '/resume';
export const CONTACT_SECTION_ID = 'contact';
export const CONTACT_ANCHOR = `/#${CONTACT_SECTION_ID}`;

export const NAV_ITEMS: readonly NavItemType[] = [
  { kind: 'anchor', label: 'Home', sectionId: 'home' },
  { kind: 'anchor', label: 'Projects', sectionId: 'projects' },
  { kind: 'anchor', label: 'About', sectionId: 'about' },
  { kind: 'route', label: 'Blog', path: '/writing' },
  { kind: 'anchor', label: 'Contact', sectionId: CONTACT_SECTION_ID },
  { kind: 'route', label: 'Resume', path: RESUME_ROUTE, emphasised: true },
];

/**
 * Anchor targets the scroll spy observes, in DOM order.
 *
 * Only sections that have a nav entry belong here — #current-role, #skills, and
 * #resume are part of the scan path but have no nav item
 * (docs/4-interaction-design.md §1), so highlighting nothing while they are in
 * view is correct.
 *
 * Module-level constant so its identity is stable across renders and does not
 * retrigger the observer effect.
 */
export const ANCHOR_SECTION_IDS: readonly string[] = NAV_ITEMS.filter(
  (item) => item.kind === 'anchor',
).map((item) => item.sectionId);

/** Targets offered by the 404 page (docs/3-style-preference.md §6.13). */
export const NOT_FOUND_LINKS: readonly NavItemType[] = [
  { kind: 'route', label: 'Home', path: '/' },
  { kind: 'anchor', label: 'Projects', sectionId: 'projects' },
  { kind: 'route', label: 'Resume', path: '/resume' },
  { kind: 'anchor', label: 'Contact', sectionId: 'contact' },
];
