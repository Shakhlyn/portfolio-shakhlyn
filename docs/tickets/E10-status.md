# E10 — Projects · Status

**11 of 12 tickets done.** T01 shipped ahead of the rest, in the decomposition commit
`88ce89e`. T09 is **implemented but not verifiable** — see the blocked-criterion record.

Verified in headless Chrome over CDP against `yarn preview`, at 320 / 375 / 768 / 1024 /
1440 / 1920, in both themes, with and without `prefers-reduced-motion`.

| Ticket | Title                                       | Commit                                                            | State                |
| ------ | ------------------------------------------- | ----------------------------------------------------------------- | -------------------- |
| T01    | Amend the card link model and Links heading | `docs(e10): fix the card link model and decompose…` (`88ce89e`)   | done                 |
| T02    | Placeholder projects and screenshots        | `feat(data): add placeholder projects and screenshots…`           | done                 |
| T03    | `ProjectCard` + minimal `ProjectsSection`   | `feat(projects): build the projects section with grouped cards`   | done (merged w/ T04) |
| T04    | Professional / Personal subsections         | ↑ same commit                                                     | done                 |
| T05    | Derive the Projects nav item                | `feat(nav): omit the projects nav item when no projects exist`    | done                 |
| T06    | `ProjectCarousel` scroll track              | `feat(projects): build the scroll-snapped project carousel track` | done                 |
| T07    | `useCarousel`                               | `feat(hooks): track carousel scroll position and arrow state`     | done                 |
| T08    | Arrow controls                              | `feat(projects): add carousel arrow controls`                     | done                 |
| T09    | Staggered per-subsection reveal             | `feat(projects): stagger card reveals per subsection`             | **blocked, see §3**  |
| T10    | `/projects/:slug` route + 404               | `feat(projects): resolve project slugs and render the hero`       | done                 |
| T11    | `ProjectCaseStudy` + `ProjectLinks`         | `feat(projects): build the case study body and links section`     | done                 |
| T12    | Verification pass + this file               | `docs(tickets): record E10 status`                                | done                 |

**Totals: 63 + 13 + 6 + 4 = 86 browser checks, 85 passing.** The one failure is §3.

---

## 1. Deviations from the tickets

**T03 and T04 ship as one commit.** Both touch only `ProjectCard.tsx` and
`ProjectsSection.tsx`, and T03's "render every project in one stack" state exists solely
to be replaced by T04's grouping two hours later. Committing the flat stack would have put
a state in the history that was never intended to ship. One commit, both tickets'
acceptance criteria verified separately.

**The card button size is resolved per breakpoint, not fixed at `sm`.** `3-style-preference.md`
§6.4 specifies `sm` (32px) card buttons; §5.1 marks `sm` desktop-only, and §11 plus
`1-prd.md` §5 require 44×44px touch targets. The two rules only disagree where a card is
touched, so the buttons render at `lg` (48px) below `md` and `sm` (32px) from `md` up —
decided by the user during implementation. Implemented as a className override on
`size="lg"` rather than by teaching `Button` responsive sizes, because `Button` is E05's
primitive and a card is not sufficient reason to widen its API.

**T12 also touches `E07-status.md`**, recording T05's cross-epic edit from the E07 end.

---

## 2. Defect found and fixed during verification

**Horizontal page scroll of 69px at 1440 — the exact risk T06 was written to retire, in a
form the mitigation did not cover.**

