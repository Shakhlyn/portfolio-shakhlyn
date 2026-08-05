import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { Section } from '@/components/ui/Section';
import { VIEWPORT_ONCE } from '@/constants/motion';
import { ABOUT } from '@/data/about';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/**
 * The career narrative (docs/3-style-preference.md §6.5,
 * docs/4-interaction-design.md §5.4).
 *
 * Static prose and nothing else — no accordion, no "read more", no portrait.
 * Every sentence comes from `src/data/about.ts`; none is written here.
 *
 * **No closing line.** `lookingFor` used to end this section with an accent
 * rule, because it was the one sentence here a reader could act on. It moved to
 * the Currently panel as `CURRENT_ROLE.availability` (RV-T01): the rule existed
 * to rescue an actionable sentence from a weak position, and the bottom of the
 * page — below Projects and Skills — was the weak position.
 *
 * Animation 2 and nothing more: one reveal for the whole block. The paragraphs
 * are not orchestrated — §8 is a closed list, and an element it does not name
 * animates with its parent (docs/4-interaction-design.md §8).
 *
 * No eyebrow. `Section`'s eyebrow is an opt-in for repeated scannable sets, and
 * §6.5 does not ask for one.
 */
export const AboutSection = (): ReactElement => {
  const { fadeUp } = useMotionVariants();

  return (
    <Section id="about" title="About">
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="max-w-content"
      >
        <div className="space-y-4 md:space-y-5">
          {ABOUT.paragraphs.map((paragraph, index) => (
            // Index key: `paragraphs` is a `string[]` with no id, and it is a
            // module constant that is never reordered, filtered, or appended to
            // at runtime — the static-list exception in AGENTS.md §5.
            <p key={index} className="text-body text-fg-muted md:text-body-md">
              {paragraph}
            </p>
          ))}
        </div>
      </m.div>
    </Section>
  );
};
