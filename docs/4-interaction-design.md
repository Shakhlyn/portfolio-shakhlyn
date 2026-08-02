# Personal Portfolio — Interaction Design

This document specifies **behaviour**: where things sit, what happens when the user
acts, how navigation resolves, how scrolling and animation behave, and what each
state looks like over time.

It is the counterpart to `docs/3-style-preference.md`, which specifies **appearance**
(colour, type, spacing, component looks). If you are asking "what colour is this
button" → that document. "What happens when I click it" → this one.

Document set and precedence:

```
1-prd.md                 What we are building and why
2-architecture.md        Structure: routes, data, components, performance
3-style-preference.md    Appearance: tokens, type, component styling
4-interaction-design.md  Behaviour: layout, navigation, scroll, motion   ← this file
AGENTS.md                Code rules — wins over all of the above
```

---

## 1. Core Model

### Decision: Hybrid — one long home page, two real routes

The site is a **single scrolling home page** for content a recruiter scans in
sequence, plus **two standalone routes** for content people arrive at directly or
want to link to.

| Nav item | Type      | Target         |
| -------- | --------- | -------------- |
| Home     | Anchor    | `#home` (hero) |
| Projects | Anchor    | `#projects`    |
| About    | Anchor    | `#about`       |
| Blog     | **Route** | `/writing`     |
| Contact  | Anchor    | `#contact`     |
| Resume   | **Route** | `/resume`      |

Six items — comfortable at every width, no label truncation needed.

Blog is a route, not a section, per `docs/2-architecture.md` §3 — `/writing` and
`/writing/:slug` stay lazy-loaded so individual posts have their own URLs, their own
metadata, and can be indexed once real content exists.

### Home page section order

Follows the heading plan in `docs/2-architecture.md` §8:

```
#home            Hero                    h1
#current-role    Current Role            h2
#projects        Projects                h2
                   ├─ Professional       h3
                   └─ Personal           h3
#about           About                   h2
#skills          Skills                  h2
#resume          Resume CTA              h2
#contact         Contact                 h2
```

**One `h2` for Projects**, with Professional and Personal as `h3` subsections inside
it. This preserves the architecture's heading plan while giving each project group its
own labelled, independently scrollable carousel.

`#current-role`, `#skills`, and `#resume` are sections **without** nav entries — they
are part of the scan path but the nav does not need to be eight items deep. The nav's
Resume item goes to the `/resume` route; the `#resume` CTA section is reached by scroll.

### Nav order mirrors scroll order

The nav lists Projects before About because that is the DOM order the architecture
specifies. A nav whose order disagrees with the page order makes the scroll-spy
indicator appear to jump backwards as the user scrolls, which reads as a bug. If you
would rather About came first, it must move in **both** places — say the word and I
will amend the architecture doc's heading plan alongside this one.

---

## 2. Responsive Strategy

Mobile-first: every rule is written for 320px, then layered upward. The site must be
correct and free of horizontal overflow from **320px to 1920px**.

### Breakpoints

Tailwind defaults — no custom breakpoints needed.

| Name     | Min width | Primary change                                                                   |
| -------- | --------- | -------------------------------------------------------------------------------- |
| _(base)_ | 320px     | Single column, hamburger nav, social rail hidden                                 |
| `sm`     | 640px     | Larger type step, 2-up badge rows                                                |
| `md`     | 768px     | 2 project cards per view, footer goes horizontal                                 |
| `lg`     | 1024px    | **Desktop nav replaces hamburger. Social rail appears. Hero may go two-column.** |
| `xl`     | 1280px    | 3 project cards per view                                                         |
| `2xl`    | 1536px    | Container reaches final width; layout stops growing                              |

### Container behaviour

| Viewport    | Container max width  |
| ----------- | -------------------- |
| < 1120px    | Fluid, minus gutters |
| 1120–1535px | 1120px               |
| ≥ 1536px    | **1280px, final**    |

Above 1536px the layout stops growing and the page centres in more whitespace. Prose
stays capped at ~68 characters regardless of viewport
(`docs/3-style-preference.md` §3.3) — a wide monitor gets breathing room, not longer
lines.

