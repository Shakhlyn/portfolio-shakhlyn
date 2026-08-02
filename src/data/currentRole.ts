import type { CurrentRoleType } from '@/types/current-role.types';

/** Sourced from the CV. Real employer, title, dates, and scope. */
export const CURRENT_ROLE: CurrentRoleType = {
  role: 'Software Engineer',
  company: 'Penta Global Limited',
  dateRange: 'Mar 2024 — Present',
  scope: [
    'Embedded with Yaana Solutions’ telecom product team as a contracted engineer, collaborating with engineers, QA, BAs, product managers, UX designers, and technical leads across Bangladesh, India, and the US.',
    'Primary frontend contact for BA, product, UX, and QA on feature behaviour, technical decisions, and defect resolution.',
    'Own features end to end — requirements clarification, implementation, production debugging, and release.',
    'Backend delivery in Python and FastAPI, including REST API design and Keycloak-based authentication and role-based authorization.',
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
