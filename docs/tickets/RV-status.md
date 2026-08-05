# RV — Revamp · Status

Tickets: [RV-tickets.md](RV-tickets.md) · Overview: [STATUS.md](STATUS.md)

**0 done, 2 need manual browser verification.** Legend in [STATUS.md](STATUS.md).

This group has no completion state — it stays open for the life of the project. The
count is "written so far", not "of a planned total".

| Ticket | Title                                                | Status | Notes                                                             |
| ------ | ---------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| RV-T01 | Rebuild Current Role as a present-tense status panel | 🔍     | Code + docs landed, gates pass; 5 criteria need a browser         |
| RV-T02 | Slim the hero to positioning only                    | 🔍     | Code + docs landed, gates pass; layout unchanged, needs a browser |

## Files

```
src/types/current-role.types.ts              + client, summary, availability, projectSlugs
src/types/about.types.ts                     − lookingFor
src/data/currentRole.ts                      rewritten; 4 invented figures deleted
src/data/about.ts                            − lookingFor
src/components/sections/CurrentRoleSection.tsx   status panel; + project link row
src/components/sections/AboutSection.tsx     − closing line and its conditional
docs/3-style-preference.md                   §6.3 rewritten, §6.5 closing line removed
docs/4-interaction-design.md                 §5.2 rewritten, §5.4 amended, §10 rows 20–22
docs/2-architecture.md                       §8 heading plan — h2 text, id rationale
docs/5-epic-list.md                          E09 superseded, E11 deliverable withdrawn
docs/tickets/README.md                       Revamp track, decision row 21
```

`src/data/navigation.ts` is **not** in the diff, as the ticket required.

## 1. Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK — 313.44 kB / 101.22 kB gzip, unchanged from before the ticket
```

The bundle is byte-identical in size: `Button` and `PROJECTS` were already in the entry
chunk, so the link row adds no import that was not already there.

## 2. Criteria met, verified without a browser

- `grep -rn "INVENTED FIGURE" src/` drops from 17 to 13. All four removed were in
  `currentRole.ts`, which now has none.
- `grep -rn "lookingFor" src/` matches only the explanatory comment in
  `AboutSection.tsx` — no type field, no data field, no JSX.
- `id="current-role"` unchanged; `ANCHOR_SECTION_IDS` unchanged; `navigation.ts` untouched.
- `projectSlugs` is a literal two-entry list, not derived from `category`.
  `bhoganti-web-app` appears nowhere in the section or its data.
- Both slugs resolve: `projects.ts:50` and `projects.ts:68`.

## 3. Not verified — needs a real browser

No browser harness is installed in this repo (earlier epics used ad-hoc ones), and
installing one for this ticket would be scope the ticket did not ask for. These five
criteria are **unconfirmed**, not passing:

- No horizontal scroll at 320 / 375 / 768 / 1024 / 1440 / 1920, and the link row wrapping
  rather than overflowing at 320. The row is `flex-wrap` with `sm` buttons and the two
  titles are short, so it should hold — but "should" is the word that E12 got caught by
  four times.
- Correct in both themes, with the divider and the accent rule visible in each.
- Link row keyboard-reachable in DOM order with a visible `focus-visible` ring.
- Card appears without transform under `prefers-reduced-motion: reduce`.
- The heading renders "Currently" and the outline still reads `h2 → h3`.

## 4. A near-miss worth recording

The first draft of `currentRole.ts` explained in its header comment that the file no
longer carries any `INVENTED FIGURE` markers — writing the marker string out in full to
say so. `grep -rn "INVENTED FIGURE" src/` is the **E18 deploy gate**, so the comment would
have reported this file as still carrying one, forever, in the exact check whose job is
deciding whether the site can ship.

Caught by running the ticket's own acceptance grep rather than trusting the edit. The
comment now names the marker only in prose and says why.

## 5. A correction the author made mid-ticket

The first draft of this ticket assumed all three `category: 'professional'` projects came
from the current role, and left Bhoganti Web App as an open question for the author.

It does not. **Penta Global is the employer; Yaana Solutions is the current placement;
Bhoganti is earlier Penta work, finished before the embedding began.** Two consequences,
both now in the ticket:

- `CURRENT_ROLE.company` and `CURRENT_ROLE.client` are separate fields. Collapsing them
  would either drop the client the work happens at or imply Yaana employs the author.
- `projectSlugs` is an explicit list and must never be derived from `category`, which
  would pull finished work back under a present-tense heading.

It also sharpens why the old fourth bullet had to go. It claimed Python / FastAPI /
Keycloak delivery as **current-role scope**, and that work is Bhoganti's — so the bullet
was not merely duplicated by `projects.ts`, it was filing past work as present.

## RV-T02

Follows directly from RV-T01, and would not exist without it: giving the panel a role
line, a placement, dates, and a present-tense summary is what made the hero's copy
redundant. Two things duplicated afterwards that had not before —

- `PROFILE.currentPositionRole · currentPositionCompany` rendered `Software Engineer ·
Penta Global Limited` as body copy, roughly 200px above the panel's `h3` carrying the
  **same two strings** with a placement and dates attached.
- The value proposition's middle clauses — the telecom platform, the two large modules,
  the inherited-code work — are all in `CURRENT_ROLE.summary`.

Both are gone. The hero keeps eyebrow, `h1`, role framing, one sentence, and the CTAs;
no element moved and none was added. `ProfileType` loses two required fields, so the
removal is compile-checked rather than trusted.

### Files

```
src/types/profile.types.ts                  − currentPositionRole, − currentPositionCompany
src/data/profile.ts                         valueProposition → one sentence; header rewritten
src/components/sections/HeroSection.tsx     − the current position line
docs/3-style-preference.md                  §6.2 stack — item 5 removed, renumbered
docs/4-interaction-design.md                §5.1 sketch row removed, §10 row 23
docs/5-epic-list.md                         E09 content stack amended
docs/tickets/README.md                      decision row 22
```

### Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK — 312.90 kB / 101.03 kB gzip (−0.54 kB from RV-T01)
```

