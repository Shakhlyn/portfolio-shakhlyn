# E11 — About & Skills

**Goal:** The two static sections between Projects and Contact — the career narrative,
and the capability grid a recruiter scans for keyword matches.

**Depends on:** E02 (tokens), E04 (`ABOUT`, `SKILL_GROUPS`, their types), E05 (`Section`,
`Badge`, `Container`), E06 (motion vocabulary, reduced motion), E07 (the `#about` and
`#skills` anchor scaffolds this epic replaces).

The Global Definition of Done in `README.md` applies to every ticket and is not repeated.

**Smallest epic since E06.** Seven tickets, seven commits, no state, no interaction, no
new routes. Both sections already have their anchors, nav entry, and scroll-spy wiring
from E07 — this epic replaces two `min-h-96` placeholder divs with real content and
nothing else.

Where the risk actually sits: nothing here can throw, so every defect this epic can
produce is a **silent** one — a stagger that never runs (the E10-T09 class of failure), a
group label that reads as a heading to sighted users and as nothing at all to a screen
reader, an empty group leaving a bare label behind, prose that loses its measure at 1920.
The ticket seams follow those four, not the file count.

---

## Decisions taken before writing

All four came from questions raised during decomposition and answered by the user. Rows
1–3 are **fixed in the source documents** by T01; row 4 required no document change.
Recorded in `README.md` § "Decisions recorded during ticket writing" rows 10–12.

| #   | Question                                                                                                                    | Decision                                                                                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `about.ts` ships a `lookingFor` field that `3-style-preference.md` §6.5 never mentions                                      | **Rendered as a visually distinct closing line** — `fg` rather than the paragraphs' `fg-muted`, set off by a `border-l-2 border-accent` rule. It is the one sentence naming what the visitor can act on; folding it into the prose loses it. |
| 2   | The optional About portrait permitted by §6.5 (96–128px, floated right at `md`+)                                            | **Dropped.** No `portrait` field on `AboutType`, no asset, and the hero already carries a portrait. §6.5's portrait clause is removed rather than left as an unimplemented option, so nobody re-opens it later.                              |
| 3   | Skill group label semantics — §6.6 styles it like a heading, `2-architecture.md` §8's outline has no `h3` under Skills      | **Labelled list, not a heading.** Each group is a `<ul role="list" aria-labelledby>` whose label is a `<p>` carrying the id. See the note below for why, and why `role="list"` is not redundant.                                             |
| 4   | `skills.ts` ships six groups whose set and order differ from `1-prd.md` §3's recommended six (no AI/LLM; "Languages" added) | **Render the data's six groups in the data's order.** The page has room the résumé does not; the AI/LLM gap is a content question tracked in `E04-status.md`, not a rendering one. No reordering, no data edit in this epic.                 |

### Why a labelled list rather than `h3`s

Headings are the right answer when a group is a **section of the document**. These are
not — they are one heading's worth of content grouped six ways for scanning, and
`2-architecture.md` §8 already fixed the home page outline with no `h3` under `h2:
Skills`. Six `h3`s would put six entries in the heading outline that a screen reader user
must page past to reach Contact, and they would still not say how many skills each group
holds.

The labelled list does both jobs: the group name is announced on entry **and** the
list carries its length — "Frontend, list, 9 items" — which is the fact a scanner wants
and a heading cannot give.

`role="list"` is set explicitly because Tailwind's reset removes `list-style`, and
**Safari + VoiceOver drops list semantics from any `ul` with `list-style: none`**. Without
the attribute the group announces nothing and the count is lost — the exact accessibility
regression this pattern exists to avoid. It is not redundant markup.

---

## E11-T01 — Amend the About closing line, the About portrait, and the skills labelling in the docs

**Depends on:** none
**Files:** modified — `docs/3-style-preference.md`, `docs/2-architecture.md`,
`docs/4-interaction-design.md`, `docs/5-epic-list.md`, `docs/tickets/README.md`
**Commit:** `docs: fix the about closing line, drop the about portrait, specify skill group labelling`

**Scope**