Only section background bands and the carousel's overflow area extend past the
container. Everything else respects it.

### Rules

- No horizontal page scroll at any width. The only horizontal scrolling is _inside_
  the project carousels, and it is deliberate and contained.
- Touch targets ≥ 44×44px below `lg`.
- Layout must survive 200% browser zoom — this is why breakpoints key off layout needs,
  not assumed device classes.
- Test widths: 320, 375, 768, 1024, 1440, 1920.

---

## 3. Header & Navigation Behaviour

### Position

Fixed to the top, full width, `h-16`, translucent with `backdrop-blur`, bottom hairline
border. It stays visible on scroll — a recruiter deep in Projects must be able to reach
Contact without scrolling back up.

**Not** auto-hiding on scroll-down. Hide-on-scroll saves 64px and costs
discoverability; on a page this short that is not a good trade.

### Desktop (`lg` and up)

```
┌────────────────────────────────────────────────────────────────┐
│  Shakhlyn        Home  Projects  About  Blog  Contact          │
│                                          [ Resume ]      ☾     │
└────────────────────────────────────────────────────────────────┘
```

- Wordmark left — scrolls to `#home`, or navigates to `/` first if on another route.
- Nav items right, in the §1 order.
- **Resume renders as a `secondary` Button**, not a text link. It leaves the page, so
  it should look like a different kind of action.
- Theme toggle last, separated by a gutter.

### Mobile (below `lg`)

Hamburger at right (44×44px). Opens a full-width sheet directly beneath the header —
not a full-screen overlay, not a side drawer.

- Slides down: `opacity 0→1`, `y −8→0`, 200ms `ease-out`. Height is **not** animated.
- Items stack as 48px rows; Resume last, separated by a divider.
- The social links from the desktop rail (§7) appear as a row at the bottom of the
  sheet, since the rail is hidden at this width.
- **Focus is trapped** while open.
- Closes on: item click, `Escape`, outside click, route change, or viewport crossing `lg`.
- On close, focus returns to the hamburger.
- Page scroll is locked while open, restoring the exact prior position on close.
- Trigger carries `aria-expanded` and `aria-controls`.

### Active state (scroll spy)

The nav item matching the section in view goes from `fg-muted` to `fg`, gains a 2px
`accent` underline, and carries `aria-current="true"`.

- One `IntersectionObserver` in a `useActiveSection` hook watching all anchor targets.
- `rootMargin: '-20% 0px -70% 0px'` — a section activates once it crosses the upper
  third of the viewport, which is where people actually read.
- When several sections intersect, the topmost wins.
- Runs **only on the home route**; disconnected on unmount.
- Suppressed for ~700ms after a nav click, so sections passed through during a smooth
  scroll do not flicker the indicator.
- The Projects `h3` subsections do **not** drive scroll spy — only `#projects` does.
  Sub-highlighting a single nav item from two child sections would flicker.
- Blog and Resume use React Router's route-active state, never section state.

### Cross-route anchors

The case that breaks naively-built hybrid sites. On `/writing` or `/resume`, clicking
**About**:

1. Navigate to `/#about`.
2. After the home route mounts, scroll to the target.
3. The scroll must run _after_ paint — a `useHashScroll` hook handles it on mount and
   on hash change, never a bare `setTimeout` guess.

A direct external hit on `https://site/#contact` must behave identically.

---

## 4. Scroll Behaviour

### Anchor scrolling

- `scroll-behavior: smooth` on `html`, disabled under `prefers-reduced-motion`.
- Every anchor target carries `scroll-mt-20` (80px) so the fixed header never covers
  the heading it just scrolled to.
- Nav clicks update the URL hash, so positions are shareable and Back walks through
  visited sections.

### Focus management on anchor navigation

Scrolling moves the _eye_, not the _keyboard_. On anchor navigation the target
section's heading receives programmatic focus (`tabIndex={-1}` +
`.focus({ preventScroll: true })`), so the next Tab continues from inside that section.
Without this, keyboard users are dropped back at the top of the document — the most
common serious failure in one-page sites.

