# E06 — Motion Foundation

**Goal:** One shared motion vocabulary, so eleven animations do not become eleven
bespoke implementations with eleven different easings.

**Why before the sections:** Retrofitting reduced-motion handling across a dozen
finished components is exactly the kind of sweep that gets half-done. Doing it once,
first, is the only way it is actually complete.

**Depends on:** E02 (and E03-T03 for T03's mount point). Independent of E04, E05.

**The governing rule:** `4-interaction-design.md` §8 is a **closed inventory**. Eleven
animations exist. If it is not on that list, it does not ship (`AGENTS.md` §7).

**Traceability:** `AGENTS.md` §7 · `2-architecture.md` §7 · `3-style-preference.md` §8 ·
`4-interaction-design.md` §8 · `5-epic-list.md` E06

---

## [ ] E06-T01 — Motion tokens and shared variants

**Files:** `src/constants/motion.ts` (new), `src/lib/motion.ts` (new), `package.json`

**Scope**

- `yarn add motion`. Import from **`motion/react`**, never `framer-motion`
  (`AGENTS.md` §2).
- `src/constants/motion.ts` — durations and easings from `3-style-preference.md` §8, in
  `SCREAMING_SNAKE_CASE`:

  | Constant | Value | Used by |
  |---|---|---|
  | `DURATION_HOVER` | 150ms, `ease-out` | hover / colour transitions |
  | `DURATION_REVEAL` | 400ms, `[0.16, 1, 0.3, 1]` | scroll reveal |
  | `DURATION_PAGE` | 200ms, `ease-out` | page transition |
  | `DURATION_MENU` | 200ms, `ease-out` | mobile sheet |
  | `STAGGER_CARDS` | 0.06s | project cards |
  | `STAGGER_BADGES` | 0.04s | skill badges |
  | `VIEWPORT_ONCE` | `{ once: true, margin: '-80px' }` | every scroll reveal |

- `src/lib/motion.ts` — shared `variants` objects: `fadeUp` (opacity 0→1, y 12→0),
  `staggerContainer`, and `pageTransition` (opacity + y 8).
- **Only `opacity` and `transform`.** Never `width`, `height`, `top`, `left`, or
  `box-shadow`. The one documented `width` exception is the social rail
  (`4-interaction-design.md` §7) and is explicitly **not** in scope here.
- **Stagger comes from a parent `variants` object with `staggerChildren`**, never
  hand-delayed children (`AGENTS.md` §7). Cap total stagger at ~300ms — a 10-card
  stagger at 60ms is 600ms of waiting, so cap the stagger, not the card count.
- `src/lib/` is pure — no React imports (`AGENTS.md` §3).

**Acceptance**

- [ ] Every duration and easing traces to a row in `3-style-preference.md` §8.
- [ ] No variant animates a non-composited property.
- [ ] `lib/motion.ts` imports no React.
- [ ] Explicit return/const types; no `any`.

**Commit:** `feat: add shared motion tokens and variants`

---

## [ ] E06-T02 — Reduced-motion wrapper

**Files:** `src/hooks/useMotionVariants.ts` (new)

**The check is written once, not eleven times.** Eleven independent
`useReducedMotion()` calls is eleven chances to forget one, and the one you forget is
the one that makes a vestibular-sensitive visitor close the tab.

**Scope**

- Built on Motion's `useReducedMotion()` (`2-architecture.md` §4).
- Returns the requested variants unchanged, or reduced equivalents when the preference
  is set: **transforms dropped, durations 0, elements in their final state
  immediately**.
- **Reduced motion never means hidden content and never removes functionality**
  (`4-interaction-design.md` §8). An element that animates `opacity 0 → 1` must render
  at opacity 1, not stay invisible. This is the failure mode that turns an accessibility
  feature into a blank page.
- Per `4-interaction-design.md` §8, the reduced behaviour differs by animation:
  - Animations 1–7: final state immediately.
  - Animation 8 (hover colour): **kept** — colour transitions convey interactive state
    and are not vestibular triggers.
  - Animation 9 (carousel scroll): `behavior: 'auto'` instead of `'smooth'`.
  - Animation 11 (spinner): static "Sending…" text.
  The hook covers 1–7; expose a boolean for 9 and 11 to consume.
- camelCase filename per the decision in `docs/tickets/README.md`.

**Acceptance**

- [ ] With OS reduced-motion enabled, content renders in final state instantly —
      **visible, never hidden, never non-functional**.
- [ ] Hover colour transitions still work under reduced motion.
- [ ] The boolean is exported for the carousel and spinner to consume in E10/E13.
- [ ] Toggling the OS setting live updates behaviour without a reload.
- [ ] No `eslint-disable` on any dependency array.

**Commit:** `feat: add reduced-motion variants hook`

---

## [ ] E06-T03 — `PageTransition`

**Files:** `src/components/layout/PageTransition.tsx` (new),
`src/components/layout/RootLayout.tsx`

**Scope**

- Wraps the route `<Outlet />` in `AnimatePresence mode="wait"`
  (`AGENTS.md` §7).
- `opacity` + `y: 8`, **200ms, under the 300ms ceiling**
  (`4-interaction-design.md` §8, animation 5).
- Keyed on `useLocation().pathname` so it fires on route change. **Not on hash change** —
  an in-page anchor jump is not a page change, and fading the whole page out for one
  would be both wrong and disorienting.
- Mounted inside `RootLayout` between `<main>` and `<Outlet />`, so the header, footer,
  and social rail do not transition with the page.
- **Ordering hazard:** `mode="wait"` delays the new route's mount until the old one has
  exited. E03-T06 moves focus to the new `h1` — verify the focus move still lands after
  the new page mounts, not during the exit. If they fight, the focus effect must key off
  the same completion signal.

**Acceptance**

- [ ] Route changes fade; the header and footer do not.
- [ ] Transition completes **under 300ms**, measured.
- [ ] Hash-only changes do not trigger it.
- [ ] Focus still lands on the new page's `h1` after the transition (E03-T06 regression
      check).
- [ ] Under reduced motion the new route appears instantly with no fade.

**Commit:** `feat: add PageTransition wrapper`

---

## [ ] E06-T04 — Smooth scroll with reduced-motion opt-out

**Files:** `src/styles/index.css`

**Scope**

- `scroll-behavior: smooth` on `html` (`4-interaction-design.md` §4).
- **Disabled under `@media (prefers-reduced-motion: reduce)`** — a full-page smooth
  scroll is one of the strongest vestibular triggers there is, and it is the animation
  most often left out of a reduced-motion pass.
- Also set `scroll-padding-top` matching the fixed header height, so native anchor
  resolution (including a direct external `/#contact` hit, before any JS runs) clears
  the header. `Section`'s `scroll-mt-20` covers the React path; this covers the case
  where the browser resolves the hash itself.
- CSS only. No JS scroll library, no scroll-jacking, no scroll progress bar
  (`4-interaction-design.md` §4).

**Acceptance**

- [ ] Anchor navigation scrolls smoothly at default settings.
- [ ] With OS reduced-motion enabled, it jumps instantly.
- [ ] A cold external hit on `/#contact` lands with the heading clear of the header.
- [ ] No horizontal scroll introduced at any tested width.

**Commit:** `feat: enable smooth scroll with reduced-motion opt-out`
