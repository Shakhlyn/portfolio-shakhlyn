# Tickets

Implementation tickets derived from `docs/5-epic-list.md`. One file per epic, one
ticket per commit.

```
1-prd.md                 What we are building and why
2-architecture.md        Structure: routes, data, components, performance
3-style-preference.md    Appearance: tokens, type, component styling
4-interaction-design.md  Behaviour: layout, navigation, scroll, motion
5-epic-list.md           Build order and acceptance criteria
tickets/                 The work itself                            ← you are here
AGENTS.md                Code rules — wins over all of the above
```

If a ticket and a source document disagree, the source document wins and the ticket is
wrong — fix the ticket rather than the code.

---

## Phase 1 — Foundation

**Progress lives in [STATUS.md](STATUS.md)** (roll-up) plus one `E0X-status.md` per
epic. Point me at those files to pick the work back up.

| Epic                            | Tickets                                              | Status                         | #   | Depends on |
| ------------------------------- | ---------------------------------------------------- | ------------------------------ | --- | ---------- |
| E01 Tooling & Project Scaffold  | [E01-tooling.md](E01-tooling.md)                     | [E01-status.md](E01-status.md) | 7   | —          |
| E02 Design Tokens & Theming     | [E02-tokens-theming.md](E02-tokens-theming.md)       | [E02-status.md](E02-status.md) | 5   | E01        |
| E03 Routing, App Shell & Errors | [E03-routing-shell.md](E03-routing-shell.md)         | [E03-status.md](E03-status.md) | 6   | E02        |
| E04 Content Data Layer & Types  | [E04-data-layer.md](E04-data-layer.md)               | [E04-status.md](E04-status.md) | 5   | E02        |
| E05 UI Primitives               | [E05-ui-primitives.md](E05-ui-primitives.md)         | [E05-status.md](E05-status.md) | 9   | E02        |
| E06 Motion Foundation           | [E06-motion-foundation.md](E06-motion-foundation.md) | [E06-status.md](E06-status.md) | 4   | E02        |

### Phase 2 — Layout & Navigation

| Epic                    | Tickets                          | Status                         | #   | Depends on |
| ----------------------- | -------------------------------- | ------------------------------ | --- | ---------- |
| E07 Header & Navigation | [E07-tickets.md](E07-tickets.md) | [E07-status.md](E07-status.md) | 14  | E02–E06    |
| E08 Social Rail         | [E08-tickets.md](E08-tickets.md) | [E08-status.md](E08-status.md) | 8   | E07        |

### Phase 3 — Home Page Sections

| Epic                    | Tickets                          | Status                         | #   | Depends on |
| ----------------------- | -------------------------------- | ------------------------------ | --- | ---------- |
| E09 Hero & Current Role | [E09-tickets.md](E09-tickets.md) | [E09-status.md](E09-status.md) | 8   | E07, E08   |
| E10 Projects            | [E10-tickets.md](E10-tickets.md) | [E10-status.md](E10-status.md) | 12  | E07        |
| E11 About & Skills      | [E11-tickets.md](E11-tickets.md) | [E11-status.md](E11-status.md) | 7   | E07        |
| E12 Resume              | [E12-tickets.md](E12-tickets.md) | [E12-status.md](E12-status.md) | 11  | E07, E09   |
| E13 Contact             | [E13-tickets.md](E13-tickets.md) | [E13-status.md](E13-status.md) | 7   | E04–E07    |

### Phase 4 — Content Depth

| Epic     | Tickets       | Status | #   | Depends on |
| -------- | ------------- | ------ | --- | ---------- |
| E14 Blog | — not written | `TODO` | —   | E03        |

**E14 is deferred by the author**, not blocked: the posts are unwritten. `/writing` and
`/writing/:slug` are still the E03 stubs. E15 shipped past it deliberately — see the
Phase 5 note below.

### Phase 5 — Hardening

| Epic                           | Tickets                          | Status                         | #   | Depends on         |
| ------------------------------ | -------------------------------- | ------------------------------ | --- | ------------------ |
| E15 SEO & Metadata             | [E15-tickets.md](E15-tickets.md) | [E15-status.md](E15-status.md) | 11  | E03, E04, E10, E12 |
| E16 Accessibility & Responsive | — not written                    | — not started                  | —   | E07–E13            |
| E17 Performance                | — not written                    | — not started                  | —   | E09–E13            |
| E18 Deployment                 | — not written                    | — not started                  | —   | E15–E17            |

