# Personal Portfolio Website Design System

This document is the binding visual specification for the portfolio. It defines
color, typography, spacing, layout, component appearance, motion, and per-section
UI composition.

It sits under `AGENTS.md` (which governs code) and alongside `docs/2-architecture.md`
(which governs structure). Where this document specifies a visual value, that value
is the source of truth. Where it conflicts with `AGENTS.md`, `AGENTS.md` wins and the
conflict must be flagged.

**Rule of thumb for every decision in this document:** the site is read by a hiring
manager for 90 seconds. Design serves legibility, credibility, and speed — never
decoration for its own sake.

---

## 1. Design Direction

### Decision: Technical Minimal, Violet Accent

- Near-neutral zinc surfaces on a white page in light mode; a dark navy ramp in dark
  mode. Both stay near-neutral enough that the single accent hue does the signalling.
- Generous whitespace and a single, narrow content column.
- Exactly one accent hue (violet), used sparingly: primary CTAs, links, focus rings,
  active nav state, and section eyebrow labels.
- Hairline borders instead of heavy shadows. Shadows appear only on genuinely
  elevated surfaces (mobile menu sheet).
- Content-first: type and spacing do the work. No gradients as decoration, no glass
  morphism, no blurred blobs, no 3D, no particle fields.

### Why This Direction

- **Credibility over flourish.** The PRD's tone requirement is "credible, direct,
  and hiring-oriented." A restrained neutral system reads as senior; a heavily
  styled one reads as a template.
- **Performance.** No gradients, no large decorative imagery, and no custom fonts
  keep the site inside the 95+ Lighthouse and ~200KB gzipped budgets from
  `docs/2-architecture.md` §7.
- **Continuity.** Violet is already the accent in the current `src/index.css`
  scaffold, so this direction carries forward an existing decision rather than
  inventing a new one.
- **Dark mode is cheap.** A neutral base with one accent inverts cleanly, which
  matters because both themes must meet WCAG AA (PRD §Accessibility).

### Anti-Goals

These are explicitly rejected and must not be introduced without an update to this
document:

- Multiple competing accent colors.
- Full-bleed hero images, stock photography, or atmospheric background media.
- Animated backgrounds, cursor followers, marquee/ticker strips, typewriter effects.
- Scroll-jacking or any animation that delays content becoming readable.
- Neon-on-black "hacker" styling.
- Skeuomorphic cards with thick shadows and large radii.
- Emoji used as UI iconography.

---

## 2. Colour System

### 2.1 Token Model

Colors are declared as **semantic tokens**, never as raw palette names in
components. A component uses `bg-surface`, never `bg-zinc-50`. This is what makes
one theme definition drive both light and dark.

Tokens are implemented as CSS custom properties in `src/styles/index.css` and mapped
into Tailwind through an `@theme inline` block in that same file (see §9). Dark mode
is class-based via `@custom-variant`, so the `.dark` class on `<html>` swaps the custom
property values and every component follows automatically.

### 2.2 Light Theme

| Token           | Hex       | Role                                             |
| --------------- | --------- | ------------------------------------------------ |
| `bg`            | `#ffffff` | Page background                                  |
| `surface`       | `#fafafa` | Cards, elevated panels, code blocks              |
| `surface-hover` | `#f4f4f5` | Card / row hover state                           |
| `border`        | `#e4e4e7` | Hairline dividers, card outlines (decorative)    |
| `border-strong` | `#8b8b94` | Form control outlines (interactive, needs 3:1)   |
| `fg`            | `#18181b` | Headings, primary body text                      |
| `fg-muted`      | `#52525b` | Secondary body copy, descriptions                |
| `fg-subtle`     | `#71717a` | Metadata, captions, timestamps                   |
| `accent`        | `#7c3aed` | Links, focus ring, primary button fill           |
| `accent-strong` | `#6d28d9` | Accent hover / pressed, accent text on tinted bg |
| `accent-soft`   | `#f5f3ff` | Badge and eyebrow background tint                |
| `on-accent`     | `#ffffff` | Text/icons on an accent fill                     |
| `danger`        | `#b91c1c` | Form validation errors                           |
| `success`       | `#15803d` | Form submission success                          |

### 2.3 Dark Theme

The dark theme is **dark navy** — not neutral zinc, and not pure black.

| Token           | Hex       | Role                                           |
| --------------- | --------- | ---------------------------------------------- |
| `bg`            | `#0a0e1a` | Page background                                |
| `surface`       | `#111726` | Cards, elevated panels, code blocks            |
| `surface-hover` | `#182032` | Card / row hover state                         |
| `border`        | `#252e42` | Hairline dividers, card outlines (decorative)  |
| `border-strong` | `#606c85` | Form control outlines (interactive, needs 3:1) |
| `fg`            | `#e3e8f2` | Headings, primary body text                    |
| `fg-muted`      | `#a4aec4` | Secondary body copy, descriptions              |
| `fg-subtle`     | `#8c96ad` | Metadata, captions, timestamps                 |
| `accent`        | `#a78bfa` | Links, focus ring, primary button fill         |
| `accent-strong` | `#c4b5fd` | Accent hover / pressed                         |
| `accent-soft`   | `#1c1b38` | Badge and eyebrow background tint              |
| `on-accent`     | `#0a0e1a` | Text/icons on an accent fill                   |
| `danger`        | `#f87171` | Form validation errors                         |
| `success`       | `#4ade80` | Form submission success                        |