- In: the three decisions above, written into the source documents that state the
  opposite or say nothing.
- Out: all code. No file under `src/` is touched by this commit.

**Implementation notes**

- `3-style-preference.md` §6.5 — remove the optional-portrait sentence entirely (decision
  2). Add the closing line: `fg` on the section background, a `border-l-2 border-accent`
  rule with `pl-4`, `mt-6` spacing, `body`/`body-md` type. State that it renders only when
  `lookingFor` is present, since the field is optional on `AboutType`.
- `3-style-preference.md` §6.6 — replace "mono `eyebrow` group label, then a
  `flex-wrap gap-2` row of `Badge`s" with the labelled-list pattern, including the
  `role="list"` requirement and the Safari/VoiceOver reason. The visual result is
  unchanged; only the markup contract is being written down.
- `2-architecture.md` §8 — add a line under the home-page outline stating that Skills has
  no `h3` level **by decision**, and that group labels are list labels. Without it the
  absence reads as an oversight and someone adds them back.
- `4-interaction-design.md` §5.4 — note the closing line. §5.5 — note the labelled list.
  §10 (decision table) — three new rows, matching the existing row format.
- `5-epic-list.md` E11 — add the closing line to the deliverables and the labelled-list
  requirement to acceptance. Leave the three existing acceptance criteria intact.
- `README.md` — decision rows 10, 11, 12; E11 index row is **not** added here, it lands
  with the status file in T07.

**Acceptance**

- [ ] `grep -n "portrait" docs/3-style-preference.md` returns no match inside §6.5.
- [ ] §6.5 names the closing line's colour, border, and spacing, and states it is
      conditional on `lookingFor`.
- [ ] §6.6 names `role="list"` and `aria-labelledby`, and gives the Safari/VoiceOver
      reason in the same paragraph.
- [ ] `2-architecture.md` §8's home-page outline is unchanged in structure and gains a
      sentence explaining the missing `h3` level.
- [ ] `4-interaction-design.md` §10 gains three rows; the existing rows are byte-identical.
- [ ] `git diff --stat` shows no file under `src/`.

**Traceability:** `1-prd.md` §3 About, Skills · `2-architecture.md` §8 ·
`3-style-preference.md` §6.5, §6.6 · `4-interaction-design.md` §5.4, §5.5, §10 ·
`5-epic-list.md` E11

---

## E11-T02 — Add the 300ms badge reveal duration to the motion vocabulary

**Depends on:** none
**Files:** modified — `src/constants/motion.ts`, `src/lib/motion.ts`,
`src/hooks/useMotionVariants.ts`
**Commit:** `feat(motion): add the badge reveal duration for staggered badge groups`

**Scope**

- In: `DURATION_BADGE`, a `badgeFadeUp` variant using it, and its exposure through
  `useMotionVariants` with the reduced-motion fallback wired.
- Out: applying it. T06 consumes it; nothing in this commit renders differently.

**Cross-epic, deliberately.** These three files are E06's. Animation 4 specifies **300ms**
and `DURATION_REVEAL` is 400ms, so there is no honest way to build animation 4 from
inside `components/sections/` — the same necessary reach-across as E10-T05 into E07's
`navigation.ts`. Record the touch in **both** `E06-status.md` and `E11-status.md`.

This is not a §8 amendment. Animation 4 is already on the closed inventory with its
duration stated; the token to express it was simply never added, because E06 shipped
before anything staggered badges.

**Implementation notes**

- `DURATION_BADGE = 0.3` in `src/constants/motion.ts`, adjacent to the existing duration
  constants, citing §8 row 4.
- `badgeFadeUp` mirrors `fadeUp` exactly except for the duration — same
  `REVEAL_OFFSET_Y`, same `EASE_REVEAL`. A second easing curve for one badge row would be
  drift nobody could justify.
- `useMotionVariants` returns `badgeFadeUp`, and returns `reducedFadeUp` in its place when
  the visitor prefers reduced motion. The whole reason that hook exists is that the check
  is written once — a component reaching for `badgeFadeUp` from `@/lib/motion` directly
  would bypass it, which is how a reduced-motion regression gets shipped.
