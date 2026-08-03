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
| E12 Resume              | [E12-tickets.md](E12-tickets.md) | [E12-status.md](E12-status.md) | 6   | E07, E09   |

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

**E12: 6 of 6 done.** 38 browser checks, no defect of its own — but two in its own ticket
file, both fixed in the specification rather than absorbed into the code: a fallback panel
that specified a redundant second control, and a hook specified as `useEffect` + `useState`
that `react-hooks/set-state-in-effect` correctly rejected. Detail in
[E12-status.md](E12-status.md) §3. Its one real gap is that iOS Safari — the browser the
fallback exists for — cannot be verified here, so the design does not depend on the check.

**36 Phase 1 tickets, 14 in E07, 8 in E08.** E01 → E02 is a hard sequence. E03, E04, E05, and E06 are independent of
each other once E02 lands and can be built in any order.

Nothing user-visible ships in Phase 1. The point of the phase is that everything after
it is fast to build and hard to build wrong.

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

| #   | Ambiguity                                                                                                                    | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                        | Documents updated                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `3-style-preference.md` §9 specified a `tailwind.config.ts` with `theme.extend` and `darkMode: 'class'` — Tailwind v3 syntax | **Tailwind v4, CSS-first.** No `tailwind.config.ts`. Tokens and the `@theme inline` mapping live in `src/styles/index.css`; dark mode via `@custom-variant`. Every token _value_ in §2.2–2.3 and §3.2 is unchanged — only the file it lives in moved                                                                                                                                                                                            | `AGENTS.md` §2, §6, §14 · `2-architecture.md` §7 · `3-style-preference.md` §2.1, §7, §9 · `5-epic-list.md` E01, E02                         |
| 2   | `AGENTS.md` §5 contradicted itself on hook filenames — camelCase in one bullet, `use-[feature].ts` in another                | **camelCase only.** `useTheme.ts`, `useActiveSection.ts`, `useHashScroll.ts`, `useCarousel.ts`. Services and types keep kebab-case                                                                                                                                                                                                                                                                                                              | `AGENTS.md` §5                                                                                                                              |
| 3   | Hero `h1`: `4-interaction-design.md` §5.1 said "name", `3-style-preference.md` §6.2 said "name + positioning"                | **Name only — a category error, not a contradiction.** §5.1 assigns elements; §6.2 described what the block communicates. Stack is `h1`(name) → role framing → value proposition. Positioning keywords live in `<title>` and `meta[description]`                                                                                                                                                                                                | `3-style-preference.md` §6.2 · `4-interaction-design.md` §5.1, §10 · `2-architecture.md` §8 · `1-prd.md` §3                                 |
| 4   | Hero layout switch keyed off the presence of `portrait`                                                                      | **Explicit `layout: 'stacked' \| 'split'` discriminator.** The seam ships now against an aspect-ratio-locked slot; the portrait treatment is separately tracked and blocked on the asset. Layout and artwork are two decisions, not one                                                                                                                                                                                                         | `4-interaction-design.md` §5.1, §10 · `3-style-preference.md` §6.2 · `2-architecture.md` §5 · `5-epic-list.md` E04, E09 · `1-prd.md` §3, §6 |
| 5   | Eyebrow on Current Role — unspecified                                                                                        | **Omitted.** Eyebrows are wayfinding for repeated, scannable sets; `Section`'s optional eyebrow is an opt-in, not a default                                                                                                                                                                                                                                                                                                                     | `3-style-preference.md` §6.3 · `4-interaction-design.md` §5.2, §10                                                                          |
| 6   | Motion for elements the §8 inventory does not name (first case: Current Role stack badges)                                   | **Default is animation 2, no child orchestration.** A closed list means absent elements take the default; adding motion to one is a §8 amendment ticket, never an in-epic judgement call                                                                                                                                                                                                                                                        | `4-interaction-design.md` §8, §5.2, §10                                                                                                     |
| 7   | Project card link model — the title was specified as the card's only link, with no stated destination                        | **Three named `secondary` `sm` buttons, no title link.** Case study → `/projects/:slug`, GitHub, Live, each conditional on its data. Siblings never nest inside an anchor, and each names its destination instead of hiding three of them behind one title. The card drops the `-translate-y-0.5` hover, which promised a click target it no longer is                                                                                          | `3-style-preference.md` §6.4 · `4-interaction-design.md` §6, §9, §10 row 10 · `5-epic-list.md` E10                                          |
| 8   | Case study `Links` `h2` when a project has neither a repository nor a live URL                                               | **Omitted entirely.** `2-architecture.md` §8 lists the maximum heading set, not a per-project guarantee. Most of this work is client software behind a login; a retained heading resolves to an apology on the majority of pages, and a heading that introduces nothing costs attention for no return                                                                                                                                           | `2-architecture.md` §8 · `3-style-preference.md` §6.10 · `4-interaction-design.md` §10 row 11 · `5-epic-list.md` E10                        |
| 9   | Vertical scroll over a project carousel — requested after E10 shipped, and banned outright by `4-interaction-design.md` §4   | **Hover-scoped wheel redirect.** While the pointer is over a track that can still travel, a vertical wheel gesture moves it sideways; at either end the page takes over. Nothing pinned, no scroll lock, pointer as the escape hatch — the narrowest form of the behaviour, recorded as a documented §4 exception like the rail's `width` animation. The pinned-section form stays prohibited                                                   | `4-interaction-design.md` §4, §6, §9, §10 row 12                                                                                            |
| 10  | `about.ts` ships a `lookingFor` field that no specification mentions                                                         | **A visually distinct closing line**, `fg` against the prose's `fg-muted` with a `border-l-2 border-accent` rule. It is the one sentence in About a reader can act on. Conditional on the field, which is optional — an accent rule beside nothing is worse than no rule                                                                                                                                                                        | `3-style-preference.md` §6.5 · `4-interaction-design.md` §5.4, §10 row 13 · `5-epic-list.md` E11                                            |
| 11  | The optional About portrait in `3-style-preference.md` §6.5                                                                  | **Withdrawn from the spec, not deferred.** The hero carries the only photograph on the page; a second 800px below it establishes nothing new. Deleting the clause is what stops it being re-opened later as an unbuilt option                                                                                                                                                                                                                   | `3-style-preference.md` §6.5 · `4-interaction-design.md` §5.4, §10 row 14 · `5-epic-list.md` E11                                            |
| 12  | Skill group labels — styled as headings by §6.6, absent from `2-architecture.md` §8's heading outline                        | **Labelled lists, not headings.** `<ul role="list" aria-labelledby>` with a `<p>` label styled as the eyebrow. Six `h3`s would enter the outline a screen reader user pages through to reach Contact and still not carry each group's size. `role="list"` is explicit: Safari drops list semantics at `list-style: none`                                                                                                                        | `3-style-preference.md` §6.6 · `2-architecture.md` §8 · `4-interaction-design.md` §5.5, §10 row 15 · `5-epic-list.md` E11                   |
| 13  | The `/resume` viewer — no document gave it a size, or said what happens where a browser cannot display a PDF inline          | **Aspect-ratio-locked slot at the PDF's page ratio (A4, 210/297), a fallback panel in the same frame, and the direct link in both states.** The lock reserves the height before the document paints, so CLS stays 0. The panel keeps `h2: View` introducing something real rather than collapsing the heading. The direct link is unconditional, so the page's one guarantee never depends on a capability check that cannot be verified on iOS | `3-style-preference.md` §6.7 · `4-interaction-design.md` §5.6, §10 row 16 · `5-epic-list.md` E12                                            |

---

## Content gate

E04 is blocked on real content that no amount of code can unblock: candidate name,
target role, contact links, project names and descriptions, skills, and the resume PDF.
`1-prd.md` §6 lists these as **not acceptable** as launch placeholders.

Draft copy is fine to start Phase 1. Launch is not. Start collecting now — content is
the most common reason a portfolio stalls at 90% built.
