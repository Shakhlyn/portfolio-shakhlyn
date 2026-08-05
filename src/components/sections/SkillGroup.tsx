import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';
import { STAGGER_BADGES, STAGGER_MAX_TOTAL } from '@/constants/motion';
import { useMotionVariants } from '@/hooks/useMotionVariants';

interface SkillGroupProps {
  /** Capability name, e.g. "Frontend". */
  label: string;
  skills: readonly string[];
  /** DOM id given to the label so the list can reference it. Must be unique. */
  labelId: string;
}

/**
 * One capability group (docs/3-style-preference.md §6.6).
 *
 * **The label is a label, not a heading.** docs/2-architecture.md §8 fixes the
 * home page outline with no `h3` level under Skills: six more headings would sit
 * in the outline a screen reader user pages through to reach Contact, and a
 * heading still could not say how large each group is. A labelled list announces
 * both — "Frontend, list, 9 items" — which is the fact a scanner actually wants.
 *
 * `role="list"` is **not** redundant with the `ul`. The Tailwind reset removes
 * `list-style`, and Safari with VoiceOver drops list semantics from any list
 * whose `list-style` is `none`. Without the attribute this group announces
 * neither its name nor its count, which is the whole point of the pattern. Do
 * not delete it as noise.
 *
 * Prop-driven and content-agnostic: it never imports from `@/data/`
 * (AGENTS.md §3).
 *
 * **Animation 4 lives here, but its trigger does not.** §8 gives the trigger as
 * the *parent section* reveal and the spacing as 40ms, and the rules below that
 * table cap total stagger *per group* at ~300ms. Those combine one way only: the
 * section owns the single `whileInView`, so all groups begin together, and each
 * group owns its own `staggerContainer`, so the cap applies per group. Flattening
 * every badge under one container would force the spacing to ~8ms — an animation
 * that runs and communicates nothing. This list therefore has no `whileInView` of
 * its own; it inherits the `visible` label from the section.
 */
export const SkillGroup = ({ label, skills, labelId }: SkillGroupProps): ReactElement => {
  const { badgeFadeUp, staggerContainer } = useMotionVariants();

  // Frontend ships nine skills; at a flat 40ms that group alone would run 360ms
  // and breach the cap. Same guard ProjectCarousel applies to cards.
  const stagger = Math.min(
    STAGGER_BADGES,
    STAGGER_MAX_TOTAL / Math.max(skills.length, 1),
  );

  return (
    <div>
      {/* Matches Section's eyebrow treatment exactly (§4.2, §6.6) — the same role
          styled two ways on one page would read as an accident. */}
      <p id={labelId} className="font-mono text-eyebrow text-accent uppercase">
        {label}
      </p>

      <m.ul
        role="list"
        aria-labelledby={labelId}
        variants={staggerContainer(stagger)}
        className="mt-3 flex flex-wrap gap-2"
      >
        {skills.map((skill) => (
          <m.li key={skill} variants={badgeFadeUp}>
            <Badge>{skill}</Badge>
          </m.li>
        ))}
      </m.ul>
    </div>
  );
};