- `STAGGER_BADGES` (0.04) already exists from E06 and needs no change.

**Acceptance**

- [ ] `DURATION_BADGE` is `0.3`, and `badgeFadeUp.visible.transition.duration` reads it
      rather than restating `0.3`.
- [ ] `badgeFadeUp.hidden` equals `fadeUp.hidden` — same `opacity` and same `y`.
- [ ] `useMotionVariants()` returns `badgeFadeUp` when motion is allowed and
      `reducedFadeUp` when it is not, verified by the existing reduced-motion path.
- [ ] Nothing renders differently: the four gates pass and the built page is visually
      unchanged from the previous commit.

**Traceability:** `4-interaction-design.md` §8 row 4, § Reduced motion · `AGENTS.md` §7

---

## E11-T03 — Build `AboutSection`, replacing the `#about` scaffold

**Depends on:** T01
**Files:** created — `src/components/sections/AboutSection.tsx`; modified —
`src/pages/HomePage.tsx`
**Commit:** `feat(about): build the about section from the bio data`

**Scope**

- In: the prose paragraphs, the closing line, the section reveal, and swapping the
  `#about` placeholder in `HomePage`.
- Out: Skills — T05 owns `#skills`, and the `#contact` scaffold stays exactly as it is
  until E13.

**Implementation notes**

- `ABOUT.paragraphs` renders in order at `max-w-content` (768px), `body`/`md:body-md`,
  `fg-muted` (§6.5). The measure token already exists; no arbitrary width.
- `ABOUT.lookingFor` is **optional on the type** — render the closing line only when it is
  present. An empty bordered rule left behind by absent data is the empty-state failure
  §14 asks every section to handle.
- Closing line: `mt-6 border-l-2 border-accent pl-4 text-body text-fg md:text-body-md`
  (§6.5 as amended by T01). `fg` against `fg-muted` prose is what makes it read as a
  distinct statement rather than a fourth paragraph.
- Paragraph keys: `SKILL_GROUPS`-style stable ids do not exist on `paragraphs` — it is a
  plain `string[]`. The array is a module constant that is never reordered or filtered, so
  the index key is the documented exception in `AGENTS.md` §5, and the comment must say
  so rather than leaving the next reviewer to flag it.
- Section reveal is animation 2 and nothing more: one `motion.div` with `fadeUp`,
  `whileInView="visible"`, `viewport={VIEWPORT_ONCE}`, exactly as `CurrentRoleSection`
  does. The paragraphs are not orchestrated — §8's closed-list default.
- No eyebrow. `Section`'s eyebrow is an opt-in (`README.md` decision 5) and §6.5 does not
  ask for one.

**Acceptance**

- [ ] `#about` renders three paragraphs from `ABOUT.paragraphs` in data order; no bio copy
      appears in the component file.
- [ ] The closing line renders with the accent rule and `fg` colour; with `lookingFor`
      temporarily removed from the data, neither the line nor the border renders and the
      section ends after the last paragraph.
- [ ] Prose measures ≤768px at 1920 — measured via `getBoundingClientRect().width` on a
      paragraph, not by eye.
- [ ] The section fades in on first scroll into view and does not re-animate on a second
      pass; under `prefers-reduced-motion: reduce` it is at full opacity on arrival.
- [ ] `HomePage` no longer renders `PLACEHOLDER` for `#about`; the `#skills` and
      `#contact` scaffolds are byte-identical.
- [ ] The nav's About item still scrolls to the section and the scroll spy still
      highlights it.

**Traceability:** `1-prd.md` §3 About · `3-style-preference.md` §6.5 ·
`4-interaction-design.md` §5.4, §8 · `5-epic-list.md` E11

---

## E11-T04 — Build `SkillGroup` as a labelled list

**Depends on:** T01
**Files:** created — `src/components/sections/SkillGroup.tsx`
**Commit:** `feat(skills): build the skill group as an accessibly labelled list`

**Scope**