**Dark theme is not pure black.** `#0a0e1a` avoids the halation that pure `#000` causes
against light text, and gives `surface` room to read as elevated. True black would also
flatten the elevation model in §4.4 — which is expressed as a background shift rather
than a shadow — because there is nothing below black to shift down from.

**The whole neutral ramp is navy-tinted together**, not just `bg`. Tinting the page blue
while leaving zinc-grey cards on top produces a hue clash that reads as an oversight, so
surfaces, borders, and all three text tiers carry the same hue.

**The accent stays violet in both themes.** Violet is a near-neighbour to navy on the
colour wheel, so it still reads as emphasis rather than as a second competing brand
colour (§2.5). Every accent pair was re-verified against the new background in §2.4.

**Light theme is unchanged** — `bg` is and remains `#ffffff`.

### 2.4 Verified Contrast Ratios

All pairs below were computed against the WCAG 2.1 relative-luminance formula. Text
pairs target AA (4.5:1 normal, 3:1 large); interactive outlines and focus rings
target the 3:1 non-text requirement.

| Pair                                      | Light | Dark  | Requirement | Status |
| ----------------------------------------- | ----- | ----- | ----------- | ------ |
| `fg` on `bg`                              | 17.72 | 15.67 | 4.5         | AAA    |
| `fg` on `surface`                         | 16.97 | 14.55 | 4.5         | AAA    |
| `fg-muted` on `bg`                        | 7.73  | 8.65  | 4.5         | AAA    |
| `fg-muted` on `surface`                   | 7.41  | 8.03  | 4.5         | AAA    |
| `fg-subtle` on `bg`                       | 4.83  | 6.49  | 4.5         | AA     |
| `accent` on `bg`                          | 5.70  | 7.08  | 4.5         | AA     |
| `on-accent` on `accent` fill              | 5.70  | 7.08  | 4.5         | AA     |
| `accent-strong` on `accent-soft`          | 6.48  | 9.00  | 4.5         | AA     |
| `danger` on `bg`                          | 6.47  | 6.96  | 4.5         | AA     |
| `success` on `bg`                         | 5.02  | 11.05 | 4.5         | AA     |
| `border-strong` on `bg` (control outline) | 3.38  | 3.65  | 3.0         | AA     |
| focus ring (`accent`) on `bg`             | 5.70  | 7.08  | 3.0         | AA     |

The dark column was **recomputed** when the theme moved from zinc to navy — not carried
over. Every pair still passes, and most improved slightly: `fg-subtle` went 5.79 → 6.49
and `border-strong` went 3.10 → 3.65, the latter being the tightest pair in the system
and the one that had the least headroom before.

`border` (`#e4e4e7` / `#252e42`) is **decorative only** — 1.27 and 1.42 respectively. It
may never be the sole indicator of an interactive control's boundary. Form inputs use
`border-strong`.

### 2.5 Colour Usage Rules

- Accent is a highlighter, not a paint. As a target: no more than ~5% of any viewport
  should be accent-coloured.
- Never encode meaning in colour alone. Error states pair `danger` with an icon and
  text; the active nav item pairs `accent` with an underline.
- No arbitrary Tailwind colour values (`bg-[#1a1a1a]`, `text-[#666]`) in components.
  If a colour is needed, it becomes a token here first.
- `danger` / `success` are reserved for form feedback. They are not decorative.
- No colour-tinted shadows. Shadows are neutral black at low alpha.

---

## 3. Typography

### 3.1 Decision: System Font Stack

