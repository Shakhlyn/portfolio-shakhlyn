# E09 — Hero & Current Role

**Goal:** The LCP section, in both supported layouts, plus the Current Role card that
follows it.

**Depends on:** E02 (tokens), E04 (`PROFILE`, `CURRENT_ROLE`), E05 (`Button`, `Card`,
`Badge`, `Section`, `Container`), E06 (motion vocabulary, reduced motion), E07
(`SocialLinks`, the `#home` / `#current-role` anchor scaffold this epic replaces), E08
(`SocialRail`, whose deferred pairing criterion this epic closes).

**Note on the epic title:** the request that produced this file said "E09 — Header &
Navigation" and asked for E07 coverage. Header & Navigation is **E07**, which shipped
(14/14, `E07-status.md`). `5-epic-list.md` names E09 **Hero & Current Role**, `STATUS.md`
lists it as next up, and that is what is decomposed here. Same mix-up as the E08 run.

The Global Definition of Done in `README.md` applies to every ticket and is not repeated.

---

## Decisions taken before writing

All four are already **fixed in the source documents**, not just recorded here — a spec
conflict resolved only in code is one the next person re-litigates. See
`README.md` § "Decisions recorded during ticket writing" rows 3–6.

| #   | Question                                 | Decision                                                                                                                                                                                                                                                                             |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Hero `h1` — name, or name + positioning? | **Name only.** `4-interaction-design.md` §5.1 assigns elements; `3-style-preference.md` §6.2 described what the block communicates. A category error, not a contradiction. Stack: `h1`(name) → role framing → value proposition. Keywords belong in `<title>` / `meta[description]`. |
| 2   | Hero layout switch                       | **Explicit `layout: 'stacked' \| 'split'` on `PROFILE`**, replacing the inference from `portrait`'s presence. The seam ships now against an aspect-ratio-locked slot; the portrait treatment is T08, blocked on the asset.                                                           |
| 3   | Eyebrow on Current Role                  | **Omitted.** `Section`'s optional eyebrow is an opt-in. Eyebrows are wayfinding for repeated, scannable sets; Current Role is one narrative block adjacent to the hero.                                                                                                              |
| 4   | Motion for the Current Role stack badges | **None of its own.** §8 is a closed list; absent elements take the default, which is "reveals with its parent section (animation 2), no child orchestration". Row 4 covers E11's skill badges only. Changing this is a §8 amendment ticket.                                          |

---

## E09-T01 — Replace the portrait-presence hero switch with an explicit `layout` field

**Depends on:** none

**Files:** modified — `src/types/profile.types.ts`, `src/data/profile.ts`

**Commit:** `feat(data): select the hero layout with an explicit discriminator`

**Scope**

- In: the `layout: 'stacked' | 'split'` field on `ProfileType`, set to `'stacked'` in
  `profile.ts`, and the comment changes that stop the file claiming `portrait` is the
  switch.
- Out: every consumer. T02 builds the hero that reads the field; T05 adds the branch.
  Out: adding a portrait — T08 owns that, and it stays absent here.

**Implementation notes**

- `portrait` stays optional and stays absent. It is no longer a switch, only the asset
  that fills the `split` slot (`4-interaction-design.md` §5.1).
- The docstrings in both files currently state the superseded rule and must be corrected
  in the same commit — a comment that contradicts the type is worse than no comment.
- `E04-data-layer.md` and `E04-status.md` already carry supersession notes pointing here;
  do not edit those again.
- Same shape as `ProjectType.category` (`2-architecture.md` §5): an explicit
  discriminator, never an inference from whether optional data happens to be populated.

**Acceptance**

- [ ] `ProfileType['layout']` is `'stacked' | 'split'` and is **not** optional — a
      profile with no layout does not typecheck.
- [ ] `PROFILE.layout === 'stacked'`; `PROFILE.portrait` is still `undefined`.
- [ ] `grep -rn "portrait" src/types src/data` returns no text claiming its presence
      selects a layout.
