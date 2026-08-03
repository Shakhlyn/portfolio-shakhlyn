import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/Badge';

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
 */
export const SkillGroup = ({ label, skills, labelId }: SkillGroupProps): ReactElement => (
  <div>
    {/* Matches Section's eyebrow treatment exactly (§4.2, §6.6) — the same role
        styled two ways on one page would read as an accident. */}
    <p id={labelId} className="font-mono text-eyebrow text-accent uppercase">
      {label}
    </p>

    <ul role="list" aria-labelledby={labelId} className="mt-3 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill}>
          <Badge>{skill}</Badge>
        </li>
      ))}
    </ul>
  </div>
);
