# E06 — Motion Foundation · Status

Tickets: [E06-motion-foundation.md](E06-motion-foundation.md) · Overview: [STATUS.md](STATUS.md)

**4 / 4 written. 2 need manual browser verification.** Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                                     | Status | Notes                                     |
| ------- | ----------------------------------------- | ------ | ----------------------------------------- |
| E06-T01 | Motion tokens and shared variants         | ✅     |                                           |
| E06-T02 | Reduced-motion wrapper                    | 🔍     | Needs the OS reduced-motion check         |
| E06-T03 | `PageTransition`                          | 🔍     | Needs the timing and focus-ordering check |
| E06-T04 | Smooth scroll with reduced-motion opt-out | ✅     |                                           |

## Files

```
src/constants/motion.ts                     durations, easings, stagger, viewport
src/lib/motion.ts                           fadeUp, staggerContainer, pageTransition
                                            + reduced-motion equivalents
src/hooks/useMotionVariants.ts              the single reduced-motion check
src/components/layout/PageTransition.tsx    AnimatePresence mode="wait"
src/styles/index.css                        scroll-behavior + reduced-motion opt-out
```

## Verified mechanically

- **Only `opacity` and `transform` animate.** No variant touches `width`, `height`,
  `top`, `left`, or `box-shadow`. The one documented `width` exception (the social
  rail, `docs/4-interaction-design.md` §7) is correctly **not** defined here — it
  belongs to E08.
- **`src/lib/motion.ts` imports no React**, keeping `lib/` pure (`AGENTS.md` §3).
- Every duration and easing traces to a row in `docs/3-style-preference.md` §8.
- `motion` is imported from `motion/react`, never `framer-motion`.

## Still to verify manually (needs a browser)

- [ ] With OS reduced-motion enabled, content renders in its **final state instantly —
      visible, never hidden, never non-functional**. This is the failure mode that
      turns an accessibility feature into a blank page.
- [ ] Hover colour transitions still work under reduced motion (animation 8 is
      deliberately kept — colour conveys interactive state and is not a vestibular
      trigger).
- [ ] Page transition completes **under 300ms**, measured.
- [ ] Hash-only changes do **not** trigger a page transition.
- [ ] Focus still lands on the new page's `h1` after the transition — the E03-T06
      regression check, see below.
- [ ] Anchor scrolling is smooth by default and jumps instantly under reduced motion.

## The ordering hazard flagged in E06-T03

`PageTransition` uses `mode="wait"`, which delays the new route's mount until the old
one has exited. `useRouteFocus` (E03-T06) waits one animation frame before focusing the
new `h1`.

These coexist in the current build, but the interaction is **unverified in a browser**
and is exactly what the ticket warns about. If the focus move ever lands during the
exit rather than after the mount, the fix is to key the focus effect off the same
completion signal rather than a frame.

Re-check this after **E07**, which layers anchor focus management on top of both.

## Implementation notes

**The reduced-motion check exists once**, in `useMotionVariants`. Eleven independent
`useReducedMotion()` calls would be eleven chances to forget one, and the one you
forget is the one that makes a vestibular-sensitive visitor close the tab.

**The hook returns final-state variants rather than disabling animation.**
`reducedFadeUp` animates `opacity: 1 → 1` — the element is _visible_ immediately, not
merely un-animated. Returning the normal `hidden` state with a zero duration would
leave content at `opacity: 0`.

**`reducedMotion` is exposed as a boolean** for the two cases variants cannot cover:
carousel scroll behaviour (animation 9, `behavior: 'auto'`) in E10, and the form
spinner (animation 11, static "Sending…" text) in E13. `FormStatus` already accepts it
as a prop.

**Smooth scrolling is CSS-only**, with `scroll-padding-top: 5rem` so a hash the browser
resolves itself — a cold external hit on `/#contact`, before any JS runs — still clears
the fixed header. `Section`'s `scroll-mt-20` covers the React path; these are
complementary, not redundant.

## Note on bundle size

Motion is the bulk of the 443 kB entry chunk (142 kB gzipped). That is inside the
~200KB gzipped budget, but it is the single largest dependency in the project and the
obvious first thing to look at in **E17**.

---

## Defect found later, during E10 (2026-08-03)

**Every animation in this foundation was disabled by one prop, from the day it shipped
until E10 found it.**

`PageTransition` carried `<AnimatePresence mode="wait" initial={false}>`. That prop sets
`PresenceContext.initial = false`, which makes **every descendant** motion component skip
its own `initial` — so the hero (animation 1) painted at its final state and every
`whileInView` reveal (animations 2–4) had no `hidden` state to travel from. The variants,
the tokens, and the reduced-motion hook in this epic were all correct; nothing that
consumed them could ever run.

Fixed by removing `initial` from `AnimatePresence` and scoping first-paint suppression to
the wrapper's own `initial`, via a module-level write-once flag — a ref read during render
and a `setState` inside an effect are both rejected by the React Compiler lint rules.

**This invalidates how E06's reduced-motion criteria were checked.** They passed because
elements rendered in their final state immediately, which is also what reduced motion
looks like — the check could not distinguish "respects the preference" from "never
animates". Re-verified after the fix: with `prefers-reduced-motion: no-preference` the
hero fades `0 → 1` and cards stagger 32/80/144/216ms; with `reduce` both are final at
first paint. Detail in [E10-status.md](E10-status.md) §3.

The lesson worth keeping: an assertion that a thing is in its final state cannot tell you
why it is in its final state. Sample the transition, not the endpoint.

## Extended by E11-T02 (2026-08-03)

**Three files in this epic gained a token and a variant, deliberately, from outside it.**

Animation 4 (skill badges) is **300ms**, and `DURATION_REVEAL` is 400ms. There was no way
to build it from inside `components/sections/` without duplicating a duration or restating
one inline, so E11-T02 added:

```
src/constants/motion.ts        DURATION_BADGE = 0.3
src/lib/motion.ts              badgeFadeUp — fadeUp's offset and curve, 300ms
src/hooks/useMotionVariants.ts badgeFadeUp exposed, reducedFadeUp in its place under reduce
```

This is **not** a §8 amendment. Animation 4 was already on the closed inventory with its
duration stated; only the token was missing, because E06 shipped before anything on the
site staggered badges. The variant mirrors `fadeUp` exactly but for the duration — a
second easing curve for one badge row would be drift with no reader-visible reason.

Detail and evidence in [E11-status.md](E11-status.md) §2.