```css
--font-sans:
  system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono:
  ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

This satisfies `docs/2-architecture.md` §7 Font Strategy: zero font requests, zero
FOUT, zero bytes, no render-blocking. No webfont may be added without an explicit
update to this document and the architecture doc.

`font-synthesis: none`, `text-rendering: optimizeLegibility`, and
`-webkit-font-smoothing: antialiased` are set once on `:root` (already present in the
scaffold — keep them).

Mono is used only for: inline code, tech-stack tokens inside case studies, and small
uppercase eyebrow labels. It is never used for body copy.

### 3.2 Type Scale

Mobile-first. The second value applies from the `md:` breakpoint up.

| Role                        | Size (mobile → desktop) | Weight | Line height | Tracking                |
| --------------------------- | ----------------------- | ------ | ----------- | ----------------------- |
| `display` (h1, hero)        | 36px → 56px             | 600    | 1.05        | -0.02em                 |
| `h1` (inner pages)          | 30px → 40px             | 600    | 1.1         | -0.02em                 |
| `h2` (section titles)       | 24px → 30px             | 600    | 1.2         | -0.01em                 |
| `h3` (card titles)          | 18px → 20px             | 600    | 1.3         | -0.01em                 |
| `body-lg` (hero sub, intro) | 17px → 19px             | 400    | 1.6         | 0                       |
| `body` (default)            | 16px → 17px             | 400    | 1.65        | 0                       |
| `body-sm` (card copy, meta) | 14px → 15px             | 400    | 1.6         | 0                       |
| `eyebrow` (section label)   | 12px                    | 500    | 1.2         | 0.08em, uppercase, mono |
| `code`                      | 14px → 15px             | 400    | 1.5         | 0                       |

**Weights in use: 400, 500, 600 only.** No 700+ — system-stack bold at large sizes
reads heavy and undermines the restrained tone. No italics except in blockquotes.

### 3.3 Typographic Rules

- Exactly one `h1` per page (PRD §Accessibility). Heading levels never skip.
- Body measure is capped at ~68 characters (`max-w-prose`). Long-form writing posts
  cap at ~72.
- Headings use `fg`; body copy uses `fg-muted`; metadata uses `fg-subtle`. This
  three-tier hierarchy replaces the need for extra font sizes.
- Never centre a paragraph longer than two lines. Hero copy is left-aligned.
- No text over images. No all-caps outside the `eyebrow` role.
- Links inside prose: `accent` colour, `underline underline-offset-4
decoration-1 decoration-accent/40`, becoming `decoration-accent` on hover. Links
  are never colour-only.

---

## 4. Spacing, Layout, and Shape

### 4.1 Spacing Scale

Use Tailwind's default 4px-based scale, restricted to this subset so rhythm stays
consistent: `1 (4px), 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px), 12 (48px),
16 (64px), 20 (80px), 24 (96px), 32 (128px)`.

Values outside this subset require a reason.

### 4.2 Layout Grid

| Token                      | Value  | Use                                       |
| -------------------------- | ------ | ----------------------------------------- |
| `container` max width      | 1120px | Page shell up to `2xl`                    |
| `container-wide` max width | 1280px | Page shell from `2xl` (1536px) up — final |
| `content` max width        | 768px  | Prose, about copy, writing posts          |
| Gutter (mobile)            | 20px   | `px-5`                                    |
| Gutter (`sm:`)             | 24px   | `sm:px-6`                                 |
| Gutter (`lg:`)             | 32px   | `lg:px-8`                                 |

`Container` is a UI component (`components/ui/Container.tsx`) that owns
`mx-auto w-full max-w-container 2xl:max-w-container-wide px-5 sm:px-6 lg:px-8`. No
section reimplements this.

The shell stops growing at 1280px. Above that the page centres in more whitespace
rather than stretching — prose stays at its ~68-character measure regardless of
viewport (§3.3).

Section vertical rhythm, owned by `components/ui/Section.tsx`:

- Mobile: `py-16` (64px)
- `md:`: `py-20` (80px)
- `lg:`: `py-24` (96px)
- Hero is the exception: `pt-24 pb-16` mobile, `pt-32 pb-24` desktop.

Breakpoints are Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. The
design must hold from **320px to 1920px with no horizontal scroll** (`AGENTS.md` §14).

### 4.3 Radii

| Token          | Value | Applied to                         |
| -------------- | ----- | ---------------------------------- |
| `rounded-sm`   | 4px   | Badges, code chips                 |
| `rounded-md`   | 6px   | Buttons, inputs                    |
| `rounded-lg`   | 10px  | Cards, image frames                |
| `rounded-full` | —     | Avatar, icon buttons, theme toggle |

No radius above 10px on rectangular surfaces. Large radii read as consumer-app, not
engineering portfolio.

### 4.4 Elevation

Elevation is expressed as **border + background shift**, not shadow.

| Level       | Treatment                               |
| ----------- | --------------------------------------- |
| 0 — page    | `bg`                                    |
| 1 — card    | `bg-surface` + `border border-border`   |
| 1 hover     | `bg-surface-hover` + `border-accent/30` |
| 2 — overlay | `bg-surface` + `border` + `shadow-lg`   |

Only two shadows exist, both neutral:

```
shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.05)
```

In dark mode, shadow alphas double (`0.4` / `0.25`) — the existing scaffold values
are correct and should be kept.

### 4.5 Focus Ring (single definition, used everywhere)

```
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-accent
focus-visible:ring-offset-2
focus-visible:ring-offset-bg
```

`focus-visible:` only — never `focus:` (`AGENTS.md` §10). Every interactive element
without exception: buttons, links, nav items, inputs, textarea, theme toggle, cards
that are themselves links, and the skip link.

---

## 5. Component Appearance Specifications

These map one-to-one onto the UI components listed in `docs/2-architecture.md` §6.
Each is prop-driven and content-agnostic — no hardcoded copy, no route knowledge.

### 5.1 Button

Three variants, three sizes. Implemented with `cn()` (clsx + tailwind-merge), never
string concatenation.

| Variant     | Idle                                          | Hover                                   | Use                        |
| ----------- | --------------------------------------------- | --------------------------------------- | -------------------------- |
| `primary`   | `bg-accent text-on-accent`                    | `bg-accent-strong`                      | One per view: the main CTA |
| `secondary` | `bg-transparent text-fg border border-border` | `bg-surface-hover border-border-strong` | Companion actions          |
| `ghost`     | `bg-transparent text-fg-muted`                | `text-fg bg-surface-hover`              | Tertiary / icon-adjacent   |

| Size | Height | Padding | Text            |
| ---- | ------ | ------- | --------------- |
| `sm` | 32px   | `px-3`  | `body-sm` / 500 |
| `md` | 40px   | `px-4`  | `body-sm` / 500 |
| `lg` | 48px   | `px-6`  | `body` / 500    |

All buttons: `rounded-md`, `inline-flex items-center gap-2`, the shared focus ring,
`transition-colors duration-150`, and `disabled:opacity-50
disabled:pointer-events-none`. Minimum touch target 44×44px on mobile — `sm` is
desktop-only.

A button rendering as a link uses `<a>`/`<Link>` with button styling, never a
`<button>` with an `onClick` navigation.

### 5.2 Card

`bg-surface border border-border rounded-lg p-5 md:p-6`, elevation level 1.

Hover (only when the whole card is interactive): background to `surface-hover`,
border to `accent/30`, and `-translate-y-0.5`. No scale transforms, no shadow bloom.

An interactive card is a single anchor wrapping the content (one tab stop), with the
title carrying the accessible name. Nested interactive elements inside a linked card
are not allowed.

### 5.3 Badge

Tech tags and skill chips. `inline-flex items-center rounded-sm px-2 py-0.5`,
`body-sm` at 500 weight, `bg-accent-soft text-accent-strong` in light and dark. A
neutral variant (`bg-surface text-fg-muted border border-border`) exists for
non-emphasised metadata. Badges are never interactive in v1 — no filtering
(architecture §12).

### 5.4 Section

Renders `<section>` with the `id` used for in-page nav anchors, the vertical rhythm
from §4.2, an optional mono `eyebrow` label in `accent`, an `h2` title, and an
optional `fg-muted` description. `scroll-mt-20` so anchored jumps clear the sticky
header.

### 5.5 IconLink / SocialLinks

40×40px `rounded-full` hit area, 20px icon, `text-fg-muted` → `text-fg` on hover,
`bg-surface-hover` on hover. Every icon link carries an `aria-label` (`"GitHub"`,
`"LinkedIn"`, `"Email"`, `"X"`). Icons are inline SVG, `currentColor`, no icon-font
dependency. External links get `target="_blank" rel="noreferrer"` and a visually
hidden "(opens in a new tab)".

### 5.6 TextInput / TextArea

- Visible `<label>` above the field, `body-sm` / 500, `fg`. Placeholders are never a
  label substitute.
- Field: `h-11` (textarea `min-h-32`), `rounded-md`, `bg-bg`,
  `border border-border-strong`, `px-3`, `body` text in `fg`, placeholder in
  `fg-subtle`.
- Focus: `border-accent` plus the shared focus ring.
- Error: `border-danger`, `aria-invalid="true"`, `aria-describedby` pointing at the
  message. Message is `body-sm` in `danger` with a 16px alert icon, directly beneath
  the field.
- Required fields are marked in the label text (`Email *`), not by colour.

### 5.7 FormStatus

A `role="status" aria-live="polite"` region above the submit button.

| State      | Appearance                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------ |
| idle       | Renders nothing                                                                                  |
| submitting | Spinner + "Sending…", `fg-muted` (button also disabled)                                          |
| success    | Check icon + confirmation, `success` on `surface`, `rounded-md p-3`                              |
| error      | Alert icon + failure message **and the direct email address as fallback**, `danger` on `surface` |

The error state must always expose the mailto fallback — architecture §9 requires no
silent failure path.

---

## 6. Page & Section UI Composition

Sections appear in the order fixed by `docs/2-architecture.md` §8.

### 6.1 Header

Fixed, `h-16`, `bg-bg/80 backdrop-blur-sm`, bottom `border-border` (which fades in
once scrolled). Contents: wordmark/name at left (`h3` scale, 600, `fg`); nav at right
(`body-sm`, `fg-muted`, active item in `fg` with a 2px `accent` underline); Resume as
a `secondary` Button; theme toggle last.

Six nav items — Home, Projects, About, Blog, Contact, Resume — which fit at every
width without truncation.

Mobile (`< lg`): nav collapses to a hamburger. The panel is a full-width sheet
beneath the header — `bg-surface`, `border-b`, `shadow-lg` — with 48px-tall rows,
Resume last behind a divider, and a `SocialLinks` row at the bottom. It traps focus
while open, closes on `Escape` and on route change, and returns focus to the trigger
(architecture §8 Focus Management).

A skip link (`Skip to content`) is the first focusable element: visually hidden until
focused, then pinned top-left as an accent-bordered pill.

### 6.2 Hero

Left-aligned, `max-w-content`. Stack:

1. Mono eyebrow — availability/location line.
2. `h1` at `display` scale: **the name, and nothing else.**
3. Role framing — `body-lg`, `fg`, directly beneath the `h1`.
4. `body-lg` in `fg-muted`, two lines maximum — the value proposition.
5. Current position line — role + company, `fg`, company emphasised.
6. Button row: `primary` "View Resume" (→ `/resume`) + `secondary` "Contact"
   (→ `#contact`).