### On route navigation

Focus moves to the new page's `h1`; scroll resets to top
(`docs/2-architecture.md` §8).

### Scroll-linked effects

Only two, both cheap:

1. Header gains its bottom border once `scrollY > 8`. **The blur is unconditional** —
   the header is `bg-bg/80 backdrop-blur-sm` from the first paint (§3,
   `3-style-preference.md` §6.1), and only the border's opacity animates, which is what
   §8 row 10 lists. An earlier draft of this line said "border and blur"; that was the
   outlier against three other statements and is corrected here.
2. Scroll spy (§3).

No parallax, no scroll-jacking, no pinned sections, no scroll progress bar, and no
element whose _size_ changes with scroll position — content must never reflow mid-scroll,
because that is what destroys CLS.

---

## 5. Section Behaviour

### 5.1 Hero (`#home`) — two supported layouts

Both layouts ship. Which one renders is decided by **one field in
`src/data/profile.ts`**: if `portrait` is present, the two-column portrait layout
renders; if it is absent, the text-only layout renders.

This is one `HeroSection` component with two documented layouts, not two components.
Two near-identical components would drift apart the moment the intro copy changed, and
`AGENTS.md` §13 prefers extending over adding. You get the switch you asked for — add
the image to the data file when you have it, remove the field to go back — with nothing
to keep in sync.

**Layout A — text only (ships now)**

```
┌────────────────────────────────────────┐
│ AVAILABLE FOR WORK                     │
│ Shakhlyn                               │
│ Full-stack engineer building …         │
│ Software Engineer @ Company            │
│                                        │
│ [ View Resume ]  [ Contact ]           │
└────────────────────────────────────────┘
```

Single left-aligned column, `max-w-content`, identical at every width.

**Layout B — with portrait (ships when the image exists)**

```
DESKTOP (lg+)                          MOBILE
┌──────────────────────────────┐       ┌─────────────┐
│ AVAILABLE FOR WORK  ┌──────┐ │       │   ┌──────┐  │
│ Shakhlyn            │      │ │       │   │photo │  │
│ Full-stack engineer │photo │ │       │   └──────┘  │
│ Software Engineer @ │      │ │       │ Shakhlyn    │
│                     └──────┘ │       │ Full-stack  │
│ [ Resume ] [ Contact ]       │       │ [ Resume ]  │
└──────────────────────────────┘       └─────────────┘
```

Two-column at `lg`+ (text left, photo right); single column below with **photo first,
then text**.

Content stack, identical in both layouts:

1. Mono eyebrow — availability / location.
2. `h1` at `display` scale — name.
3. `body-lg` in `fg-muted` — intro, two lines max.
4. Current position line — role + company, `fg`, company emphasised.
5. Button row — `primary` "View Resume" → `/resume`, `secondary` "Contact" → `#contact`.
6. `SocialLinks` row — **rendered below `lg` only.**

Item 6 exists because `1-prd.md` §3 requires direct GitHub, LinkedIn, and email links
in the hero. The floating rail satisfies that at `lg` and up, but the rail is hidden
below `lg`, which would otherwise leave mobile visitors without them. Showing both at
`lg`+ would duplicate the same four links a few hundred pixels apart, so they are
mutually exclusive by breakpoint.

Portrait requirements (Layout B only):

- 280px at `lg`, 320px at `xl`, `rounded-lg`, explicit `width`/`height` so it reserves
  space and contributes zero CLS.