**E15: 11 of 11 done.** Lighthouse SEO 100 on `/` and on `/projects/data-slicing`; one
criterion (the LinkedIn/Slack preview) deferred to E18 for want of a public URL. One code
defect of its own — a non-idempotent image pipeline — plus three `2-architecture.md` §8
heading amendments that E09, E12, and E13 had left only in component comments
([E15-status.md](E15-status.md) §3).

**E15 ships against the E03 writing stubs.** The graph edge from E14 existed so that
writing pages would exist before being marked non-indexable; a stub is a page with no real
content, which is exactly the condition `noindex` keys off. Everything that will need
revisiting when E14 lands carries a greppable `TODO(E14)`.

**E09: 8 of 8 done.** E09-T08 (portrait treatment) was unblocked by the supplied
photograph and shipped the same day — the seam built ahead of it took the image with no
layout change and zero CLS, which is what building the seam separately was for.

**E10: 12 of 12 done.** T09 was blocked on first pass and is now closed. Chasing it found
that `<AnimatePresence initial={false}>` in `PageTransition` had been suppressing the
`initial` prop of every motion component in the app since E06 shipped — the hero never
faded in and no scroll reveal ever ran. Fixed, with the first-paint requirement it existed
to serve preserved. 108 browser checks across the epic.

**E11: 7 of 7 done.** 46 browser checks, no defect of its own. It did surface a
pre-existing E07 discrepancy — the scroll spy retains the last observed section where
`navigation.ts` claims nothing should be highlighted — recorded in
[E11-status.md](E11-status.md) §3 for an E07 amendment ticket rather than fixed in place.

**E12: 11 of 11 done, across four passes.** 102 browser checks. Two defects were fixed in
the specification before any code was written — a fallback panel with a redundant second
control, and a hook specified as `useEffect` + `useState` that
`react-hooks/set-state-in-effect` correctly rejected ([E12-status.md](E12-status.md) §3).

**Then four more reached a real viewport that passing checks had not caught.** T07 and T08:
the preview sat flush left, and a missing PDF rendered one sentence inside a 1086px box.
T09 and T10: Chromium's thumbnail sidebar was eating ~200px of a 768px frame, so the
document rendered too small to read without zooming. Every one of them was a property the
checks never asked about — they asserted what the ticket specified, and a check written
from the same sentence as the code cannot contradict the code.

Chasing T08 found a seventh, and the sharpest: the SPA catch-all rewrite answers a missing
asset with **200 and the HTML shell**, so the availability probe's original `response.ok`
test would have called every missing file present — exactly the failure it was added to
catch. Detail in [E12-status.md](E12-status.md) §8 and §9. iOS Safari, and whether the
sidebar is _visually_ gone, remain outside what a harness here can confirm.

**36 Phase 1 tickets, 14 in E07, 8 in E08.** E01 → E02 is a hard sequence. E03, E04, E05, and E06 are independent of
each other once E02 lands and can be built in any order.

Nothing user-visible ships in Phase 1. The point of the phase is that everything after
it is fast to build and hard to build wrong.

---

## Revamp — not a phase

| Group     | Tickets                        | Status                       | #   | Depends on         |
| --------- | ------------------------------ | ---------------------------- | --- | ------------------ |
| RV Revamp | [RV-tickets.md](RV-tickets.md) | [RV-status.md](RV-status.md) | 6   | per-ticket, varies |

Revisions to sections that already shipped, decided after seeing the built page. **Every
revamp ticket lives in this one group**, whichever epic originally built the code it
touches — `RV-T01`, `RV-T02`, … in the order they are written.

It is not numbered as an epic on purpose. `E01`–`E18` are a build order with a dependency
graph and a finish line; revamps have neither, and they arrive for the life of the
project. Filing them as `E19`, `E20` would put open-ended work in the phase tables and
make a finished site read as unfinished.

