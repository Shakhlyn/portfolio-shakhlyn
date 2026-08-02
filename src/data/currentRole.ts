import type { CurrentRoleType } from '@/types/current-role.types';

/**
 * Employer, title, dates, and the substance of every bullet are from the CV and
 * are real.
 *
 * **Every number below is an invented development placeholder** and is marked
 * `TODO(content): INVENTED FIGURE`. Replace them with your real figures, or
 * delete the clause containing them — a bullet without a number is honest, a
 * bullet with a wrong one is not (`1-prd.md` §6, `AGENTS.md` §13).
 *
 *     grep -rn "INVENTED FIGURE" src/
 */
export const CURRENT_ROLE: CurrentRoleType = {
  role: 'Software Engineer',
  company: 'Penta Global Limited',
  dateRange: 'Mar 2024 — Present',
  scope: [
    // TODO(content): INVENTED FIGURE — "18-engineer", "three timezones". The
    // team, the roles, and the three countries are real.
    'Embedded with Yaana Solutions’ telecom product team as a contracted engineer on an 18-engineer product org spanning three timezones, collaborating with engineers, QA, BAs, product managers, UX designers, and technical leads across Bangladesh, India, and the US.',
    // TODO(content): INVENTED FIGURE — "~35 defects per release".
    'Primary frontend contact for BA, product, UX, and QA on feature behaviour, technical decisions, and defect resolution, triaging roughly 35 reported defects a release cycle.',
    // TODO(content): INVENTED FIGURE — "14 features across 9 releases".
    'Own features end to end — requirements clarification, implementation, production debugging, and release. Shipped 14 features across 9 releases with no rollback.',
    // TODO(content): INVENTED FIGURE — "30+ endpoints", "six internal services".
    'Backend delivery in Python and FastAPI — 30+ REST endpoints and Keycloak-based authentication and role-based authorization covering six internal services.',
  ],
  stack: [
    'TypeScript',
    'React',
    'Python',
    'FastAPI',
    'Django',
    'PostgreSQL',
    'Keycloak',
    'SCSS',
  ],
};
