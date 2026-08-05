import { m } from 'motion/react';
import type { ReactElement } from 'react';

import { ProjectCard } from '@/components/sections/ProjectCard';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { STAGGER_CARDS, STAGGER_MAX_TOTAL, VIEWPORT_ONCE } from '@/constants/motion';
import { FOCUS_RING } from '@/constants/styles';
import { useCarousel } from '@/hooks/useCarousel';
import { useMotionVariants } from '@/hooks/useMotionVariants';
import { cn } from '@/lib/cn';
import type { ProjectType } from '@/types/project.types';

interface ProjectCarouselProps {
  /** Subsection heading, and the noun in both arrow labels. */
  title: string;
  projects: readonly ProjectType[];
  className?: string;
}

/**
 * Card width for 1.15 / 2.15 / 3 cards per view, from `c = (100% - k·g) / n`
 * where `g` is the `gap-6` (1.5rem) track gap and `k = ⌈n⌉ - 1`.
 *
 * The fraction is the point, not a rounding artefact: a partially visible next
 * card is the clearest signal that more exists sideways, where a row of
 * exactly-fitting cards reads as a finished grid nobody scrolls
 * (docs/4-interaction-design.md §6). Arbitrary values because no token
 * expresses a fractional card width (docs/3-style-preference.md §9).
 */
const CARD_WIDTH_CLASSES =
  'w-[calc((100%-1.5rem)/1.15)] md:w-[calc((100%-3rem)/2.15)] xl:w-[calc((100%-3rem)/3)]';

/**
 * The track bleeds to the viewport edge **below `sm` only**.
 *
 * `Container` is not symmetric — it carries `sm:pl-14 lg:pl-14 xl:pl-8` to clear
 * the fixed social rail — so a symmetric negative margin anywhere from `sm` to
 * `lg` would overhang the left viewport edge and produce horizontal scroll on
 * the *page*, which the Definition of Done forbids at every width. Below `sm`
 * the rail is hidden and the gutter is a symmetric 20px, so `-mx-5` restores
 * exactly viewport width and cannot exceed it.
 *
 * `scroll-px-5` keeps the first card's leading edge on the container gutter and
 * stops a card focused by Tab from landing flush against the edge (§6).
 */
const TRACK_BLEED_CLASSES = '-mx-5 scroll-px-5 px-5 sm:mx-0 sm:scroll-px-0 sm:px-0';

/** 36px round ghost arrow with a hairline border (§6.4). */
const ARROW_CLASSES = 'h-9 w-9 rounded-full border border-border p-0';

/**
 * One project group: an `h3`, its arrows, and its own scroll-snapped track
 * (docs/4-interaction-design.md §5.3, §6).
 *
 * **One component, two instances.** Each owns its own `useCarousel`, so the two
 * carousels share no state and scrolling one never moves the other.
 *
 * The track is `role="region"` + `tabindex="0"` so it is reachable and arrow
 * keys scroll it natively — no key handler of our own. The outer wrapper is a
 * plain `div` rather than a second labelled `section`, which would register a
 * duplicate landmark around the same content.
 *
 * Motion is animation 3: each subsection reveals when *it* enters view, with its
 * own stagger. One cascade across both groups would hold the second group's
 * content behind the first group's animation (§8).
 */
export const ProjectCarousel = ({
  title,
  projects,
  className,
}: ProjectCarouselProps): ReactElement => {
  const { trackRef, canScrollPrev, canScrollNext, hasOverflow, scrollPrev, scrollNext } =
    useCarousel();
  const { fadeUp, staggerContainer } = useMotionVariants();

  // Cap the stagger, not the card count: 10 cards at 60ms is 600ms of waiting.
  const stagger = Math.min(
    STAGGER_CARDS,
    STAGGER_MAX_TOTAL / Math.max(projects.length, 1),
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h3 text-fg md:text-h3-md">{title}</h3>

        {/* Hidden below `md`, where swipe is the natural gesture, and hidden
            entirely when nothing overflows — a permanently disabled pair of
            arrows is a worse signal than no arrows at all (§6). */}
        {hasOverflow ? (
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                ARROW_CLASSES,
                !canScrollPrev && 'pointer-events-none opacity-50',
              )}
              aria-label={`Previous ${title.toLowerCase()} projects`}
              aria-disabled={!canScrollPrev}
              /* `pointer-events-none` does not block the keyboard, so the
                 handler must no-op too or Enter still scrolls. `aria-disabled`
                 rather than `disabled` keeps the control in the tab order and
                 announced, instead of silently vanishing. */
              onClick={canScrollPrev ? scrollPrev : undefined}
            >
              <ChevronLeftIcon width={16} height={16} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                ARROW_CLASSES,
                !canScrollNext && 'pointer-events-none opacity-50',
              )}
              aria-label={`Next ${title.toLowerCase()} projects`}
              aria-disabled={!canScrollNext}
              onClick={canScrollNext ? scrollNext : undefined}
            >
              <ChevronRightIcon width={16} height={16} />
            </Button>
          </div>
        ) : null}
      </div>

      <m.div
        ref={trackRef}
        role="region"
        /* Two carousels on one page cannot share a label, and the count comes
           from the data rather than a hardcoded number (§6). */
        aria-label={`${title} projects, ${projects.length} items`}
        tabIndex={0}
        variants={staggerContainer(stagger)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className={cn(
          /* `relative` is load-bearing, not cosmetic. `overflow-x-auto` does not
             clip absolutely positioned descendants unless the scroller is also
             their containing block, and every external button in a card carries
             an absolutely positioned `sr-only` "(opens in a new tab)" span. A
             card scrolled out of view therefore pushed those 1px spans past the
             viewport and gave the *page* 69px of horizontal scroll at 1440. */
          'relative mt-6 scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto',
          TRACK_BLEED_CLASSES,
          FOCUS_RING,
        )}
      >
        {projects.map((project) => (
          <m.div
            key={project.id}
            variants={fadeUp}
            className={cn('flex-none snap-start', CARD_WIDTH_CLASSES)}
          >
            <ProjectCard project={project} />
          </m.div>
        ))}
      </m.div>
    </div>
  );
};
