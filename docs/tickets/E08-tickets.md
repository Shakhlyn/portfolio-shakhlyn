# E08 — Social Rail

**Goal:** The fixed left rail from `../../src/assets/img.png`, driven by the same `profile.ts` link
data as the `SocialLinks` built in E07.

**Depends on:** E02 (tokens), E05 (`IconLink`, icons, focus ring), E06 (reduced motion),
E07 (`SocialLinks`, `RootLayout`).

**Note on the epic title:** the request that produced this file said "E08 — Header &
Navigation". That was E07, which shipped. `5-epic-list.md` names E08 **Social Rail**,
and that is what is decomposed here.

The Global Definition of Done in `README.md` applies to every ticket and is not
repeated.

---

## Decisions taken before writing (previously blocking)

| #   | Question                       | Decision                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Rail breakpoint                | **`sm` (640px) and up**, not `lg`. The hero's `SocialLinks` row moves with it — below `sm` only — or the two are both visible at 640–1023px, breaking E08's own "rail and hero social links are never both visible". Tailwind has no 600px breakpoint and §2 says no custom breakpoints are needed. |
| 2   | Rail overlapping the container | **Rail overlays the gutter.** §7's "must not overlap the container at any width ≥ `lg`" is false as written — at 640px the container gutter is 24px and the collapsed rail is 48px. Reworded to "must not overlap page **content**"; the gutter is whitespace and prose starts further in.          |
| 3   | Expansion duration             | **100ms** in normal use (§7 and §8 row 7 both currently say 200ms). Reduced motion is **unchanged**: §8's rule that animations 1–7 render in their final state immediately still holds, so reduced motion snaps with no transition.                                                                 |
| 4   | Stacking                       | **`z-30`** — above page content, below the header. The mobile sheet renders inside the header's `z-40` stacking context, so this satisfies §7's "below the mobile nav sheet" with one value and no special case. This now matters in practice: at 640–1023px the sheet and the rail co-exist.       |

---

## E08-T01 — Amend the design docs for the four E08 decisions

**Depends on:** none

**Files:** modified — `docs/4-interaction-design.md`, `docs/3-style-preference.md`,
`docs/5-epic-list.md`

**Commit:** `docs(design): move the social rail to sm and shorten its expansion`

**Scope**

- In: the documentation changes the four decisions above require, so every later ticket
  cites a document that is already correct rather than one it contradicts.
- Out: all code. T02–T08 own that. Out: the hero's `SocialLinks` breakpoint in code —
  the hero does not exist yet and is E09's to build against the amended §5.1.

**Implementation notes**

- **Rail breakpoint.** §2's breakpoint table currently lists "Social rail appears" under
  `lg`; it moves to the `sm` row. §7's "Visible at `lg` and up only" becomes `sm`.
- **The hero row must move with it.** §5.1 item 6 and `3-style-preference.md` §6.2 both
  say the hero renders `SocialLinks` "below `lg` only". Left alone, the rail and the hero
  row would both be visible at 640–1023px, which E08's acceptance forbids outright.
- **The rationale sentences change too.** §7 justifies hiding the rail with "a fixed rail
  on a 375px screen eats content width and collides with thumbs" — still true at 375px,
  so the reasoning survives the breakpoint move and should be reworded, not deleted.
- **Overlap constraint.** §7's sentence is factually wrong at every width the rail is now
  visible. Rewrite to constrain overlap of page _content_, and record that the rail
  deliberately overlays the container gutter.
- **Duration.** §7 "Duration 200ms `ease-out`" → 100ms. §8 row 7's Duration column →
  100ms. **§8's reduced-motion list is not touched** — animation 7 still renders in its
  final state immediately.
- `5-epic-list.md` E08's deliverable line says "`lg`+ only" and must match.

**Acceptance**

- [ ] §2's breakpoint table lists the social rail under `sm`, and the `lg` row no longer
      mentions it.
- [ ] §7 says visible at `sm` and up.
- [ ] §5.1 item 6 and `3-style-preference.md` §6.2 both say the hero row renders below
      `sm`.
- [ ] `grep -n "lg" docs/4-interaction-design.md` shows no remaining claim that the rail
      is `lg`-only.
- [ ] §7 and §8 row 7 both read 100ms.
- [ ] §8's reduced-motion list still says animations 1–7 render in their final state
      immediately.
- [ ] §7 no longer claims the rail must not overlap the container.
- [ ] `5-epic-list.md` E08 says `sm`+.

