# RV — Revamp · Status

Tickets: [RV-tickets.md](RV-tickets.md) · Overview: [STATUS.md](STATUS.md)

**0 done, 5 need manual browser verification, 1 superseded (RV-T03).** Legend in
[STATUS.md](STATUS.md).

This group has no completion state — it stays open for the life of the project. The
count is "written so far", not "of a planned total".

| Ticket | Title                                                | Status | Notes                                                              |
| ------ | ---------------------------------------------------- | ------ | ------------------------------------------------------------------ |
| RV-T01 | Rebuild Current Role as a present-tense status panel | 🔍     | Code + docs landed, gates pass; 5 criteria need a browser          |
| RV-T02 | Slim the hero to positioning only                    | 🔍     | Code + docs landed, gates pass; layout unchanged, needs a browser  |
| RV-T03 | Size the hero `h1` to hold the full name on one line | ❌     | Shipped unverified and **wrapped at 1024px**; superseded by RV-T04 |
| RV-T04 | Retune the hero `h1` against a measured wrap         | 🔍     | Gates pass; the same browser check RV-T03 skipped is still open    |
| RV-T05 | Separate employer and placement date ranges          | 🔍     | Gates pass; a factual error is fixed, one width needs a browser    |

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

The per-ticket file lists for RV-T02 onward are in each ticket's section below.

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
current employer. `CURRENT_ROLE.companyDateRange` starts Mar 2024, so as of Aug 2026 the current
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

## RV-T03 — failed, and the failure is the useful part

**Status: ❌ superseded by RV-T04.** It shipped a fluid `--text-display-name` token sized
from an estimate that the name is ~12.6em wide. The author found it wrapped at 1024px.

The estimate was not merely imprecise — it was made against the wrong font. `--font-sans`
is a `system-ui` stack that resolves per platform, and the ticket listed that as a "known
risk" without acting on it. On Linux it resolves to DejaVu Sans or Cantarell, both
materially wider than the macOS and Windows faces the 12.6em figure came from.

**The lesson is procedural, not typographic:** the ticket's own acceptance list said
"verified in a browser", and it was marked done without that step. Every criterion RV-T03
could check without a browser passed. The one it skipped was the one that mattered.

### Files (as shipped)

```
src/styles/index.css                        + --text-display-name (superseded value)
src/components/sections/HeroSection.tsx     h1 uses it; md: step dropped
docs/3-style-preference.md                  §3.2 token, §6.2 note
```

## RV-T04

### The bug report was the measurement

The author's report — "for 1024, the name gets into two lines" — is not just a defect
notice. The `lg` text column is 624px and RV-T03's cap was 46px, so the name is **wider
than 13.6em**: the original figure was low by at least 8%, and the report bounds the real
value from below without anyone measuring a glyph.

### The retune

`clamp(1.125rem, 5.6vw, 2.4rem)`, sized for a **15em** name against the widest face in
the stack rather than the average one. A visitor on a narrow face gets a name slightly
smaller than it needs to be; a visitor on a wide face gets a wrapped `h1`. Only one of
those is a defect. Margins are 4–8% at every tight stop, against RV-T03's 1–3%.

### Files

```
src/styles/index.css                        --text-display-name retuned
docs/3-style-preference.md                  §3.2, §6.2 clamp values
docs/tickets/RV-tickets.md                  + RV-T04
```

### Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK — clamp(1.125rem,5.6vw,2.4rem) present in dist/index.html
```

`grep -c "6.9vw\|2.875rem"` returns 0 in both `src/styles/index.css` and
`docs/3-style-preference.md` — no reference to the superseded value survives.

### The cost is unresolved, and it is the author's call

The hero name now renders at **38.4px** desktop, against 56px before RV-T03. One line at
every width is expensive for a 25-character name, and the expense is imposed by the
`split` layout: the portrait takes 280px of a 936px container at `lg`, so the `h1` is
narrowest exactly where a fixed scale would go largest.

Three ways to buy it back are listed in the ticket; none is taken, because each changes a
decision the author owns. **Accepting two lines as the design is the one worth considering
first** — a deliberate two-line name at 56px usually reads better than a cramped one-line
name at 38px.

### Not verified — needs a real browser

The full name on one line at 320 / 375 / 640 / 768 / 1024 / 1280 / 1920 in both layouts,
and no horizontal scroll at any of them. **This is the criterion RV-T03 skipped**, and it
is the reason RV-T03 failed. It remains open here.

## RV-T05

### This fixed a factual error, not a formatting one

RV-T01 split `company` (employer) from `client` (placement) precisely because collapsing
them drops the client or implies the client employs the author. It then left a single
`dateRange` covering both — the same conflation one level down.

The panel rendered `Embedded with Yaana Solutions · Mar 2024 — Present`. The placement
began **Oct 2024**; the employment began Mar 2024. The section whose entire job is stating
current state accurately was **backdating the placement by seven months**.

The shape of the bug is worth recording alongside RV-T01 §4 and RV-T02's marker defect:
**a field named for what it renders next to rather than what it describes.** `dateRange`
sat beside `client` in the markup, so every reader — including the one who wrote it — read
it as the client's range while it held the employer's.

### Why a rename, not an addition

`clientDateRange` could have been added beside a kept `dateRange`. Renaming to
`companyDateRange` instead makes the change compile-checked: both fields are required, so
`yarn typecheck` forces every reader to be visited, and the ambiguous name that caused the
bug does not survive the commit.

### Layout: each range beside its own organisation

The first attempt put the employer's range on a mono line of its own above the placement
line. The author corrected it: a range on a line with no organisation on it is read
against whatever is nearest — which is exactly how the original bug read as correct.

Final form, with the employer's range as a `fg-subtle` mono `body-sm` span **inside** the
`h3` — in the heading, but not at heading size, which would push the `h3` to three lines
at 320px:

```
Software Engineer · Penta Global Limited · Mar 2024 — Present
Embedded with Yaana Solutions · Oct 2024 — Present
```

Side effect worth knowing: the `h3`'s accessible name now includes the date range. Longer,
but true, and this heading is not a nav or skip target.

### Files

```
src/types/current-role.types.ts                  dateRange → companyDateRange + clientDateRange
src/data/currentRole.ts                          Mar 2024 / Oct 2024
src/components/sections/CurrentRoleSection.tsx   ranges beside their organisations
src/data/profile.ts                              comment named the removed field
docs/3-style-preference.md                       §6.3 rows 1–2
docs/tickets/RV-tickets.md                       + RV-T05
```

### Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK
```

`grep -rn "dateRange" src` returns nothing — no bare field name survives the rename.

### Not verified — needs a real browser

The `h3` at 320px, where it now carries three `·`-separated parts and must wrap the range
under the employer name rather than overrunning the card.

## RV-T06

### The ticket followed the commit

`40dd8e4` was committed on the author's instruction before this ticket existed, inverting
the group's normal order. Recorded rather than backdated. The rule the order exists to
serve — source documents win, and are amended in the same commit — is satisfied by the
§6.2 amendment, which did land with the ticket.

### Why the old value was wrong rather than merely small

`mt-8` was tuned against a four-line hero stack. RV-T02 deleted the current position line
and left the value spacing against three, which is how a deliberate number quietly becomes
an inherited one. At 32px the CTAs also sat inside the copy block's own rhythm — the value
proposition is `mt-4` below the role framing — so they read as the paragraph's last line
rather than as something to act on.

`mt-32` is in §4.1's subset, so it needs no arbitrary-value justification in the JSX. §6.2
now states the gap and why it is outside the copy rhythm, so the next reader does not tidy
it back.

### Files

```
src/components/sections/HeroSection.tsx     mt-8 → mt-32 on the CTA row
docs/3-style-preference.md                  §6.2 — the hero's internal spacing is specified
docs/tickets/RV-tickets.md                  + RV-T06
```

### Gates

```
yarn typecheck      OK
yarn lint           OK
yarn format:check   OK
yarn build          OK
```

### Not verified — needs a real browser, and this one has a known risk

128px is larger than the hero's own `pt-24` (96px) top padding and equal to `pt-32` at
desktop. At 320–375px it is the largest vertical space on the screen and **may push the
primary CTA below the fold**, which is the opposite of a hero CTA's job.

No responsive step was pre-emptively added: the author asked for 4× having seen the built
page, and second-guessing that with an unmeasured assumption is worse than checking. If
the check fails, `mt-12 sm:mt-32` is the fix and it is a follow-up ticket.

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
