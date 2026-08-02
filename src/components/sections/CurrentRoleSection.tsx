import { motion } from 'motion/react';
import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { VIEWPORT_ONCE } from '@/constants/motion';
import { CURRENT_ROLE } from '@/data/currentRole';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/**
 * Current Role (docs/3-style-preference.md §6.3, docs/4-interaction-design.md
 * §5.2). Sits immediately after the hero so the active engineering role is the
 * first thing read after the positioning (docs/2-architecture.md §8).
 *
 * **No eyebrow.** `Section`'s eyebrow is optional, and an optional prop is an
 * opt-in — eyebrows are wayfinding for repeated, scannable sets, and this is one
 * narrative block.
 *
 * The whole card is one reveal target (animation 2). The stack badges do not
 * stagger: §8's inventory is a closed list, row 4 covers E11's skill badges, and
 * an element the list does not name takes the default rather than inventing
 * motion for itself.
 *
 * `Card` is not `interactive` — nothing here is clickable, and a hover treatment
 * on a static surface is a false affordance.
 */
export const CurrentRoleSection = (): ReactElement => {
  const { fadeUp } = useMotionVariants();

  return (
    <Section id="current-role" title="Current Role">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <Card>
          {/* h3 because Section renders the h2. Levels are never chosen for
              visual size (docs/3-style-preference.md §3.3). */}
          <h3 className="text-h3 text-fg md:text-h3-md">
            {CURRENT_ROLE.role} ·{' '}
            <span className="font-normal text-fg-muted">{CURRENT_ROLE.company}</span>
          </h3>

          <p className="mt-1 font-mono text-body-sm text-fg-subtle">
            {CURRENT_ROLE.dateRange}
          </p>

          {CURRENT_ROLE.scope.length > 0 ? (
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-body text-fg-muted md:text-body-md">
              {CURRENT_ROLE.scope.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}

          {CURRENT_ROLE.stack.length > 0 ? (
            <ul className="mt-6 flex list-none flex-wrap gap-2">
              {CURRENT_ROLE.stack.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </motion.div>
    </Section>
  );
};