- **Never `loading="lazy"`** — it is above the fold. Use `fetchpriority="high"`.
- Real `alt` text (the person's name), not `alt=""`.
- Capped at 200px on mobile so the text is not pushed below the fold at 320px.
- WebP or AVIF, optimised before commit.

The hero is the LCP element in both layouts. Its text must be in the DOM and readable at
first paint — the mount animation may fade it in, but must never gate its presence on
JavaScript state.

### 5.2 Current Role (`#current-role`)

Static card, no interaction beyond link hovers. Appearance in
`docs/3-style-preference.md` §6.3.

### 5.3 Projects (`#projects`)

One section, one `h2`, two `h3` subsections:

```
┌─────────────────────────────────────────────────────────┐
│ WORK                                                    │  eyebrow
│ Projects                                                │  h2
│                                                         │
│   Professional                            [ ← ] [ → ]   │  h3 + arrows
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───┐          │
│   │  card    │ │  card    │ │  card    │ │   │ ← peek   │
│   └──────────┘ └──────────┘ └──────────┘ └───┘          │
│                                                         │
│   Personal                                [ ← ] [ → ]   │  h3 + arrows
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───┐          │
│   │  card    │ │  card    │ │  card    │ │   │          │
│   └──────────┘ └──────────┘ └──────────┘ └───┘          │
└─────────────────────────────────────────────────────────┘
```

- Each subsection owns an **independent** carousel with its own scroll position, its
  own arrows, and its own disabled-state tracking. Scrolling one never moves the other.
- Both render `ProjectCarousel` with different data — one component, two instances.
- Grouping comes from a `category: 'professional' | 'personal'` discriminator on the
  project type, filtered from the single `src/data/projects.ts`. This is **grouping,
  not filtering** — there are no filter controls, consistent with
  `docs/2-architecture.md` §12.
- If one category is empty, that subsection (heading, carousel, arrows) does not render.
  If both are empty, the whole `#projects` section does not render and the nav item is
  omitted.

Full carousel behaviour in §6.

### 5.4 About (`#about`)

Static prose, `max-w-content`. No accordion, no "read more" toggle — hiding a
three-paragraph bio behind a click serves nobody.

### 5.5 Skills (`#skills`)

Static badge groups. Non-interactive.

### 5.6 Resume CTA (`#resume`)

Two actions: download the PDF, or open `/resume`. Both resolve from the single path in
`src/data/resume.ts`.

### 5.7 Contact (`#contact`)

Two-column at `lg` (form 60% / direct links 40%), stacked below.

Form behaviour — Netlify Forms, per `docs/2-architecture.md` §9:

| Moment     | Behaviour                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------- |
| Typing     | No validation. Validating every keystroke punishes people mid-word.                         |
| Blur       | Validate that field only, if touched.                                                       |
| Submit     | Validate all. On failure, focus the first invalid field and announce the count.             |
| Submitting | Button disabled, spinner + "Sending…", fields read-only.                                    |
| Success    | Form replaced by a success message, `role="status"`. Focus moves to it.                     |
| Error      | Form retained **with values intact**, error message plus the raw email address as fallback. |

Values are never cleared on error — retyping a message because a network call failed is
the fastest way to lose a contact. The honeypot field is visually hidden but stays in
the DOM for Netlify's detection.

---

## 6. Project Carousel Behaviour

`ProjectCarousel`, instantiated once per subsection.

### Cards per view

**1.15 mobile, 2.15 at `md`, 3 at `xl`.** The fractional value is deliberate — a
partially visible next card is the clearest possible signal that more exists sideways.
A row of exactly-fitting cards looks like a complete grid and nobody scrolls it.

On mobile the scroller extends to the viewport edge (breaking the container) so cards
slide fully off-screen, with the first card's leading edge still aligned to the
container gutter via `scroll-padding-inline`.

### Scrolling mechanics

- Native CSS overflow scrolling: `overflow-x: auto`, `scroll-snap-type: x mandatory`,
  each card `scroll-snap-align: start`. **No carousel library** — this gives momentum
  scrolling, trackpad support, and accessibility for free.
- Scrollbar visually hidden; scrolling never disabled.
- Arrows scroll by one card width + gap via `scrollBy({ behavior: 'smooth' })`, falling
  back to instant under reduced motion.
- No auto-advance, no looping, no dot indicators. Auto-advancing carousels move content
  out from under people who are still reading.

### Arrow buttons

- Positioned top-right of their **subsection**, aligned with the `h3`.
- Hidden below `md`, where swipe is the natural gesture and arrows only consume space.
  Keyboard access at those widths is preserved through the focusable cards.
- **Disabled at the ends**: left at `scrollLeft <= 0`, right at
  `scrollLeft >= scrollWidth - clientWidth - 1` (the 1px absorbs sub-pixel rounding).
  Disabled = `opacity-50` + `pointer-events-none` + `aria-disabled`.
- Hidden entirely when all cards fit without overflow.
- Position tracked by a scroll listener **throttled via `requestAnimationFrame`**, and
  cleaned up on unmount. It must re-evaluate on resize, or the arrows lie after an
  orientation change.
- `aria-label` names the group: "Previous professional projects" / "Next personal
  projects". Two carousels on one page cannot share one label.

### Keyboard and assistive tech

- Each scroller is `role="region"` with an `aria-label` and `tabindex="0"`, so it is
  reachable and arrow keys scroll it natively.
- Region label includes the count: "Professional projects, 6 items".
- Tabbing to an off-screen card scrolls it into view via native focus behaviour;
  `scroll-padding-inline` keeps it off the edge.

### Card behaviour

- Image: fixed 16:9, explicit dimensions, `loading="lazy"` (below the fold).
- Hover, pointer devices only via `@media (hover: hover)`: background to
  `surface-hover`, border to `accent/30`, `-translate-y-0.5`. No hover transforms on
  touch, where they fire on tap and stick.
- **GitHub and Live buttons render only when that URL exists in the data** — no dead
  links, no disabled placeholders (`docs/2-architecture.md` §11).
- Both open in a new tab with `rel="noreferrer"` and a visually hidden "(opens in a new
  tab)".