- [ ] `yarn typecheck` passes with no other file changed.

**Traceability:** `4-interaction-design.md` §5.1, §10 row 1 · `2-architecture.md` §5 ·
`5-epic-list.md` E04, E09

---

## E09-T02 — Build `HeroSection` in the `stacked` layout, replacing the `#home` scaffold

**Depends on:** none (T01 is independent; the branch arrives in T05)

**Files:** created — `src/components/sections/HeroSection.tsx`; modified —
`src/pages/HomePage.tsx`

**Commit:** `feat(hero): build the stacked hero section`

**Scope**

- In: the seven-item content stack in a single left-aligned column, rendered from
  `PROFILE`, replacing the E07-T03 `#home` scaffold block.
- Out: motion (T03), the `SocialLinks` row (T04), the `split` branch (T05), Current Role
  (T06). Out: the other five scaffold sections — E10–E13 own those.

**Implementation notes**

- **Not the `Section` primitive.** `Section` renders an `h2` and its own rhythm; the hero
  needs an `h1` and the exception rhythm `pt-24 pb-16` / `md:pt-32 md:pb-24`
  (`3-style-preference.md` §4.2). It therefore renders its own `<section>` and its own
  `Container`.
- Keep `id="home"`, `scroll-mt-20`, and `tabIndex={-1}` on the `h1`. All three are
  load-bearing and already in the scaffold: `useActiveSection` observes `#home`, and
  `focusSection` (E07-T04) queries `h1, h2` inside the section and focuses it. Dropping
  the `tabIndex` silently breaks anchor focus for the Home nav item, which E07 verified.
- Content stack, in order (`4-interaction-design.md` §5.1, `3-style-preference.md` §6.2):
  mono `eyebrow` → `h1` **name only** → role framing (`body-lg`, `fg`) → value
  proposition (`body-lg`, `fg-muted`) → current position line (`fg`, company emphasised)
  → button row. Every value from `PROFILE`; no copy in the JSX.
- Column capped at `max-w-content` (§6.2).
- Buttons at size `lg`. The hero CTA is the one control a phone visitor must hit first,
  and `md` is 40px against the 44×44px minimum in `3-style-preference.md` §11; `sm` is
  documented desktop-only. This is derived from the touch-target rule, not chosen.
- "View Resume" is `primary` → `/resume`; "Contact" is `secondary` → **`/#contact`**, the
  same link form `Navigation` uses. One form covers the hash change and the cross-route
  case, and `useHashScroll` resolves both (E07 design note). No `onClick` scroll handler.
- The button row wraps at 320px rather than shrinking the controls.

**Acceptance**

- [ ] The home `h1` contains `PROFILE.name` and nothing else; role framing is a sibling
      `<p>`.
- [ ] There is exactly one `h1` on `/`.
- [ ] `document.querySelector('#home h1').tabIndex === -1`, and clicking the Home nav item
      moves `document.activeElement` to that `h1`.
- [ ] Both CTAs render as anchors (`<a>`), not `<button>`; "Contact" resolves to
      `#contact` from `/` and from `/writing`.
- [ ] At 320px both CTAs are fully visible without horizontal scroll and are ≥44px tall.
- [ ] No string literal of user-facing copy appears in `HeroSection.tsx`.

**Traceability:** `4-interaction-design.md` §5.1 · `3-style-preference.md` §6.2, §4.2,
§5.1, §11 · `1-prd.md` §3 Hero

---

## E09-T03 — Add the hero mount reveal without gating hero text on JS state

**Depends on:** E09-T02

**Files:** modified — `src/components/sections/HeroSection.tsx`

**Commit:** `feat(hero): animate the hero on mount`

**Scope**

