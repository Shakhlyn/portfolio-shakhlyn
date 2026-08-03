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
#contact         Contact                 h2
```

**One `h2` for Projects**, with Professional and Personal as `h3` subsections inside
it. This preserves the architecture's heading plan while giving each project group its
own labelled, independently scrollable carousel.

`#current-role` and `#skills` are sections **without** nav entries — they are part of
the scan path but the nav does not need to be eight items deep.

**There is no `#resume` section.** The resume is reached only through the `/resume`
route, from the nav's Resume button and the hero's primary CTA. An earlier draft put a
resume CTA section between Skills and Contact; it was a third path to a destination that
already had two, and the one furthest down the page — a visitor who has scrolled that
far has passed the nav button five times. `1-prd.md` §3 requires the resume CTA in the
hero and from navigation, and both remain.

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

| Name     | Min width | Primary change                                              |
| -------- | --------- | ----------------------------------------------------------- |
| _(base)_ | 320px     | Single column, hamburger nav, social rail hidden            |
| `sm`     | 640px     | Larger type step, 2-up badge rows. **Social rail appears.** |
| `md`     | 768px     | 2 project cards per view, footer goes horizontal            |
| `lg`     | 1024px    | **Desktop nav replaces hamburger. Hero may go two-column.** |
| `xl`     | 1280px    | 3 project cards per view                                    |
| `2xl`    | 1536px    | Container reaches final width; layout stops growing         |

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
  sheet. Below `sm` this is the only place they appear, since the rail is hidden. Between
  `sm` and `lg` the rail exists but the open sheet covers it, so the row stays rather
  than leaving a gap where the links were.
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

No parallax, no pinned sections, no scroll progress bar, and no element whose _size_
changes with scroll position — content must never reflow mid-scroll, because that is what
destroys CLS.

**Documented exception to the no-scroll-jacking rule: the project carousels (§6).** A
vertical wheel gesture whose pointer is over a carousel travels that carousel sideways
until it runs out, then hands the gesture back to the page. This is the narrowest form the
behaviour can take, and the limits are what make it acceptable rather than the intent:

- **Nothing is pinned and no scroll position is locked.** The page is never prevented from
  moving; it simply is not asked to move while the gesture is being consumed elsewhere.
- **The pointer is the switch.** Move it off the track mid-gesture and scrolling is
  immediately normal again. A visitor who does not want this never has to fight it.
- **Both ends release.** At the last card a downward gesture scrolls on to the next
  section; at the first card an upward one scrolls back. There is no state in which the
  page refuses to move.
- **One card per gesture, not pixel-following.** The track snaps `x mandatory`, and a
  handler that adds raw wheel delta to `scrollLeft` moves nothing at all: a mouse notch is
  ~100px and a trackpad delta ~12px, neither crosses the half-card mark that decides which
  snap point wins, so the browser re-snaps to the card it started on. Wheel intent is
  accumulated instead, and crossing 40px steps one whole card — which lands exactly on the
  next snap point. A 260ms cooldown follows each step, so one trackpad flick advances one
  card rather than the whole set.
- **Keyboard and touch are unaffected.** Touch has no wheel events and keeps its native
  swipe; `ArrowDown`/`ArrowUp` step one card only while the track itself holds focus, and
  release at the ends exactly as the wheel does (§9).

The full pinned-section version of this idea — where the section sticks to the viewport
and all vertical travel is consumed until the carousels are exhausted — remains
prohibited. It traps a visitor who wants to reach About behind eight wheel gestures, and
it breaks deep links and Back, which is the difference between an affordance and a trap.

---

## 5. Section Behaviour

### 5.1 Hero (`#home`) — two supported layouts

Both layouts ship. Which one renders is decided by **one field in
`src/data/profile.ts`**: `layout: 'stacked' | 'split'`.

The switch is an **explicit discriminator, not an inference from `portrait`'s
presence.** Deriving the layout from whether an image exists conflates two independent
decisions — "which layout" and "is the artwork ready" — so the layout could not be
built, reviewed, or reverted without an image in hand, and dropping the image to fix a
photo problem would silently change the page structure. With an explicit field, the
`split` layout is verifiable against an empty slot, and `portrait` becomes what it
actually is: the content that fills a slot the layout already reserved.