Two obligations an epic ticket does not carry: a revamp must **name the decision it
overturns** by document and row, and must **amend the source documents in the same
commit** — the standing rule is that the document wins over the ticket, so code that lands
ahead of its spec is wrong by definition the moment it merges.

---

## Ticket conventions

**Size.** One ticket is one Conventional Commit. If a ticket needs two commits to
describe honestly, it was written too large — split it.

**Status.** The `E0X-status.md` files are the single source of truth for progress —
the `[ ]` checkboxes in the ticket headings are part of the ticket text and are left
alone, so the two can never drift. Update the epic's status file when you finish a
ticket, then the roll-up in [STATUS.md](STATUS.md) if the counts changed.

**Global Definition of Done** from `5-epic-list.md` applies to every ticket and is not
repeated in each one. The short version — it must pass all four gates:

```
yarn typecheck      # tsc --noEmit, zero errors
yarn lint           # eslint ., zero errors
yarn format:check   # prettier --check ., clean
yarn build          # succeeds
```

plus: no `any`, no `React.FC`, explicit return types on exports, arrow-function
components, no `console.log`, no commented-out code, every subscribing `useEffect`
returns a cleanup function, correct in both themes, no horizontal scroll at 320/375/
768/1024/1440/1920, keyboard reachable with a visible `focus-visible` ring, animations
respect `prefers-reduced-motion`, content from `src/data/`.

**Acceptance criteria are the review checklist.** A ticket is done when someone else
could verify every box without asking you what you meant.

---

## Decisions recorded during ticket writing

Ambiguities in the source documents that were resolved before tickets were written.
Every one of them is now fixed **in the source documents themselves** — resolving a spec
conflict only in code leaves the next person to re-litigate it.

