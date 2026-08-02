import type { ProfileType } from '@/types/profile.types';

/**
 * Sourced from the CV. Everything here is real.
 *
 * `portrait` is deliberately absent — text-only is the launch default. Adding
 * the field is the entire hero-layout switch (docs/4-interaction-design.md §5.1).
 */
export const PROFILE: ProfileType = {
  name: 'Shaokh Al Mahmud Shakhlyn',
  roleFraming: 'Software Engineer',
  eyebrow: 'Dhaka, Bangladesh',
  valueProposition:
    'Software engineer with 2+ years building enterprise web applications on distributed international teams. I own features end to end — from clarifying the requirement to shipping the release.',
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
