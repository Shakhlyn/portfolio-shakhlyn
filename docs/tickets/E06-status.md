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