This is one `HeroSection` component with two documented layouts, not two components.
Two near-identical components would drift apart the moment the intro copy changed, and
`AGENTS.md` §13 prefers extending over adding. You get the switch you asked for — flip
one field — with nothing to keep in sync.

**Layout A — `stacked`, text only (ships now)**

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

**Layout B — `split` (the seam ships now; the portrait fills it later)**

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

Two-column at `lg`+ (text left, portrait slot right); single column below with **slot
first, then text**.

Content stack, identical in both layouts:

1. Mono eyebrow — availability / location.
2. `h1` at `display` scale — **the name only.**
3. Role framing — one line, directly beneath the `h1`.
4. `body-lg` in `fg-muted` — value proposition, two lines max.
5. Current position line — role + company, `fg`, company emphasised.
6. Button row — `primary` "View Resume" → `/resume`, `secondary` "Contact" → `#contact`.
7. `SocialLinks` row — **rendered below `sm` only.**

Items 2 and 3 are separate elements. `3-style-preference.md` §6.2 describes the block as
communicating "name + positioning", which is what items 2–3 do jointly; it is not a
claim that the positioning sits inside the heading. One `h1`, one name — the keyword
work belongs in `<title>` and `meta[description]`.

Item 7 exists because `1-prd.md` §3 requires direct GitHub, LinkedIn, and email links
in the hero. The floating rail satisfies that at `sm` and up, but the rail is hidden
below `sm`, which would otherwise leave phone visitors without them. Showing both at
`sm`+ would duplicate the same four links a few hundred pixels apart, so they are
mutually exclusive by breakpoint.

**The `split` layout and the portrait are two deliverables, not one.**

_The layout seam_ — the `layout` field, the branch, the two-column grid, and the slot —
ships as soon as the hero does. The slot is aspect-ratio-locked and reserves its exact
final space with no image in it, so the switch is fully verifiable before any photograph
exists.

_The portrait treatment_ — crop, focal point, responsive sources — is blocked on the real
asset and ships separately. Tuning it against a stand-in image bakes that stand-in's
accidental properties (its crop, its subject position, its tonal range) into the CSS,
and the mistuning only becomes visible once the real photo replaces it.

Portrait requirements, when it lands:

- 280px at `lg`, 320px at `xl`, `rounded-lg`, explicit `width`/`height` matching the
  slot's locked ratio, so it contributes zero CLS.
- **Never `loading="lazy"`** — it is above the fold. Use `fetchpriority="high"`.
- Real `alt` text (the person's name), not `alt=""`.
- Capped at 200px on mobile so the text is not pushed below the fold at 320px.
- WebP or AVIF, optimised before commit.

The hero is the LCP element in both layouts. Its text must be in the DOM and readable at
first paint — the mount animation may fade it in, but must never gate its presence on
JavaScript state.

### 5.2 Current Role (`#current-role`)

Static card, no interaction beyond link hovers. Appearance in
`docs/3-style-preference.md` §6.3, which specifies **no eyebrow** on this section.

It reveals as one block on scroll (animation 2). Its stack badges do **not** stagger —
see the closed-list rule in §8.

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
three-paragraph bio behind a click serves nobody. No portrait — the hero holds the only
one on the page (`3-style-preference.md` §6.2, §6.5).

The optional `lookingFor` sentence closes the section as a visually distinct line rather
than a fourth paragraph, and renders only when the field is present
(`3-style-preference.md` §6.5).

### 5.5 Skills (`#skills`)

Static badge groups. Non-interactive — no filtering, no expansion, and **no tab stops**:
a visitor tabbing from Projects reaches Contact without stopping inside this section.

Each capability group is a labelled list rather than a heading plus a row of badges
(`3-style-preference.md` §6.6). A group whose skill list is empty renders nothing at all,
label included.

### 5.6 Resume — route only

There is no resume section on the home page (§1). Both resume actions — view in browser
and download the PDF — live on the `/resume` route and resolve from the single path in
`src/data/resume.ts`. The home page's two entry points to it are the hero's `primary`
CTA and the nav's Resume button.

**The embed carries PDF Open Parameters**, which are the only control we have over the
browser's own viewer without adding a PDF library (`2-architecture.md` §7 rules one out for
a single embed):

```
#navpanes=0&pagemode=none&view=FitH
```

