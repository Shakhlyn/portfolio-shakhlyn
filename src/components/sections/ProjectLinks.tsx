import type { ReactElement } from 'react';

import { Button } from '@/components/ui/Button';
import type { ProjectType } from '@/types/project.types';

interface ProjectLinksProps {
  project: ProjectType;
}

/**
 * The case study's `Links` section (docs/3-style-preference.md §6.10).
 *
 * **Renders nothing — heading included — when the project has neither a
 * repository nor a live URL** (docs/4-interaction-design.md §10 row 11). Most of
 * this work is client software behind a customer login, so a retained heading
 * would resolve to an apology on the majority of project pages, and a heading
 * that introduces nothing costs the reader attention for no return.
 *
 * `caseStudySlug` is deliberately absent from this list: it is how the visitor
 * arrived at this page, not somewhere else they can go.
 */
export const ProjectLinks = ({ project }: ProjectLinksProps): ReactElement | null => {
  if (!project.githubUrl && !project.liveUrl) return null;

  return (
    <section aria-labelledby="project-links-heading">
      <h2 id="project-links-heading" className="text-h2 text-fg md:text-h2-md">
        Links
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {project.githubUrl ? (
          <Button href={project.githubUrl} external variant="secondary">
            GitHub
          </Button>
        ) : null}

        {project.liveUrl ? (
          <Button href={project.liveUrl} external variant="secondary">
            Live
          </Button>
        ) : null}
      </div>
    </section>
  );
};
