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

Five `TODO(content)` items remain, all permitted as development placeholders by
`1-prd.md` §6 and none blocking Phase 2:

```
grep -rn "TODO(content)" src/
```

| Item                                     | Needed by | Launch blocker?                  |
| ---------------------------------------- | --------- | -------------------------------- |
| Resume PDF + real file size              | E12       | **Yes**                          |
| OG image at `public/og/portfolio-og.png` | E15       | **Yes**                          |
| `SITE_URL` — real deployed domain        | E15, E18  | **Yes**                          |
| Project screenshots                      | E10       | No — cards omit the frame        |
| `githubUrl` for Meal Management System   | E10       | No — button just does not render |

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