7. `SocialLinks` row — below `sm` only, where the floating rail is hidden.

**This section describes what the hero block communicates; it does not assign
elements.** The block reads as "name + full-stack / AI engineering positioning" because
items 2 and 3 sit adjacent, not because the positioning is inside the `h1`. Element
assignment is `docs/4-interaction-design.md` §5.1's to make, and it assigns the `h1` to
the name alone. An earlier draft of this line read "`h1`: name + positioning", which was
a description of the block mistaken for a spec for the element; the two are not in
conflict and only one of them is normative here.

The positioning keywords that people try to cram into an `h1` for SEO belong in
`<title>` and `meta[description]` (§8 of `docs/2-architecture.md`). One `h1`, one name.

**Two layouts, one component.** Which renders is decided by an explicit
`layout: 'stacked' | 'split'` field in `src/data/profile.ts` — see
`docs/4-interaction-design.md` §5.1 for the switching behaviour.

- **`stacked`** (ships now): single column at every width.
- **`split`**: two-column at `lg`+ (text left, portrait slot right); single column below
  with the slot first. The slot is 280px at `lg`, 320px at `xl`, `rounded-lg`, capped at
  200px on mobile, and **aspect-ratio-locked** so it reserves its space whether or not
  an image has landed in it yet.

The portrait is above the fold, so it is never `loading="lazy"` — it carries
`fetchpriority="high"`, explicit `width`/`height`, and real `alt` text (the person's
name). No illustration, no background media, no text over the photo. The hero's job is
to make the positioning legible in under three seconds.