`navpanes=0` hides Chromium's thumbnail sidebar — a strip of page previews that consumed
~200px of the frame and left the document to render in what remained. `pagemode=none` is
pdf.js's equivalent; each viewer ignores the other's key. `view=FitH` fits the page to the
frame's width so text is legible on arrival and the visitor scrolls inside the frame rather
than zooming. **The toolbar is deliberately kept** — it carries zoom, rotate, print and
download, and is worth its ~40px.

The fragment is applied **only to the embed**. The "View in browser" link and the download
keep the bare path: a standalone tab is exactly where someone wants the full viewer.

Support for these parameters varies and cannot be relied on — they are an enhancement over
a frame that already works. Chromium honours them; Firefox honours `pagemode`; Safari
largely ignores them, which changes nothing about whether the document renders.

**The embed is attempted by default.** The page renders the inline viewer unless the
browser reports that it cannot display a PDF, which is the correct default because it is
right for the large majority and because an incorrect negative is more visible than an
incorrect positive — a visitor who would have seen the document instead gets a panel
telling them they cannot.

**A missing file is a separate state from an unsupported browser**, with its own message.
Both produce the same compact panel, and confusing them tells a visitor to blame their
browser for a deploy defect.

Availability is checked with a same-origin `HEAD` on mount, because `<object>` fires no
usable `error` event. **A 200 is not proof the file exists**: the SPA rewrite
(`/* /index.html 200`, `2-architecture.md` §10) answers a missing asset with the HTML shell
at status 200, so the check requires a content type that is actually a PDF. Where the
header is absent the answer is optimistic — hiding a working document is worse than showing
a frame that fails.

While the check is in flight the embed renders, so the common path never shifts. Only a
confirmed absence collapses the frame.

**The fallback replaces the embed, never the section.** The preview is a labelled region
rather than a heading-led subsection (`2-architecture.md` §8), and all three states keep
that region in the same place with the same name — so nothing about the page's shape
depends on the visitor's browser, and the action beneath it never moves. Appearance is
`3-style-preference.md` §6.7.

**The direct link renders in both states.** It is the page's one guarantee, so it is never
conditional on the capability check. If detection is wrong in either direction the visitor
still reaches the file from the same screen — which is what makes the check a progressive
enhancement rather than something correctness depends on.

The known hard case is iOS Safari, which does not display an embedded PDF the way desktop
browsers do. That is the case the fallback exists for, and it is the case that cannot be
verified without a real device (`5-epic-list.md` E12, Open Risks).

### 5.7 Contact (`#contact`)

Two-column at `lg` (form 60% / direct links 40%), stacked below.

Three fields: **Name (optional), Email (required), Message (required)**, and a submit
button labelled "Send message".

Form behaviour — FormSubmit, per `docs/2-architecture.md` §9:

| Moment     | Behaviour                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------- |
| Typing     | No validation. Validating every keystroke punishes people mid-word.                         |
| Blur       | Validate that field only, if touched.                                                       |
| Submit     | Validate all. On failure, focus the first invalid field and announce the count.             |
| Submitting | Button disabled, spinner + "Sending…", fields read-only.                                    |
| Success    | Form replaced by a success message, `role="status"`. Focus moves to it.                     |
| Error      | Form retained **with values intact**, error message plus the raw email address as fallback. |

**The announced count rides in `FormStatus`'s existing error state.** The live region is
already `role="status" aria-live="polite"` and already mounted while idle, so a count
written into it is announced without a fourth `FormState` variant and without touching an
E05 component. The visitor therefore hears both halves of the failure — "3 fields need
attention" from the region, then the specific message on the field focus lands in.

Two consequences worth stating, because both are visible: the mailto fallback `FormStatus`
appends to every error is shown for a validation failure too, which is harmless and
occasionally the more useful path; and the count is recomputed only on submit, so it stands
unchanged while the visitor fixes fields and is replaced the next time they submit.

Values are never cleared on error — retyping a message because a network call failed is
the fastest way to lose a contact. The `_honey` honeypot is visually hidden but stays in
the DOM, because the provider reads it from the submitted body.

