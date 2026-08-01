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

| Nav item | Type | Target |
|---|---|---|
| Home | Anchor | `#home` (hero) |
| About | Anchor | `#about` |
| Professional Projects | Anchor | `#professional-projects` |
| Personal Projects | Anchor | `#personal-projects` |
| Blog | **Route** | `/writing` |
| Contact | Anchor | `#contact` |
| Resume | **Route** | `/resume` |

Blog is a route, not a section, per `docs/2-architecture.md` §3 — `/writing` and
`/writing/:slug` stay lazy-loaded so individual posts have their own URLs, their own
metadata, and can be indexed once real content exists. A section preview would have
cost those URLs.

Home page section order (top to bottom):

```
#home            Hero
#current-role    Current Role
#about           About
#skills          Skills
#professional-projects
#personal-projects
#resume          Resume CTA
#contact         Contact
```

Note that `#current-role` and `#skills` are sections **without** nav entries — they
are part of the scan path but the nav bar is already at seven items and does not need
nine. The Resume CTA section is reachable by scroll; the nav's Resume item goes
straight to the route.

---

## 2. Responsive Strategy

Mobile-first: every rule is written for 320px, then layered upward. The site must be
correct and free of horizontal overflow from **320px to 2160px**.

### Breakpoints

| Name | Min width | Primary change |
|---|---|---|
| *(base)* | 320px | Single column, hamburger nav, social rail hidden |
| `sm` | 640px | Larger type step, 2-up badge rows |
| `md` | 768px | Project cards show 2 per view, footer goes horizontal |
| `lg` | 1024px | **Desktop nav bar replaces hamburger. Social rail appears. Hero goes two-column.** |
| `xl` | 1280px | Full nav labels, 3 project cards per view |
| `2xl` | 1536px | Container widens |
| `3xl` | 1920px | Container reaches final cap; layout stops growing |

`3xl` is a custom breakpoint added to `tailwind.config.ts` for this project.

### Container behaviour up to 2160px

| Viewport | Container max width |
|---|---|
| < 1120px | Fluid, minus gutters |
| 1120–1535px | 1120px |
| 1536–1919px | 1280px |
| ≥ 1920px | **1360px, hard cap** |

Above 1920px the layout stops growing and the page simply centres in more whitespace.
Text is never stretched — prose stays capped at ~68 characters regardless of viewport
(`docs/3-style-preference.md` §3.3). A 2160px monitor gets more breathing room, not
longer lines.

Full-bleed elements at ultra-wide: only section background bands and the project
carousel's overflow area extend past the container. Everything else respects it.

### Rules

- No horizontal scroll at any width. The only horizontal scrolling on the site is
  *inside* the project carousels, and it is deliberate and contained.
- Touch targets ≥ 44×44px below `lg`.
- The layout must survive 200% browser zoom, which is why `lg` breakpoints key off
  layout needs rather than assumed device classes.
- Test widths: 320, 375, 768, 1024, 1440, 1920, 2160.

---

## 3. Header & Navigation Behaviour

### Position

Fixed to the top, full width, `h-16`, translucent background with `backdrop-blur`,
bottom hairline border. It stays visible on scroll — a recruiter deep in the projects
section must be able to reach Contact without scrolling back up.

**Not** auto-hiding on scroll-down. Hide-on-scroll saves 64px and costs discoverability;
on a page this short it is not a trade worth making.

### Desktop (`lg` and up)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Shakhlyn        Home  About  Professional  Personal  Blog  Contact  │
│                                              [ Resume ]      ☾       │
└──────────────────────────────────────────────────────────────────────┘
```

- Wordmark left — clicking it scrolls to `#home` (or navigates to `/` first if on
  another route).
- Nav items right, in the order in §1.
- **Resume renders as a `secondary` Button**, not a plain text link. It is a different
  kind of action (leaves the page) and should look like one.
- Theme toggle last, separated by a gutter.

Label shortening at `lg` (1024–1279px), where seven full labels do not fit:

| `xl` and up | `lg` |
|---|---|
| Professional Projects | Work |
| Personal Projects | Projects |

Labels return to full text at `xl`. The accessible name always stays the full label
via `aria-label`, so screen reader users hear "Professional Projects" at every width.

### Mobile (below `lg`)

Hamburger button at right (44×44px). Opens a full-width sheet directly beneath the
header — not a full-screen overlay, not a side drawer.

