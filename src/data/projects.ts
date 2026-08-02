import type { ProjectCategory, ProjectType } from '@/types/project.types';

/**
 * Sourced from the CV. Five projects: three professional, two personal.
 *
 * Ordered by relevance to full-stack roles — array order is render order, there
 * is no sort at render time.
 *
 * Link policy: only links that genuinely exist are present. Client work has no
 * public repository or demo, so `githubUrl` and `liveUrl` are omitted rather
 * than pointed at a placeholder — an empty or dead link is worse than no button
 * (docs/2-architecture.md §11). Every project carries a `caseStudySlug`, so
 * each card always has one real destination.
 *
 * TODO(content): screenshots. `image` is omitted everywhere, so cards render
 * without an image frame — no grey placeholder box ships
 * (docs/3-style-preference.md §6.4).
 */
export const PROJECTS: readonly ProjectType[] = [
  {
    id: 'deal-summary-comparison',
    slug: 'deal-summary-comparison',
    title: 'Deal Summary & Comparison',
    summary:
      'The telecom platform’s first deal summary and comparison view, collapsing data previously spread across multiple tabs into one screen.',
    category: 'professional',
    problem:
      'Deal data was spread across multiple tabs, and comparing two deals meant opening them side by side on two screens and reading them against each other by hand. The work was slow, error-prone, and impossible to do at volume.',
    role: 'Primary frontend contact, owning delivery from requirements clarification through release — the direct interface to BA, product, UX, and QA on feature behaviour, technical decisions, and defect resolution.',
    approach:
      'Designed a reusable, configuration-driven table framework with dynamic columns, composable renderers, and cell-level customization, so complex comparison behaviour needed no third-party dependency. On top of it, built a Statement Comparison engine that normalizes nested datasets, splits mixed inbound/outbound records into direction-specific rows, supports separate and combined views, and surfaces deltas through row-level filtering and value-level highlighting.',
    stack: ['TypeScript', 'React', 'Django', 'REST APIs', 'Jinja', 'SCSS'],
    outcome:
      'Cut deal review time by roughly 50% and comparison effort by roughly 95%. The table framework became reusable across the product rather than a one-off.',
    tags: ['TypeScript', 'React', 'Django', 'REST APIs', 'SCSS'],
    caseStudySlug: 'deal-summary-comparison',
  },
  {
    id: 'data-slicing',
    slug: 'data-slicing',
    title: 'Data Slicing',
    summary:
      'A config-driven form validation engine and a set of create/edit workflows for a telecom data platform.',
    category: 'professional',
    problem:
      'Form validation was being rewritten per form, and the product needed create/edit workflows complex enough — conditional fields, dynamic multi-row inputs, uploads — that duplicating validation logic each time would not hold.',
    role: 'Frontend engineer, owning the validation engine and the create/edit workflows built on it.',
    approach:
      'Built a configuration-driven input-validation engine reusable across any React form by declaring per-field rules, with live and blur validation, touched-state tracking, and row-level errors in dynamic multi-row forms — no third-party dependency added. Developed the workflows on top: conditional fields, searchable and multi-select inputs, image previews, multipart uploads, and add/remove multi-row forms.',
    stack: ['TypeScript', 'React', 'SCSS', 'REST APIs', 'jQuery'],
    outcome:
      'One validation engine replaced per-form logic across the feature set, so new forms declare rules instead of reimplementing them.',
    tags: ['TypeScript', 'React', 'REST APIs', 'SCSS'],
    caseStudySlug: 'data-slicing',
  },
  {
    id: 'bhoganti-web-app',
    slug: 'bhoganti-web-app',
    title: 'Bhoganti Web App',
    summary:
      'Internal product: REST API backend with FastAPI and PostgreSQL, plus Keycloak authentication across the API and React client.',
    category: 'professional',
    problem:
      'An internal product needed a backend with proper schemas and an authentication and authorization model that held consistently across both the API and the client.',
    role: 'Backend engineer, delivering the API and the auth model.',
    approach:
      'Built REST APIs with FastAPI and PostgreSQL, defining schemas and request/response models. Implemented Keycloak-based authentication and role-based authorization across backend endpoints and the React client, so permissions were enforced server-side rather than merely hidden in the UI.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Keycloak', 'React'],
    outcome:
      'Shipped as the product’s API and auth layer, with role-based access enforced consistently on both sides.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Keycloak'],
    caseStudySlug: 'bhoganti-web-app',
  },
  {
    id: 'meal-management-system',
    slug: 'meal-management-system',
    title: 'Meal Management System',
    summary:
      'Full-stack meal booking system with day-wise scheduling, server-side cancellation cutoffs, and an automated nightly booking cycle.',
    category: 'personal',
    problem:
      'Meal booking needed day-wise scheduling with a hard cancellation cutoff. Enforcing the cutoff in the UI alone would have left it trivially bypassable, and the daily reset was manual work nobody should be doing.',
    role: 'Sole engineer — full stack, from schema to UI.',
    approach:
      'Built the booking flow with React, TypeScript, and RTK Query against an Express and MongoDB backend, with JWT authentication and bcrypt-hashed credentials. Cancellation cutoffs are enforced server-side. A scheduled job automates the nightly cycle, locking submissions past the cutoff and resetting the dashboard for the next day.',
    stack: [
      'React',
      'TypeScript',
      'RTK Query',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'JWT',
    ],
    outcome:
      'The nightly cycle runs unattended, and the cutoff cannot be bypassed from the client because it is enforced on the server.',
    tags: ['React', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
    caseStudySlug: 'meal-management-system',
    // TODO(content): add githubUrl once the repository is public.
  },
  {
    id: 'linux-setup-tooling',
    slug: 'linux-setup-tooling',
    title: 'Developer Tooling & Automation',
    summary:
      'A modular Linux setup system of ~19 distro-aware scripts, plus supporting CLI utilities for local workflows.',
    category: 'personal',
    problem:
      'Setting up a new Linux machine meant repeating the same install steps by hand, and the steps differ between Debian-based distros and Fedora. Re-running a half-finished setup script usually made things worse rather than better.',
    role: 'Sole author.',
    approach:
      'Built a modular setup system of roughly 19 scripts with distro-aware installers for Debian-based distros and Fedora, using idempotent operations so a re-run is safe, and explicit failure handling so a broken step stops rather than silently continuing. Added CLI utilities for local workflows, including a PDF-to-audio conversion pipeline and media download/extraction tooling.',
    stack: ['Bash', 'Python', 'Linux'],
    outcome:
      'A new machine is provisioned by running the scripts rather than by following a checklist, and a re-run is safe by design.',
    tags: ['Bash', 'Python', 'Linux'],
    githubUrl: 'https://github.com/Shakhlyn/linux-setup-script',
    caseStudySlug: 'linux-setup-tooling',
  },
];

export const getProjectsByCategory = (category: ProjectCategory): ProjectType[] =>
  PROJECTS.filter((project) => project.category === category);

export const getProjectBySlug = (slug: string): ProjectType | undefined =>
  PROJECTS.find((project) => project.slug === slug);
