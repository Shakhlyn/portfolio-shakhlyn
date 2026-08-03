# E11 — About & Skills · Status

Tickets: [E11-tickets.md](E11-tickets.md) · Overview: [STATUS.md](STATUS.md)

**7 / 7 done.** Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                                                      | Status | Notes                                    |
| ------- | ---------------------------------------------------------- | ------ | ---------------------------------------- |
| E11-T01 | Amend the closing line, the portrait, the skills labelling | ✅     | Docs only, no `src/` file touched        |
| E11-T02 | `DURATION_BADGE` and `badgeFadeUp`                         | ✅     | Cross-epic: edits E06's three files      |
| E11-T03 | `AboutSection`                                             | ✅     |                                          |
| E11-T04 | `SkillGroup` as a labelled list                            | ✅     |                                          |
| E11-T05 | `SkillsSection`                                            | ✅     |                                          |
| E11-T06 | Staggered badge reveal (animation 4)                       | ✅     |                                          |
| E11-T07 | Verification pass                                          | ✅     | 46 browser checks across three harnesses |

## Files

```
src/components/sections/AboutSection.tsx    prose + the conditional closing line
src/components/sections/SkillGroup.tsx      one labelled list, owns its badge stagger
src/components/sections/SkillsSection.tsx   six groups, empty-group omission
src/pages/HomePage.tsx                      both scaffolds replaced; #contact untouched
src/constants/motion.ts                     + DURATION_BADGE          (E06's file)
src/lib/motion.ts                           + badgeFadeUp             (E06's file)
src/hooks/useMotionVariants.ts              + badgeFadeUp, reduced fallback (E06's file)
```

## 1. Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK — 477.34 kB / 153.20 kB gzip
```

`yarn tsc --noEmit` is **not** a gate here and never was: the root `tsconfig.json` is a
solution file with `"files": []`, so bare `tsc --noEmit` checks nothing and always exits 0. `yarn typecheck` runs `tsc -b --noEmit` across the project references. First recorded
in [E09-status.md](E09-status.md).

## 2. Cross-epic touch: E11-T02 edits E06's files

`src/constants/motion.ts`, `src/lib/motion.ts`, and `src/hooks/useMotionVariants.ts`
belong to E06. Animation 4 specifies **300ms** and `DURATION_REVEAL` is 400ms, so there
is no way to build it from inside `components/sections/` without either duplicating a
duration or restating one inline. Recorded in [E06-status.md](E06-status.md) as well as
here, so the next reader finds it from either end.

This is **not** a §8 amendment. Animation 4 was already on the closed inventory with its
duration stated; only the token was missing, because E06 shipped before anything
staggered badges.

## 3. Finding: the scroll spy retains the last observed section

Not an E11 defect — **behaviour is byte-identical on the pre-E11 build** — but it was
found here and should not be lost.

`src/data/navigation.ts` carries this comment:

> Only sections that have a nav entry belong here — `#current-role` and `#skills` are part
> of the scan path but have no nav item, so **highlighting nothing while they are in view
> is correct**.

The implementation does not do that. `useActiveSection` observes only the anchored
sections, and an `IntersectionObserver` fires only when an **observed** target changes
intersection — so while `#skills` fills the viewport, whichever nav item was last active
stays highlighted. Measured on both builds at 1440×900, scrolling `#skills` to centre:

| Build          | `aria-current="true"` on |
| -------------- | ------------------------ |
| HEAD (pre-E11) | Home                     |
| E11            | Home                     |

The comment describes an intent the code never implemented, and E11 changed neither. It
is E07's to resolve — either the comment is wrong and retention is the desired behaviour
(defensible: a highlighted item is a "you are here" for the region, not the pixel), or
the spy needs a null state. **Raise it as an E07 amendment ticket; do not fix it inside a
feature epic.** E11's own criterion is that the spy is unchanged, and it is.

## 4. Criteria verified against temporarily edited data

Three criteria are unobservable against real content. Each was verified by editing
`src/data/`, rebuilding, measuring, and restoring from a scratchpad backup. `git diff` on
`src/data/` is empty at commit time.

