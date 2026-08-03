# Ticket Status — Overview

Roll-up across all epics. Per-epic detail lives in `E0X-status.md` next to each
ticket file. **Update the per-epic file when you finish a ticket; update this table
when an epic's counts change.**

Last updated: **2026-08-03**

## Legend

| Mark | Meaning                                                                                                                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅   | Done — code written, all four gates pass, acceptance criteria met                                                                                |
| 🔍   | Code done, but one or more acceptance criteria need **manual browser verification** (visual, screen reader, throttled reload). Not yet confirmed |
| ⛔   | **Blocked** — cannot proceed without something outside the code (almost always real content)                                                     |
| ⬜   | Not started                                                                                                                                      |

## Roll-up

| Epic                                   | Done   | Needs manual check | Blocked | Not started | Total  |
| -------------------------------------- | ------ | ------------------ | ------- | ----------- | ------ |
| [E01 Tooling](E01-status.md)           | 7      | 0                  | 0       | 0           | 7      |
| [E02 Tokens & Theming](E02-status.md)  | 3      | 2                  | 0       | 0           | 5      |
| [E03 Routing & Shell](E03-status.md)   | 4      | 2                  | 0       | 0           | 6      |
| [E04 Data Layer](E04-status.md)        | 5      | 0                  | 0       | 0           | 5      |
| [E05 UI Primitives](E05-status.md)     | 6      | 3                  | 0       | 0           | 9      |
| [E06 Motion Foundation](E06-status.md) | 2      | 2                  | 0       | 0           | 4      |
| **Phase 1 total**                      | **27** | **9**              | **0**   | **0**       | **36** |

**Phase 1 is complete.** Nothing is blocked or unstarted. The nine remaining items are
acceptance criteria that need a browser — theme flash, focus order, contrast,
reduced motion — not unwritten code.

## Phase 2

| Epic                                     | Done | Needs manual check | Blocked | Not started | Total |
| ---------------------------------------- | ---- | ------------------ | ------- | ----------- | ----- |
| [E07 Header & Navigation](E07-status.md) | 14   | 0                  | 0       | 0           | 14    |
| [E08 Social Rail](E08-status.md)         | 8    | 0                  | 0       | 0           | 8     |

## Phase 3

| Epic                                     | Done | Needs manual check | Blocked | Not started | Total |
| ---------------------------------------- | ---- | ------------------ | ------- | ----------- | ----- |
| [E09 Hero & Current Role](E09-status.md) | 8    | 0                  | 0       | 0           | 8     |
| [E10 Projects](E10-status.md)            | 12   | 0                  | 0       | 0           | 12    |

E10 was verified with **86 automated browser checks, 85 passing**. It found one real
defect of its own: 69px of horizontal **page** scroll at 1440, caused not by the
deliberate mobile bleed the ticket was written to guard but by `sr-only` spans —
`overflow-x: auto` does not clip absolutely positioned descendants unless the scroller is
also their containing block. Fixed with `relative` on the track.

**E10 also found and fixed the bug that had disabled every animation on the site.**
`PageTransition` carried `<AnimatePresence initial={false}>`, which sets
`PresenceContext.initial = false` and makes _every descendant_ motion component skip its
own `initial`. The hero painted at its final state and no scroll reveal had a `hidden`
state to travel from — from the day E06 shipped until now. Three competing hypotheses
(observer margin, reduced-motion state, headless-browser artefact) were killed by
measurement first; detail in [E10-status.md](E10-status.md) §3 and
[E06-status.md](E06-status.md).

This retires the 🔍 reduced-motion checks against E02 and E06 above: they were passing for
the wrong reason, since an element that never animates is indistinguishable from one
correctly honouring the preference. Both were re-verified against the real transition.

E09 was verified with 33 automated browser checks the same way as E07 and E08. It found
one real defect of its own — the portrait slot shrank to 233px against a specified 280px
as a flex child, which is exactly the CLS the aspect-ratio lock exists to prevent — and
one gate that was not gating: bare `tsc --noEmit` typechecks **nothing** here, because
the root `tsconfig.json` is a solution file with `"files": []`. Use `yarn typecheck`.

**E09-T08 was unblocked the same day** by the supplied photograph and is done: cropped to
the slot's 3:4 and converted to WebP (36 KB from 102 KB) using the verification browser,
since no image tooling is installed and no dependency was worth adding for one file.
`PROFILE.layout` is now `'split'` and the portrait is the LCP element at 616ms, CLS 0.

E09 closed E08's deferred criterion (rail and hero social links never both visible) and
retired E07's weakly-verified one (the next Tab after a nav anchor now lands on the
hero's "View Resume" CTA). LCP on a throttled mobile profile is **496ms** against the
2.5s budget.

