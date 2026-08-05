import { PROJECTS } from '@/data/projects';
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
export const PROJECTS_SECTION_ID = 'projects';

/**
 * `ProjectsSection` does not render when both categories are empty
 * (docs/4-interaction-design.md §5.3), and a nav item pointing at an anchor that
 * is not in the DOM is exactly the dead internal link `1-prd.md` §5 forbids. The
 * nav is data, so the requirement can only be met here — this is E10 reaching
 * into E07's data file by necessity, recorded in both epics' status files.
 *
 * Evaluated once at import: `PROJECTS` is a module constant, so this is not
 * state and never needs to re-run.
 */
const HAS_PROJECTS = PROJECTS.length > 0;

/** Drops any entry targeting `#projects` when there are no projects to show. */
const withoutEmptyProjects = (items: readonly NavItemType[]): readonly NavItemType[] =>
  HAS_PROJECTS
    ? items
    : items.filter(
        (item) => item.kind !== 'anchor' || item.sectionId !== PROJECTS_SECTION_ID,
      );

export const NAV_ITEMS: readonly NavItemType[] = withoutEmptyProjects([
  { kind: 'anchor', label: 'Home', sectionId: 'home' },
  { kind: 'anchor', label: 'Projects', sectionId: PROJECTS_SECTION_ID },
  // { kind: 'anchor', label: 'About', sectionId: 'about' },
  // { kind: 'route', label: 'Blog', path: '/writing' },
  { kind: 'anchor', label: 'Contact', sectionId: CONTACT_SECTION_ID },
  { kind: 'route', label: 'Resume', path: RESUME_ROUTE, emphasised: true },
]);

/**
 * Anchor targets the scroll spy observes, in DOM order.
 *
 * Only sections that have a nav entry belong here — #current-role and #skills
 * are part of the scan path but have no nav item
 * (docs/4-interaction-design.md §1), so highlighting nothing while they are in
 * view is correct.
 *
 * Module-level constant so its identity is stable across renders and does not
 * retrigger the observer effect.
 */
export const ANCHOR_SECTION_IDS: readonly string[] = NAV_ITEMS.filter(
  (item) => item.kind === 'anchor',
).map((item) => item.sectionId);

/**
 * Targets offered by the 404 page (docs/3-style-preference.md §6.13).
 *
 * Filtered through the same predicate as `NAV_ITEMS`: a 404 page that offers a
 * link to a section which does not exist is a dead link on the one page whose
 * entire job is recovering from one.
 */
export const NOT_FOUND_LINKS: readonly NavItemType[] = withoutEmptyProjects([
  { kind: 'route', label: 'Home', path: '/' },
  { kind: 'anchor', label: 'Projects', sectionId: PROJECTS_SECTION_ID },
  { kind: 'route', label: 'Resume', path: RESUME_ROUTE },
  { kind: 'anchor', label: 'Contact', sectionId: CONTACT_SECTION_ID },
]);
