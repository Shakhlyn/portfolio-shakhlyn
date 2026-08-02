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

**36 Phase 1 tickets, 14 in E07.** E01 → E02 is a hard sequence. E03, E04, E05, and E06 are independent of
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

Two ambiguities in the source documents were resolved before these tickets were
written. Both are now fixed in the source documents themselves.

| #   | Ambiguity                                                                                                                    | Decision                                                                                                                                                                                                                                             | Documents updated                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | `3-style-preference.md` §9 specified a `tailwind.config.ts` with `theme.extend` and `darkMode: 'class'` — Tailwind v3 syntax | **Tailwind v4, CSS-first.** No `tailwind.config.ts`. Tokens and the `@theme inline` mapping live in `src/styles/index.css`; dark mode via `@custom-variant`. Every token _value_ in §2.2–2.3 and §3.2 is unchanged — only the file it lives in moved | `AGENTS.md` §2, §6, §14 · `2-architecture.md` §7 · `3-style-preference.md` §2.1, §7, §9 · `5-epic-list.md` E01, E02 |
| 2   | `AGENTS.md` §5 contradicted itself on hook filenames — camelCase in one bullet, `use-[feature].ts` in another                | **camelCase only.** `useTheme.ts`, `useActiveSection.ts`, `useHashScroll.ts`, `useCarousel.ts`. Services and types keep kebab-case                                                                                                                   | `AGENTS.md` §5                                                                                                      |

---

## Content gate

E04 is blocked on real content that no amount of code can unblock: candidate name,
target role, contact links, project names and descriptions, skills, and the resume PDF.
`1-prd.md` §6 lists these as **not acceptable** as launch placeholders.

Draft copy is fine to start Phase 1. Launch is not. Start collecting now — content is
the most common reason a portfolio stalls at 90% built.