**The submission is a `fetch`, not a form navigation.** Every row below the first two
depends on the page still being there when the response arrives: a native POST replaces the
document with the provider's own thank-you page, which cannot show a `submitting` state,
cannot retain values on error, and cannot move focus to a success message. The `<form>`
therefore carries no `action` and no `method` — there is no no-JS submission path to
degrade to, and attributes describing a mechanism that is not in use invite a later reader
to make them load-bearing.

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
- **A vertical wheel gesture over the track steps it one card sideways** per gesture,
  until it reaches an end and releases to the page — the documented §4 exception, with its
  limits and the snap-interaction reasoning listed there.
  Horizontal gestures are never intercepted: the track already scrolls natively on those,
  and taking them over would fight trackpad inertia for nothing.
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
  `surface-hover`, border to `accent/30`. **No `-translate-y-0.5`** — the lift signals a
  single click target, and the card is not one (see below). No hover transforms on touch,
  where they fire on tap and stick.
- **Case study, GitHub, and Live buttons each render only when that slug or URL exists
  in the data** — no dead links, no disabled placeholders
  (`docs/2-architecture.md` §11). A project with none of the three renders no button row.
- Case study is an internal router link to `/projects/:slug`, same tab. GitHub and Live
  are external: new tab, `rel="noreferrer"`, and a visually hidden "(opens in a new tab)".
- **The card is not a link and the title is not a link.** Every destination is an
  explicit, named button. The card must never be wrapped in an anchor — nested
  interactive elements inside an anchor are invalid HTML and break the buttons inside it.
  An earlier draft made the title the sole card-level anchor; three named buttons satisfy
  the same no-nesting constraint while telling the visitor where each one goes.

---

## 7. Floating Social Rail

Matches the reference in `../src/assets/img.png`.

### Position

Fixed to the **left viewport edge**, vertically centred
(`top: 50%; translateY(-50%)`), above page content but below the mobile nav sheet.

Visible at `sm` and up only. Below `sm` it is hidden and its links appear in the mobile
nav sheet and the footer — a fixed rail on a 375px phone screen eats content width and
collides with thumbs, which is why the cut-off exists at all.

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
- Duration 100ms `ease-out`. Only one tile expands at a time; the others never shift,
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

- The rail must not overlap page **content** at any width where it is visible. The
  default gutter is narrower than the rail (24px at 640px, 32px at 1024px against a 48px
  collapsed tile), so the container widens its **left** gutter to 56px from `sm` through
  `lg`. From `xl` the centred container already starts right of 48px and the gutter
  returns to normal. Between 640px and 1279px the content therefore sits ~16px right of
  centre; that asymmetry is the accepted cost of keeping the rail from `sm`. Check the
  rail's right edge against the container's **content box**, not its padding box.
- Marked up as `<nav aria-label="Social links">` so screen readers can skip it, and it
  comes **after** `<main>` in DOM order while rendering visually left. It is
  supplementary and should not sit between the header and page content in the tab order.

---

## 8. Animation Inventory

Every animation on the site, with its trigger and justification. If it is not on this
list, it does not ship (`AGENTS.md` §7).

**What "closed list" means for anything absent.** An element not named in this table is
not an invitation to invent motion for it — it animates **with its parent section
(animation 2) and receives no child orchestration of its own.** That is the default, and
taking it requires no decision. Row 4 covers the skill badges in E11; the Current Role
stack badges (§5.2) are a different badge row that this table does not name, so they
reveal with their section and do not stagger. Two badge rows animating differently for
a reason no reader could name is exactly the drift a closed list exists to prevent.

Adding motion to something absent from this table is an **amendment to this section**,
raised as its own ticket — never a judgement call made inside a feature epic.

| #   | Element               | Trigger                  | Motion                                       | Duration   | Purpose                                     |
| --- | --------------------- | ------------------------ | -------------------------------------------- | ---------- | ------------------------------------------- |
| 1   | Hero content          | Mount                    | opacity 0→1, y 12→0                          | 400ms      | Establishes reading order on arrival        |
| 2   | Section content       | First scroll into view   | opacity 0→1, y 12→0                          | 400ms      | Signals a new content block                 |
| 3   | Project cards         | Parent subsection reveal | Staggered #2, 60ms apart                     | 400ms      | Groups the set, guides eye left→right       |
| 4   | Skill badges          | Parent section reveal    | Staggered #2, 40ms apart                     | 300ms      | Same                                        |
| 5   | Route change          | Navigation               | opacity + y 8, `mode="wait"`                 | 200ms      | Confirms the page changed                   |
| 6   | Mobile nav sheet      | Toggle                   | opacity + y −8                               | 200ms      | Connects the sheet to its trigger           |
| 7   | Social rail tile      | Hover / focus            | width + label opacity (see §7 exception)     | 100ms      | Discloses the label on demand               |
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
| `↑` `↓`  | Carousel focused         | Step one card sideways; at either end, scroll the page instead |
| `Tab`    | Off-screen carousel card | Scrolls into view automatically                                |
| `Enter`  | Card buttons             | Follow link                                                    |