| #                                                                                         | Ambiguity                                                                                                                               | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Documents updated                                                                                                                           |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1                                                                                         | `3-style-preference.md` §9 specified a `tailwind.config.ts` with `theme.extend` and `darkMode: 'class'` — Tailwind v3 syntax            | **Tailwind v4, CSS-first.** No `tailwind.config.ts`. Tokens and the `@theme inline` mapping live in `src/styles/index.css`; dark mode via `@custom-variant`. Every token _value_ in §2.2–2.3 and §3.2 is unchanged — only the file it lives in moved                                                                                                                                                                                                                                                                                              | `AGENTS.md` §2, §6, §14 · `2-architecture.md` §7 · `3-style-preference.md` §2.1, §7, §9 · `5-epic-list.md` E01, E02                         |
| 2                                                                                         | `AGENTS.md` §5 contradicted itself on hook filenames — camelCase in one bullet, `use-[feature].ts` in another                           | **camelCase only.** `useTheme.ts`, `useActiveSection.ts`, `useHashScroll.ts`, `useCarousel.ts`. Services and types keep kebab-case                                                                                                                                                                                                                                                                                                                                                                                                                | `AGENTS.md` §5                                                                                                                              |
| 3                                                                                         | Hero `h1`: `4-interaction-design.md` §5.1 said "name", `3-style-preference.md` §6.2 said "name + positioning"                           | **Name only — a category error, not a contradiction.** §5.1 assigns elements; §6.2 described what the block communicates. Stack is `h1`(name) → role framing → value proposition. Positioning keywords live in `<title>` and `meta[description]`                                                                                                                                                                                                                                                                                                  | `3-style-preference.md` §6.2 · `4-interaction-design.md` §5.1, §10 · `2-architecture.md` §8 · `1-prd.md` §3                                 |
| 4                                                                                         | Hero layout switch keyed off the presence of `portrait`                                                                                 | **Explicit `layout: 'stacked' \| 'split'` discriminator.** The seam ships now against an aspect-ratio-locked slot; the portrait treatment is separately tracked and blocked on the asset. Layout and artwork are two decisions, not one                                                                                                                                                                                                                                                                                                           | `4-interaction-design.md` §5.1, §10 · `3-style-preference.md` §6.2 · `2-architecture.md` §5 · `5-epic-list.md` E04, E09 · `1-prd.md` §3, §6 |
| 5                                                                                         | Eyebrow on Current Role — unspecified                                                                                                   | **Omitted.** Eyebrows are wayfinding for repeated, scannable sets; `Section`'s optional eyebrow is an opt-in, not a default                                                                                                                                                                                                                                                                                                                                                                                                                       | `3-style-preference.md` §6.3 · `4-interaction-design.md` §5.2, §10                                                                          |
| 6                                                                                         | Motion for elements the §8 inventory does not name (first case: Current Role stack badges)                                              | **Default is animation 2, no child orchestration.** A closed list means absent elements take the default; adding motion to one is a §8 amendment ticket, never an in-epic judgement call                                                                                                                                                                                                                                                                                                                                                          | `4-interaction-design.md` §8, §5.2, §10                                                                                                     |
| 7                                                                                         | Project card link model — the title was specified as the card's only link, with no stated destination                                   | **Three named `secondary` `sm` buttons, no title link.** Case study → `/projects/:slug`, GitHub, Live, each conditional on its data. Siblings never nest inside an anchor, and each names its destination instead of hiding three of them behind one title. The card drops the `-translate-y-0.5` hover, which promised a click target it no longer is                                                                                                                                                                                            | `3-style-preference.md` §6.4 · `4-interaction-design.md` §6, §9, §10 row 10 · `5-epic-list.md` E10                                          |
| 8                                                                                         | Case study `Links` `h2` when a project has neither a repository nor a live URL                                                          | **Omitted entirely.** `2-architecture.md` §8 lists the maximum heading set, not a per-project guarantee. Most of this work is client software behind a login; a retained heading resolves to an apology on the majority of pages, and a heading that introduces nothing costs attention for no return                                                                                                                                                                                                                                             | `2-architecture.md` §8 · `3-style-preference.md` §6.10 · `4-interaction-design.md` §10 row 11 · `5-epic-list.md` E10                        |
| 9                                                                                         | Vertical scroll over a project carousel — requested after E10 shipped, and banned outright by `4-interaction-design.md` §4              | **Hover-scoped wheel redirect.** While the pointer is over a track that can still travel, a vertical wheel gesture moves it sideways; at either end the page takes over. Nothing pinned, no scroll lock, pointer as the escape hatch — the narrowest form of the behaviour, recorded as a documented §4 exception like the rail's `width` animation. The pinned-section form stays prohibited                                                                                                                                                     | `4-interaction-design.md` §4, §6, §9, §10 row 12                                                                                            |
| 10                                                                                        | `about.ts` ships a `lookingFor` field that no specification mentions                                                                    | **A visually distinct closing line**, `fg` against the prose's `fg-muted` with a `border-l-2 border-accent` rule. It is the one sentence in About a reader can act on. Conditional on the field, which is optional — an accent rule beside nothing is worse than no rule                                                                                                                                                                                                                                                                          | `3-style-preference.md` §6.5 · `4-interaction-design.md` §5.4, §10 row 13 · `5-epic-list.md` E11                                            |
| 11                                                                                        | The optional About portrait in `3-style-preference.md` §6.5                                                                             | **Withdrawn from the spec, not deferred.** The hero carries the only photograph on the page; a second 800px below it establishes nothing new. Deleting the clause is what stops it being re-opened later as an unbuilt option                                                                                                                                                                                                                                                                                                                     | `3-style-preference.md` §6.5 · `4-interaction-design.md` §5.4, §10 row 14 · `5-epic-list.md` E11                                            |
| 12                                                                                        | Skill group labels — styled as headings by §6.6, absent from `2-architecture.md` §8's heading outline                                   | **Labelled lists, not headings.** `<ul role="list" aria-labelledby>` with a `<p>` label styled as the eyebrow. Six `h3`s would enter the outline a screen reader user pages through to reach Contact and still not carry each group's size. `role="list"` is explicit: Safari drops list semantics at `list-style: none`                                                                                                                                                                                                                          | `3-style-preference.md` §6.6 · `2-architecture.md` §8 · `4-interaction-design.md` §5.5, §10 row 15 · `5-epic-list.md` E11                   |
| 13                                                                                        | The `/resume` viewer — no document gave it a size, or said what happens where a browser cannot display a PDF inline                     | **Aspect-ratio-locked slot at the PDF's page ratio (A4, 210/297), a fallback panel in the same frame, and the direct link in both states.** The lock reserves the height before the document paints, so CLS stays 0. The panel keeps `h2: View` introducing something real rather than collapsing the heading. The direct link is unconditional, so the page's one guarantee never depends on a capability check that cannot be verified on iOS                                                                                                   | `3-style-preference.md` §6.7 · `4-interaction-design.md` §5.6, §10 row 16 · `5-epic-list.md` E12                                            |
| 14                                                                                        | The contact form was locked to Netlify Forms by `2-architecture.md` §9, while the host is unsettled between Netlify, Vercel, and Render | **FormSubmit's token AJAX endpoint, `fetch`ed from a single service module.** Netlify Forms is a build-time HTML scan plus an edge intercept, not an endpoint: hosted elsewhere the POST resolves against the SPA fallback and returns `200` and the HTML shell, which `fetch` cannot tell from success — so the visitor is thanked for a message that was never sent. A provider endpoint works on any host and is verifiable from `yarn dev`, which moved E13's delivery criterion out of E18 and back into E13. No npm package: it is one POST | `2-architecture.md` §9 · `3-style-preference.md` §6.8 · `4-interaction-design.md` §5.7, §10 row 19 · `5-epic-list.md` E13, E18              |
| 15                                                                                        | E14 is unbuilt, and E15 sits downstream of it in the dependency graph                                                                   | **E15: 11 of 11 done.** Lighthouse SEO 100 on `/` and on `/projects/data-slicing`; one                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| criterion (the LinkedIn/Slack preview) deferred to E18 for want of a public URL. One code |
| defect of its own — a non-idempotent image pipeline — plus three `2-architecture.md` §8   |
| heading amendments that E09, E12, and E13 had left only in component comments             |
| ([E15-status.md](E15-status.md) §3).                                                      |

