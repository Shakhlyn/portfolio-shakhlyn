# Ticket Status — Overview

Roll-up across all epics. Per-epic detail lives in `E0X-status.md` next to each
ticket file. **Update the per-epic file when you finish a ticket; update this table
when an epic's counts change.**

Last updated: **2026-08-02**

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
| E08 Social Rail                          | 0    | 0                  | 0       | 6           | ~6    |

E07 was verified with 27 automated checks in a real browser (headless Chrome over
CDP against a production build), so none of its criteria are left pending a manual
pass. One is verified in a weaker form and must be re-tested once sections have real
content — see [E07-status.md](E07-status.md).

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

Build output: entry `443 kB / 142 kB gzip`, four lazy chunks at ~0.25 kB each.
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

| Item                  | State today                                       | Needed by | Launch blocker? |
| --------------------- | ------------------------------------------------- | --------- | --------------- |
| Resume PDF            | Real 2-page PDF from your CV, stamped **"Draft"** | E12       | **Yes**         |
| OG image              | 1200×630, generated from the design tokens        | E15       | **Yes**         |
| `SITE_URL`            | `https://shakhlyn.dev` — a guess, not registered  | E15, E18  | **Yes**         |
| About copy            | 3 draft paragraphs, CV facts, my wording          | E11       | **Yes — voice** |
| Project screenshots   | Absent; cards omit the frame cleanly              | E10       | No              |
| Meal Mgmt `githubUrl` | Absent; button does not render                    | E10       | No              |

## Open decision — positioning

**The CV has no AI/LLM work, but `1-prd.md` is written around "full-stack and AI
engineering roles"** throughout. `skills.ts` ships only what the CV supports, so the
site currently positions more narrowly than the PRD intends. Either reframe the PRD or
add real AI/LLM work before launch — detail and options in
[E04-status.md](E04-status.md).

## Next up

Phase 1 is done, so Phase 2 is fully unblocked:

- **E07 — Header & Navigation.** The highest-risk epic in the plan. `useActiveSection`,
  `useHashScroll`, the mobile sheet's focus trap, and cross-route anchors all interact.
  Build and verify the three behaviours separately before combining them. Also re-check
  the `PageTransition` / `useRouteFocus` ordering flagged in
  [E06-status.md](E06-status.md).
- **E08 — Social Rail.** Now unblocked: GitHub, LinkedIn, and email are in
  `profile.ts`. There is no X account, so that tile simply will not render — which is
  the intended behaviour, not a gap.
