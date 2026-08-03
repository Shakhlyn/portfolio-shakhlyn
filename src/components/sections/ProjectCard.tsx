import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ProjectType } from '@/types/project.types';

interface ProjectCardProps {
  project: ProjectType;
}

/** Beyond this, the remainder collapses into a single `+N` badge (§6.4). */
const MAX_VISIBLE_TAGS = 5;

/**
 * `Button`'s `lg` size (48px) below `md`, its `sm` size (32px) from `md` up.
 *
 * §6.4 specifies `sm` card buttons, but §5.1 marks `sm` desktop-only because
 * 32px fails the 44x44px touch minimum that §11 and `1-prd.md` §5 both require.
 * The two rules disagree only where a card is touched, so the size is resolved
 * per breakpoint rather than one rule being ignored. Applied as an override on
 * `size="lg"` rather than by teaching `Button` responsive sizes: `Button` is
 * E05's primitive and a card is not reason enough to change its API.
 */
const CARD_BUTTON_CLASSES = 'md:h-8 md:px-3 md:text-body-sm';

/**
 * One project in a carousel track (docs/3-style-preference.md §6.4,
 * docs/4-interaction-design.md §6).
 *
 * **Neither the card nor its title is a link.** Every destination is a named
 * button, so nothing interactive nests inside an anchor and the visitor can see
 * where each control goes before clicking it
 * (docs/4-interaction-design.md §10 row 10).
 *
 * `Card` is used without `interactive` for the same reason: that prop means "one
 * tab stop, the whole surface is the target", which this is not. The background
 * and border hover below group the card under the pointer without the lift,
 * which would promise a click the card as a whole does not accept.
 *
 * `h4`, because the subsection heading above it is an `h3`. Levels are never
 * chosen for size (§3.3).
 */
export const ProjectCard = ({ project }: ProjectCardProps): ReactElement => {
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  const hasLinks = Boolean(project.caseStudySlug ?? project.githubUrl ?? project.liveUrl);

  return (
    <Card className="flex h-full flex-col transition-colors duration-150 hover:border-accent/30 hover:bg-surface-hover">
      {/* Omitted entirely when absent — no grey placeholder box ships (§6.4). */}
      {project.image ? (
        <div className="mb-4 overflow-hidden rounded-lg bg-surface-hover">
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            /* Below the fold, the exact inverse of the hero portrait. Explicit
               dimensions plus the locked ratio keep this at zero CLS. */
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : null}

      <h4 className="text-h3 text-fg md:text-h3-md">{project.title}</h4>

      {/* Clamping is a paint-level truncation: the full text stays in the
          accessibility tree and in the DOM. */}
      <p className="mt-2 line-clamp-2 text-body-sm text-fg-muted md:text-body-sm-md">
        {project.summary}
      </p>

      {visibleTags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
          {hiddenTagCount > 0 ? (
            <li>
              <Badge variant="neutral">{`+${hiddenTagCount}`}</Badge>
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* `mt-auto` pins the row to the bottom so buttons align across a track of
          equal-height cards with unequal copy. */}
      {hasLinks ? (
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.caseStudySlug ? (
            <Button
              href={`/projects/${project.slug}`}
              variant="secondary"
              size="lg"
              className={CARD_BUTTON_CLASSES}
            >
              Case study
            </Button>
          ) : null}

          {project.githubUrl ? (
            <Button
              href={project.githubUrl}
              external
              variant="secondary"
              size="lg"
              className={CARD_BUTTON_CLASSES}
            >
              GitHub
            </Button>
          ) : null}

          {project.liveUrl ? (
            <Button
              href={project.liveUrl}
              external
              variant="secondary"
              size="lg"
              className={CARD_BUTTON_CLASSES}
            >
              Live
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
};
