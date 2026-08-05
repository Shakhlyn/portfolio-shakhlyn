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
    "I'm a software engineer with 2.5 years of experience. For nearly 2 years, I've been working on an enterprise platform" +
    " serving telecom operators, where I've built two large modules and worked deep in the ones I inherited " +
    '— fixing defects and tracing issues through unfamiliar code. I own features end to end, from clarifying the requirement to supporting it in production.',
  currentPositionRole: 'Software Engineer',
  currentPositionCompany: 'Penta Global Limited',
  // Label text from docs/3-style-preference.md §6.2 item 6.
  heroCtas: {
    resume: 'View Resume',
    contact: "Let's Talk",
  },
  layout: 'split',
  /**
   * Cropped from the supplied 960×960 source to the slot's locked 3:4 and
   * encoded as WebP (720×960, 36 KB against the original 102 KB). The intrinsic
   * size is twice the largest rendered box (320×427 at `xl`), so it stays sharp
   * on a 2× display without shipping more pixels than that needs.
   *
   * The uncropped 960×960 original is not committed — nothing imported it, so
   * it was 102 KB of repository weight that never reached `dist/`. Recover it
   * with `git show 528ecb3:src/assets/portfolio_img.jpg` if the crop ever needs
   * redoing; the 3:4 ratio above is the part worth keeping written down.
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
    x: 'https://x.com/Shakhlyn',
  },
};

/** Rendered as selectable text in the contact section, so it is copyable without JS. */
export const CONTACT_EMAIL = 'shakhlyn.sh.du@gmail.com';