- In: animation 1 — the hero's mount reveal, via the shared `fadeUp` variants.
- Out: animation 2 (section scroll reveal), which T06 introduces for Current Role. Out:
  any per-child stagger inside the hero — animation 1 is one block, and §8 lists no
  hero stagger.

**Implementation notes**

- Animation 1: `opacity 0→1`, `y 12→0`, 400ms, `[0.16, 1, 0.3, 1]` — all four values come
  from `@/constants/motion` via `useMotionVariants`, none re-declared here.
- **Mount, not `whileInView`.** The hero is above the fold; `whileInView` would add a
  viewport check to something already on screen.
- **The hazard this ticket exists for:** the hero is the LCP element. Its text must be in
  the DOM and readable at first paint, and the animation must never gate its presence on
  JS state (`4-interaction-design.md` §5.1, `3-style-preference.md` §8). Animate the
  rendered markup; do not conditionally render on a mounted flag, and do not hold the
  text behind a state variable that flips in an effect.
- `useMotionVariants` already returns final-state variants under reduced motion — do not
  add a second `useReducedMotion()` call.

**Acceptance**

- [ ] With JavaScript disabled, the hero eyebrow, name, role framing, value proposition,
      position line, and both CTAs are all visible and legible.
- [ ] With OS reduced motion on, the hero renders in its final state with no transform
      and no delay.
- [ ] Only `opacity` and `transform` appear in the animated properties.
- [ ] `HeroSection.tsx` contains no duration, easing, or offset literal — all come from
      `@/constants/motion`.

**Traceability:** `4-interaction-design.md` §8 row 1, §5.1 · `3-style-preference.md` §8 ·
`5-epic-list.md` E06, E09

---

## E09-T04 — Render the hero `SocialLinks` row below `sm` only

**Depends on:** E09-T02

**Files:** modified — `src/components/sections/HeroSection.tsx`

**Commit:** `feat(hero): show social links below the rail breakpoint`

**Scope**

- In: item 7 of the content stack — `SocialLinks`, rendered below `sm` and hidden at `sm`
  and up.
- Out: `SocialLinks` itself (E07-T11) and `SocialRail` (E08). Out: the paired
  never-both-visible check across breakpoints — T07 verifies that.

**Implementation notes**

- Breakpoint is **`sm`**, not `lg`. E08-T01 moved the rail to `sm`+ and amended
  `4-interaction-design.md` §5.1 item 7 and `3-style-preference.md` §6.2 to match. A `lg`
  gate here puts both on screen at 640–1023px, which E08's acceptance forbids outright.
- Hide with a CSS breakpoint utility, not a `useMediaQuery` branch. A JS branch makes the
  links depend on hydration and can flash, and this row exists precisely for the visitor
  least likely to have a fast one.
- `1-prd.md` §3 requires direct GitHub, LinkedIn, and email links in the hero; below `sm`
  this row is the only thing satisfying it.

**Acceptance**

- [ ] At 375px the hero renders the social row; at 640px and above it does not.
- [ ] The row renders only channels present in `PROFILE.social` — with no `x` in the data,
      no X tile appears.
- [ ] The row is absent from the accessibility tree at `sm`+, not merely transparent.

**Traceability:** `4-interaction-design.md` §5.1 item 7, §7 · `3-style-preference.md` §6.2
· `1-prd.md` §3 Hero · `E08-tickets.md` T01

---

## E09-T05 — Add the `split` layout seam with an aspect-ratio-locked portrait slot

**Depends on:** E09-T01, E09-T02

**Files:** modified — `src/components/sections/HeroSection.tsx`

**Commit:** `feat(hero): add the split layout seam`

**Scope**

- In: the branch on `PROFILE.layout`, the two-column grid at `lg`+, the single-column
  slot-first order below, and the slot itself — sized, `rounded-lg`, and
  aspect-ratio-locked so it reserves its final space with nothing in it.
- Out: the photograph and everything about how it is treated — crop, focal point,
  responsive sources, `fetchpriority`. That is T08 and it is blocked on the asset.