**E15 ships against the E03 writing stubs.** Author's decision. The edge existed so writing pages would exist before being marked non-indexable; a stub is a page with no real content, which is exactly what `noindex` keys off — `getPublishedPosts().length === 0` is true for a stub and for a finished-but-empty state alike. Recorded as `TODO(E14)`, not as a blocked ticket | `5-epic-list.md` E14, E15 · `docs/tickets/STATUS.md` Phase 4 |
| 16 | Image tooling — no image binary is installed, and E09-T08 converted the portrait through a headless browser | **`sharp` as a devDependency, plus `scripts/optimize-images.mjs` and `yarn images`.** The one dependency E15 adds, said out loud per `AGENTS.md` §13. It never enters the bundle, so §7's budget is untouched. The browser-canvas route is not repeatable by the author, and three project screenshots are still missing — the pipeline makes adding them one command. A committed hash manifest keeps a second run a no-op, since re-encoding lossy formats otherwise degrades them each pass | `2-architecture.md` §5 (Image Pipeline) · `AGENTS.md` §9, §13 · `5-epic-list.md` E15 |
| 17 | What "slugs validated against stable project IDs" means — no document names a mechanism, and there is no test runner | **One invariant function, `assertValidProjectSlugs()`, asserted at dev-server boot.** Throws on a duplicate id, a duplicate slug, or a slug that is not lowercase-kebab. The build gate originally specified alongside it was **withdrawn**: it would have to live in `vite.config.ts`, which esbuild bundles with no loader for the `.webp` imports in `projects.ts`, so importing the data there fails the config load outright. Eight hand-edited entries and no CI make the dev-time assert proportionate. No test framework for one assertion | `2-architecture.md` §5, §8 · `src/types/project.types.ts` · `E15-tickets.md` T07 · `E15-status.md` §3 |
| 18 | Canonical links, `robots.txt`, and `sitemap.xml` — none appears in any source document | **All three ship.** Lighthouse audits `robots.txt` validity directly, so criterion 1 is unreachable without it. The canonical is per-route and written by the metadata utility: an SPA answers every path with the same shell, so it is the only signal that `/projects/x` and `/projects/x?utm_source=…` are one page — a single static one would claim every route is the home page. The sitemap is a hand-maintained seven-URL file; a generator for seven URLs is infrastructure the PRD's non-goals rule out | `2-architecture.md` §8 · `1-prd.md` §5 SEO · `5-epic-list.md` E15 |
| 19 | Twitter card type and handle — unspecified | **`summary_large_image`, with `twitter:site` and `twitter:creator` both `@Shakhlyn`** from `PROFILE.social.x`. `summary` crops a 1200×630 asset into a square thumbnail; the OG image is authored at that ratio, so the large card is the one that renders what exists | `2-architecture.md` §5, §8 · `5-epic-list.md` E15 |
| 20 | E15 criterion 2 (LinkedIn/Slack preview) needs a public URL, and `SITE_URL` is an unregistered guess | **Deferred to E18 with a named hand-off, not marked passing in E15.** Every absolute URL in `dist/` derives from the single `SITE_URL` constant, so the deploy-time fix is one line. E15 proves the markup is present and absolute in `dist/index.html`; E18 pastes the live link. Precedent: E08's rail criterion deferred to E09. Marked `TODO(deploy)` | `5-epic-list.md` E15 criterion 2, E18 · `E15-status.md` §5 |
| 21 | Whether Current Role earns a standalone slot after the hero, or belongs inside Projects | **Neither — it keeps the slot and changes its job (RV-T01).** All four of its scope bullets were duplicated elsewhere on the page, so there was no copy left to rewrite; and it could not fold into Projects either, since the projects it covers share one employment context that no card can hold without repeating it. Rebuilt as "Currently": a present-tense status panel carrying employer, placement, one sentence of scope, availability, and links into the projects. `about.lookingFor` moves here, superseding `4-interaction-design.md` §10 row 13 | `3-style-preference.md` §6.3, §6.5 · `2-architecture.md` §8 · `4-interaction-design.md` §5.2, §5.4, §10 rows 20–22 · `5-epic-list.md` E09, E11 · [RV-tickets.md](RV-tickets.md) |
| 22 | RV-T01 made the hero redundant: it restated the role, employer, platform, and modules that the new panel carries one screen below | **The hero slims to positioning only (RV-T02).** The current position line goes, with both `ProfileType` fields behind it; the value proposition cuts to one sentence about _how_ rather than _where_. The employer name renders exactly once on the home page. The stale year counts are deleted rather than replaced — `AGENTS.md` §13 forbids guessing one, and the panel's date range is a real tenure signal until the author supplies a total | `3-style-preference.md` §6.2 · `4-interaction-design.md` §5.1, §10 row 23 · `5-epic-list.md` E09 · [RV-tickets.md](RV-tickets.md) |
| 23 | The hero `h1` used a two-step `display` → `display-md` scale, and the author's 25-character name wrapped | **A fluid, single-token size (RV-T03, retuned by RV-T04).** A two-step scale cannot express "as large as the current box allows", and the binding box is not the smallest phone — it is the `split` layout's text column at `lg`, which _narrows_ to 624px exactly where a fixed scale jumps to its largest step. RV-T03 shipped without the browser check its own acceptance list required and wrapped at 1024px; RV-T04 retunes it for the **widest** face in the `system-ui` stack, since that stack resolves per platform. Cost: 38.4px desktop against 56px originally, and accepting a deliberate two-line name remains open | `3-style-preference.md` §3.2, §6.2 · `4-interaction-design.md` §10 row 24 · [RV-tickets.md](RV-tickets.md) RV-T03, RV-T04 |
| 24 | RV-T01 gave the panel one `dateRange` for two organisations, backdating the placement by seven months | **Two fields, each rendered beside its own organisation (RV-T05).** `companyDateRange` rides in the `h3` with the employer, `clientDateRange` on the placement line — a range on a line of its own is read against whatever is nearest, which is how the original bug read as correct. Renamed rather than supplemented so `yarn typecheck` forces every reader to be visited and the ambiguous name does not survive | `3-style-preference.md` §6.3 · `4-interaction-design.md` §5.2, §10 row 25 · [RV-tickets.md](RV-tickets.md) RV-T05 |

---

## Content gate

E04 is blocked on real content that no amount of code can unblock: candidate name,
target role, contact links, project names and descriptions, skills, and the resume PDF.
`1-prd.md` §6 lists these as **not acceptable** as launch placeholders.

Draft copy is fine to start Phase 1. Launch is not. Start collecting now — content is
the most common reason a portfolio stalls at 90% built.