- In: one group — its label, its badge list, and the markup contract from decision 3.
- Out: composing the six groups, the empty-group rule, and the stagger. T05 and T06.

**Implementation notes**

- Props are `label` and `skills`, plus the `id` used to tie the two together. Content-
  agnostic and prop-driven — it never imports `SKILL_GROUPS` (`AGENTS.md` §3).
- Markup:

  ```
  <div>
    <p id={labelId} class="font-mono text-eyebrow text-accent uppercase">{label}</p>
    <ul role="list" aria-labelledby={labelId} class="mt-3 flex flex-wrap gap-2">
      <li><Badge>{skill}</Badge></li>
    </ul>
  </div>
  ```

- The label's classes match `Section`'s eyebrow exactly (§6.6, §4.2). Same role, same
  treatment — divergence here would be visible on the same page.
- `role="list"` is required, for the Safari/VoiceOver reason in decision 3. It carries a
  comment saying why, or someone removes it as redundant within a month.
- `Badge` renders a `<span>`, so it nests inside `<li>` without change. Do not modify
  `Badge` — it is E05's and correct as it stands.
- Key on the skill string. Skills within a group are unique and never reordered.
- The component lives in `components/sections/` alongside `SkillsSection`, matching
  `2-architecture.md` §7's placement of `SkillGroup`.

**Acceptance**

- [ ] Rendering with a label and three skills produces one `<ul role="list">` whose
      `aria-labelledby` resolves to the label element's id.
- [ ] The accessibility tree reports the list with its group name and its item count —
      captured from the rendered page, not asserted from the source.
- [ ] Ids are unique when two groups render on the same page.
- [ ] The component contains no skill names and no import from `@/data/`.
- [ ] Badges wrap onto multiple rows at 320px with no horizontal overflow.

**Traceability:** `1-prd.md` §3 Skills · `2-architecture.md` §7, §8 ·
`3-style-preference.md` §4.2, §6.6 · `AGENTS.md` §3, §10

---

## E11-T05 — Build `SkillsSection`, replacing the `#skills` scaffold

**Depends on:** T04
**Files:** created — `src/components/sections/SkillsSection.tsx`; modified —
`src/pages/HomePage.tsx`
**Commit:** `feat(skills): build the skills section from the skill group data`

**Scope**

- In: composing `SkillGroup` over `SKILL_GROUPS`, the empty-group rule, the section
  reveal, and swapping the `#skills` placeholder.
- Out: the badge stagger (T06) and the `#contact` scaffold (E13).

**Implementation notes**

- All six groups render in data order (decision 4). No slicing, no "show more", no
  reordering in the component.
- **A group with no skills renders nothing at all** — not a label with an empty row.
  Filter before mapping, the same shape `ProjectsSection` uses for empty categories.
- If every group is empty the section renders `null`, mirroring `ProjectsSection`. Unlike
  Projects this removes **no nav item**: `#skills` has no nav entry
  (`4-interaction-design.md` §1), so there is nothing to derive and `navigation.ts` is not
  touched by this epic.
- Group ids feed both the React key and `SkillGroup`'s `aria-labelledby` id — derive the
  DOM id from `group.id` (e.g. `skills-${group.id}-label`) rather than generating one, so
  it is stable across renders and inspectable.
- Vertical rhythm between groups: `space-y-8`. One group per row (§6.6).
- Section reveal is animation 2 on a single wrapper, as in T03. The stagger lands in T06.
- No eyebrow, for the same reason as T03.
- **No proficiency affordance of any kind.** `SkillGroupType` has no level field, which is
  what makes this enforceable rather than a matter of restraint — do not add one.

**Acceptance**

- [ ] `#skills` renders six labelled groups in `SKILL_GROUPS` order with every skill
      present; no skill name appears in any component file.
- [ ] With one group's `skills` temporarily emptied, that group's label does not render
      and the remaining five are unaffected; restored before commit, `git diff` on
      `skills.ts` empty.
- [ ] With `SKILL_GROUPS` temporarily emptied, `#skills` renders nothing and the page has
      no empty section box; the nav is unchanged, since Skills has no nav item.
