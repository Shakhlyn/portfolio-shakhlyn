import type { ReactElement } from 'react';

import { ProjectCarousel } from '@/components/sections/ProjectCarousel';
import { Section } from '@/components/ui/Section';
import { getProjectsByCategory } from '@/data/projects';
import type { ProjectCategory } from '@/types/project.types';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
}

/** Professional first, then Personal (docs/4-interaction-design.md §5.3). */
const GROUPS: readonly ProjectGroup[] = [
  { category: 'professional', title: 'Professional' },
  { category: 'personal', title: 'Personal' },
];

/**
 * One `h2`, two `h3` subsections (docs/2-architecture.md §8,
 * docs/4-interaction-design.md §5.3).
 *
 * This is **grouping, not filtering** — one data file, one type, split by the
 * `category` discriminator, with no filter controls anywhere
 * (docs/2-architecture.md §12).
 *
 * Both groups are computed during render. Two `filter` passes over a
 * single-digit array is not a reason to reach for `useMemo`; wrapping it would
 * be the reflexive memoisation `AGENTS.md` §5 warns about.
 *
 * An empty category renders nothing at all — no heading, no empty track. Both
 * empty and the section itself does not render, which is also what removes its
 * nav item (`src/data/navigation.ts`).
 */
export const ProjectsSection = (): ReactElement | null => {
  const groups = GROUPS.map((group) => ({
    ...group,
    projects: getProjectsByCategory(group.category),
  })).filter((group) => group.projects.length > 0);

  if (groups.length === 0) return null;

  return (
    <Section id="projects" title="Projects" eyebrow="Work">
      {groups.map((group, index) => (
        <ProjectCarousel
          key={group.category}
          title={group.title}
          projects={group.projects}
          className={index > 0 ? 'mt-12' : undefined}
        />
      ))}
    </Section>
  );
};
