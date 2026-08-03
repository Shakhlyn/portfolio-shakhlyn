import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import type { ProjectType } from '@/types/project.types';

interface ProjectCaseStudyProps {
  project: ProjectType;
}

/**
 * The case study body: Problem → Approach → Stack → Outcome, in that fixed order
 * (docs/2-architecture.md §8, docs/3-style-preference.md §6.10). The order never
 * varies by project — it is the order a hiring manager reads in, and a page that
 * reorders it makes two case studies incomparable.
 *
 * `Links` is a sibling, not part of this component, because it is the one
 * section that can be absent.
 *
 * The candidate's `role` is rendered with Problem rather than under a heading of
 * its own: `1-prd.md` §6 requires it on every project, and the five-heading plan
 * is fixed at five.
 */
export const ProjectCaseStudy = ({ project }: ProjectCaseStudyProps): ReactElement => (
  <>
    <section aria-labelledby="project-problem-heading">
      <h2 id="project-problem-heading" className="text-h2 text-fg md:text-h2-md">
        Problem
      </h2>
      <p className="mt-4 max-w-content text-body text-fg-muted md:text-body-md">
        {project.problem}
      </p>
      <p className="mt-4 max-w-content text-body-sm text-fg-subtle md:text-body-sm-md">
        <span className="text-fg-muted">Role:</span> {project.role}
      </p>
    </section>

    <section aria-labelledby="project-approach-heading">
      <h2 id="project-approach-heading" className="text-h2 text-fg md:text-h2-md">
        Approach
      </h2>
      <p className="mt-4 max-w-content text-body text-fg-muted md:text-body-md">
        {project.approach}
      </p>
    </section>

    <section aria-labelledby="project-stack-heading">
      <h2 id="project-stack-heading" className="text-h2 text-fg md:text-h2-md">
        Stack
      </h2>
      {/* Badges, not prose: `stack` is the full list, where the card's `tags`
          are the scannable subset. */}
      <ul className="mt-4 flex max-w-content flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="project-outcome-heading">
      <h2 id="project-outcome-heading" className="text-h2 text-fg md:text-h2-md">
        Outcome
      </h2>
      <p className="mt-4 max-w-content text-body text-fg-muted md:text-body-md">
        {project.outcome}
      </p>
    </section>
  </>
);