**Traceability:** `4-interaction-design.md` §2, §5.1, §7, §8 · `3-style-preference.md`
§6.2, §6.11 · `5-epic-list.md` E08

---

## E08-T02 — Extract shared social channel definitions

**Depends on:** none

**Files:** created — `src/constants/social.ts`, `src/types/social.types.ts`; modified —
`src/components/layout/SocialLinks.tsx`

**Commit:** `refactor(social): extract shared social channel definitions`

**Scope**

- In: one definition of the four social channels — order, label, icon — consumed by both
  `SocialLinks` and (later) `SocialRail`. Refactors E07's `SocialLinks` onto it.
- Out: the rail itself (T03–T06). Out: any change to what `SocialLinks` renders — this
  is a refactor, and its output must be byte-identical.

**Implementation notes**

- `5-epic-list.md` E08 requires rail and links be "driven by the same `profile.ts` link
  data". E07's `SocialLinks` currently builds its entry list inline; adding a second copy
  in the rail would mean two places to edit when a channel changes, and two places for
  the order to drift.
- Channel order is GitHub, LinkedIn, Email, X (§7). Both consumers inherit it.
- Icons are **component references**, not rendered JSX, so the module stays `.ts` and the
  consumer decides sizing — the rail uses a 20px icon (`3-style` §6.11) and `SocialLinks`
  inherits `IconLink`'s default.
- Key each channel by its `SocialLinksType` field name so `PROFILE.social[key]` is
  type-checked rather than string-matched.
- "Tiles render only for links present in `src/data/profile.ts`. No placeholder tiles"
  (§7) — the presence filter belongs here, so both consumers cannot disagree about it.

**Acceptance**

- [ ] `SocialLinks` renders the same three links, same order, same `aria-label`s and
      `rel` attributes as before the refactor — diff the rendered DOM before and after.
- [ ] `SOCIAL_CHANNELS` declares four channels; the presence filter returns three against
      the current `profile.ts`.
- [ ] Adding an `x` URL to `profile.ts` makes both consumers render a fourth entry with
      no component edit.
- [ ] A typo in a channel key is a compile error, not a silently missing link.
- [ ] `src/constants/social.ts` contains no JSX.

**Traceability:** `4-interaction-design.md` §7 · `5-epic-list.md` E08 · `AGENTS.md` §3, §13

---

## E08-T03 — Add `SocialRailTile` collapsed state and link semantics

**Depends on:** E08-T02

**Files:** created — `src/components/layout/SocialRailTile.tsx`

**Commit:** `feat(social): add SocialRailTile collapsed state`

**Scope**

- In: one tile at rest — dimensions, colours, shape, focus ring, and correct link
  semantics for external versus `mailto:` targets.
- Out: hover and focus expansion (T04). Out: the stack and its positioning (T05).

**Implementation notes**

- Collapsed: **48px wide, 48px tall**, 20px icon centred, `bg-surface`,
  `border border-border` **with no left border**, `text-fg-muted` (`3-style` §6.11).
- `rounded-r-md` — rounded on the right edge only, "so it reads as attached to the screen
  edge" (§7).
- `shadow-sm` at rest (`3-style` §6.11).
- **Every tile carries an `aria-label`**, so the visual label added in T04 is enhancement
  only and never the sole accessible name (§7, and an explicit E08 acceptance criterion).
- GitHub, LinkedIn, X → external, new tab, `rel="noreferrer"`. Email → `mailto:`, same
  tab (§7).
- Standard focus ring (`3-style` §4.5), **offset so it is not clipped by the viewport
  edge** (§6.11) — the tile sits flush against x=0, so a symmetric ring would be cut in
  half.
- Not an `IconLink`: that primitive is a 40px `rounded-full` circle with different colours
  and no label slot. Extending it to cover both would push it past the 4–5 optional props
  where `AGENTS.md` §5 says to prefer composition.

**Acceptance**

- [ ] A tile measures 48×48px with a 20px icon centred, checked in DevTools.
- [ ] `border-left-width` computes to `0px`; the other three borders are 1px.
- [ ] `border-radius` is 0 on the left corners and non-zero on the right.
- [ ] Every tile has a non-empty `aria-label`; the icon inside is `aria-hidden="true"`.
- [ ] The GitHub tile has `target="_blank"` and `rel="noreferrer"`; the Email tile has
      neither and its `href` starts `mailto:`.
- [ ] Keyboard focus shows a ring that is fully visible, not clipped at the left viewport
      edge.
- [ ] Correct in both themes.

