# RV — Revamp

**Goal:** Changes to sections that already shipped, made after seeing the built page
rather than while building it. Every revamp ticket lives here, whichever epic originally
built the code it touches.

**Depends on:** the epic that built the section being revised. Each ticket names its own.

The Global Definition of Done in `README.md` applies to every ticket and is not repeated.

---

## Why this is one group and not `E19`, `E20`, …

The `E01`–`E18` epics are a **build order**: each one exists because something did not
exist yet, and each is finished when its section ships. Revamps are not that. They arrive
whenever the author looks at the live page and disagrees with a decision that was
reasonable at specification time, so there is no order to them and no completion state to
reach.

Numbering them as epics would put them in the phase tables, imply a dependency graph they
do not have, and suggest the site is unfinished when it is merely being revised. So the
code is `RV`, not a number, and it stays a single open group for the life of the project.

**Every revamp ticket goes here.** `RV-T01`, `RV-T02`, … in the order they are written.

## How a revamp ticket differs from an epic ticket

Two extra obligations, because a revamp contradicts something already written down:

1. **Name the decision it overturns.** Revising shipped behaviour means a source document,
   or a row in `README.md` § "Decisions recorded during ticket writing", currently says
   the opposite. Cite it by number. A revamp that silently disagrees with a spec leaves
   the next reader to discover the contradiction on their own.
2. **Amend the source documents in the same commit.** Standing rule from `README.md` —
   if a ticket and a source document disagree, the document wins and the ticket is wrong.
   A revamp that ships code without moving the spec makes the code wrong by that rule the
   moment it lands.

---

## RV-T01 — Rebuild Current Role as a present-tense status panel

**Depends on:** E09 (built the section), E10 (`PROJECTS`, case-study routes), E11 (built
`AboutSection` and its closing line)

**Overturns:** `4-interaction-design.md` §10 row 13 (the About closing line), and the
scope-bullet form specified by `3-style-preference.md` §6.3

**Files:**

```
modified  docs/3-style-preference.md              §6.3 rewritten, §6.5 closing line removed
modified  docs/4-interaction-design.md            §5.2 rewritten, §5.4 amended, §10 rows
modified  docs/2-architecture.md                  §8 heading plan — h2 text
modified  docs/5-epic-list.md                     E09, E11 acceptance
modified  docs/tickets/README.md                  Revamp track, decision row
added     docs/tickets/RV-status.md
modified  docs/tickets/STATUS.md                  Revamp roll-up
modified  src/types/current-role.types.ts         scope → summary, + availability, + projectSlugs
modified  src/types/about.types.ts                lookingFor removed
modified  src/data/currentRole.ts                 rewritten
modified  src/data/about.ts                       lookingFor removed
modified  src/components/sections/CurrentRoleSection.tsx
modified  src/components/sections/AboutSection.tsx  closing line removed
```

**Commit:** `refactor(sections): rebuild current role as a present-tense status panel`

### The problem

`CURRENT_ROLE.scope` carries four bullets. Every one of them is already said elsewhere on
the same page:

| Bullet                                         | Also in                                 |
| ---------------------------------------------- | --------------------------------------- |
| 18-engineer team, three timezones              | `about.ts` ¶1, nearly verbatim          |
| Primary frontend contact for BA / product / QA | `projects.ts` `deal-summary-comparison` |
| Owns features end to end                       | `profile.ts` `valueProposition`         |
| Python, FastAPI, Keycloak, 30+ endpoints       | `projects.ts` `bhoganti-web-app`        |

A visitor reading in scroll order meets the same three claims three times before reaching
anything new. The section is not badly written — it is **redundant**, which is a worse
failure on a page whose whole budget is a 90-second scan.

It cannot be fixed by rewriting the bullets, because there are no unused facts left to put
in them. So the section has to take a different **job**, not different content.

### The decision

**Current Role becomes a status panel: the page's only present-tense block.**

Two questions a recruiter has that nothing on the page currently answers in a scannable
place:

- **Where is this person now, and for how long?** The hero gives role and company but no
  dates. About says "the past two years" inside a paragraph.
- **Are they available, and for what?** `about.lookingFor` answers it — from the bottom of
  a three-paragraph block, below Projects and Skills. It is the most decision-relevant
  sentence on the site and it is the last thing anyone reads.

Everything else the section used to claim is deleted, because the projects say it better.

**Heading text becomes "Currently"** — present tense, and it tells the reader the section
is about state rather than history. `id="current-role"` is **unchanged**: it is a public
hash, `navigation.ts` names it in a comment, and renaming it would break inbound links to
buy nothing.

### Why the About closing line moves rather than duplicates