The **layout seam** (the field, the branch, the two-column grid, the locked slot) and
the **portrait treatment** (crop, focal point, responsive sources) are separately
shippable. The seam is verifiable against an empty slot; the treatment is not
verifiable at all until a real photograph exists, and tuning it against a stand-in
image encodes accidental properties of that stand-in into the CSS.

Social links and the floating rail (§6.11) are mutually exclusive by breakpoint: the
rail covers `sm` and up, the hero's `SocialLinks` row covers everything below. They are
never both visible, which would duplicate the same four links on one screen.

### 6.3 Current Role

Immediately after the hero, per architecture §8. A single level-1 card: role title
and company as `h3`, date range in `fg-subtle` mono, two-to-four bullet lines of
scope in `fg-muted`, and a `Badge` row of the stack in active use.

**No eyebrow.** `Section`'s eyebrow is optional, and an optional prop is an opt-in, not
a default. Eyebrows are wayfinding for scannable, repeated sets — Projects has one
because it is a set you scan. Current Role is a single narrative block sitting directly
under the hero, where an eyebrow is decoration.

### 6.4 Projects

One `h2` ("Projects"), two `h3` subsections — Professional, then Personal — each with
its own horizontally scrolling carousel. Full scroll, arrow, and keyboard behaviour is
in `docs/4-interaction-design.md` §6; this section covers appearance only.

Subsection header: `h3` at left, arrow buttons at right on the same baseline. Arrows
are 36px `rounded-full` `ghost` buttons with a 16px chevron, `border border-border`,
`opacity-50` when disabled. Subsections are separated by `mt-12`.

Cards sit in a `gap-6` horizontal track. Card width is set so **1.15 / 2.15 / 3** cards
are visible at base / `md` / `xl`. All cards in a track are equal height.

Card anatomy, top to bottom: 16:9 image frame (`rounded-lg overflow-hidden`,
`bg-surface-hover` placeholder, explicit `width`/`height` to prevent CLS,
`loading="lazy"`) → `h4` title as **plain text** → two-line clamped `body-sm` summary in
`fg-muted` → `Badge` row (max 5, remainder as `+N`) → button row of up to three
`secondary` `sm` buttons — "Case study" (internal, → `/projects/:slug`), "GitHub", and
"Live" — each rendering **only** when its URL or slug exists in the data
(architecture §11 broken-link prevention).

**Every card destination is a button; the title is not a link.** An earlier draft made
the `h4` title the sole card-level anchor, to keep interactive elements from nesting inside an
anchor. Three explicit buttons satisfy that constraint better: they are siblings, never
children of a link, and they name their destinations instead of hiding "case study",
"repository", and "live product" behind one title whose target the visitor cannot
predict. A card whose project has none of the three renders no buttons — that is a card
with nothing to link to, not a card with a broken link.

Because the card is no longer a single interactive surface, it does **not** take
`Card`'s `interactive` treatment. It keeps the background and border hover, which group
the card under the pointer, and drops the `-translate-y-0.5` lift, which promises a click
target the card as a whole no longer is.

Headings inside a card are `h4`, since the subsection heading is `h3`. Level order is
never skipped for visual reasons (§3.3).

If a project has no image, the frame is omitted entirely — no grey placeholder box
ships to production.

### 6.5 About

`max-w-content` prose, two or three paragraphs in `body`, `fg-muted`, headings in
`fg`.

**No portrait.** An optional 96–128px portrait floated right was specified here and is
withdrawn: the hero already carries the only photograph on the page (§6.2), and a second
one 800px further down adds nothing the first has not already established.

**The closing line.** `about.ts` carries an optional `lookingFor` — the one sentence
naming the roles being targeted. It renders after the last paragraph as a visually
distinct line, not a fourth paragraph: `fg` rather than the prose's `fg-muted`, set off
by a `border-l-2 border-accent` rule with `pl-4`, `mt-6` above it, `body`/`body-md` type.
It is the only sentence in the section a reader can act on, and prose colour would bury
it. The field is optional, so **the line and its rule render only when it is present** —
an accent rule left standing beside nothing is worse than no rule.

### 6.6 Skills

Grouped by capability, one group per row: mono `eyebrow` group label, then a
`flex-wrap gap-2` row of `Badge`s. No proficiency bars, no percentages, no star
ratings — they are unverifiable and read as filler.

**The group label is a label, not a heading.** Each group renders as
`<ul role="list" aria-labelledby="…">` whose label is a `<p>` carrying the referenced id.
It is styled exactly like `Section`'s eyebrow (§4.2) but is not a heading element:
`2-architecture.md` §8 fixes the home page outline with no `h3` level under `h2: Skills`,
and six more headings would sit in the outline a screen reader user pages through to
reach Contact while still not saying how large each group is. The labelled list announces
both the group name and its length — "Frontend, list, 9 items" — which is exactly the
fact a scanner wants.

`role="list"` is written explicitly and is **not** redundant. The Tailwind reset removes
`list-style`, and Safari with VoiceOver drops list semantics from any `ul` whose
`list-style` is `none` — without the attribute the group announces neither its name nor
its count, which is the entire benefit of the pattern.

### 6.7 Resume

**No home-page resume section** (`docs/4-interaction-design.md` §1, §5.6). The resume is
reached through the `/resume` route only, from the hero's `primary` CTA and the nav's
Resume button.

