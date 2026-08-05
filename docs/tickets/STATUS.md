# Ticket Status — Overview

Roll-up across all epics. Per-epic detail lives in `E0X-status.md` next to each
ticket file. **Update the per-epic file when you finish a ticket; update this table
when an epic's counts change.**

Last updated: **2026-08-05**

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
| [E11 About & Skills](E11-status.md)      | 7    | 0                  | 0       | 0           | 7     |
| [E12 Resume](E12-status.md)              | 11   | 0                  | 0       | 0           | 11    |
| [E13 Contact](E13-status.md)             | 7    | 0                  | 0       | 0           | 7     |

E12 was verified with **38 automated browser checks, all passing**, and found no defect in
the code. It found two in **its own ticket file**, both corrected in the source documents
rather than absorbed: the fallback panel had been specified with a redundant second control
pointing at the same file, and the capability hook had been specified as `useEffect` +
`useState`, which `react-hooks/set-state-in-effect` rejects as an error. The hook is now
`useSyncExternalStore` and settles on the first render.

**E12's one real gap is iOS Safari** — the browser the fallback exists for, and the one
that cannot be tested here, since headless Chrome on Linux has no WebKit PDF pipeline. The
mitigation is architectural rather than a test: the `View in browser` action renders in
both branches and the Download section is unconditional, so a wrong detection degrades to a
blank frame above two working links. Detail in [E12-status.md](E12-status.md) §7.

E12-T02 reaches into E05's `Button` to add a `download` case, because a router `Link` to a
static asset resolves to the catch-all 404. Recorded in both status files.

E11 was verified with **46 automated browser checks, all passing**, including three
temporary-data edits for criteria that real content makes unobservable. It found no
defect of its own — the smallest epic since E06, and the first to ship without one.

It did surface a **pre-existing E07 discrepancy**: `navigation.ts` states that nothing
should be highlighted while a section without a nav entry is in view, and the scroll spy
instead retains the last observed section. Behaviour is identical on the pre-E11 build, so
it is not E11's, and it is recorded in [E11-status.md](E11-status.md) §3 for an E07
amendment ticket rather than fixed inside a feature epic.

E11-T02 reaches into E06's three motion files to add `DURATION_BADGE` and `badgeFadeUp`,
because animation 4 is 300ms and no token expressed it. Recorded in both status files.

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

## Phase 4

| Epic     | Done | Needs manual check | Blocked | Not started | Total  |
| -------- | ---- | ------------------ | ------- | ----------- | ------ |
| E14 Blog | 0    | 0                  | 0       | 0           | `TODO` |

**E14 is `TODO` — not started, deliberately deferred by the author.** It is not blocked on
code: the posts are unwritten. `/writing` and `/writing/:slug` are still the E03 stubs, and
the ticket file has not been written. Ticket counts land here when it is picked up.

**E15 shipped past it on purpose.** The graph edge from E14 to E15 existed so that writing
pages would exist before being marked non-indexable, and a stub satisfies that condition
already — `getPublishedPosts().length === 0` is true for an E03 stub and for a finished
empty state alike. Everything E15 ships that will need revisiting when E14 lands is marked:

```
grep -rn "TODO(E14)" src/ docs/ public/
```

## Phase 5

| Epic                                | Done | Needs manual check | Blocked | Not started | Total |
| ----------------------------------- | ---- | ------------------ | ------- | ----------- | ----- |
| [E15 SEO & Metadata](E15-status.md) | 11   | 0                  | 0       | 0           | 11    |
| E16 Accessibility & Responsive      | —    | —                  | —       | —           | —     |
| E17 Performance                     | —    | —                  | —       | —           | —     |
| E18 Deployment                      | —    | —                  | —       | —           | —     |

**E15: 11 of 11 done.** Lighthouse SEO **100** on `/` and on `/projects/data-slicing`.
`/writing` scores 66 because it is `noindex` — that failing audit _is_ criterion 4 passing,
and it lifts on its own in E14.

**One acceptance criterion is deferred, not done.** Criterion 2 — the LinkedIn and Slack
link preview — needs a public URL, and `SITE_URL` is still an unregistered guess. E15 proves
the markup is present and absolute in `dist/index.html`; E18 pastes the live link. Same
precedent as E08's rail criterion deferred to E09.

The epic found **one code defect, in its own new pipeline**: `yarn images` was not
idempotent, because re-encoding lossy WebP degrades it a little on every run and "write only
if smaller" feeds that loop rather than stopping it. Fixed with a committed hash manifest.

It also found **two heading decisions that never reached `2-architecture.md` §8** — E09's
and E13's `h3`s, and the `h2: Download` E12 deliberately removed from `/resume`. All three
were corrected **in §8**, not in the code: each was a well-reasoned section-epic decision
recorded only in a component comment. Detail in [E15-status.md](E15-status.md) §3.

**T07's specified build-time slug gate turned out to be impossible** and was withdrawn
rather than replaced by inference: `vite.config.ts` is esbuild-bundled and cannot import
`projects.ts`, whose `.webp` imports have no loader there. The dev-time assert stands alone.

E16–E18 have no ticket files yet.

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