The skip link is the first focusable element on every page: hidden until focused, then
pinned top-left.

---

## 10. Resolved Decisions

These were flagged as conflicts and have been decided. This section records the
decision and what still needs updating elsewhere.

These were flagged as conflicts, decided, and **propagated to the other documents**.
All four documents now describe the same flow.

| #   | Conflict                                                                                                         | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Propagated to                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Hero portrait forbidden by style doc §6.2                                                                        | Both layouts supported, switched by an explicit `layout: 'stacked' \| 'split'` field in `profile.ts` (§5.1). `stacked` ships now; the `split` seam ships with it, its portrait later.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `3-style-preference.md` §6.2 rewritten; `2-architecture.md` §5 notes the field                  |
| 2   | Responsive range                                                                                                 | 320–1920px. No custom breakpoint; container caps at 1280px.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | This doc §2. Style doc §4.2/§12 already said 320–1920 — no change needed                        |
| 3   | Single `projects.ts`                                                                                             | One file, one type, plus a `category` discriminator. One nav link, one section, two subsections.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `2-architecture.md` §5 data files + grouping note                                               |
| 4   | Social rail and carousel absent from component tree                                                              | Both confirmed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `2-architecture.md` §6 tree, feature modules, and hooks; `3-style-preference.md` §6.4 and §6.11 |
| 5   | Heading order                                                                                                    | Follow `2-architecture.md` §8. One Projects `h2`, two `h3` subsections, project titles at `h4`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `2-architecture.md` §8 heading plan updated                                                     |
| 6   | Two `ProjectsSection` instances                                                                                  | One `ProjectCarousel` component, two instances with different data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `2-architecture.md` §6                                                                          |
| 7   | Hero `h1`: name, or name + positioning?                                                                          | **Name only.** §5.1 assigns elements; `3-style-preference.md` §6.2 described the block, not the heading — a category error, not a contradiction. Stack is `h1`(name) → role framing → value proposition.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `3-style-preference.md` §6.2 reworded to defer element assignment here; this doc §5.1 item list |
| 8   | Eyebrow on Current Role                                                                                          | **Omitted.** Eyebrows are wayfinding for repeated, scannable sets. `Section`'s optional eyebrow is an opt-in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `3-style-preference.md` §6.3; this doc §5.2                                                     |
| 9   | Motion for elements absent from the §8 inventory                                                                 | **Default is animation 2 with no child orchestration.** Adding motion to an unlisted element is a §8 amendment ticket, not an in-epic judgement call. Applied first to the Current Role stack badges.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | This doc §8 preamble, §5.2                                                                      |
| 10  | Project card link model                                                                                          | **Three named buttons, no title link.** Case study → `/projects/:slug`, GitHub, Live — each conditional on its data. The card and its title are never anchors, so nothing nests. The card loses the `-translate-y-0.5` hover, which promised a click target it no longer is.                                                                                                                                                                                                                                                                                                                                                                                                                       | This doc §6 card behaviour, §9 · `3-style-preference.md` §6.4 · `5-epic-list.md` E10            |
| 11  | Case study `Links` `h2` with no external links                                                                   | **Omitted entirely.** `2-architecture.md` §8 lists the maximum heading set, not a per-project guarantee. Most projects are client work behind a login; a retained heading would resolve to an apology on the majority of pages, and a heading that introduces nothing costs the reader attention for no return.                                                                                                                                                                                                                                                                                                                                                                                    | `3-style-preference.md` §6.10 · `2-architecture.md` §8 · `5-epic-list.md` E10                   |
| 12  | Vertical scroll over a project carousel                                                                          | **Redirected to horizontal travel while the pointer is over a track that can still move**, releasing to the page at both ends. §4 banned scroll-jacking outright; this is a documented exception with hard limits — nothing pinned, no scroll lock, pointer as the escape hatch. The pinned-section form stays prohibited.                                                                                                                                                                                                                                                                                                                                                                         | This doc §4, §6, §9 · `src/hooks/useCarousel.ts`                                                |
| 13  | `about.ts`'s `lookingFor`, unmentioned by any spec                                                               | **Rendered as a visually distinct closing line** — `fg` against the prose's `fg-muted`, set off by a `border-l-2 border-accent` rule. It is the one sentence in the section a reader can act on; folded into the prose it disappears. Conditional on the field, which is optional.                                                                                                                                                                                                                                                                                                                                                                                                                 | `3-style-preference.md` §6.5 · this doc §5.4 · `5-epic-list.md` E11                             |
| 14  | The optional About portrait                                                                                      | **Withdrawn from the spec**, not deferred. The hero carries the only photograph on the page; a second one 800px below it establishes nothing the first has not. Removing the clause is what stops it being re-opened as an unbuilt option.                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `3-style-preference.md` §6.5 · this doc §5.4 · `5-epic-list.md` E11                             |
| 15  | Skill group label semantics                                                                                      | **A labelled list, not a heading.** `<ul role="list" aria-labelledby>` with a `<p>` label styled as the eyebrow. Six `h3`s would enter the outline a screen reader user pages through to reach Contact and still not carry each group's size. `role="list"` is explicit — Safari drops list semantics at `list-style: none`.                                                                                                                                                                                                                                                                                                                                                                       | `3-style-preference.md` §6.6 · `2-architecture.md` §8 · this doc §5.5 · `5-epic-list.md` E11    |
| 16  | Resume viewer slot and its behaviour where inline PDF embedding is unavailable                                   | **An aspect-ratio-locked slot with a fallback panel in the same frame, and the direct link in both states.** No document sized the viewer or said what happens when the embed fails. The slot locks to the PDF's page ratio (A4, 210/297) so it reserves its height and contributes zero CLS; the panel keeps `h2: View` introducing something real; the direct link stays unconditional so the page's one guarantee never rests on a capability check that cannot be verified on iOS.                                                                                                                                                                                                             | `3-style-preference.md` §6.7 · this doc §5.6 · `5-epic-list.md` E12                             |
| 17  | Row 16 shipped three defects, found on a real viewport rather than by its harness                                | **Corrected: the page is one centred column, the frame is capped at `80vh`, and the failure panel is not aspect-locked.** The slot was `max-w-content` with no `mx-auto`, so it sat flush left in a 1120px shell. The A4 lock made it 1086px tall — taller than a laptop viewport — and a failed load rendered one sentence inside that empty rectangle. The lock reserves space for a document that is arriving; where none is, it is a defect. A missing file also gained its own copy: `<object>`'s fallback fires for both causes, and one message blamed the browser for a deploy defect.                                                                                                     | `3-style-preference.md` §6.7 · this doc §5.6 · `5-epic-list.md` E12                             |
| 18  | The preview still read small: Chromium's thumbnail sidebar, and a 768px frame                                    | **Viewer parameters plus a wider frame, and the `View` heading dropped.** `#navpanes=0&pagemode=none&view=FitH` hides the sidebar that was consuming ~200px of the frame and fits the page to width; the toolbar stays, since it carries zoom, rotate, print and download. The whole page column widens to the container's content box from `lg` up, and every element widens with it — a document is not prose, and width is what removes the need to zoom. Widening the embed alone left the action row indented from the frame it belongs to. The `h2: View` above it went with them: it introduced nothing the document does not announce itself, and the region carries `aria-label` instead. | `3-style-preference.md` §6.7 · `2-architecture.md` §8 · this doc §5.6 · `5-epic-list.md` E12    |
| 19  | The contact form was specified as Netlify Forms, while the host is unsettled between Netlify, Vercel, and Render | **Moved to FormSubmit's AJAX endpoint, `fetch`ed, with the field set fixed at Name (optional), Email (required), Message (required).** Netlify Forms is a build-time HTML scan plus an edge intercept, so off Netlify the POST resolves against the SPA fallback and returns `200` and the HTML shell — indistinguishable from success, so the visitor is thanked for a message that was never sent. A provider endpoint works on any host and is verifiable before deploy. `fetch` rather than a native POST because every state in §5.7 after "Blur" requires the page to still exist when the response lands                                                                                    | `2-architecture.md` §9 · `3-style-preference.md` §6.8 · this doc §5.7 · `5-epic-list.md` E13    |

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
  is `sm`-and-up only, so below `sm` the hero renders a `SocialLinks` row (§5.1 item 6).

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