The bleed mitigation (below `sm` only, where `Container`'s gutter is symmetric) was correct
and held. The overflow came from somewhere else entirely: every external `Button` renders a
visually hidden `(opens in a new tab)` span, `sr-only` is `position: absolute`, and the
track was `position: static`. **`overflow-x: auto` does not clip absolutely positioned
descendants unless the scroller is also their containing block**, so those 1px spans on
cards scrolled out of view escaped the track and dragged the document's scroll area to
1509px. Fixed by adding `relative` to the track.

Three things about how it was found are worth keeping:

- It reproduced on the **professional** track only, because that is where an off-screen
  card carries external buttons. A one-track test would have missed it.
- `getBoundingClientRect()` reports clipped content, so the first offender scan returned
  four false leads. The scan that worked filtered by whether any ancestor clips.
- `documentElement.scrollWidth > clientWidth` was **not** a reliable signal:
  under mobile emulation it read 1076 against a 375 viewport on a page that could not
  scroll sideways at all. The harness now asserts on `window.scrollX` after
  `scrollTo(9999, y)` — whether the page actually scrolls, which is what the rule means.

---

## 3. Blocked criterion — T09's reveal cannot be observed

**Scroll-reveal animations do not run, and this predates E10.**

`whileInView` elements never receive their `initial` variant: sampling computed opacity
every 16ms while scrolling a target into view shows `1.00` for every frame, and the
element carries no inline style until the observer fires, at which point it is set to the
final state it already had. No fade occurs.

This was confirmed **not** to be an E10 regression by building `HEAD` (`88ce89e`, before
any E10 code) in a separate worktree and running the same probe against E09's
`CurrentRoleSection`: identical result — `min opacity = 1`, no `hidden` state, inline
style appearing only after entry. The mechanism is E06's, the first consumer was E09's,
and both behave the same way before and after this epic.

What this means per criterion:

| T09 criterion                                       | State                                                      |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Cards reveal staggered ~60ms apart, ≤300ms total    | **not verifiable** — measured spread 0ms, nothing animates |
| Personal group stays hidden until it enters view    | **fails** — cards are at opacity 1 while off-screen        |
| Scrolling away and back does not re-animate         | passes (vacuously — nothing animates in the first place)   |
| Reduced motion renders final state immediately      | passes                                                     |
| Only `opacity`/`transform` in the transition list   | passes                                                     |
| `lib/motion.ts` and `constants/motion.ts` untouched | passes — `git diff` on both is empty                       |

The T09 code is written to the spec — parent `staggerContainer` variants, per-subsection
`whileInView` with `VIEWPORT_ONCE`, `Math.min(STAGGER_CARDS, STAGGER_MAX_TOTAL / count)`
so the group total stays inside the 300ms cap, children on the shared `fadeUp`. It is
correct against `4-interaction-design.md` §8 and will animate the moment the underlying
issue is fixed. **Fixing it means changing E06's motion foundation, which is outside this
epic's scope**, so it is recorded here rather than done quietly.

Not yet determined: whether this is a genuine site-wide defect or an artefact of headless
Chrome resolving `whileInView` instantly. That distinction needs a headful browser and is
the first step of whatever ticket picks this up.

---

## 4. Criteria verified by temporarily editing data

Three ticket criteria are unobservable with real content. Each was verified against a
temporary edit to `src/data/projects.ts`, then reverted — `git diff` on the file shows
only T02's additions.

**`PROJECTS = []`** (6 checks): `#projects` is absent from the DOM entirely, not an empty
section; the desktop nav drops to 5 items — `Home, About, Blog, Contact, Resume`; the
mobile sheet drops it too; `ANCHOR_SECTION_IDS` loses `projects`, so the spy reports
`Home / Home / About / About` across four scroll depths and never `Projects`; the 404 link
row reads `Home, Resume, Contact`.

**Every project `category: 'personal'`** (4 checks): one `h3` ("Personal"), one carousel
region, all 8 cards in it, and no empty heading or container left behind.

---

## 5. Per-ticket evidence

### T02 — placeholder projects and screenshots

| Criterion                    | Evidence                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| ≥4 per category              | 4 professional, 4 personal — DOM card counts `[4,4]`                  |
| Every placeholder marked     | 5 `PLACEHOLDER PROJECT` + 4 `PLACEHOLDER SCREENSHOT` in `projects.ts` |
| Gate grep covers everything  | 26 total marker lines under `src/`                                    |
| 16:9, <60KB, dims match data | 1280×720 each; 7.9KB / 7.0KB / 6.7KB; `width`/`height` attrs match    |
| Five real entries unchanged  | `git diff -U0` shows zero removed lines outside comments              |

### T03 / T04 — card and grouping

`h4` count 8, none inside an anchor; `a a, a button, button a` → 0 nested interactives;
case-study-only project → one button to `/projects/deal-summary-comparison`; github-only
project → one GitHub button; link-less project → **zero** buttons and no empty row
container; all-links project → three buttons, externals carrying
`target="_blank" rel="noreferrer"` and an accessible name ending "(opens in a new tab)".
Images lazy with `width`/`height`; frame omitted where no image exists. Summary clamps at
48px against a 24px line-height with 134 characters still in the DOM. Seven tags →
`TypeScript, React, Node.js, PostgreSQL, Docker, +2`. Card hover transitions colour only —
`transition-property` contains no `transform`. Two `h3`s in order; outline
`H1 → H2 Current Role → H3 → H2 Projects → H3 Professional → H4×4 → H3 Personal → H4×4 →
H2 About → H2 Skills → H2 Contact`; zero filter controls.

### T06 — track

No horizontal page scroll at any of the six widths (`scrollX === 0` after
`scrollTo(9999, y)`). Track spans 0→375 at 375px; at 640 it sits inside the asymmetric
gutter (left 56, right 616). Cards per view measured **1.150 / 2.150 / 3.000** against
targets 1.15 / 2.15 / 3 — computed as `(trackContent − k·gap) / cardWidth`, which is what
"cards per view" means; the naive `cardWidth / trackWidth ≈ 1/n` form ignores the gap term
and is wrong. Both tracks are `role="region"` `tabindex="0"` with distinct labels carrying
data-derived counts. Snap `x mandatory`, scrollbar hidden, scrolling one track leaves the
other at 0, `ArrowRight` on a focused track scrolls it, and a card focused from off-screen
lands with a 720px gap from the track edge, not flush.

### T07 — hook

Explicit exported return type, no `any`. Zero `window.addEventListener('resize')`; a
`ResizeObserver` instead. Cleanup calls `removeEventListener`, `cancelAnimationFrame`, and
`observer.disconnect()`. `yarn lint` clean with no `eslint-disable`. `DOMDebugger.getEventListeners`
shows exactly one `scroll` listener on the track while mounted, and the node is gone after
navigating to `/resume`.

### T08 — arrows

Four arrows, four distinct labels. At `scrollLeft 0`: prev `aria-disabled=true` at
`opacity 0.5`, next enabled. Next advances exactly 360px against an expected 360px. At the
end: next disabled, prev enabled. Activating a disabled arrow leaves `scrollLeft` at 360.
36px tall. No arrow visible below `md`.

**Resize re-evaluation** — the first version of this check was wrong and passed nothing
useful: scrolling to the end and resizing proves nothing, because mandatory snap re-snaps
to the last card and "next disabled" stays correctly true at both widths. The check that
actually exercises re-evaluation moves a _middle_ snap point past the new maximum: at 768
the track sits at card 1 (`pos 322 / max 575`, next enabled); resizing to 1920 clamps it to
`pos 413 / max 413` and the arrow flips to disabled, agreeing with a fresh measurement.

### T10 / T11 — case study route

All 8 slugs resolve to their own `h1`. `/projects/definitely-not-a-project` renders `h1`
"Page Not Found" with the URL untouched, no error-boundary text, and header and footer
intact. A link-less project's `h2` list is exactly `Problem → Approach → Stack → Outcome`;
a linked one adds `Links` with two external buttons. The candidate's role renders outside
any heading. Stack renders as 7 badges. The case study hero image carries
`fetchpriority="high"` and is not lazy. Prose measures 768px at 1920.

### T12 — cross-cutting

No horizontal scroll in either theme; cards resolve themed surfaces
(`rgb(250,250,250)` / `rgb(17,23,38)`). A real Tab sweep — 59 stops, dispatched as key
events because programmatic `.focus()` does not match `:focus-visible` — finds 31 of 31
stops inside the section showing a focus ring, with no trap. Scroll spy still marks at
most one nav item at five depths. The rail and the hero's `SocialLinks` row are still
never both visible.

---

## 6. Outstanding content debt

`grep -rnE "INVENTED FIGURE|PLACEHOLDER PROJECT|PLACEHOLDER SCREENSHOT" src/` → **26
lines**: 5 placeholder-project markers, 4 placeholder-screenshot markers, and the
pre-existing invented outcome figures from E04. All are a hard deploy gate in
`5-epic-list.md` E18.