Sheet behaviour:

- Slides down: `opacity 0→1`, `y: -8→0`, 200ms `ease-out`. Height is **not**
  animated (§8 forbids animating height).
- Nav items stack as 48px rows; Resume sits last, visually separated by a divider.
- The social links from the desktop rail (§7) appear as a row at the bottom of the
  sheet, since the rail itself is hidden at this width.
- **Focus is trapped** while open.
- Closes on: item click, `Escape`, outside click, route change, or viewport crossing
  `lg`.
- On close, focus returns to the hamburger button.
- Page scroll is locked while open, restoring the exact prior scroll position on close.
- The trigger carries `aria-expanded` and `aria-controls`.

### Active state (scroll spy)

The nav item matching the section currently in view is marked active: text goes from
`fg-muted` to `fg` plus a 2px `accent` underline, and it carries `aria-current="true"`.

Implementation:

- One `IntersectionObserver` in a `useActiveSection` hook watching all anchor targets.
- `rootMargin: '-20% 0px -70% 0px'` — a section becomes active once it crosses the
  upper third of the viewport, which matches where people actually read.
- When multiple sections intersect, the topmost wins.
- The observer runs **only on the home route** and must be disconnected on unmount.
- Scroll spy is suppressed for ~700ms after a nav click, so the intermediate sections
  a smooth scroll passes through do not flicker the active state.
- Blog and Resume never receive the active-section treatment; they use React Router's
  route-active state instead.

### Cross-route anchors

This is the case that breaks naively-built hybrid sites. When the user is on
`/writing` or `/resume` and clicks **About**:

1. Navigate to `/#about`.
2. After the home route mounts, scroll to the target.
3. Because the home route is eagerly loaded this is a single frame, but the scroll
   must still run *after* paint — a `useHashScroll` hook handles it on mount and on
   hash change, never a bare `setTimeout` guess.

A direct hit on `https://site/#contact` from an external link must land on Contact
with the same behaviour.

---

## 4. Scroll Behaviour

### Anchor scrolling

- `scroll-behavior: smooth` on `html`, disabled under `prefers-reduced-motion`.
- Every anchor target carries `scroll-mt-20` (80px) so the fixed header never covers
  the section heading it just scrolled to.
- Nav clicks update the URL hash so the position is shareable and the back button
  walks back through visited sections.

### Focus management on anchor navigation

Scrolling alone moves the *eye*, not the *keyboard*. On anchor navigation the target
section's heading receives programmatic focus (`tabIndex={-1}` + `.focus({
preventScroll: true })`), so the next Tab continues from inside that section. Without
this, keyboard users are dropped back at the top of the document — a common and
serious failure in one-page sites.

### On route navigation

Focus moves to the new page's `h1` and scroll resets to top, per
`docs/2-architecture.md` §8.

### Scroll-linked effects

Only two, both cheap:

1. Header gains its bottom border and blur once `scrollY > 8`.
2. Scroll spy (§3).

No parallax. No scroll-jacking. No pinned sections. No scroll-driven progress bar. No
element whose *size* changes with scroll position — content must never reflow while
the user scrolls, because that is what destroys CLS.

---

## 5. Section Behaviour

### 5.1 Hero (`#home`)

Two-column at `lg` and up: text left, photo right. Single column below, **photo
first, then text**.

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

Content stack (text column):

1. Mono eyebrow — availability / location.
2. `h1` at `display` scale — name.
3. `body-lg` in `fg-muted` — intro, two lines max.
4. Current position line — role + company, `fg` with the company emphasised.
5. Button row — `primary` "View Resume" → `/resume`, `secondary` "Contact" → `#contact`.

Photo behaviour:

- 280px at `lg`, 320px at `xl`, `rounded-lg`, fixed aspect ratio with explicit
  `width`/`height` attributes so it reserves space and contributes zero CLS.