On the `/resume` page itself: a `primary` "Download PDF" carrying the file type and size
in the label or adjacent `fg-subtle` text, and the in-browser viewer. Both paths point at
the single stable asset path from `src/data/resume.ts`.

**Everything is centred on one axis.** The `h1`, the `h2`, the preview, and both buttons
share a vertical centreline, so the route reads as a document rather than as blocks pinned
to the left of a 1120px shell. Copy stays left-aligned within its measure — §3.3 never
centres a paragraph longer than two lines. Between `sm` and `xl` the page inherits
`Container`'s widened left gutter, which clears the social rail
(`4-interaction-design.md` §7), so the centreline sits ~16px right of true viewport centre
in that range; that asymmetry is accepted site-wide and is not corrected here.

**The column is `max-w-content` below `lg` and the full container content box above it**,
and _everything_ on the route widens with it — heading, preview, panel, both actions. From
`lg` that is roughly 936px at 1024, 1056px at 1440, 1216px at 1920. A resume is a document,
not prose: the wider it renders, the less the visitor has to zoom, which is the whole reason
the preview exists. §3.3's 68-character measure protects paragraphs, and this route has
none — an `h1`, an `h2`, one metadata line and two buttons.

**One width, shared.** An earlier version widened only the embed and left everything else at
768px, which put the "View in browser" button 144px inside the left edge of the very frame
it belongs to. Elements that read as one block must be sized by one rule; the column uses
`max-w-none` at `lg` rather than a larger fixed width so it can never overflow the shell,
whatever the shell later becomes.

**The viewer slot.** `rounded-lg`, `border border-border`, `bg-surface` — elevation level 1
(§4.4), the same treatment as a card. It is **aspect-ratio-locked to the PDF's own page
ratio** so it reserves its exact height before the document paints, contributing zero CLS.
This is the hero portrait slot's technique (§6.2) applied to a second asset that arrives
after first paint, and it is the reason the ratio is a value in the markup rather than a
height guess: the committed file is A4, so the lock is 210/297.

**No heading above it.** The preview is a labelled region — `<section aria-label="Resume
preview">` — not a subsection. A heading reading "View" above an embedded document
introduces nothing the document does not announce itself, and it bought a second `h2` in an
outline two items long (`2-architecture.md` §8).

**It is also capped at `80vh`.** Unbounded, the A4 lock makes the frame 1086px tall at the
column's full width — taller than a laptop viewport, so the visitor scrolls the page to
read a document that scrolls itself. Capped, the PDF's own viewer scrolls inside a frame
that always fits the screen. Viewport units resolve at first paint, so the ceiling costs no
CLS. Neither the ratio nor the fraction is expressible as a token, so both are arbitrary
values carrying comments (§9).

**The two failure states share a panel and do not share their copy.** Where no document
will render — the browser has no inline PDF viewer, or the file is unreachable — the frame
is replaced by a compact panel: the same border and surface, height driven by its one
`fg-muted` `body-sm` sentence, and **deliberately not aspect-locked**. The lock exists to
reserve space for a document that is arriving; holding 1086px of empty rectangle around one
sentence is a defect, not a reservation.

The sentence differs by cause. A browser without a PDF viewer is a capability difference. A
missing file is a deploy defect, and telling that visitor their browser is at fault sends
them to check a setting that was never the problem. Neither is styled as an error —
`danger` is reserved for form feedback (§2.5).

**The action sits beneath the slot and is unconditional.** A `secondary` Button carrying
`RESUME.viewLabel`, opening the file in a new tab, rendered identically in both states.
Putting a second action inside the panel would give the fallback state two controls with
the same name pointing at the same file — three, counting Download — so the panel
explains and the button acts.

It is unconditional because it is the one guarantee the page makes: the file is always one
click away. A guarantee must not rest on a capability check that can be wrong, and this
one cannot be verified on the browser it exists for.

It is `secondary`, not `primary`, because Download is this view's single `primary`
(§5.1). Saving the file is the main action; opening it full-size is the companion.

### 6.8 Contact

Two-column at `lg:` (form 60% / direct links 40%), stacked below.

- Left: `ContactForm` — Name, Email, Message, a `_honey` honeypot, `FormStatus`, then a
  full-width-on-mobile `primary` submit labelled **"Send message"**.
- Right: `SocialLinks` plus the email address rendered as real, selectable text — a
  recruiter must be able to copy it without JavaScript.

**Required-ness is part of the spec, because the label carries it.** Name is **optional**;
Email and Message are **required** and marked with `*` in the label text per §5.6, never by
colour. A field's asterisk and its validator must not be able to disagree, which they can
the moment either is decided in a component.

**The honeypot is hidden from everyone, not only from sighted visitors.** It is positioned
off-screen with CSS — never `display:none`, which some clients drop from the submitted body
— and carries `tabindex="-1"`, `aria-hidden="true"`, and `autocomplete="off"`.

The clause this replaced required the field to "remain in the accessibility tree as hidden
but present per Netlify's detection". That was self-contradictory, its justification is
void now that the provider reads `_honey` from the request body and never inspects the
page, and read literally it built a trap that only a screen reader user can fall into: they
hear a labelled field, fill it in good faith, and their message is discarded in silence —
the exact failure `2-architecture.md` §11 forbids. A honeypot works by being invisible to
humans; a human using a screen reader is a human.

### 6.9 Writing