- **The card title is the only card-level link** — not a wrapper around the whole card.
  Nested interactive elements inside an anchor are invalid HTML and break the GitHub and
  Live buttons.

---

## 7. Floating Social Rail

Matches the reference in `docs/img.png`.

### Position

Fixed to the **left viewport edge**, vertically centred
(`top: 50%; translateY(-50%)`), above page content but below the mobile nav sheet.

Visible at `lg` and up only. Below `lg` it is hidden and its links appear in the mobile
nav sheet and the footer — a fixed rail on a 375px screen eats content width and
collides with thumbs.

### Structure

A vertical stack of tiles: GitHub, LinkedIn, Email, X. Each tile is a flex row of
`[label][icon]`, 48px tall, rounded on the **right edge only** so it reads as attached
to the screen edge.

```
COLLAPSED           HOVERED / FOCUSED
┌────┐              ┌──────────────┐
│ ⌥  │              │  GitHub   ⌥  │
├────┤              ├────┬─────────┘
│ ✉  │              │ ✉  │
├────┤              ├────┤
│ in │              │ in │
├────┤              ├────┤
│ 𝕏  │              │ 𝕏  │
└────┘              └────┘
 48px                ~140px
```

### Expansion behaviour

- Collapsed: 48px wide, icon only, centred.
- On **hover or keyboard focus**, that tile alone expands rightward to fit its label.
  The label sits left of the icon and fades in as the icon settles at the trailing edge.
- Duration 200ms `ease-out`. Only one tile expands at a time; the others never shift,
  because growth is horizontal.
- **Focus expansion is required, not optional** — a keyboard user must see the same
  label a mouse user sees.
- Each tile always carries an `aria-label`, so the visual label is an enhancement and
  never the sole accessible name.

**Documented exception to the no-`width`-animation rule (§8):** this tile animates
`width`. The rule exists to prevent layout thrash, and the reason does not apply here —
the rail is `position: fixed`, so it is outside document flow and its width cannot
reflow a single element on the page. The alternative (a `scaleX` background with a
counter-scaled child) distorts the rounded corner and the icon, and is more fragile
than the problem it solves. Verify in DevTools that no layout is recalculated outside
the rail; if the profiler disagrees, fall back to `scaleX`.

### Content