| Edit                       | Observed                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ABOUT.lookingFor` removed | 0 bordered paragraphs, 3 paragraphs total; section ends after the prose                                            |
| `Data.skills` emptied      | Labels: Languages, Frontend, Backend, Infrastructure, Practices — 5 lists, no empty label                          |
| `SKILL_GROUPS` emptied     | `#skills` absent from the DOM entirely; `h2`s are Current Role, Projects, About, Contact; nav unchanged at 6 items |

A criterion verified only by reading the code is not verified.

## 5. Per-ticket evidence

### T01 — docs

- `3-style-preference.md` §6.5's portrait clause is gone; the only "portrait" in §6.5 is
  the sentence recording its removal. §6.2's hero portrait is untouched.
- §6.5 names the closing line's colour (`fg`), rule (`border-l-2 border-accent`), spacing
  (`pl-4`, `mt-6`), type (`body`/`body-md`), and its conditionality.
- §6.6 names `role="list"`, `aria-labelledby`, and the Safari/VoiceOver reason in the same
  paragraph.
- `2-architecture.md` §8's outline block is unchanged — `git diff` shows additions only.
- `4-interaction-design.md` §10 gained rows 13–15. `git diff --ignore-all-space` shows
  **one** removed line, the table's separator row, whose column padding Prettier widened
  to fit the new rows. All twelve existing rows are content-identical.
- `git diff --name-only -- src/` on that commit: empty.

### T02 — motion token

Values dumped from the real modules (Node type-stripping, no rebuild of the assertions):

```json
{
  "DURATION_BADGE": 0.3,
  "DURATION_REVEAL": 0.4,
  "badgeHidden": { "opacity": 0, "y": 12 },
  "fadeHidden": { "opacity": 0, "y": 12 },
  "badgeTransition": { "duration": 0.3, "ease": [0.16, 1, 0.3, 1] },
  "fadeTransition": { "duration": 0.4, "ease": [0.16, 1, 0.3, 1] }
}
```

- `badgeFadeUp.hidden` deep-equals `fadeUp.hidden`, and both share `EASE_REVEAL`.
- `grep "0.3" src/lib/motion.ts` returns nothing — the duration is read from the
  constant, not restated.
- The reduced-motion swap is verified behaviourally in §5/T06 below: under `reduce` every
  badge is final with no transform, which is only true if the hook returned
  `reducedFadeUp` in `badgeFadeUp`'s place.
- Nothing rendered differently at T02: the only importer of `badgeFadeUp` at that commit
  is `useMotionVariants`, which no component consumed until T06.

### T03 — About

| Criterion                                 | Evidence                                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Three paragraphs in data order            | Rendered `textContent` deep-equals `ABOUT.paragraphs` extracted from the module                           |
| No bio copy in the component              | `AboutSection.tsx` contains no prose; all text comes from `ABOUT`                                         |
| Closing line with accent rule             | `border 2px rgb(167, 139, 250)`, text equals `ABOUT.lookingFor`                                           |
| Closing line is `fg`, prose is `fg-muted` | `rgb(227, 232, 242)` vs `rgb(164, 174, 196)`                                                              |
| Absent when the field is absent           | §4 above                                                                                                  |
| Measure ≤768px at 1920                    | `getBoundingClientRect().width` = **768px** at a 1920px viewport                                          |
| Reveal once, final under reduced motion   | Opacity 1 under `reduce`; fades in and does not replay otherwise                                          |
| `#contact` scaffold untouched             | `git diff src/pages/HomePage.tsx` leaves the Contact `Section` unchanged                                  |
| Nav and spy still work                    | About click: `scrollY 0 → 2766`, `h2` at 176px (clear of the 64px header), `aria-current="true"` on About |

### T04 — SkillGroup

Accessibility tree, captured from the rendered page via `Accessibility.getFullAXTree`:

```
list "LANGUAGES"       5 items
list "FRONTEND"        9 items
list "BACKEND"         6 items
list "DATA"            3 items
list "INFRASTRUCTURE"  6 items
list "PRACTICES"       5 items
```

The name and the item count are both exposed — the two things six `h3`s would not have
given. (The name uppercases because the label is styled `uppercase`; the accessible name
comes from the rendered text.)