Index: list of `WritingCard` rows (title `h3`, date `fg-subtle` mono, one-line
summary `fg-muted`), separated by `border-border` dividers rather than boxed cards.
Empty state (`WritingEmptyState`): centred, `fg-muted`, one honest sentence plus a
link back to Projects. No fake "coming soon" posts.

Post page: `max-w-content` prose, `h1`, date line, then article body.

### 6.10 Project Case Study

`h1` project name, `fg-muted` one-line summary, `Badge` stack row, hero image, then
`h2` sections in the fixed order Problem → Approach → Stack → Outcome → Links, each
`max-w-content`.

**The Links `h2` is omitted entirely when the project has neither a repository nor a
live URL.** Most of the work here is client software behind a customer login, so a
retained heading would resolve to an apology on the majority of project pages. A heading
that introduces nothing is worse than an outline that varies: the visitor pays attention
to it and gets nothing back. Architecture §8's heading plan lists the maximum set of
project-page headings, not a guarantee that all five appear on every project.

### 6.11 Social Rail

Fixed to the left viewport edge, vertically centred, `sm` and up only. A vertical
stack of 48px-tall tiles — GitHub, LinkedIn, Email, X — each a flex row of
`[label][icon]`, rounded on the **right edge only** (`rounded-r-md`) so it reads as
attached to the screen edge.

- Collapsed: 48px wide, 20px icon centred, `bg-surface`, `border border-border`
  (no left border), `text-fg-muted`.
- Expanded on hover **or focus**: grows rightward to fit its `body-sm` label,
  `bg-accent`, `text-on-accent`. One tile at a time; the stack never shifts vertically.
- `shadow-sm` at rest, `shadow-lg` when expanded.
- Standard focus ring (§4.5), offset so it is not clipped by the viewport edge.

Behaviour, timing, and the documented `width`-animation exception are in
`docs/4-interaction-design.md` §7.

### 6.12 Footer

`border-t border-border`, `py-12`. Name + current year at left in `fg-subtle`, social
icons at right. No sitemap sprawl, no newsletter, no "built with ❤️".

### 6.13 404

Centred, `py-32`. Large `fg-subtle` "404", `h1` "Page Not Found", one `fg-muted`
sentence, then a row of links to Home, Projects, Resume, Contact. Header, footer, and
theme are preserved.

### 6.14 Error Boundary Fallback

Same shape as the 404, with a "Reload page" `primary` button. Never a blank screen
and never a raw stack trace in production.

---

## 7. Dark Mode

- Class-based dark mode on `<html>` (`@custom-variant dark`), driven by `useTheme`
  (architecture §4).
- Resolution order: stored `localStorage` preference → `prefers-color-scheme` →
  light.
- The theme class must be applied by a tiny blocking inline script in `index.html`
  **before** first paint. Without it the site flashes light on a dark-mode reload,
  which is the single most visible polish failure on a portfolio.
- Both themes are first-class. Every component is checked in both, and both meet the
  AA ratios in §2.4.
- The toggle is a `rounded-full` icon button (sun/moon), 40×40px, with
  `aria-label` reflecting the action (`"Switch to dark theme"`) — not the current
  state. It carries the standard focus ring and is reachable by keyboard.
- Images with light backgrounds need a subtle `border-border` frame in dark mode so
  they do not float as bright rectangles.
- `color-scheme: light dark` stays on `:root` so native form controls and scrollbars
  follow the theme.

---

## 8. Motion Design

Governed by `AGENTS.md` §7 and architecture §7. Motion is imported from
`motion/react`.

### Allowed Properties

`opacity` and `transform` only. Never `width`, `height`, `top`, `left`, or
`box-shadow`.

### Timing

| Interaction                | Duration | Easing              |
| -------------------------- | -------- | ------------------- |
| Hover / colour transitions | 150ms    | `ease-out`          |
| Scroll reveal              | 400ms    | `[0.16, 1, 0.3, 1]` |
| Page transition            | 200ms    | `ease-out`          |
| Mobile menu                | 200ms    | `ease-out`          |

### Patterns

- **Scroll reveal:** `opacity 0 → 1`, `y: 12 → 0`, via `whileInView` with
  `viewport={{ once: true, margin: '-80px' }}`. Once only — re-triggering reads as
  unpolished.
- **Stagger:** grouped children (project cards, skill badges) animate through a
  parent `variants` object with `staggerChildren: 0.06`, capped at ~0.3s total. Never
  hand-delay individual children.
- **Page transitions:** `AnimatePresence mode="wait"` around the route outlet,
  `opacity` + `y: 8`, under 300ms.
- **Hero:** the hero animates on mount only, and its content must be present and
  readable in the DOM regardless of animation state — never animate the LCP element's
  opacity from 0 in a way that delays it.

### Reduced Motion

`useReducedMotion()` is checked wherever motion is defined. When it returns true:
all transforms are dropped, durations collapse to 0, and elements render in their
final state immediately. Reduced motion never means hidden content.

### The Test

If you cannot state in one sentence what an animation communicates — draws attention,
signals a state change, or guides the eye — delete it.

---

## 9. Token Implementation

**Tailwind CSS v4, CSS-first configuration.** There is no `tailwind.config.ts` — the
theme is declared in CSS, in the single stylesheet the project is allowed
(`AGENTS.md` §2). This is a deliberate update from an earlier draft of this document,
which described the v3 JavaScript config; every token value below is unchanged, only
the file it lives in moved.

### `src/styles/index.css`

