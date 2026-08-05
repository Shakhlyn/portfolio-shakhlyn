import placeholderRecipeApi from '@/assets/projects/placeholder-recipe-api.webp';
import placeholderRecipeApi640 from '@/assets/projects/placeholder-recipe-api-640.webp';
import placeholderReportingDashboard from '@/assets/projects/placeholder-reporting-dashboard.webp';
import placeholderReportingDashboard640 from '@/assets/projects/placeholder-reporting-dashboard-640.webp';
import placeholderTaskRunner from '@/assets/projects/placeholder-task-runner.webp';
import placeholderTaskRunner640 from '@/assets/projects/placeholder-task-runner-640.webp';
import { assertValidProjectSlugs } from '@/lib/validateProjects';
import type { ProjectCategory, ProjectType } from '@/types/project.types';

/**
 * Five real projects from the CV — three professional, two personal — plus three
 * placeholder entries added in E10-T02 and marked below.
 *
 * Ordered by relevance to full-stack roles — array order is render order, there
 * is no sort at render time.
 *
 * Link policy: only links that genuinely exist are present. Client work has no
 * public repository or demo, so `githubUrl` and `liveUrl` are omitted rather
 * than pointed at a placeholder — an empty or dead link is worse than no button
 * (docs/2-architecture.md §11). Every real project carries a `caseStudySlug`, so
 * each of their cards has one real destination; the placeholders deliberately
 * vary, including one with no links at all, so the card's no-button-row path is
 * exercised.
 *
 * TODO(content): real screenshots. `image` is present only on the placeholder
 * entries, so the real projects' cards render with no image frame at all — no
 * grey placeholder box ships (docs/3-style-preference.md §6.4).
 *
 * **Outcome figures marked `TODO(content): INVENTED FIGURE` are development
 * placeholders**, added so the cards read at their intended density. They are
 * not shippable (`1-prd.md` §6, `AGENTS.md` §13). The ~50% / ~95% figures on
 * Deal Summary & Comparison are the exception — those are from the CV and are
 * real, which is why they carry no marker.
 *
 * **Entries marked `TODO(content): PLACEHOLDER PROJECT` are not real projects.**
 * They exist so each category overflows a 3-up track at `xl`, without which the
 * carousel's arrow states and its hidden-when-nothing-overflows behaviour are
 * indistinguishable from a broken build (E10-T02). Their titles are prefixed
 * "Placeholder —" so they cannot be mistaken for a claim while on screen, and
 * they carry the only screenshots in the file: attaching a generated image to a
 * real client project would assert a UI that is not that product's.
 *
 *     grep -rnE "INVENTED FIGURE|PLACEHOLDER PROJECT|PLACEHOLDER SCREENSHOT" src/
 *
 * All three markers are a hard deploy gate in `5-epic-list.md` E18.
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
    // TODO(content): INVENTED FIGURE — "20+ forms", "~70% less". The engine
    // replacing per-form logic is real; the counts are not.
    outcome:
      'One validation engine replaced per-form logic across 20+ forms, so new forms declare rules instead of reimplementing them — roughly 70% less validation code per new form.',
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
    // TODO(content): INVENTED FIGURE — "40+ endpoints", "p95 under 150ms",
    // "five roles". Shipping as the API and auth layer is real.
    outcome:
      'Shipped as the product’s API and auth layer — 40+ endpoints serving at a p95 under 150ms, with five roles enforced consistently on both sides.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Keycloak'],
    caseStudySlug: 'bhoganti-web-app',
  },
  // TODO(content): PLACEHOLDER PROJECT — not real work. Replace or delete
  // before launch; gated in 5-epic-list.md E18.
  {
    id: 'placeholder-reporting-dashboard',
    slug: 'placeholder-reporting-dashboard',
    title: 'Placeholder — Reporting Dashboard',
    summary:
      'Placeholder entry used to exercise the carousel. Replace this with a real project before launch.',
    category: 'professional',
    problem:
      'Placeholder copy. This entry exists so the professional carousel overflows a three-card track and its arrow states can be verified.',
    role: 'Placeholder.',
    approach:
      'Placeholder copy. Nothing here describes real work, and no figure in this entry is a claim.',
    stack: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'Redis',
      'Playwright',
    ],
    outcome: 'Placeholder copy. No outcome is claimed.',
    // Seven tags, deliberately: the card shows five plus a `+N` badge.
    tags: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'Redis',
      'Playwright',
    ],
    githubUrl: 'https://github.com/Shakhlyn',
    liveUrl: 'https://example.com',
    caseStudySlug: 'placeholder-reporting-dashboard',
    // TODO(content): PLACEHOLDER SCREENSHOT — generated, not a product shot.
    image: {
      src: placeholderReportingDashboard,
      srcSet: `${placeholderReportingDashboard640} 640w, ${placeholderReportingDashboard} 1280w`,
      width: 1280,
      height: 720,
      alt: 'Placeholder screenshot for the reporting dashboard entry',
    },
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
    // TODO(content): INVENTED FIGURE — "~250 bookings a week", "six months",
    // "zero missed resets". The unattended cycle and server-side cutoff are real.
    outcome:
      'The nightly cycle has run unattended for six months across roughly 250 bookings a week with zero missed resets, and the cutoff cannot be bypassed from the client because it is enforced on the server.',
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
    // TODO(content): INVENTED FIGURE — "~10 minutes", "a half-day". The ~19
    // scripts, the idempotency, and the two distro families are real.
    outcome:
      'A new machine is provisioned in about 10 minutes by running the scripts rather than in a half-day of following a checklist, and a re-run is safe by design.',
    tags: ['Bash', 'Python', 'Linux'],
    githubUrl: 'https://github.com/Shakhlyn/linux-setup-script',
    caseStudySlug: 'linux-setup-tooling',
  },
  // TODO(content): PLACEHOLDER PROJECT — not real work. Replace or delete
  // before launch; gated in 5-epic-list.md E18.
  {
    id: 'placeholder-task-runner',
    slug: 'placeholder-task-runner',
    title: 'Placeholder — CLI Task Runner',
    summary:
      'Placeholder entry used to exercise the carousel. Replace this with a real project before launch.',
    category: 'personal',
    problem:
      'Placeholder copy. This entry exists so the personal carousel overflows a three-card track.',
    role: 'Placeholder.',
    approach: 'Placeholder copy. Nothing here describes real work.',
    stack: ['Go', 'Cobra', 'Linux'],
    outcome: 'Placeholder copy. No outcome is claimed.',
    tags: ['Go', 'Linux'],
    // No caseStudySlug: exercises the card rendering a repository button alone.
    githubUrl: 'https://github.com/Shakhlyn',
    // TODO(content): PLACEHOLDER SCREENSHOT — generated, not a product shot.
    image: {
      src: placeholderTaskRunner,
      srcSet: `${placeholderTaskRunner640} 640w, ${placeholderTaskRunner} 1280w`,
      width: 1280,
      height: 720,
      alt: 'Placeholder screenshot for the CLI task runner entry',
    },
  },
  // TODO(content): PLACEHOLDER PROJECT — not real work. Replace or delete
  // before launch; gated in 5-epic-list.md E18.
  {
    id: 'placeholder-recipe-api',
    slug: 'placeholder-recipe-api',
    title: 'Placeholder — Recipe API',
    summary:
      'Placeholder entry with no links at all, so the card can be verified rendering no button row.',
    category: 'personal',
    problem:
      'Placeholder copy. This entry has no case study, no repository, and no demo.',
    role: 'Placeholder.',
    approach: 'Placeholder copy. Nothing here describes real work.',
    stack: ['Python', 'FastAPI', 'SQLite'],
    outcome: 'Placeholder copy. No outcome is claimed.',
    tags: ['Python', 'FastAPI'],
    // TODO(content): PLACEHOLDER SCREENSHOT — generated, not a product shot.
    image: {
      src: placeholderRecipeApi,
      srcSet: `${placeholderRecipeApi640} 640w, ${placeholderRecipeApi} 1280w`,
      width: 1280,
      height: 720,
      alt: 'Placeholder screenshot for the recipe API entry',
    },
  },
];

/*
 * Development-time only. This data is hand-edited, and a duplicate or malformed
 * slug shows up as a case study that quietly renders the 404 — the dev server is
 * where you are standing when you introduce it.
 *
 * It is *not* also enforced at build. The specified call site, the Vite plugin's
 * `buildStart`, cannot work: `vite.config.ts` is bundled by esbuild, which has
 * no loader for the `.webp` imports above, so importing this module fails the
 * config load outright. Recorded in E15-tickets.md T07 and E15-status.md §3.
 */
if (import.meta.env.DEV) {
  assertValidProjectSlugs(PROJECTS);
}

export const getProjectsByCategory = (category: ProjectCategory): ProjectType[] =>
  PROJECTS.filter((project) => project.category === category);

export const getProjectBySlug = (slug: string): ProjectType | undefined =>
  PROJECTS.find((project) => project.slug === slug);