- [ ] `grep -rniE "proficien|percent|rating|star|progress" src/components/sections/ src/types/skill.types.ts`
      returns nothing.
- [ ] No `<progress>`, no meter, no bar element anywhere in the rendered `#skills`.
- [ ] `HomePage` renders `PLACEHOLDER` for `#contact` only.

**Traceability:** `1-prd.md` §3 Skills · `3-style-preference.md` §6.6 ·
`4-interaction-design.md` §5.5 · `5-epic-list.md` E11 acceptance

---

## E11-T06 — Stagger the skill badges on section reveal

**Depends on:** T02, T05
**Files:** modified — `src/components/sections/SkillGroup.tsx`,
`src/components/sections/SkillsSection.tsx`
**Commit:** `feat(skills): stagger the skill badge reveal within each group`

**Scope**

- In: animation 4 — badges 40ms apart, 300ms each, triggered by the section reveal.
- Out: every other animation. Nothing about animations 1–3 or 5–11 changes.

**Where the stagger lives, and why it is per group.** §8 row 4 gives the trigger as
_parent section reveal_ and the spacing as _40ms apart_, and the rules beneath the table
cap "total stagger **per group**" at ~300ms. Those combine to exactly one arrangement:

- the **section** owns the `whileInView` trigger — one trigger, so all six groups begin
  together and no group animates on its own the way the two project subsections
  deliberately do;
- each **group** owns a `staggerContainer`, so its badges cascade left→right within the
  group and the 300ms cap applies to the group, not to all ~37 badges at once.

Flattening every badge under one container would force the cap down to ~8ms apart, which
is not a stagger anyone can perceive — the animation would technically exist and
communicate nothing.

**Implementation notes**

- `stagger = Math.min(STAGGER_BADGES, STAGGER_MAX_TOTAL / Math.max(skills.length, 1))`,
  the same guard `ProjectCarousel` uses for cards. Frontend ships nine skills; at a flat
  40ms it would run 360ms and breach the cap.
- Motion propagates a variant label to all motion descendants, so the group containers
  need no `whileInView` of their own — they inherit `visible` from the section wrapper.
  Giving them one would re-introduce per-group triggering.
- Badge items use `badgeFadeUp` from `useMotionVariants` (T02), never imported from
  `@/lib/motion` directly.
- The `<li>` becomes `motion.li`. Do not wrap `Badge` in an extra `motion.span` — an extra
  element inside a list item to carry an animation is markup added for motion's
  convenience.
- Under reduced motion `useMotionVariants` supplies the final-state variants and
  `staggerContainer` collapses, so badges are visible immediately. That path already
  exists; do not add a second check here.

**Acceptance**

- [ ] Sampling `opacity` per badge frame-by-frame during the reveal: within a group the
      badges start at increasing times, spread >30ms and ≤320ms end to end. Endpoint
      state is not evidence — an element that never animates is indistinguishable from
      one that finished.
- [ ] All six groups begin within one frame of each other; no group waits for the group
      above it to finish.
- [ ] Before `#skills` enters view its badges are at opacity <0.2; after, all are >0.9.
- [ ] Re-scrolling past `#skills` does not replay the animation (`viewport.once`).
- [ ] Under `prefers-reduced-motion: reduce` every badge is at full opacity within 80ms
      of the section entering view, with no transform applied.
- [ ] Only `opacity` and `transform` appear in the computed transition — no `width`, no
      `height`.

**Traceability:** `4-interaction-design.md` §8 row 4 and rules, § Reduced motion ·
`AGENTS.md` §7

---

## E11-T07 — Verification pass and `E11-status.md`

**Depends on:** T01–T06
**Files:** created — `docs/tickets/E11-status.md`; modified —
`docs/tickets/STATUS.md`, `docs/tickets/README.md`
**Commit:** `docs(tickets): record E11 status`

**Scope**

- In: verifying the epic end to end at real viewports, in both themes, by keyboard and
  screen reader, and writing the evidence down.
