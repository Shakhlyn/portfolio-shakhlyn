import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectCaseStudy } from '@/components/sections/ProjectCaseStudy';
import { ProjectHero } from '@/components/sections/ProjectHero';
import { ProjectLinks } from '@/components/sections/ProjectLinks';
import { Container } from '@/components/ui/Container';
import { getProjectBySlug } from '@/data/projects';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * The case study route, `/projects/:slug` (docs/2-architecture.md §3, §8).
 *
 * **An unknown slug renders the 404 in place — it never throws.**
 * `throw new Response(null, { status: 404 })` would be caught by this route's
 * `errorElement` and render "something went wrong", which is the wrong answer
 * for a URL that is simply not a project and is what makes a mistyped link look
 * like a crash. The URL is left untouched rather than redirected, so it stays
 * shareable and diagnosable, and rendering inside `RootLayout` keeps the header,
 * footer, rail, and theme intact for free (`2-architecture.md` §11).
 *
 * Slug validation against stable project IDs is E15's deliverable; all this
 * route needs is a lookup that is total — every input produces a page.
 */
export const ProjectPage = (): ReactElement => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) return <NotFoundPage />;

  return (
    <Container as="article" className="space-y-12 py-16 md:py-20">
      <ProjectHero project={project} />
      <ProjectCaseStudy project={project} />
      <ProjectLinks project={project} />
    </Container>
  );
};