`4-interaction-design.md` §10 row 13 put `lookingFor` in About and argued it must be
visually distinct because "folded into the prose it disappears." That reasoning holds and
points further than the row took it: the sentence disappears at the **bottom of the page**
too. The row is superseded rather than contradicted — the field moves to
`CURRENT_ROLE.availability` and `AboutType.lookingFor` is deleted, so there is one
availability sentence on the page, high up, not two.

About loses its accent rule and ends on its third paragraph. That is the cost, and it is
the right trade: the rule existed to rescue a sentence from a bad position, and the
sentence is no longer in that position.

### Employer and placement are two different facts

Author-confirmed 2026-08-05, and the shipped data does not model it:

- **Penta Global Limited is the employer**, since Mar 2024 and continuing.
- **Yaana Solutions is the current placement** — an embedded assignment that began after
  joining Penta, not a second job and not the employer.
- **Bhoganti Web App is earlier Penta work**, before the embedding. It is finished.

The panel therefore names Penta as the employer with Yaana as the placement, in one line.
Collapsing them would either drop the client the current work actually happens at, or
imply Yaana employs the author. Neither is true.

### Why the project links belong here — and why Bhoganti is not among them

Two of the three professional projects — Deal Summary & Comparison and Data Slicing — are
the modules built at the Yaana placement and still owned. They are the current work, so a
section about the present is the natural place to name them, and it holds the employment
context both share rather than repeating it on each card.

**Bhoganti Web App is excluded, and this is settled, not pending.** It is earlier Penta
work that is done. Listing it under "Currently" would file finished work as ongoing, which
is the exact defect this ticket exists to remove — the section's old fourth bullet claimed
Bhoganti's Python / FastAPI / Keycloak delivery as current-role scope, and it was never
current. It stays a first-class card in Projects, where completed work belongs.

So `projectSlugs` names exactly `deal-summary-comparison` and `data-slicing`. The field is
"projects of the current placement", not "professional projects" — deriving it from
`category: 'professional'` would pull Bhoganti straight back in and is specifically wrong.

Links resolve to `/projects/:slug` through `PROJECTS`. The section **never hardcodes a
title or a path** — a slug that no longer resolves is dropped rather than rendered as a
dead link.

### Content (author-confirmed, 2026-08-05)

Confirmed in conversation and safe to ship — **no invented figures**:

- Employed by Penta Global Limited, currently embedded with Yaana Solutions' telecom
  product team. Present tense.
- Built two large, complex modules there, still owns both, still shipping
  customer-requested features and improvements to them.
- Also fixing defects across modules inherited from others.
- Actively looking for a new role.

This ticket **deletes four `TODO(content): INVENTED FIGURE` markers** from
`currentRole.ts` — all four lived in the bullets being removed. None is replaced.

**Scope**

- In: the Current Role section end to end — data, types, component, heading text; removal
  of the About closing line; the source-document amendments those require.
- Out: the hero, the projects data, the carousel, `navigation.ts`. `#current-role` keeps
  its id and stays absent from `ANCHOR_SECTION_IDS`, so nav and scroll spy are untouched.
- Out: the `INVENTED FIGURE` markers in `profile.ts`, `about.ts`, and `projects.ts`. They
  are the E18 content gate and are not this ticket's to close.

**On ticket size.** This is at the upper bound of "one ticket, one commit", and the docs
and code deliberately ship together rather than split as `E11-T01` did. E11's docs commit
came _before_ five code tickets, so it described work about to happen. Here the docs
describe the section this same commit builds; landing them separately leaves the specs
describing a UI that does not exist for the length of one commit — the inverse problem.

**Implementation notes**

- `current-role.types.ts` — replace `scope: string[]` with `summary: string` (one
  sentence). Add `client: string` for the placement, `availability: string`, and
  `projectSlugs: readonly string[]`. `role`, `company`, `dateRange`, `stack` are unchanged;
  `company` remains the **employer**, and `client` is documented as the placement so the
  two can never be conflated by a later edit.
- `about.types.ts` — delete `lookingFor`. It is optional today, so nothing else can be
  relying on it; `grep -rn "lookingFor" src/` must return nothing after this ticket.
- `currentRole.ts` — one `summary` sentence in present tense from the confirmed content
  above, `client`, `availability`, and `projectSlugs` naming exactly the two Yaana modules.
  Carry a comment stating that `bhoganti-web-app` is deliberately absent because it is
  earlier, finished Penta work — otherwise a later reader "fixes" the omission.