### The invented-figure count fell by three, not one

The ticket predicted one: the marker guarding the value proposition. `src/` went from 13
to 10.

The other two were in `profile.ts`'s **header docstring**, which announced that the file
carried invented placeholders and told the reader to `grep -rn "INVENTED FIGURE" src/` to
find them — spelling the marker out twice in the course of saying so. That grep is the
E18 deploy gate. The docstring had been reporting its own file as unclean since E04, and
after this ticket it was also simply false: `profile.ts` now carries no figures at all.

This is the second instance of the same defect in two tickets (RV-T01 §4). The pattern is
worth naming: **a comment that explains a marker convention by quoting the marker becomes
a permanent false positive in the check the convention exists to serve.** Both rewrites
name the marker in prose only.

### The years figure is an open content question

The removed copy claimed **"2.5 years of experience"** and **"For nearly 2 years"** at the
current employer. `CURRENT_ROLE.dateRange` starts Mar 2024, so as of Aug 2026 the current
role alone is about 2 years 5 months — the two claims no longer reconcile, and the second
understates the author's own tenure.

They were true when written and went stale in place, which is a different failure from
the invented figures and does not get a `TODO(content)` marker: the sentence now shipping
is correct, just less specific. **No replacement was guessed** (`AGENTS.md` §13). Re-adding
one is a single edit to `PROFILE.valueProposition` once the author supplies a real total.

### Not verified — needs a real browser

Same constraint as RV-T01 §3. This ticket removes one line of text and adds no element,
so the risk is narrow but not zero:

- The hero's vertical rhythm at 320 / 375 / 768 / 1024 / 1440 / 1920 in **both** layouts.
  `mt-8` on the button row now spaces against the value proposition rather than the
  deleted line, and in `split` the text column is shorter against a fixed-height portrait
  slot — the two columns are `lg:items-center`, so this changes where the photo sits
  relative to the text.
- The employer rendering exactly once on the page.

## Origin of RV-T01

Raised by the author while reviewing the built page: whether Current Role earns a
standalone slot immediately after the hero, or whether it belongs inside Projects.

Reading the data settled it in a direction neither option covered. All four
`CURRENT_ROLE.scope` bullets were duplicated elsewhere, so the section could not be fixed
by rewriting its content. It could not fold into Projects either: the projects it covers
share one employment context, which no card can hold without repeating it three times or
burying it in a case study.

What was left is the option the review produced: keep the slot, change the job. Full
reasoning in [RV-tickets.md](RV-tickets.md) § RV-T01.
