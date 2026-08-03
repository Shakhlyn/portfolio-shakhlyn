import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import type { ProjectType } from '@/types/project.types';

interface ProjectHeroProps {
  project: ProjectType;
}

/**
 * The head of a case study page (docs/3-style-preference.md §6.10).
 *
 * `h1` here, not `h4`: this is a page, not a card
 * (docs/2-architecture.md §8 project page plan). `tabIndex={-1}` is what
 * `useRouteFocus` moves focus to on route change.
 *
 * The image is above the fold on this route, so it is never `loading="lazy"` —
 * the same reasoning as the hero portrait, and the exact inverse of the card's
 * treatment of the same asset.
 */
export const ProjectHero = ({ project }: ProjectHeroProps): ReactElement => (
  <header>
    <h1
      tabIndex={-1}
      className="text-h1 text-fg focus-visible:outline-none md:text-h1-md"
    >
      {project.title}
    </h1>

    <p className="mt-3 max-w-content text-body-lg text-fg-muted md:text-body-lg-md">
      {project.summary}
    </p>

    <ul className="mt-6 flex flex-wrap gap-2">
      {project.stack.map((item) => (
        <li key={item}>
          <Badge>{item}</Badge>
        </li>
      ))}
    </ul>

    {project.image ? (
      <div className="mt-8 overflow-hidden rounded-lg bg-surface-hover">
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          fetchPriority="high"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      </div>
    ) : null}
  </header>
);
