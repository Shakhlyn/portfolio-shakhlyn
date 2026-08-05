import portraitSrc from '@/assets/portrait.webp';
import portraitSrc400 from '@/assets/portrait-400.webp';
import type { ProfileType } from '@/types/profile.types';

/**
 * Names, titles, and links are from the CV and are real.
 *
 * **This file now carries no figures at all**, invented or otherwise. The two
 * placeholders it used to hold left with the long value proposition in RV-T02,
 * and the year counts went with them for being stale rather than invented — see
 * the note on `valueProposition` below. The marker string is deliberately not
 * written out here: `grep -rn` for it across `src/` is the E18 deploy gate, and
 * a mention in a comment reports this file as still carrying one.
 *
 * The employer is **not** named in this file either. The Currently panel names
 * it once, with a placement and dates attached (RV-T02).
 *
 * `layout` is the hero switch (docs/4-interaction-design.md §5.1). Set to 'split'
 * now that a portrait exists; 'stacked' drops the image and the column with it,
 * and the slot reserves its space either way.
 */
export const PROFILE: ProfileType = {
  name: 'Shaokh Al Mahmud Shakhlyn',
  wordmark: 'Shakhlyn',
  // Technologies are CV-true; only the framing is broadened from the bare title.
  roleFraming: 'Full-stack Engineer — TypeScript, React, Python, FastAPI, PostgreSQL, MongoDB',
  eyebrow: 'Dhaka, Bangladesh',
  /*
   * One sentence, and deliberately about *how* rather than *where*: the
   * Currently panel one screen below carries the employer, the placement, the
   * dates, and what the current work is (RV-T02). The employer name appears
   * once on this page, and it is not here.
   *
   * **No year count.** The previous copy claimed "2.5 years of experience" and
   * "nearly 2 years" at the current employer; `CURRENT_ROLE.companyDateRange`
   * starts Mar 2024, so the current role alone has since outgrown both. They were
   * true when written and went stale in place. A replacement is the author's to
   * supply — inventing one is exactly what AGENTS.md §13 forbids, and the panel's
   * date ranges are a real tenure signal in the meantime.
   */
  valueProposition:
    'I own features end to end — from clarifying what a requirement actually asks for, through shipping it, to supporting it in production.',
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
    /*
     * The slot is 200px wide below `lg` and 320px at `xl`, so a phone at 2× DPR
     * needs 400px and never 720. The narrow variant is 11 KB against 32 KB, and
     * it is the one a phone actually downloads.
     */
    srcSet: `${portraitSrc400} 400w, ${portraitSrc} 720w`,
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
