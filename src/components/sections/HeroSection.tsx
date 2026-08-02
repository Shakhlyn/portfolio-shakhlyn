import { motion } from 'motion/react';
import type { ReactElement } from 'react';

import { SocialLinks } from '@/components/layout/SocialLinks';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CONTACT_ANCHOR, RESUME_ROUTE } from '@/data/navigation';
import { PROFILE } from '@/data/profile';
import { useMotionVariants } from '@/hooks/useMotionVariants';

/**
 * The hero (docs/4-interaction-design.md §5.1, docs/3-style-preference.md §6.2).
 *
 * Not the `Section` primitive: that renders an `h2` and the standard rhythm,
 * while the hero needs the page's single `h1` and §4.2's documented exception
 * rhythm. It therefore owns its own `<section>` and `Container`.
 *
 * Three things here are load-bearing for E07's navigation and must not be
 * removed: `id="home"` is what the scroll spy observes, `scroll-mt-20` keeps the
 * anchored jump clear of the fixed h-16 header, and `tabIndex={-1}` on the `h1`
 * is what `focusSection` moves keyboard focus to.
 *
 * **One component, two layouts**, chosen by `PROFILE.layout`. The content stack
 * is built once and rendered by both branches, so the two cannot drift apart the
 * moment the copy changes.
 */

/**
 * The `split` layout's portrait slot. Aspect-ratio-locked at 3:4 so it reserves
 * its exact final box whether or not an image is in it — which is what let the
 * seam ship before the photograph existed, and what makes the portrait
 * contribute zero CLS now that it has landed.
 *
 * The widths are the exact values §6.2 specifies — 200px capped on mobile, 280px
 * at `lg`, 320px at `xl` — which is why they step outside §4.1's spacing subset.
 * The 3:4 ratio is an arbitrary value because no token expresses aspect ratios.
 */
// `shrink-0` is load-bearing: as a flex child the slot otherwise shrinks below
// its declared width (measured 233px against a specified 280px at `lg`), which
// would make the reserved box a lie and reintroduce the CLS the lock prevents.
const PORTRAIT_SLOT_CLASSES =
  'aspect-[3/4] w-50 shrink-0 rounded-lg bg-surface-hover lg:order-2 lg:w-70 xl:w-80';

export const HeroSection = (): ReactElement => {
  const { fadeUp } = useMotionVariants();

  const content = (
    <>
      <p className="font-mono text-eyebrow text-accent uppercase">{PROFILE.eyebrow}</p>

      {/* The h1 is the name alone. The positioning below it is a sibling, and the
          keyword work belongs in <title> / meta (docs/2-architecture.md §8). */}
      <h1
        tabIndex={-1}
        className="mt-3 text-display text-fg focus-visible:outline-none md:text-display-md"
      >
        {PROFILE.name}
      </h1>

      <p className="mt-3 text-body-lg text-fg md:text-body-lg-md">
        {PROFILE.roleFraming}
      </p>

      <p className="mt-4 max-w-content text-body-lg text-fg-muted md:text-body-lg-md">
        {PROFILE.valueProposition}
      </p>

      <p className="mt-4 text-body text-fg md:text-body-md">
        {PROFILE.currentPositionRole} ·{' '}
        <span className="font-medium">{PROFILE.currentPositionCompany}</span>
      </p>

      {/* Wraps rather than shrinking: both stay ≥44px tall at 320px (§11). */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href={RESUME_ROUTE} size="lg">
          {PROFILE.heroCtas.resume}
        </Button>
        <Button href={CONTACT_ANCHOR} variant="secondary" size="lg">
          {PROFILE.heroCtas.contact}
        </Button>
      </div>

      {/* Below `sm` only, where the social rail is hidden. A CSS breakpoint, not
          a useMediaQuery branch — these links must not wait on hydration. */}
      <SocialLinks className="mt-8 sm:hidden" />
    </>
  );

  return (
    <section id="home" className="scroll-mt-20 pt-24 pb-16 md:pt-32 md:pb-24">
      <Container>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          {PROFILE.layout === 'split' ? (
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Slot first in DOM: it leads on mobile, and `lg:order-2` moves it
                  right of the text from `lg` up. */}
              <div className={PORTRAIT_SLOT_CLASSES}>
                {PROFILE.portrait ? (
                  <img
                    src={PROFILE.portrait.src}
                    alt={PROFILE.portrait.alt}
                    width={PROFILE.portrait.width}
                    height={PROFILE.portrait.height}
                    /* Above the fold, so never `loading="lazy"` — this is the
                       one image on the site that must not wait its turn. The
                       source is pre-cropped to the slot's 3:4, so `object-cover`
                       only absorbs sub-pixel rounding. The dark-mode border
                       keeps a light-background photo from floating as a bright
                       rectangle (docs/3-style-preference.md §7). */
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full rounded-lg object-cover dark:border dark:border-border"
                  />
                ) : null}
              </div>
              <div className="lg:order-1">{content}</div>
            </div>
          ) : (
            <div className="max-w-content">{content}</div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