- `CurrentRoleSection.tsx` — `Section title="Currently"`, still no eyebrow (§6.3's rule is
  unchanged and still correct — this is one narrative block, not a scannable set). Card
  contents in order: `h3` role · company, a placement + `dateRange` line in mono
  `fg-subtle`, the summary paragraph, the `Badge` stack row, then a divider, the
  availability line, and the project link row. Drop the `<ul>` entirely.
- The link row resolves slugs through `PROJECTS` and filters unresolved ones before
  rendering. Derive at module scope or with `useMemo` — `PROJECTS` is a module constant,
  so this is not state.
- The availability line keeps About's visual treatment — `fg` against the card's
  `fg-muted`, `border-l-2 border-accent`, `pl-4`. The treatment was the right answer to
  "make the actionable sentence visually distinct"; only its location was wrong.
- **Motion is unchanged.** The card is one animation-2 reveal target and the new children
  inherit it. `4-interaction-design.md` §8's closed-list rule means the link row and the
  availability line take the default with no child orchestration — no §8 amendment, and
  the badges still do not stagger.
- `AboutSection.tsx` — remove the closing-line block and its conditional. The paragraphs
  and their `max-w-content` measure are untouched.

**Acceptance**

- [ ] `grep -rn "INVENTED FIGURE" src/data/currentRole.ts` returns no match.
- [ ] `grep -rn "lookingFor" src/` matches nothing but the explanatory comment in
      `AboutSection.tsx` — no type field, no data field, no JSX.
- [ ] `grep -n 'id="current-role"' src/components/sections/CurrentRoleSection.tsx` still
      matches; `ANCHOR_SECTION_IDS` is unchanged and `navigation.ts` is not in the diff.
- [ ] The rendered section heading reads "Currently"; `2-architecture.md` §8's home-page
      outline reads `h2: Currently` with the `h3` beneath it intact.
- [ ] The section renders no `<ul>` of scope bullets, and exactly one availability
      sentence exists on the home page.
- [ ] Every link in the project row resolves to a live `/projects/:slug` route; a slug
      absent from `PROJECTS` renders nothing rather than a dead anchor.
- [ ] The link row names exactly the two Yaana modules. `bhoganti-web-app` appears
      nowhere in the section, and `projectSlugs` is not derived from `category`.
- [ ] The section names Penta as employer and Yaana as placement, distinguishably —
      neither reads as the other.
- [ ] `3-style-preference.md` §6.3 describes the panel, not "two-to-four bullet lines of
      scope"; §6.5 no longer describes a closing line.
- [ ] `4-interaction-design.md` §10 row 13 is marked superseded with a pointer to the new
      row, rather than deleted.
- [ ] Four gates pass. No horizontal scroll at 320 / 375 / 768 / 1024 / 1440 / 1920; the
      link row wraps rather than overflowing at 320.
- [ ] Correct in both themes; the accent rule and the divider are visible in each.
- [ ] Link row is keyboard reachable with a visible `focus-visible` ring, in DOM order.
- [ ] With `prefers-reduced-motion: reduce`, the card appears without transform.

**Traceability:** `1-prd.md` §3 · `2-architecture.md` §8 ·
`3-style-preference.md` §6.3, §6.5 · `4-interaction-design.md` §5.2, §5.4, §8, §10 ·
`5-epic-list.md` E09, E11

---

## RV-T02 — Slim the hero to positioning only

