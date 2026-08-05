import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { VIEWPORT_ONCE } from '@/constants/motion';
import { CURRENT_ROLE } from '@/data/currentRole';
import { PROJECTS } from '@/data/projects';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/**
 * Resolved once at module scope: `PROJECTS` and `CURRENT_ROLE` are both module
 * constants, so this is neither state nor a per-render computation.
 *
 * Unresolvable slugs are dropped rather than rendered — a link to a
 * `/projects/:slug` with no matching project resolves to the 404, and a dead
 * internal link is what `1-prd.md` §5 forbids.
 */
const CURRENT_PROJECTS = CURRENT_ROLE.projectSlugs.flatMap((slug) => {
  const project = PROJECTS.find((candidate) => candidate.slug === slug);
  return project ? [project] : [];
});

/**
 * Currently (docs/3-style-preference.md §6.3, docs/4-interaction-design.md
 * §5.2). Sits immediately after the hero so the active role is the first thing
 * read after the positioning (docs/2-architecture.md §8).
 *
 * **This is a status panel, not a résumé entry** (RV-T01). It answers the two
 * questions nothing else on the page answers where a scanner will find them:
 * where the author is now, and whether they are available. It carries no
 * achievement claims — every one it used to carry was already made, in more
 * detail, by `projects.ts` or `about.ts`, and a claim made three times reads
 * worse than one made once.
 *
 * The heading is "Currently" rather than "Current Role" so the section reads as
 * present state rather than history. The `id` stays `current-role`: it is a
 * public hash and `navigation.ts` names it, so renaming buys nothing.
 *
 * **No eyebrow.** `Section`'s eyebrow is optional, and an optional prop is an
 * opt-in — eyebrows are wayfinding for repeated, scannable sets, and this is one
 * block.
 *
 * The whole card is one reveal target (animation 2). Nothing inside it staggers:
 * §8's inventory is a closed list, and an element the list does not name takes
 * the default rather than inventing motion for itself.
 *
 * `Card` is not `interactive` — it contains links, and a hover treatment on the
 * surface around them is both a false affordance and invalid nesting.
 */
export const CurrentRoleSection = (): ReactElement => {
  const { fadeUp } = useMotionVariants();

  return (
    <Section id="current-role" title="Currently">
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <Card>
          {/* h3 because Section renders the h2. Levels are never chosen for
              visual size (docs/3-style-preference.md §3.3). */}
          {/* Each date range sits beside the organisation it belongs to, so the
              two are read as a pair rather than as one range covering both. The
              employer's range rides in the h3 alongside the employer; the
              placement's rides on the line below alongside the placement.

              The range is a mono `body-sm` span inside the heading, not heading
              text at heading size: it wraps under the name at 320px instead of
              pushing the h3 to three lines, and it keeps the dates visually
              identical across the two lines. */}
          <h3 className="text-h3 text-fg md:text-h3-md">
            {CURRENT_ROLE.role} ·{' '}
            <span className="font-normal text-fg-muted">{CURRENT_ROLE.company}</span>{' '}
            <span className="font-mono text-body-sm font-normal text-fg-subtle">
              · {CURRENT_ROLE.companyDateRange}
            </span>
          </h3>

          <p className="mt-1 font-mono text-body-sm text-fg-subtle">
            Embedded with {CURRENT_ROLE.client} · {CURRENT_ROLE.clientDateRange}
          </p>

          <p className="mt-4 max-w-content text-body text-fg-muted md:text-body-md">
            {CURRENT_ROLE.summary}
          </p>

          {CURRENT_ROLE.stack.length > 0 ? (
            <ul className="mt-6 flex list-none flex-wrap gap-2">
              {CURRENT_ROLE.stack.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 border-t border-border pt-6">
            {/* Keeps the treatment this line had in About — `fg` against the
                surrounding `fg-muted`, accent rule — because it is still the one
                sentence a reader can act on. Only its location changed. */}
            <p className="border-l-2 border-accent pl-4 text-body text-fg md:text-body-md">
              {CURRENT_ROLE.availability}
            </p>

            {CURRENT_PROJECTS.length > 0 ? (
              <div className="mt-6">
                <p className="font-mono text-eyebrow text-fg-subtle uppercase">
                  What I built here
                </p>

                {/* flex-wrap rather than a grid: at 320px the buttons stack
                    instead of forcing the card wider than the viewport. */}
                <ul className="mt-3 flex list-none flex-wrap gap-2">
                  {CURRENT_PROJECTS.map((project) => (
                    <li key={project.id}>
                      <Button
                        href={`/projects/${project.slug}`}
                        variant="secondary"
                        size="sm"
                      >
                        {project.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Card>
      </m.div>
    </Section>
  );
};