- GitHub, LinkedIn, X → external, new tab, `rel="noreferrer"`.
- Email → `mailto:`, same tab.
- Tiles render only for links present in `src/data/profile.ts`. No placeholder tiles.

### Constraints

- The rail must not overlap the container at any width ≥ `lg`. At 1024px, container
  gutter plus rail width is checked explicitly; if they collide, the rail sits outside
  the content column.
- Marked up as `<nav aria-label="Social links">` so screen readers can skip it, and it
  comes **after** `<main>` in DOM order while rendering visually left. It is
  supplementary and should not sit between the header and page content in the tab order.

---

## 8. Animation Inventory

Every animation on the site, with its trigger and justification. If it is not on this
list, it does not ship (`AGENTS.md` §7).

| #   | Element               | Trigger                  | Motion                                       | Duration   | Purpose                                     |
| --- | --------------------- | ------------------------ | -------------------------------------------- | ---------- | ------------------------------------------- |
| 1   | Hero content          | Mount                    | opacity 0→1, y 12→0                          | 400ms      | Establishes reading order on arrival        |
| 2   | Section content       | First scroll into view   | opacity 0→1, y 12→0                          | 400ms      | Signals a new content block                 |
| 3   | Project cards         | Parent subsection reveal | Staggered #2, 60ms apart                     | 400ms      | Groups the set, guides eye left→right       |
| 4   | Skill badges          | Parent section reveal    | Staggered #2, 40ms apart                     | 300ms      | Same                                        |
| 5   | Route change          | Navigation               | opacity + y 8, `mode="wait"`                 | 200ms      | Confirms the page changed                   |
| 6   | Mobile nav sheet      | Toggle                   | opacity + y −8                               | 200ms      | Connects the sheet to its trigger           |
| 7   | Social rail tile      | Hover / focus            | width + label opacity (see §7 exception)     | 200ms      | Discloses the label on demand               |
| 8   | Buttons, links, cards | Hover / focus            | `transition-colors`, card `translateY(-2px)` | 150ms      | Confirms interactivity                      |
| 9   | Carousel scroll       | Arrow click              | Native smooth scroll                         | ~300ms     | Shows the relationship between views        |
| 10  | Header border         | `scrollY > 8`            | opacity                                      | 150ms      | Separates header from content once scrolled |
| 11  | Form submit spinner   | Submitting               | Rotation                                     | 800ms loop | The only state proof during a network call  |

Rules:

- `opacity` and `transform` only. Never `height`, `top`, or `left`. `width` only in the
  single documented case in §7.
- Scroll reveals use `whileInView` with `viewport={{ once: true, margin: '-80px' }}`.
  Re-animating on every pass reads as unpolished.
- Stagger comes from a parent `variants` object with `staggerChildren`, never
  hand-delayed children.
- Total stagger per group capped at ~300ms. A 10-card stagger at 60ms is 600ms of
  waiting — cap the stagger, not the card count.
- The two project subsections reveal independently, each when _it_ enters view. One
  600ms cascade across both groups would delay the second group's content.
- Nothing animates longer than 400ms except the intentional spinner loop.

### Reduced motion

When `useReducedMotion()` returns true:

- Animations 1–7 render in their final state immediately — no transform, no delay.
- Animation 9 becomes an instant jump (`behavior: 'auto'`), as does `scroll-behavior`
  on `html`.
- Animation 8 keeps colour transitions — those convey interactive state and are not
  vestibular triggers.
- Animation 11 becomes a static "Sending…" text label.

**Reduced motion never hides content and never removes functionality.**

---

## 9. Keyboard Map

| Key      | Context                  | Result                                                         |
| -------- | ------------------------ | -------------------------------------------------------------- |
| `Tab`    | Global                   | Skip link → header → nav → main content → social rail → footer |
| `Enter`  | Nav anchor               | Scroll to section, move focus to its heading                   |
| `Escape` | Mobile sheet open        | Close, return focus to hamburger                               |
| `Escape` | Rail tile focused        | Blur, collapse                                                 |
| `←` `→`  | Carousel focused         | Native horizontal scroll within that carousel only             |
| `Tab`    | Off-screen carousel card | Scrolls into view automatically                                |
| `Enter`  | Card title / buttons     | Follow link                                                    |

