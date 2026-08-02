import type { ProfileType } from '@/types/profile.types';

/**
 * Names, titles, employer, and links are from the CV and are real.
 *
 * **Some figures in this file are invented development placeholders.** Every one
 * is marked `TODO(content): INVENTED FIGURE`. They exist so the hero reads at
 * its intended density during development, and they are NOT shippable:
 * `1-prd.md` §6 lists fabricated metrics as unacceptable at launch, and
 * `AGENTS.md` §13 forbids inventing them at all. Find every one before launch:
 *
 *     grep -rn "INVENTED FIGURE" src/
 *
 * `portrait` is deliberately absent — the `split` layout's slot reserves its
 * space without it (docs/4-interaction-design.md §5.1).
 */
export const PROFILE: ProfileType = {
  name: 'Shaokh Al Mahmud Shakhlyn',
  wordmark: 'Shakhlyn',
  // Technologies are CV-true; only the framing is broadened from the bare title.
  roleFraming: 'Full-stack Engineer — TypeScript, React, Python',
  eyebrow: 'Dhaka, Bangladesh',
  // TODO(content): INVENTED FIGURE — "40,000 deals", "three continents". The
  // distributed team and the end-to-end ownership are real; the scale is not.
  valueProposition:
    'Software engineer with 2+ years building enterprise web applications that move 40,000+ deals a month for telecom operators, on teams spanning three continents. I own features end to end — from clarifying the requirement to shipping the release and debugging it in production.',
  currentPositionRole: 'Software Engineer',
  currentPositionCompany: 'Penta Global Limited',
  social: {
    email: 'mailto:shakhlyn.sh.du@gmail.com',
    linkedin: 'https://linkedin.com/in/shakhlyn',
    github: 'https://github.com/shakhlyn',
    // No X/Twitter on the CV. Omitted rather than guessed — the rail and
    // SocialLinks render only links that exist.
  },
};

/** Rendered as selectable text in the contact section, so it is copyable without JS. */
export const CONTACT_EMAIL = 'shakhlyn.sh.du@gmail.com';
