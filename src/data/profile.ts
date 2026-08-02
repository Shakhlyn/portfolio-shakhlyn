import portraitSrc from '@/assets/portrait.webp';
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
 * `layout` is the hero switch (docs/4-interaction-design.md §5.1). Set to 'split'
 * now that a portrait exists; 'stacked' drops the image and the column with it,
 * and the slot reserves its space either way.
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
  // Label text from docs/3-style-preference.md §6.2 item 6.
  heroCtas: {
    resume: 'View Resume',
    contact: 'Contact',
  },
  layout: 'split',
  /**
   * Cropped from the supplied 960×960 source to the slot's locked 3:4 and
   * encoded as WebP (720×960, 36 KB against the original 102 KB). The intrinsic
   * size is twice the largest rendered box (320×427 at `xl`), so it stays sharp
   * on a 2× display without shipping more pixels than that needs.
   *
   * `src/assets/portfolio_img.jpg` is kept as the uncropped original.
   */
  portrait: {
    src: portraitSrc,
    width: 720,
    height: 960,
    alt: 'Shaokh Al Mahmud Shakhlyn',
  },
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
