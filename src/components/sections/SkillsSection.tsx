import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { SkillGroup } from '@/components/sections/SkillGroup';
import { Section } from '@/components/ui/Section';
import { VIEWPORT_ONCE } from '@/constants/motion';
import { SKILL_GROUPS } from '@/data/skills';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/** Derived from the group id so it is stable across renders and inspectable. */
const labelIdFor = (groupId: string): string => `skills-${groupId}-label`;

/**
 * The capability grid a recruiter scans for keyword matches
 * (docs/3-style-preference.md §6.6, docs/4-interaction-design.md §5.5).
 *
 * Groups render in data order, all of them. The set and order live in
 * `src/data/skills.ts` and are a content decision, not a rendering one.
 *
 * **A group with no skills renders nothing at all** — not a label above an empty
 * row. Every group empty and the section itself renders `null`, the same shape
 * `ProjectsSection` uses. Unlike Projects this removes no nav item: `#skills`
 * has no nav entry (docs/4-interaction-design.md §1), so there is nothing to
 * derive and `navigation.ts` is untouched by this epic.
 *
 * Non-interactive by construction. `SkillGroupType` has no proficiency, level,
 * or rating field, which is what makes "no proficiency bars" enforceable rather
 * than a matter of restraint.
 */
export const SkillsSection = (): ReactElement | null => {
  const { fadeUp } = useMotionVariants();

  const groups = SKILL_GROUPS.filter((group) => group.skills.length > 0);
  if (groups.length === 0) return null;

  return (
    <Section id="skills" title="Skills">
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="space-y-8"
      >
        {groups.map((group) => (
          <SkillGroup
            key={group.id}
            label={group.label}
            skills={group.skills}
            labelId={labelIdFor(group.id)}
          />
        ))}
      </m.div>
    </Section>
  );
};