**Implementation notes**

- Slot geometry (`3-style-preference.md` §6.2, `4-interaction-design.md` §5.1): 280px at
  `lg`, 320px at `xl`, capped at 200px on mobile, `rounded-lg`.
- The lock is what makes this verifiable without an image: the slot occupies its exact
  final box either way, so adding the portrait later contributes **zero** CLS.
- Below `lg` the slot renders **first**, then the text. At `lg`+ text left, slot right.
- Empty slot styling stays minimal — `bg-surface-hover` at most, per the level-1 surface
  in §4.4. This is a structural placeholder, not a designed empty state, and no
  placeholder box ships to production while `layout` is `'stacked'`.
- One component, two layouts. Two near-identical hero components drift the moment the
  copy changes (`AGENTS.md` §13, `4-interaction-design.md` §5.1).
- Keep the component under ~200 lines (`AGENTS.md` §3). If the branch pushes past it,
  extract the slot to `HeroPortraitSlot.tsx` rather than trimming the content stack.

**Acceptance**

- [ ] Setting `PROFILE.layout = 'split'` produces the two-column layout at `lg`+ with **no
      other file edited**; setting it back to `'stacked'` restores the single column.
- [ ] Under `'split'` with `portrait` absent, the slot occupies its full box and the page
      has no horizontal scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] Under `'split'` below `lg`, the slot precedes the text in DOM order.
- [ ] Under `'stacked'` no slot element is rendered at all.
- [ ] The `h1` and content stack are byte-identical between layouts — only the wrapper
      differs.

**Traceability:** `4-interaction-design.md` §5.1, §10 row 1 · `3-style-preference.md` §6.2
· `5-epic-list.md` E09

---

## E09-T06 — Build `CurrentRoleSection`, replacing the `#current-role` scaffold

**Depends on:** none

**Files:** created — `src/components/sections/CurrentRoleSection.tsx`; modified —
`src/pages/HomePage.tsx`

**Commit:** `feat(current-role): build the current role section`

**Scope**

- In: the `#current-role` section — `Section` wrapper, one level-1 `Card`, role and
  company as `h3`, date range, scope bullets, stack badges — plus its scroll reveal
  (animation 2), rendered from `CURRENT_ROLE`.
- Out: the hero (T02–T05). Out: any per-badge stagger — Decision 4.

**Implementation notes**

- `Section id="current-role" title="Current Role"` with **no `eyebrow` prop** (Decision 3,
  `3-style-preference.md` §6.3). `Section` already owns the `h2`, the `scroll-mt-20`, and
  the rhythm; do not wrap children in a second `Container`.
- Card anatomy (§6.3): `h3` role + company → date range in `fg-subtle` **mono** → two-to-
  four scope lines in `fg-muted` → `Badge` row of the stack in active use.
- Heading level is `h3` because `Section` renders the `h2`. Levels are never chosen for
  visual size (`3-style-preference.md` §3.3).
- `Card` **without** `interactive` — nothing here is clickable, and the hover treatment on
  a non-interactive surface is a false affordance.
- Scope renders as a `<ul>`; it is a list, and `CURRENT_ROLE.scope` is already an array of
  four lines.
- Reveal: animation 2 via `fadeUp` + `whileInView` with
  `viewport={{ once: true, margin: '-80px' }}` from `VIEWPORT_ONCE`. The whole card is one
  reveal target — no `staggerContainer`, no per-badge variants (Decision 4).
- Handle the empty case: if `scope` or `stack` is empty, that row does not render rather
  than leaving a bare label (`5-epic-list.md` Global DoD, `AGENTS.md` §5).

**Acceptance**

- [ ] `#current-role` renders `CURRENT_ROLE`'s real role, company, date range, four scope
      lines, and eight stack badges; the E07 placeholder `div` is gone.