**Depends on:** RV-T01 (which is what made the hero's copy redundant)

**Overturns:** `3-style-preference.md` §6.2 item 5 (the current position line), and the
three-sentence value proposition shipped by E09

**Files:**

```
modified  docs/3-style-preference.md              §6.2 stack — item 5 removed
modified  docs/4-interaction-design.md            §5.1 layout sketches, §10 row 23
modified  docs/5-epic-list.md                     E09 content stack
modified  docs/tickets/README.md                  decision row 22
modified  docs/tickets/RV-status.md
modified  docs/tickets/STATUS.md
modified  src/types/profile.types.ts              − currentPositionRole, − currentPositionCompany
modified  src/data/profile.ts                     valueProposition slimmed; two fields removed
modified  src/components/sections/HeroSection.tsx − the current position line
```

**Commit:** `refactor(hero): slim the intro to positioning now that Currently carries the role`

### The problem RV-T01 created

RV-T01 gave the panel directly beneath the hero a role line, a placement, dates, and a
present-tense summary. That made two things in the hero redundant, and neither was
redundant before it landed:

| Hero element                                           | Now also in                                 |
| ------------------------------------------------------ | ------------------------------------------- |
| `currentPositionRole · currentPositionCompany`         | the panel's `h3` — **the same two strings** |
| "enterprise platform serving telecom operators"        | `CURRENT_ROLE.summary`                      |
| "built two large modules"                              | `CURRENT_ROLE.summary`                      |
| "worked deep in the ones I inherited — fixing defects" | `CURRENT_ROLE.summary`                      |

The current position line is the sharper failure: `Software Engineer · Penta Global
Limited` renders twice, about 200px apart, once as body copy and once as an `h3`. A
reader sees the same words twice before the first scroll completes.

### The decision

**The hero states positioning. The panel states current state. Neither restates the
other.**

- **Delete the current position line** and both fields behind it. The panel says it with
  more information — placement, dates — one screen down, and it is the panel's actual
  job. Two fields on `ProfileType` go with it; nothing else reads them.
- **Cut the value proposition to one sentence** carrying only what the hero can say and
  the panel cannot: how the author works, rather than where. The telecom platform, the
  two modules, and the inherited-code work all move out — they are the panel's and the
  projects' to make, with detail neither the hero nor a summary line can carry.

The eyebrow, `h1`, role framing, buttons, and social links are unchanged. This ticket
removes copy; it adds none and moves no element.

### The years figure is an open content question, not a decision

The shipped copy says **"2.5 years of experience"** and **"For nearly 2 years"** at the
current employer. `CURRENT_ROLE.dateRange` starts Mar 2024, so as of Aug 2026 the current
role alone is roughly 2 years 5 months — which makes the two claims no longer reconcile,
and makes "nearly 2 years" an understatement of the author's own tenure.

Both numbers were written when they were true and have gone stale in place. **This ticket
does not guess a replacement** — `AGENTS.md` §13 forbids inventing figures, and a wrong
number in the first sentence of a portfolio is worse than no number. The slimmed sentence
therefore carries no year count, and the panel's date range is the only tenure signal on
the page until the author supplies a total.

Re-adding it is a one-field edit to `PROFILE.valueProposition` once the real figure is
known. Tracked here rather than as a `TODO(content)` marker, because the sentence
currently shipping is correct as written — it is merely less specific than it could be.

**Scope**

- In: the hero's copy and the two `ProfileType` fields that only it reads.
- Out: `roleFraming`, the eyebrow, the CTAs, the portrait, both layouts, and the layout
  switch. No element is added, removed, or reordered — only text.
- Out: `CURRENT_ROLE.availability`'s "own features end to end" phrasing, which overlaps
  the hero's positioning claim slightly. One sentence in each, on either side of a
  section boundary, reads as consistency rather than repetition; collapsing it further
  would leave the panel's actionable line without a reason to exist.

**Implementation notes**

- `profile.types.ts` — delete `currentPositionRole` and `currentPositionCompany`. Both
  are required fields today, so deletion is compile-checked: `yarn typecheck` fails if any
  reader remains.
- `profile.ts` — one-sentence `valueProposition`. Delete the `INVENTED FIGURE` marker
  above it along with the invented "40,000 deals" and "three continents" clauses it
  guarded; those were already absent from the rendered copy, so the marker was guarding a
  comment rather than a claim.
- `HeroSection.tsx` — remove the current-position `<p>` and nothing else. The `mt-8` on
  the button row already spaces correctly against the value proposition above it.
- `3-style-preference.md` §6.2 — remove item 5 and renumber. Add a line stating that the
  hero deliberately does not name the employer, and why.
- `4-interaction-design.md` §5.1 — the two ASCII layout sketches both show
  `Software Engineer @ Company`. Remove that row from each; a sketch that shows a deleted
  element is how it gets re-added.

**Acceptance**

- [ ] `grep -rn "currentPosition" src/` matches nothing but the explanatory comment on
      `valueProposition` in `profile.types.ts` — no field, no data, no JSX.
- [ ] The employer name renders exactly once on the home page.
- [ ] `PROFILE.valueProposition` is one sentence and names no employer, product,
      platform, or module.
- [ ] `grep -n "INVENTED FIGURE" src/data/profile.ts` returns no match. The count across
      `src/` drops by three, not one: the file's header docstring named the marker twice
      while describing a policy that no longer applies to it, and both were false
      positives in the E18 deploy gate.
- [ ] No year count appears in the hero. The panel's date range is unchanged.
- [ ] Neither ASCII sketch in `4-interaction-design.md` §5.1 shows a company row.
- [ ] Four gates pass. Hero layout is unchanged in both `stacked` and `split` at
      320 / 375 / 768 / 1024 / 1440 / 1920 — this ticket removes a text line and must not
      shift the portrait slot or the CTAs.
- [ ] `h1` is still the name alone; the heading outline is unchanged.

**Traceability:** `1-prd.md` §3 · `3-style-preference.md` §6.2 ·
`4-interaction-design.md` §5.1, §10 · `5-epic-list.md` E09 · RV-T01
