import type { CurrentRoleType } from '@/types/current-role.types';

/**
 * The page's one present-tense block (docs/3-style-preference.md §6.3). It
 * answers where the author is now and whether they are available — not what
 * they have built, which is what Projects is for.
 *
 * **Everything here is author-confirmed and carries no figures.** The four
 * invented-figure placeholders that used to live in this file were deleted with
 * the scope bullets that held them (RV-T01), and none was replaced: every claim
 * they made is already made, with real detail, by `projects.ts`.
 *
 * The marker string itself is deliberately not written above — `grep -rn` for it
 * across `src/` is the E18 deploy gate, and a mention in a comment would report
 * this file as still carrying one.
 *
 * `company` is the employer and `client` is the placement. They are two facts —
 * Penta employs the author, Yaana is the team the current work happens with.
 */
export const CURRENT_ROLE: CurrentRoleType = {
  role: 'Software Engineer',
  company: 'Penta Global Limited',
  client: 'Yaana Solutions',
  companyDateRange: 'Mar 2024 — Present',
  clientDateRange: 'Oct 2024 — Present',
  summary:
    "Embedded with Yaana Solutions' telecom product team, collaborating with engineers, technical leads, BAs, product managers, UX designers, and QA across Asia, Europe, and North America. I built two large modules and still own both — shipping customer-requested features and improvements to them — while fixing bugs across modules I inherited from others.",
  stack: ['TypeScript', 'React', 'jQuery', 'Python', 'Django', 'Jinja', 'SCSS'],
  availability:
    'I am looking for full-stack engineering roles where I can own features end to end and work close to the people deciding what gets built.',
  /**
   * The two modules built at the Yaana placement and still owned.
   *
   * `bhoganti-web-app` is deliberately absent. It is earlier Penta work,
   * finished before the embedding began — naming it under "Currently" would
   * present completed work as ongoing. It keeps its card in Projects, which is
   * where finished work belongs. Do not "fix" this omission.
   */
  projectSlugs: ['deal-summary-comparison', 'data-slicing'],
};