- [ ] The section renders no eyebrow element.
- [ ] Heading order on `/` reads `h1 → h2(Current Role) → h3(role @ company)` with no
      skipped level.
- [ ] The card reveals once on first scroll into view and does not re-animate on a second
      pass.
- [ ] The badges have no stagger — the row appears with the card.
- [ ] With OS reduced motion on, the card is visible in its final state without scrolling
      to it.

**Traceability:** `3-style-preference.md` §6.3, §3.3 · `4-interaction-design.md` §5.2, §8
row 2 · `2-architecture.md` §8

---

## E09-T07 — Integration verification pass

**Depends on:** E09-T01 … E09-T06

**Files:** created — `docs/tickets/E09-status.md`; modified —
`docs/tickets/STATUS.md`, `docs/tickets/README.md`

**Commit:** `docs(tickets): record E09 status`

**Scope**

- In: verifying the epic's criteria in a real browser against a production build, closing
  E08's deferred pairing criterion and re-testing the two E07/E08 checks that were
  vacuous while `#home` and `#current-role` held nothing focusable, and recording the
  results.
- Out: fixing anything found — a defect gets its own ticket and its own commit, as in
  E07-T14 and E08-T08. Out: E10–E13's scaffold sections, still placeholders.

**Implementation notes**

- Same harness as E07 and E08: headless Chrome over CDP against `yarn preview`, real
  clicks, real key events, real viewport resizes. Both found real defects this way; two of
  E07's were pre-existing.
- Emulate a fine pointer for any hover assertion — headless Chrome reports
  `(hover: none)` by default, which is why E07's `Card` hover check never actually ran
  (`STATUS.md`, "Next up").
- Re-tests unblocked by this epic:
  - **E07** — "after clicking a nav anchor, the next Tab lands inside that section",
    verified only in a weaker form because the scaffold had no focusable children. `#home`
    now has two CTAs.
  - **E08** — the tab-order check, for the same reason.
- LCP is measured on a throttled mobile profile; the number belongs in the status file.

**Acceptance**

- [ ] At 375px the hero social row is visible and the rail is not; at 640, 1024, and
      1440px the rail is visible and the row is not. **Closes E08's deferred criterion.**
- [ ] Clicking Home from `/writing` lands on `#home` with `activeElement` on the hero
      `h1`, and the next Tab lands on the "View Resume" CTA — E07's criterion, now
      literally testable.
- [ ] No horizontal scroll at 320, 375, 768, 1024, 1440, 1920 in both `stacked` and
      `split`.
- [ ] Hero and Current Role are correct in both themes.
- [ ] LCP under 2.5s on a throttled mobile profile, recorded with the measured figure.
- [ ] Reduced motion: hero final-state on mount, Current Role visible without scrolling.
- [ ] `E09-status.md` exists with one row per ticket; `STATUS.md`'s Phase 2 table and
      `README.md`'s Phase 2 table both list E09.

**Traceability:** `4-interaction-design.md` §11 · `3-style-preference.md` §12 ·
`5-epic-list.md` E09 Acceptance · `E08-status.md` (deferred criterion) · `E07-status.md`
(criterion verified in a weaker form)

---

## E09-T08 — Portrait treatment ⛔ BLOCKED on the asset

**Depends on:** E09-T05, **and a real portrait photograph**

**Files:** modified — `src/data/profile.ts`, `src/components/sections/HeroSection.tsx`;
created — `src/assets/portrait.webp` (or `.avif`)

**Commit:** `feat(hero): add the portrait to the split layout`

**Scope**

- In: the `portrait` data, the `<img>` in the slot T05 already reserved, and its loading
  treatment.
- Out: the layout. T05 shipped it, and this ticket must not need to touch the grid — if it
  does, T05's slot was not actually locked.

**Implementation notes**

