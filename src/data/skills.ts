import type { SkillGroupType } from '@/types/skill.types';

/**
 * Sourced from the CV. Every entry is backed by the experience or projects
 * described there — 1-prd.md §3 requires skills reflect actual experience with
 * no overclaiming, because a hiring manager who probes an overclaimed skill in
 * an interview has learned something worse than a shorter list.
 *
 * NOTE — the AI/LLM group from 1-prd.md §3 is deliberately absent. There is no
 * AI or LLM work on the CV, so there is nothing honest to put in it. See the
 * positioning note in docs/tickets/E04-status.md: either that experience needs
 * adding here once it exists, or the PRD's "full-stack and AI engineering"
 * framing needs revisiting.
 *
 * Deliberately absent everywhere: any proficiency, level, or rating field.
 */
export const SKILL_GROUPS: readonly SkillGroupType[] = [
  {
    id: 'languages',
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Bash'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      'React',
      'React Router',
      'Redux Toolkit',
      'RTK Query',
      'Tailwind CSS',
      'SCSS',
      'Bootstrap',
      'Yup',
      'jQuery',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: ['FastAPI', 'Express.js', 'Node.js', 'Jinja'],
  },
  {
    id: 'data',
    label: 'Data',
    skills: ['PostgreSQL', 'MongoDB'],
  },
  {
    id: 'tools & infrastructure',
    label: 'Tools & Infrastructure',
    skills: ['Git', 'Linux', 'Vim', 'Keycloak', 'Vite', 'npm', 'Postman'],
  },
];