- Every `ul` carries `role="list"` and an `aria-labelledby` that resolves:
  `skills-languages-label→Languages`, `skills-frontend-label→Frontend`,
  `skills-backend-label→Backend`, `skills-data-label→Data`,
  `skills-infrastructure-label→Infrastructure`, `skills-practices-label→Practices`.
- 6 unique ids of 6 groups.
- `#skills` contains exactly one heading — `H2:Skills`.
- No import from `@/data/` and no skill name in `SkillGroup.tsx`.
- At 320px the nine Frontend badges wrap onto **4 rows**, rightmost edge 288px of 320px.

### T05 — SkillsSection

- Six groups in data order with every skill: Languages(5), Frontend(9), Backend(6),
  Data(3), Infrastructure(6), Practices(5) — deep-equals `SKILL_GROUPS`.
- Empty group and all-empty behaviour: §4 above.
- `grep -rniE "proficien|percent|rating|star|progress" src/components/sections/ src/types/skill.types.ts`
  → no match.
- `progress`, `meter`, `[role="progressbar"]` inside `#skills`: **0**.
- `#skills` contains **0** focusable elements, so it adds no tab stop.

### T06 — stagger

Sampled frame-by-frame during the reveal, not at the endpoint:

| Group          | Badge start offsets spread |
| -------------- | -------------------------- |
| Languages      | 167ms                      |
| Frontend       | 271ms                      |
| Backend        | 199ms                      |
| Data           | 87ms                       |
| Infrastructure | 199ms                      |
| Practices      | 167ms                      |

- Every spread is >30ms and ≤320ms — the ~300ms cap holds per group, including Frontend's
  nine badges, which a flat 40ms would have run to 360ms.
- First-badge offsets per group: **17ms across all six** — the groups begin together, so
  no group waits for the one above it.
- Before the section enters view, max badge opacity **0**; after, min **1**.
- Scrolling away and back: opacity stays 1, no replay (`viewport.once`).
- Under `prefers-reduced-motion: reduce`: all 34 badges at opacity 1 within 80ms, and the
  only computed transform across all of them is `none`.

Reduced motion was emulated **explicitly in both directions**. Headless Chrome defaults to
`reduce`, which silently measures the reduced path and passes motion criteria for the
wrong reason ([E10-status.md](E10-status.md) §3).

### T07 — cross-cutting

- No horizontal page scroll at 320 / 375 / 768 / 1024 / 1440 / 1920, in both themes —
  12 checks, `window.scrollX` after `scrollTo(9999, y)`. `documentElement.scrollWidth` is
  unreliable under device emulation and was not used.
- Contrast, computed from rendered colours:

| Theme | Prose  | Closing line | Group label | Badge  |
| ----- | ------ | ------------ | ----------- | ------ |
| Light | 7.73:1 | 17.72:1      | 5.7:1       | 6.48:1 |
| Dark  | 8.65:1 | 15.67:1      | 7.08:1      | 9:1    |

All pass WCAG AA (4.5:1) with room to spare.

- Tabbing from Projects reaches Contact without stopping: 0 focusable elements in
  `#about`, 0 in `#skills`.

## 6. Harnesses

| Script                 | Checks | Covers                                                     |
| ---------------------- | ------ | ---------------------------------------------------------- |
| `verify-e11.mjs`       | 34     | Content, structure, a11y tree, stagger, contrast, overflow |
| `verify-e11-empty.mjs` | 8      | Four temporary-data and wrap modes                         |
| `verify-e11-nav.mjs`   | 4      | Anchor navigation and the scroll spy                       |
| **Total**              | **46** | all passing                                                |

Assertions compare the rendered page against the data extracted from `src/data/*.ts` at
run time, so a data edit cannot silently pass by matching a copy of itself.

## 7. Outstanding

- **The AI/LLM skill group is still absent**, deliberately — nothing on the CV supports
  it. Either that experience gets added or the PRD's "full-stack and AI engineering"
  framing needs revisiting. Tracked in [E04-status.md](E04-status.md); rendering could not
  resolve it and E11 did not paper over it with an empty group.
- **`ABOUT` is draft copy**, marked `TODO(content)`, including two
  `TODO(content): INVENTED FIGURE` lines. Gated for E18.
- The spy retention finding in §3, for E07.