- **Never `loading="lazy"`** — it is above the fold. Mark it `fetchpriority="high"`.
- Real `alt` text (the person's name), not `alt=""`.
- Mobile caps at 200px so the text is not pushed below the fold on a 320px screen.

The hero is the LCP element. Its text must be in the DOM and readable at first paint —
the mount animation may fade it in, but never gates its presence on JavaScript state.

### 5.2 Current Role (`#current-role`)

Static card, no interaction beyond link hovers. Details in
`docs/3-style-preference.md` §6.3.

### 5.3 About (`#about`)

Static prose, `max-w-content`. No accordion, no "read more" toggle — hiding a
three-paragraph bio behind a click serves nobody.

### 5.4 Professional / Personal Projects

Two separate sections, identical behaviour, different data. Full carousel spec in §6.

The split is by a `category: 'professional' | 'personal'` discriminator on the project
type. It is **grouping, not filtering** — there are no filter controls, consistent with
`docs/2-architecture.md` §12.

### 5.5 Skills (`#skills`)

Static badge groups. Non-interactive.

### 5.6 Resume CTA (`#resume`)

Two actions: download the PDF directly, or open `/resume`. Both resolve from the single
path in `src/data/resume.ts`.

### 5.7 Contact (`#contact`)

Two-column at `lg` (form 60% / direct links 40%), stacked below.

Form behaviour — Netlify Forms, per `docs/2-architecture.md` §9:

| Moment | Behaviour |
|---|---|
| Typing | No validation. Validating on every keystroke punishes people mid-word. |
| Blur | Validate that field only, if it has been touched. |
| Submit | Validate all. On failure, focus the first invalid field and announce the count. |
| Submitting | Button disabled, spinner + "Sending…", fields become read-only. |
| Success | Form replaced by a success message, `role="status"`. Focus moves to it. |
| Error | Form retained with values intact, error message **plus the raw email address** as fallback. |

Values are never cleared on error — retyping a message because a network call failed
is the fastest way to lose a contact. The honeypot field is visually hidden but stays
in the DOM for Netlify's detection.

---

## 6. Project Carousel Behaviour

Used identically by both project sections.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ PROFESSIONAL PROJECTS                        [ ← ] [ → ]│
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───┐        │
│  │  image   │  │  image   │  │  image   │  │   │ ← peek │
│  ├──────────┤  ├──────────┤  ├──────────┤  │   │        │
│  │ Title    │  │ Title    │  │ Title    │  │   │        │
│  │ summary  │  │ summary  │  │ summary  │  │   │        │
│  │ [badges] │  │ [badges] │  │ [badges] │  │   │        │
│  │ [GitHub] │  │ [GitHub] │  │ [GitHub] │  │   │        │
│  │ [ Live ] │  │ [ Live ] │  │          │  │   │        │
│  └──────────┘  └──────────┘  └──────────┘  └───┘        │
└─────────────────────────────────────────────────────────┘
```

Cards visible per view: **1.15 mobile, 2.15 at `md`, 3 at `xl`.** The fractional value
is deliberate — a partially visible next card is the clearest possible signal that
more content exists sideways. A row of exactly-fitting cards looks like a complete grid
and nobody scrolls it.

The scroller extends to the viewport edge on mobile (breaking the container) so cards
can slide fully off-screen, with the first card's leading edge still aligned to the
container gutter via scroll padding.

### Scrolling mechanics

- Native CSS overflow scrolling — `overflow-x: auto`, `scroll-snap-type: x mandatory`,
  each card `scroll-snap-align: start`. **No carousel library.** This gives momentum
  scrolling, trackpad support, and accessibility for free.
- Scrollbar visually hidden but scrolling never disabled.
- Arrow buttons scroll by one card width + gap, using `scrollBy({ behavior: 'smooth' })`,
  falling back to instant under reduced motion.
- No auto-advance, no looping, no dot indicators. Auto-advancing carousels move content
  out from under people who are still reading.

### Arrow buttons

- Positioned in the section header, top-right, aligned with the `h2`.
- Hidden below `md`, where swipe is the natural gesture and the arrows only consume
  space. Keyboard access at those widths is preserved through the focusable cards.
- **Disabled at the ends**: left disabled at `scrollLeft <= 0`, right disabled at
  `scrollLeft >= scrollWidth - clientWidth - 1` (the 1px absorbs sub-pixel rounding).
  Disabled state is `opacity-50` + `pointer-events-none` + `aria-disabled`.
- Both arrows are hidden entirely when all cards fit without overflow.
- Position tracked by a scroll listener that is **throttled via
  `requestAnimationFrame`** and cleaned up on unmount. It must also re-evaluate on
  resize, or the arrows lie after an orientation change.
- `aria-label`: "Previous projects" / "Next projects".

### Keyboard and assistive tech

- The scroller is `role="region"` with an `aria-label` ("Professional projects") and
  `tabindex="0"`, so it is reachable and arrow keys scroll it natively.
- Each card is a single link — one tab stop for the card, plus separate stops for the
  GitHub and Live buttons. Tabbing to an off-screen card scrolls it into view
  automatically via native focus behaviour; `scroll-padding-inline` keeps it from
  landing flush against the edge.
- Card count is announced in the region label ("Professional projects, 6 items").

### Card behaviour

- Image: fixed 16:9, explicit dimensions, `loading="lazy"` (these sections are below
  the fold).
- Hover (pointer devices only, via `@media (hover: hover)`): background lifts to
  `surface-hover`, border to `accent/30`, `-translate-y-0.5`. No hover transforms on
  touch, where they fire on tap and stick.
- **GitHub and Live buttons render only when the URL exists in the data** — no dead
  links, no disabled placeholders (`docs/2-architecture.md` §11).
- Both open in a new tab with `rel="noreferrer"` and a visually hidden "(opens in a new
  tab)".
- Clicking these buttons must not also trigger the card's own link — stop propagation,
  or make the card title the only link rather than wrapping the whole card. **Prefer
  the latter**: nested interactive elements inside a link are invalid HTML.

### Empty state

If a category has no projects, the entire section does not render. An empty carousel
with arrows is worse than no section.

---

## 7. Floating Social Rail

Matches the reference in `docs/img.png`.

### Position

Fixed to the **left viewport edge**, vertically centred (`top: 50%; translateY(-50%)`),
above page content but below the mobile nav sheet and any modal.

Visible at `lg` and up only. Below `lg` it is hidden and its links appear inside the
mobile nav sheet and the footer — a fixed rail on a 375px screen eats content width and
collides with thumbs.

### Structure

A vertical stack of tiles, one per link: GitHub, LinkedIn, Email, X. Each tile is a
flex row of `[label][icon]`, 48px tall, rounded on the **right edge only** so it reads
as attached to the screen edge.

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
  The label sits left of the icon and fades in; the icon slides to the trailing edge.
- Implemented by animating the label's `transform`/`opacity` and the tile's `width`
  via a Motion layout-safe approach — **`width` is not animated directly** (§8). The
  label occupies a wrapper that scales/translates rather than reflowing, so no layout
  thrash occurs on the page.
- Duration 200ms `ease-out`. Only one tile expands at a time; the others do not shift,
  since they grow horizontally, not vertically.
- Focus expansion is required, not optional — a keyboard user must see the same label a
  mouse user sees.
- Each tile always carries an `aria-label`, so the visual label is an enhancement and
  never the sole accessible name.

### Content

- GitHub, LinkedIn, X → external, new tab, `rel="noreferrer"`.
- Email → `mailto:`, same tab.
- Tiles render only for links present in `src/data/profile.ts`. No placeholder tiles.

### Constraints

- The rail must not overlap the container at any width ≥ `lg`. At 1024px the container
  gutter plus rail width is checked explicitly; if they would collide, the rail sits
  outside the content column.
- The rail is `<nav aria-label="Social links">`, marked so screen readers can skip it,
  and it comes **after** `<main>` in DOM order while being visually left — it is
  supplementary, and should not sit between the header and the page content in the tab
  order.

---

## 8. Animation Inventory

Every animation on the site, with its trigger and its justification. If it is not on
this list, it does not ship (`AGENTS.md` §7).

| # | Element | Trigger | Motion | Duration | Purpose |
|---|---|---|---|---|---|
| 1 | Hero content | Mount | opacity 0→1, y 12→0 | 400ms | Establishes reading order on arrival |
| 2 | Section content | First scroll into view | opacity 0→1, y 12→0 | 400ms | Signals a new content block |
| 3 | Project cards | Parent section reveal | Staggered #2, 60ms apart | 400ms | Groups the set, guides eye left→right |
| 4 | Skill badges | Parent section reveal | Staggered #2, 40ms apart | 300ms | Same |
| 5 | Route change | Navigation | opacity + y 8, `mode="wait"` | 200ms | Confirms the page actually changed |
| 6 | Mobile nav sheet | Toggle | opacity + y −8 | 200ms | Connects the sheet to its trigger |
| 7 | Social rail tile | Hover / focus | Label reveal + width | 200ms | Discloses the label on demand |
| 8 | Buttons, links, cards | Hover / focus | `transition-colors`, card `translateY(-2px)` | 150ms | Confirms interactivity |
| 9 | Carousel scroll | Arrow click | Native smooth scroll | ~300ms | Shows the relationship between views |
| 10 | Header border | `scrollY > 8` | opacity | 150ms | Separates header from content once scrolled |
| 11 | Form submit spinner | Submitting | Rotation | 800ms loop | The only state proof during a network call |

Rules:

- `opacity` and `transform` only. Never `width`, `height`, `top`, `left`.
- Scroll reveals use `whileInView` with `viewport={{ once: true, margin: '-80px' }}`.
  Re-animating on every pass reads as unpolished.
- Stagger comes from a parent `variants` object with `staggerChildren`, never
  hand-delayed children.
- Total stagger per group capped at ~300ms. A 10-card stagger at 60ms is 600ms of
  waiting — cap the stagger, not the card count.
- Nothing animates for longer than 400ms except the intentional spinner loop.

### Reduced motion

When `useReducedMotion()` returns true:

- Animations 1–7 render in their final state immediately, no transform, no delay.
- Animation 9 becomes an instant jump (`behavior: 'auto'`), as does `scroll-behavior`
  on `html`.
- Animation 8 keeps colour transitions — those convey interactive state and are not
  vestibular triggers.
- Animation 11 is replaced by a static "Sending…" text label.

**Reduced motion never hides content and never removes functionality.**

---

## 9. Keyboard Map

| Key | Context | Result |
|---|---|---|
| `Tab` | Global | Skip link → header → nav → main content → social rail → footer |
| `Enter` | Nav anchor | Scroll to section, move focus to its heading |
| `Escape` | Mobile sheet open | Close, return focus to hamburger |
| `Escape` | Rail tile focused | Blur, collapse |
| `←` `→` | Carousel focused | Native horizontal scroll |
| `Tab` | Carousel card off-screen | Scrolls into view automatically |
| `Enter` | Card title / buttons | Follow link |

The skip link is the first focusable element on every page: hidden until focused, then
pinned top-left.

---

## 10. Conflicts With Existing Documents

Per `AGENTS.md`, these are flagged rather than silently resolved. Each needs a decision
before implementation.

1. **`3-style-preference.md` §6.2 forbids a hero portrait.** This document specifies
   one, per your direction. That line needs amending — I have not edited that file.
2. **`3-style-preference.md` §4.2 and §12 state a 320–1920px range.** Now 320–2160px,
   with the container cap and `3xl` breakpoint in §2 above.
3. **`2-architecture.md` §5 defines a single `projects.ts`.** Splitting professional
   from personal requires a `category` discriminator on the project type in
   `src/types/project.types.ts`. It stays one data file and one type.
4. **`2-architecture.md` §6 component tree has no social rail and no carousel.** Two
   additions: `SocialRail` (in `components/layout/`) and `ProjectCarousel` (in
   `components/sections/`), plus a `useCarousel` hook. `SocialLinks` still exists and is
   reused inside the mobile sheet and footer.
5. **`2-architecture.md` §8 heading order** lists Featured Projects as one `h2`. It is
   now two: "Professional Projects" and "Personal Projects". Still one `h1` per page.
6. **`2-architecture.md` §6 lists one `ProjectsSection`.** It is now instantiated twice
   with different data, not duplicated as two components.

---

## 11. Definition of Behavioural Done

- [ ] Every nav item reaches its target from the home page **and** from `/writing` and
      `/resume`.
- [ ] Anchor navigation moves focus, not just scroll position.
- [ ] Scroll spy marks exactly one item active, and does not flicker during a nav-click
      scroll.
- [ ] Mobile sheet traps focus, closes on all five triggers, restores focus and scroll.
- [ ] Carousel: swipes, snaps, arrow-scrolls, disables arrows at both ends, and
      re-evaluates on resize.
- [ ] Every card renders only the links that exist in data.
- [ ] Rail tiles expand on focus as well as hover.
- [ ] Contact form retains values on error and exposes the email fallback.
- [ ] All 11 animations respect `prefers-reduced-motion`.
- [ ] No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920, 2160.
- [ ] Every scroll listener, observer, and timer has a cleanup function.