**Traceability:** `3-style-preference.md` §4.5, §6.11 · `4-interaction-design.md` §7

---

## E08-T04 — Add hover and focus expansion to `SocialRailTile`

**Depends on:** E08-T03

**Files:** modified — `src/components/layout/SocialRailTile.tsx`

**Commit:** `feat(social): expand rail tiles on hover and focus`

**⚠️ High risk.** Focus parity is the criterion most often shipped broken — hover works,
keyboard does not, and nobody notices because nobody tabs to it. This ticket also owns
the animation that T07 must prove is safe; if T07 fails, this is the ticket that gets
rewritten.

**Scope**

- In: the expansion itself — width, label reveal, expanded colours, timing, reduced
  motion, and `Escape` to collapse.
- Out: profiling the animation and any `scaleX` fallback (T07). Out: ensuring only one
  tile expands at a time — that is a consequence of per-tile hover/focus state and needs
  no coordinator.

**Implementation notes**

- **Expands on hover _or_ keyboard focus** — "focus expansion is required, not optional;
  a keyboard user must see the same label a mouse user sees" (§7).
- Grows **rightward** to fit its `body-sm` label. The label sits **left of the icon** and
  fades in as the icon settles at the trailing edge (§7).
- Expanded colours: `bg-accent`, `text-on-accent`; `shadow-lg` (`3-style` §6.11).
- **100ms `ease-out`** per Decision 3 (§7 as amended by T01).
- Growth is horizontal only, so "the stack never shifts vertically" and "the others never
  shift" (§7, §6.11) fall out of the layout rather than needing to be enforced.
- **Reduced motion:** the tile still expands — §8 states reduced motion "never hides
  content and never removes functionality" — but with no transition. Use the existing
  `useMotionVariants` boolean from E06-T02 rather than a new `useReducedMotion` call.
- `Escape` while a tile is focused blurs it and collapses (§9 keyboard map). See Open
  Question 1: this deliberately drops focus to `<body>`, as specified.
- **`box-shadow` must not be transitioned.** `3-style` §8 Allowed Properties lists
  `box-shadow` in the never-animate set, while §6.11 requires the shadow to differ
  between states. Swap it without a transition; animate only `width` and the label's
  `opacity`.

**Acceptance**

- [ ] Hovering a tile expands it to fit its label within 100ms; the label is left of the
      icon.
- [ ] **Tabbing** to a tile produces a visually identical expansion to hovering it —
      compare screenshots of the two states.
- [ ] Expanding one tile leaves the other tiles' bounding boxes unchanged, verified by
      reading `getBoundingClientRect()` before and after.
- [ ] Expanded tile computes `bg-accent` / `text-on-accent`; collapsed computes
      `bg-surface` / `text-fg-muted`.
- [ ] `Escape` on a focused tile collapses it.
- [ ] With OS reduced-motion on, the expanded state appears with no transition —
      `transition-duration` computes to `0s`.
- [ ] `transition-property` never includes `box-shadow`.

**Traceability:** `4-interaction-design.md` §7, §8 row 7, §9 · `3-style-preference.md`
§6.11, §8

---

## E08-T05 — Add `SocialRail` container with fixed positioning and `sm` gating

**Depends on:** E08-T01, E08-T02, E08-T04

**Files:** created — `src/components/layout/SocialRail.tsx`

**Commit:** `feat(social): add SocialRail container`

**Scope**

- In: the fixed, vertically centred stack; the `sm` visibility gate; the landmark; and
  rendering one tile per present link.
- Out: mounting it in `RootLayout` and the DOM-order requirement (T06).

**Implementation notes**

- Fixed to the **left viewport edge**, vertically centred via `top: 50%` and
  `translateY(-50%)` (§7).
- `z-30` per Decision 4 — above page content, below the header's `z-40`, which is what
  places it below the mobile nav sheet. At 640–1023px the sheet and the rail now co-exist,
  so this is load-bearing rather than theoretical.
- **Visible at `sm` and up** per Decision 1. Below `sm` it is hidden and its links appear
  in the mobile nav sheet and the footer (§7).
- Marked up as **`<nav aria-label="Social links">`** so screen readers can skip it (§7).
- Renders one `SocialRailTile` per channel returned by the presence filter from T02 — no
  placeholder tiles (§7).
- The rail overlays the container's gutter by design (Decision 2). No page padding is
  added and the container is not shifted.

**Acceptance**

- [ ] At 1440px the rail is fixed at the left edge and vertically centred — its box's
      centre y equals the viewport's within 1px.