The file has four parts, in this order: the Tailwind import and dark variant, the raw
token values, the `@theme` mapping that turns them into utility classes, and base
element styles.

```css
@import 'tailwindcss';

/* Class-based dark mode — v4's replacement for darkMode: 'class' */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: 255 255 255;
  --surface: 250 250 250;
  --fg: 24 24 27;
  --accent: 124 58 237;
  /* … one per token in §2.2 */
}

.dark {
  --bg: 10 14 26;
  --surface: 17 23 38;
  --fg: 227 232 242;
  --accent: 167 139 250;
  /* … one per token in §2.3 */
}

@theme inline {
  --color-bg: rgb(var(--bg));
  --color-surface: rgb(var(--surface));
  --color-fg: rgb(var(--fg));
  --color-accent: rgb(var(--accent));
  /* … one per token in §2.2 / §2.3 */

  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --text-display: 2.25rem; /* + line-height / weight / tracking pairs per §3.2 */
  --text-eyebrow: 0.75rem;

  --container-container: 1120px;
  --container-container-wide: 1280px;
  --container-content: 768px;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05);
}
```

Two details that are load-bearing:

- Raw values are stored as **space-separated RGB channels**, wrapped in `rgb()` only
  inside `@theme`. This is what makes opacity modifiers (`bg-accent/30`) resolve
  correctly against a runtime-swapped variable.
- The block is `@theme inline`, not plain `@theme`. Without `inline`, the generated
  utilities capture the token value at build time and dark mode stops swapping.
- `max-w-container` / `max-w-content` come from the `--container-*` namespace in v4,
  which feeds both `max-w-*` and `w-*`. The `--container-container` repetition is
  namespace + token name, not a typo.

Rules:

- Every colour, font size, max-width, and radius used in the app resolves to a token
  defined in `@theme`. Arbitrary values (`text-[17px]`, `bg-[#1a1a1a]`) are not
  permitted unless no token can fit, and that case requires a comment.
- Class order is left to `prettier-plugin-tailwindcss`. Do not hand-order.
- Conditional classes go through `cn()`, never template-string concatenation.

---

## 10. Imagery & Iconography

**Images**

- WebP or AVIF, with explicit `width`/`height` recorded in the typed project data so
  no layout shift occurs.
- `loading="lazy"` for anything below the fold; the hero ships no image at all.
- Project screenshots must show the actual product interface — legible UI, light
  background preferred, no device mockups tilted in 3D, no dark blurred atmosphere.
- Every image has meaningful `alt`, or `alt=""` if purely decorative
  (`AGENTS.md` §10).
- Aspect ratio is fixed at 16:9 for project cards; the source is cropped to fit
  rather than letterboxed.

**Icons**

- Inline SVG only, 20px default (16px inside `body-sm` contexts), `stroke-width 1.5`,
  `currentColor` fill/stroke. No icon-font, no runtime icon package unless it
  tree-shakes to only the icons used.
- Decorative icons get `aria-hidden="true"`; standalone icon controls get an
  `aria-label`.
- No emoji as interface iconography.

---

## 11. Accessibility Requirements That Are Design Decisions

These are listed here, not only in the architecture doc, because they constrain
visual choices directly:

- Every interactive element shows a visible `focus-visible` ring (§4.5). Removing an
  outline without replacing it is a blocking defect.
- Colour never carries meaning alone (§2.5).
- Text contrast meets the ratios in §2.4 in both themes.
- Touch targets are at least 44×44px on mobile.
- Placeholder text is never a label.
- Heading order is never chosen for visual size; use the correct level and restyle it.
- Motion respects `prefers-reduced-motion` (§8).
- Content is legible and reachable at 200% browser zoom and at 320px width.

---

## 12. Definition of Visual Done

A section ships only when all of the following hold:

- [ ] Renders correctly from 320px to 1920px with no horizontal scroll or overlap.
- [ ] Correct and AA-compliant in **both** light and dark themes.
- [ ] Every colour, size, and spacing value comes from a token in this document.
- [ ] Every interactive element is keyboard reachable and shows the focus ring.
- [ ] Animations respect reduced motion and animate only opacity/transform.
- [ ] Images have explicit dimensions and meaningful `alt`.
- [ ] Empty/undefined data renders a sane state, not a broken layout.
- [ ] No arbitrary Tailwind values and no inline `style` except runtime-computed
      transforms.

---

## 13. Requirements Traceability

- Restrained neutral direction and anti-goals trace to PRD §Tone ("credible, direct,
  hiring-oriented") and PRD §Failure Modes ("important information buried behind heavy
  animation or visual noise").
- The dual-theme token system and verified ratios trace to PRD §Theme Support and
  §Accessibility ("WCAG AA color contrast in dark and light themes") and to PRD
  §Visual/Brand Content ("professional color system for light and dark themes").
- System font stack traces to architecture §7 Font Strategy.
- No decorative media, fixed image dimensions, and lazy loading trace to architecture
  §7 Image Strategy and PRD §Performance.
- Motion constraints trace to `AGENTS.md` §7 and architecture §7 Animation Strategy.
- Focus ring, touch target, label, and heading rules trace to `AGENTS.md` §10 and
  architecture §8 Accessibility Strategy.
- Section order and composition trace to architecture §8 Structured Heading Plan.
- Conditional link rendering in project cards traces to architecture §11 Broken-Link
  Prevention.
- Contact form states and the mailto fallback trace to architecture §9 and PRD
  §Reliability.
- Token implementation rules trace to `AGENTS.md` §6 Styling Conventions.
