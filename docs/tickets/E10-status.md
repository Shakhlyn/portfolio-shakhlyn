# E10 — Projects · Status

**12 of 12 tickets done.** T01 shipped ahead of the rest, in the decomposition commit
`88ce89e`. T09 was recorded as blocked on first pass and is now **done** — the cause was
found and fixed; see §3.

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
| T09    | Staggered per-subsection reveal             | `feat(projects): stagger card reveals per subsection`             | done — see §3        |
| T10    | `/projects/:slug` route + 404               | `feat(projects): resolve project slugs and render the hero`       | done                 |
| T11    | `ProjectCaseStudy` + `ProjectLinks`         | `feat(projects): build the case study body and links section`     | done                 |
| T12    | Verification pass + this file               | `docs(tickets): record E10 status`                                | done                 |

**Totals: 63 + 14 + 6 + 4 + 12 + 9 = 108 browser checks, all passing.**

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

## 3. Root cause found: one prop had disabled every animation on the site

**First pass recorded T09 as blocked** — `whileInView` elements never received their
`initial` variant, so nothing faded in anywhere, and the same was true at `88ce89e`
before any E10 code existed. That was correct as far as it went, and the wrong place to
stop. The cause was one prop:

```tsx
<AnimatePresence mode="wait" initial={false}>   // PageTransition
```

`initial={false}` on `AnimatePresence` does not only suppress that component's own entry
animation. It sets `PresenceContext.initial = false`, and **every descendant motion
component then skips its own `initial` prop**, rendering straight at its animate state.
The whole app is inside `PageTransition`, so this silently disabled animation 1 (hero
mount) and every scroll reveal on the site — the hero painted at its final state, and
`whileInView` elements had no `hidden` state to travel from.

It is invisible in review because the prop is correct-looking, sits in an unrelated
component, and its stated purpose — "do not fade the whole page in on first load" — is a
real requirement. The fix keeps that requirement and scopes it to the element that needs
it: `AnimatePresence` no longer carries `initial`, and the wrapper's own `initial` is
`false` on first paint only, via a module-level write-once flag. A ref read during render
and a `setState` in an effect are both rejected by the React Compiler lint rules, which is
why it is neither.

### How it was isolated

Four hypotheses were tested and three were killed by measurement, which is the only
reason the fourth was found:

| Hypothesis                                       | Test                                                             | Result                                    |
| ------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------- |
| `viewport.margin: '-80px'` breaking the observer | Removed it, rebuilt, re-measured                                 | No change — not the cause                 |
| The app is stuck in reduced-motion mode          | Temporary probe writing `useReducedMotion()` to a data attribute | Returns `false` correctly — not the cause |
| Headless Chrome resolves animations instantly    | Ran a raw WAAPI animation and a CSS transition in the same page  | Both animate normally — environment fine  |
| Something suppresses `initial` globally          | Read `PageTransition`, the only `AnimatePresence` in the tree    | **Confirmed**                             |

The third one matters most: the first pass left open whether this was a real defect or a
headless artefact. It was a real defect, and the site has never once shown a scroll
reveal to a visitor.

### Verified after the fix — 9 checks

- Hero fades in on mount: opacity `0 → 0.22 → 0.42 → 0.57 → 0.68 …`, min 0.
- Cards are at opacity 0 while their subsection is off-screen, and 1 after entry.
- Stagger fires at 32 / 80 / 144 / 216ms — ~60ms apart, 184ms total against the ~300ms
  cap in §8.
- The two subsections reveal independently: with the professional group in view and the
  personal group below the fold, the personal cards are still at 0.
- Reduced motion still renders final state immediately, hero and cards alike.
- After a full-page scroll sweep, all 9 reveal targets are at opacity 1 — nothing is left
  permanently invisible, which is the failure mode that matters most here.

**This fix is E06/E03 territory, not E10's.** It is recorded in `E06-status.md` as well,
and it retires the `🔍` reduced-motion items that were pending against E06 — those were
passing for the wrong reason, because nothing animated at all.

---

## 3b. Wheel-driven horizontal scrolling (added after the epic, on request)

A vertical wheel gesture over a carousel now travels it sideways and releases to the page
at either end — a documented exception to §4's no-scroll-jacking rule, recorded in
`4-interaction-design.md` §4, §6, §9 and §10 row 12.

**The first implementation did not work, and the first test did not catch it.** The
handler ran and called `preventDefault`, but `scrollLeft += delta` moved the track zero
pixels: `scroll-snap-type: x mandatory` re-snapped it to the card it started on, because
neither a mouse notch (~100px) nor a trackpad delta (~12px) crosses the half-card mark
that decides which snap point wins. The original check dispatched **one** 200px wheel
event, which does cross it — so a synthetic gesture no real input device produces was the
only gesture that worked.

Fixed by stepping one whole card once accumulated intent crosses 40px, landing exactly on
the next snap point, with a 260ms cooldown so one flick advances one card. Verified with
input-device-shaped bursts, 10 checks:

| Check                                         | Evidence                                                     |
| --------------------------------------------- | ------------------------------------------------------------ |
| 12 mouse notches of 100px                     | `scrollLeft 0 → 360` (the full travel at 1280), no snap-back |
| 10 trackpad deltas of 12px at 768             | `0 → 322` of max 575, page held at `pageY 1907`              |
| 25-notch burst overrunning the end            | track `→ 360` of 360, then `pageY 1516 → 3316`               |
| Line-mode wheel (`deltaMode 1`)               | 3 lines → 359px, not 3px                                     |
| Listener is non-passive                       | `defaultPrevented=true` mid-track, `false` at the end        |
| `ArrowDown` with the carousel **not** focused | page scrolls 40px, track unchanged — documented behaviour    |

The lesson is the same shape as §3's: a test that only passes for an input no device
emits is not evidence. Both defects in this epic were found by making the probe more like
a real user, not by reading the code again.

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