- [ ] The rail does not scroll with the page.
- [ ] At 639px the rail is not rendered; at 640px it is.
- [ ] Computed `z-index` is 30, and the header computes 40.
- [ ] The element is a `<nav>` with `aria-label="Social links"`.
- [ ] Three tiles render against the current `profile.ts`; no X tile.
- [ ] No page content is overlapped at 640, 768, 1024, 1440, 1920 — measured against the
      container's content box, not its padding box.

**Traceability:** `4-interaction-design.md` §2, §7 · `3-style-preference.md` §6.11 ·
`2-architecture.md` §6

---

## E08-T06 — Mount `SocialRail` after `<main>` and verify tab order

**Depends on:** E08-T05

**Files:** modified — `src/components/layout/RootLayout.tsx`

**Commit:** `feat(social): mount SocialRail after main`

**Scope**

- In: mounting the rail in the app shell at the correct position in the document.
- Out: the rail's own styling and behaviour (T03–T05).

**Implementation notes**

- The rail "comes **after `<main>`** in DOM order while rendering visually left. It is
  supplementary and should not sit between the header and page content in the tab order"
  (§7). This is the whole point of the ticket — visual position and DOM position
  deliberately disagree, and getting it backwards is invisible to a mouse user.
- §9's keyboard map fixes the full order: skip link → header → nav → main content →
  **social rail** → footer. That places the rail between `<main>` and `<footer>`.
- Mounted in `RootLayout`, outside `PageTransition`, so it does not fade on route change
  — `2-architecture.md` §6 places `SocialRail` as a sibling of `PageTransition`, not a
  child.

**Acceptance**

- [ ] In the elements panel, the `<nav aria-label="Social links">` appears after
      `</main>` and before `<footer>`.
- [ ] Tabbing from the last focusable element inside `<main>` reaches the first rail tile
      before reaching any footer link.
- [ ] Tabbing forward from the last rail tile reaches the first footer link.
- [ ] The rail does not fade or move during a route change.
- [ ] The rail is present on `/`, `/resume`, and `/writing`.

**Traceability:** `4-interaction-design.md` §7, §9 · `2-architecture.md` §6

---

## E08-T07 — Profile the `width` animation; confirm or fall back to `scaleX`

**Depends on:** E08-T06

**Files:** none expected — fixes only, and only if profiling fails

**Commit:** none unless the fallback is needed →
`perf(social): use scaleX for rail expansion`

**⚠️ High risk.** This is the only place in the codebase where an explicitly forbidden
property is animated, and it ships on a documented exception that the epic requires be
_proved_ rather than assumed. A failure here rewrites T04.

**Scope**

- In: profiling the expansion and recording the result. Applying the documented `scaleX`
  fallback if, and only if, the profiler disagrees.
- Out: any other performance work. If profiling reveals an unrelated problem, that is a
  new ticket.

**Implementation notes**

- §8's rule is `opacity` and `transform` only; `width` is permitted in **one** documented
  case, this one. The stated reasoning: the rail is `position: fixed`, so it is outside
  document flow and its width "cannot reflow a single element on the page" (§7).
- The doc does not ask for that to be taken on trust: "**Verify in DevTools that no
  layout is recalculated outside the rail; if the profiler disagrees, fall back to
  `scaleX`**" (§7), and `5-epic-list.md` E08 repeats it as an acceptance criterion.
- The fallback is a `scaleX` background with a counter-scaled child. §7 records why it is
  the second choice, not the first: it "distorts the rounded corner and the icon, and is
  more fragile than the problem it solves". Do not pre-emptively adopt it.
- Record the outcome in `E08-status.md` either way. A criterion that says "profiling
  confirms" is not satisfied by a passing build.

**Acceptance**

- [ ] A Performance recording of one hover expansion is captured at 1440px.
- [ ] Layout / "Recalculate Style" entries in that recording are attributed only to nodes
      inside the rail — screenshot or node list recorded as evidence.
- [ ] If any layout work outside the rail appears, `scaleX` is implemented and the
      recording is repeated until clean.
- [ ] The result — pass, or fallback applied — is written into `E08-status.md` with the
      evidence, not merely asserted.

**Traceability:** `4-interaction-design.md` §7, §8 · `3-style-preference.md` §8 ·
`5-epic-list.md` E08

---

## E08-T08 — Integration verification pass

**Depends on:** E08-T01 … E08-T07

**Files:** none expected; fixes only