The skip link is the first focusable element on every page: hidden until focused, then
pinned top-left.

---

## 10. Resolved Decisions

These were flagged as conflicts and have been decided. This section records the
decision and what still needs updating elsewhere.

These were flagged as conflicts, decided, and **propagated to the other documents**.
All four documents now describe the same flow.

| #   | Conflict                                            | Decision                                                                                                       | Propagated to                                                                                   |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Hero portrait forbidden by style doc §6.2           | Both layouts supported, switched by the optional `portrait` field in `profile.ts` (§5.1). Text-only ships now. | `3-style-preference.md` §6.2 rewritten; `2-architecture.md` §5 notes the field                  |
| 2   | Responsive range                                    | 320–1920px. No custom breakpoint; container caps at 1280px.                                                    | This doc §2. Style doc §4.2/§12 already said 320–1920 — no change needed                        |
| 3   | Single `projects.ts`                                | One file, one type, plus a `category` discriminator. One nav link, one section, two subsections.               | `2-architecture.md` §5 data files + grouping note                                               |
| 4   | Social rail and carousel absent from component tree | Both confirmed.                                                                                                | `2-architecture.md` §6 tree, feature modules, and hooks; `3-style-preference.md` §6.4 and §6.11 |
| 5   | Heading order                                       | Follow `2-architecture.md` §8. One Projects `h2`, two `h3` subsections, project titles at `h4`.                | `2-architecture.md` §8 heading plan updated                                                     |
| 6   | Two `ProjectsSection` instances                     | One `ProjectCarousel` component, two instances with different data.                                            | `2-architecture.md` §6                                                                          |

Four further inconsistencies were found and fixed while propagating:

- **`2-architecture.md` §8** listed a `Writing` `h2` on the home page, left over from
  when Blog was going to be a section. Removed — Blog is a route.
- **`3-style-preference.md` §6.1** put the mobile nav breakpoint at `< md`, while this
  document specifies `< lg` (the rail and desktop nav both appear at `lg`). Corrected
  to `< lg`.
- **`3-style-preference.md` §4.2** defined a flat 1120px container, while §2 here
  widens it at `2xl`. Style doc now carries both `container` (1120px) and
  `container-wide` (1280px) tokens.
- **`1-prd.md` §3** requires direct GitHub/LinkedIn/email links in the hero. The rail
  is `lg`-and-up only, so below `lg` the hero renders a `SocialLinks` row (§5.1 item 6).

- **`1-prd.md` §3** specified "Primary CTA to view projects, secondary CTA to download
  resume." Confirmed as resume + contact instead, and the PRD has been updated to
  match — the hero's two CTAs now point at the actions that are otherwise several
  scrolls away, rather than at Projects, which is the next section down and already
  reachable from the nav. `1-prd.md` §3 and its launch-content checklist both updated.

No open divergences remain. All four documents describe the same flow.

---

## 11. Definition of Behavioural Done

- [ ] Every nav item reaches its target from the home page **and** from `/writing` and
      `/resume`.
- [ ] Anchor navigation moves focus, not just scroll position.
- [ ] Scroll spy marks exactly one item active and does not flicker during a nav-click
      scroll.
- [ ] Mobile sheet traps focus, closes on all five triggers, restores focus and scroll.
- [ ] Both carousels scroll independently; arrows disable at both ends and re-evaluate
      on resize.
- [ ] Each carousel has a distinct accessible label.
- [ ] Every card renders only the links present in its data.
- [ ] An empty project category hides its subsection; two empty categories hide the
      section and its nav item.
- [ ] Hero renders correctly in both layouts, switched only by the profile data field.
- [ ] Rail tiles expand on focus as well as hover.
- [ ] Contact form retains values on error and exposes the email fallback.
- [ ] All 11 animations respect `prefers-reduced-motion`.
- [ ] No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] Every scroll listener, observer, and timer has a cleanup function.