- **This ticket is listed so the gap is visible rather than silently missing.** It is not
  startable and must not be worked around with a stand-in image: tuning crop and focal
  point against a throwaway JPEG encodes that image's accidental properties — its framing,
  its subject position, its tonal range — into CSS that then mistunes the real photograph.
- Requirements when it lands (`4-interaction-design.md` §5.1): explicit `width`/`height`
  matching the slot's locked ratio, `fetchpriority="high"`, **never** `loading="lazy"`
  (it is above the fold), real `alt` text — the person's name, not `alt=""` — and WebP or
  AVIF optimised before commit.
- In dark mode a light-background portrait needs a `border-border` frame so it does not
  float as a bright rectangle (`3-style-preference.md` §7).
- Flipping `PROFILE.layout` to `'split'` for launch is part of this ticket, not T05.

**Acceptance**

- [ ] The portrait renders in the T05 slot with **no change to the grid or the slot's
      dimensions**.
- [ ] `loading` is not `lazy`; `fetchpriority` is `high`; `width` and `height` are
      explicit and match the locked ratio.
- [ ] `alt` is the person's name.
- [ ] CLS contribution is 0 — measured, not assumed.
- [ ] Format is WebP or AVIF.

**Traceability:** `4-interaction-design.md` §5.1 · `3-style-preference.md` §6.2, §7, §10 ·
`1-prd.md` §6 Hero Content · `5-epic-list.md` E09 Deferred

---

## Coverage table

### Deliverables

| E09 deliverable                                                                         | Tickets           |
| --------------------------------------------------------------------------------------- | ----------------- |
| `HeroSection` — one component, two layouts, selected by `profile.layout`                | T01, T02, T05     |
| `stacked` ships now; the `split` seam ships alongside it                                | T02, T05          |
| Content stack: eyebrow → `h1` name → role framing → value proposition → position → CTAs | T02               |
| `SocialLinks` below `sm` only                                                           | T04               |
| `CurrentRoleSection` — card, `h3`, date range, scope bullets, stack badges              | T06               |
| No eyebrow on Current Role; badges do not stagger                                       | T06               |
| _Deferred:_ portrait treatment — crop, focal point, sources, priority, dimensions       | **T08 (blocked)** |

### Acceptance criteria

| E09 acceptance criterion                                                            | Tickets  |
| ----------------------------------------------------------------------------------- | -------- |
| Hero text in the DOM and readable at first paint; animation never gates it on JS    | T03, T07 |
| `h1` contains the name and nothing else; role framing is a sibling                  | T02, T07 |
| Switching `profile.layout` changes the layout with no other file edited             | T01, T05 |
| The `split` slot reserves its space with no image present                           | T05      |
| At 320px the CTAs are not pushed below the fold                                     | T02, T07 |
| LCP under 2.5s on a throttled mobile profile                                        | T07      |
| Rail and hero social links never both visible (deferred here by E08)                | T04, T07 |
| _Blocked:_ portrait uses `fetchpriority="high"`, never `lazy`, explicit dims, `alt` | **T08**  |

### Inherited criteria this epic unblocks

| Criterion                                                            | Origin  | Ticket |
| -------------------------------------------------------------------- | ------- | ------ |
| "The next Tab lands inside that section" — verified in a weaker form | E07-T14 | T07    |
| Tab-order check, vacuous while the sections held nothing focusable   | E08-T08 | T07    |

---

## Open Questions

None blocking. The four ambiguities this epic raised were decided above and propagated to
the source documents; two smaller defaults are recorded here rather than asked, because
each has an unambiguous source and no reasonable alternative:

1. **Hero CTA size is `lg`.** Derived, not chosen: `md` is 40px against the 44×44px touch
   minimum (`3-style-preference.md` §11) and `sm` is documented desktop-only.
2. **The hero renders its own `<section>` and `Container` rather than using `Section`.**
   `Section` renders an `h2` and the standard rhythm; the hero needs an `h1` and §4.2's
   documented exception rhythm.