E07 was verified with 27 automated checks in a real browser (headless Chrome over
CDP against a production build), so none of its criteria are left pending a manual
pass. One is verified in a weaker form and must be re-tested once sections have real
content — see [E07-status.md](E07-status.md).

E08 was verified with 26 automated checks the same way. It found three defects of its
own, one of which was a wrong premise in its own ticket file: the social rail sat on
top of real page content between 640px and ~1280px, because the container's left
gutter is narrower than the rail. Fixed by widening that gutter — detail in
[E08-status.md](E08-status.md). One E08 criterion is **deferred to E09**, not passed:
"rail and hero social links never both visible" cannot be closed before the hero
exists.

**E07 also fixed two pre-existing defects**: an anchor offset that stacked
`scroll-padding-top` with `scroll-mt-20`, and route-change focus that had never
worked because it raced `PageTransition`'s exit animation. The second one retires a
pending E03-T06 check — and shows why the 🔍 items above are worth actually running.

## Gate status

All four gates pass on the current tree:

```
yarn typecheck    ✅ clean
yarn lint         ✅ zero errors
yarn format:check ✅ clean
yarn build        ✅ succeeds, lazy routes split into separate chunks
```

Build output: entry `459 kB / 147 kB gzip`, four lazy chunks at ~0.25 kB each.
Within the ~200KB gzipped budget, but Motion is most of it — worth a look in E17.

## Content status

E04 was unblocked on **2026-08-02** by the supplied CV. Real content is now in place
for profile, current role, five projects, six skill groups, and site metadata.

Placeholder assets were generated the same day, so **no epic is waiting on a missing
asset** — the draft resume PDF, the OG image, and the About copy all exist and work.
Five `TODO(content)` markers track what still needs your version:

```
grep -rn "TODO(content)" src/
```

### ⚠️ Invented figures are in the data layer

On **2026-08-03**, at your request, placeholder metrics were added to
`profile.ts`, `currentRole.ts`, `projects.ts`, and `about.ts` so the hero, the
Current Role card, and the project cards read at their intended density during
development. **Eleven figures are invented.** Every one carries a marker:

```
grep -rn "INVENTED FIGURE" src/
```

Real content — name, employer, title, dates, stack, project names, the CV's own
~50% / ~95% deal-review figures — was left untouched, and each marker names
exactly which clause is fabricated and which part of the sentence is real.

This is the one placeholder category `1-prd.md` §6 lists as **never acceptable at
launch** ("fabricated metrics, job titles, employers, credentials, or outcomes"),
and `AGENTS.md` §13 forbids inventing them at all. Treated here as a development
placeholder with a hard removal gate: every marker must be replaced with a real
figure or have its clause deleted before E18 deploys. A bullet with no number is
honest; a bullet with an invented one fails in the interview it was meant to win.

| Item                  | State today                                        | Needed by | Launch blocker? |
| --------------------- | -------------------------------------------------- | --------- | --------------- |
| **Invented metrics**  | 11 placeholder figures, each marked in `src/data/` | E09–E11   | **Yes — hard**  |
| Resume PDF            | Real 2-page PDF from your CV, stamped **"Draft"**  | E12       | **Yes**         |
| OG image              | 1200×630, generated from the design tokens         | E15       | **Yes**         |
| `SITE_URL`            | `https://shakhlyn.dev` — a guess, not registered   | E15, E18  | **Yes**         |
| About copy            | 3 draft paragraphs, CV facts, my wording           | E11       | **Yes — voice** |
| Portrait photograph   | **Done** — 720×960 WebP, cropped 3:4, `split` live | —         | No              |
| Project screenshots   | Absent; cards omit the frame cleanly               | E10       | No              |
| Meal Mgmt `githubUrl` | Absent; button does not render                     | E10       | No              |

## Open decision — positioning

**The CV has no AI/LLM work, but `1-prd.md` is written around "full-stack and AI
engineering roles"** throughout. `skills.ts` ships only what the CV supports, so the
site currently positions more narrowly than the PRD intends. Either reframe the PRD or
add real AI/LLM work before launch — detail and options in
[E04-status.md](E04-status.md).

## Next up

E07, E08, and E09 are done. The remaining work is the rest of the page sections:

- **E09 — Hero & Current Role.** Done except the blocked portrait ticket — see
  [E09-status.md](E09-status.md). Both checks E08 could not close are now closed.
- **E10–E13 — Projects, About, Skills, Resume, Contact.** These replace what is left of
  the E07-T03 anchor scaffold: `#projects`, `#about`, `#skills`, `#contact`. The
  `#resume` anchor was removed — the resume is route-only.
  E09 already retired the two criteria that were waiting on real content in `#home`.
- **Re-run E07's `Card` hover check.** It was never actually exercised — headless
  Chrome reports `(hover: none)`, so Tailwind's `hover:` rules never matched. The
  harness now emulates a fine pointer, so it is testable.
