import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { ContactForm } from '@/components/sections/ContactForm';
import { Section } from '@/components/ui/Section';
import { VIEWPORT_ONCE } from '@/constants/motion';
import { CONTACT } from '@/data/contact';
import { CONTACT_EMAIL } from '@/data/profile';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/**
 * Contact (docs/3-style-preference.md §6.8, docs/4-interaction-design.md §5.7).
 *
 * Two columns at `lg` — form 60%, direct links 40% — stacked below with the
 * form first.
 *
 * Animation 2 and nothing more: one reveal for the whole block. The fields are
 * not named in the §8 inventory, so they take the closed-list default and get
 * no child orchestration (docs/4-interaction-design.md §8).
 *
 * `Section` already owns the anchor, `scroll-mt-20`, the `h2`, and the
 * `Container`; nothing here wraps the children in a second one.
 */
export const ContactSection = (): ReactElement => {
  const { fadeUp } = useMotionVariants();

  return (
    <Section id="contact" title="Contact">
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="grid gap-10 lg:grid-cols-5 lg:gap-12"
      >
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-h3 font-semibold text-fg">{CONTACT.directHeading}</h3>

          <p className="mt-3 text-body-sm text-fg-muted">{CONTACT.directDescription}</p>

          {/*
            The address as real, selectable characters — not an icon, not a
            label reading "Email me", not assembled at runtime. A recruiter must
            be able to drag-select and copy it. The anchor is a convenience on
            top of that; the text is the requirement (5-epic-list.md E13).
          */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-block text-body break-all text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-150 hover:decoration-accent focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            {CONTACT_EMAIL}
          </a>

          <SocialLinks className="mt-6" />
        </div>
      </m.div>
    </Section>
  );
};