**Commit:** none unless a fix is needed → `fix(social): <specific defect>`

**⚠️ High risk by definition.** One of E08's acceptance criteria cannot be fully
satisfied within E08 — see below — and this ticket is where that is recorded honestly
rather than ticked.

**Scope**

- In: verifying the criteria that span components, and fixing what fails.
- Out: the hero's `SocialLinks` row. It is E09's to build, against §5.1 as amended by T01.

**Implementation notes**

- **"Rail and hero social links are never both visible" cannot be closed here.** The hero
  does not exist yet. E08 can prove the rail's own gate — hidden below `sm`, shown at and
  above — and T01 makes the hero's future breakpoint match. The paired check belongs to
  **E09** and must be listed there, not silently marked done.
- Re-check the mobile sheet interaction: at 640–1023px the hamburger sheet and the rail
  are both present for the first time, which no earlier epic exercised.

**Acceptance**

- [ ] Rail hidden at 320 and 375; visible at 640, 768, 1024, 1440, 1920.
- [ ] Focus expansion matches hover expansion on every tile.
- [ ] No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] With the mobile sheet open at 768px, the sheet renders above the rail.
- [ ] Tab order matches §9 on every route.
- [ ] Every listener added in E08 is released on unmount.
- [ ] The hero pairing check is recorded as deferred to E09, not as passed.

**Traceability:** `4-interaction-design.md` §2, §7, §9 · `5-epic-list.md` E08

---

## Coverage table

### Deliverables

| E08 deliverable                                                                                               | Tickets                                              |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `SocialRail` in `components/layout/` — fixed left edge, vertically centred, breakpoint-gated                  | T05, T06                                             |
| Tiles: GitHub, LinkedIn, Email, X. 48px collapsed, expanding rightward on hover **and** focus, `rounded-r-md` | T02, T03, T04                                        |
| `SocialLinks` reused by hero, contact section, footer                                                         | Built in E07; refactored onto shared channels in T02 |
| Both driven by the same `profile.ts` data; tiles render only for links that exist                             | T02, T05                                             |
| `<nav aria-label="Social links">`, placed after `<main>` in DOM order                                         | T05, T06                                             |

### Acceptance criteria

| E08 acceptance criterion                                                                   | Tickets                                                                    |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Focus expansion works identically to hover                                                 | T04, T08                                                                   |
| Each tile has an `aria-label`, so the visual label is enhancement only                     | T03, T08                                                                   |
| The rail does not overlap the container at 1024px                                          | T01 (constraint reworded to page _content_), T05, T08                      |
| Rail and hero social links are never both visible                                          | T01 (breakpoints aligned), T08 — **partial; paired check deferred to E09** |
| Profiling confirms the `width` animation triggers no layout recalculation outside the rail | T07                                                                        |

---

## Open Questions

Non-blocking. Each has a default recorded below and will be implemented that way unless
you say otherwise.

1. **`Escape` on a focused tile "blurs".** §9 specifies blur, which drops focus to
   `<body>` and loses the keyboard user's position in the tab order — the same class of
   problem `useRouteFocus` exists to prevent elsewhere. **Default taken:** implement as
   specified. Flagging because a more conventional pattern would collapse the tile while
   keeping focus on it.

2. **The mobile sheet's `SocialLinks` row now duplicates the rail at 640–1023px.** §3
   puts social links in the sheet "since the rail is hidden at this width" — a rationale
   that Decision 1 invalidates for that band. §7 forbids the rail and the hero row being
   visible together for exactly this reason. **Default taken:** leave the sheet row
   as-is, because the sheet is transient and covers the rail while open. Say the word and
   I will gate the sheet's row to below `sm` in T01 instead.

3. **Expanded tile width.** §7's diagram shows "~140px" but no token, and `4.1` restricts
   the spacing scale. **Default taken:** intrinsic width sized to the label, not a fixed
   value — the labels differ in length and a fixed width would either clip "LinkedIn" or
   pad "X".

4. **Does the rail render on every route?** Not stated. `2-architecture.md` §6 places
   `SocialRail` in `RootLayout` outside `PageTransition`, which implies all routes.
   **Default taken:** all routes.

5. **`box-shadow` between rest and expanded.** `3-style` §6.11 requires `shadow-sm` →
   `shadow-lg`, while §8 lists `box-shadow` as never-animate. **Default taken:** swap the
   shadow with no transition, animating only `width` and label `opacity`. This satisfies
   both, but the shadow change will read as instant against a 100ms width change.