- Out: any fix it uncovers. A defect found here is a new ticket or an amendment to the
  ticket that caused it — not a silent extra commit on this one.

**Implementation notes**

- Viewports 320 / 375 / 768 / 1024 / 1440 / 1920, both themes. `window.scrollX` after
  `scrollTo(9999, y)` is the reliable horizontal-overflow probe —
  `documentElement.scrollWidth` lies under device emulation (`E10-status.md` §2).
- Emulate `prefers-reduced-motion` **explicitly in both directions**. Headless Chrome
  defaults to `reduce`, which silently measures the reduced path and passes motion
  criteria for the wrong reason (`E10-status.md` §3).
- Tab through `#about` and `#skills`: neither section adds a tab stop. Both are static
  content, so the count of focusable elements inside them is **zero** — assert that
  rather than assuming it.
- Capture the accessibility tree for `#skills` once and paste it into the status file. It
  is the only evidence for T04's labelling that a future reader can check without
  re-running anything.
- Record the cross-epic touch from T02 in `E06-status.md` as well as `E11-status.md`.
- `README.md` gains the E11 index row and the Phase 3 count; `STATUS.md` gains the
  roll-up line.

**Acceptance**

- [ ] Four gates green, output pasted into the status file.
- [ ] No horizontal page scroll at any of the six widths, in either theme, measured with
      the `scrollX` probe.
- [ ] Both sections correct in light and dark: prose, the About accent rule, and badge
      contrast all pass AA, with measured ratios recorded.
- [ ] Tab from the Projects section reaches Contact without stopping inside `#about` or
      `#skills`.
- [ ] The accessibility tree for `#skills` shows six labelled lists with their item
      counts.
- [ ] Motion verified with reduced motion both off and on, sampled mid-transition.
- [ ] `E11-status.md` records every acceptance criterion in T01–T06 with its evidence;
      `README.md` and `STATUS.md` show E11 at 7 tickets.

**Traceability:** `AGENTS.md` §11, §14 · `3-style-preference.md` §12 ·
`4-interaction-design.md` §11

---

## Coverage

### Deliverables

| `5-epic-list.md` E11 deliverable                      | Tickets  |
| ----------------------------------------------------- | -------- |
| `AboutSection` — `max-w-content` prose, no accordion  | T03      |
| `SkillsSection` + `SkillGroup`, grouped by capability | T04, T05 |

### Acceptance criteria

| `5-epic-list.md` E11 acceptance criterion         | Tickets  |
| ------------------------------------------------- | -------- |
| No proficiency bars, percentages, or star ratings | T05, T07 |
| Skill groups render from data                     | T05      |
| An empty group does not render                    | T05      |
| Prose respects the ~68-character measure          | T03, T07 |

### Requirements reached beyond the epic list

| Source                                                             | Ticket   |
| ------------------------------------------------------------------ | -------- |
| Animation 4 — skill badges, 40ms apart, 300ms                      | T02, T06 |
| `3-style-preference.md` §6.5 — the `lookingFor` closing line       | T01, T03 |
| `2-architecture.md` §8 — no `h3` level under Skills, by decision   | T01, T04 |
| `AGENTS.md` §10 — group labelling that survives VoiceOver          | T01, T04 |
| `4-interaction-design.md` §5.4–5.5 — both sections non-interactive | T07      |

---

## Open Questions

**None outstanding.** Four ambiguities were found during decomposition and all four were
answered before tickets were written; three are fixed in the source documents by T01
rather than left for the implementer.

Two things are deliberately **out** of this epic and are not gaps:

1. **The About portrait** (§6.5's optional 96–128px image). Removed from the spec by T01,
   not deferred — there is no asset, no data field, and the hero already carries one.
2. **The missing AI/LLM skill group.** `1-prd.md` §3 recommends it and `skills.ts`
   deliberately omits it, because nothing on the CV supports it. That is the positioning
   question already open in `E04-status.md` — either the experience gets added or the
   PRD's "full-stack and AI engineering" framing is revisited. Rendering cannot resolve it,
   and E11 must not paper over it with an empty group.
