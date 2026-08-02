# E09 — Hero & Current Role · Status

Tickets: [E09-tickets.md](E09-tickets.md) · Overview: [STATUS.md](STATUS.md)

**8 / 8 done.** Verified in a real browser, not by inspection.
Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                               | Status | Notes                                                |
| ------- | ----------------------------------- | ------ | ---------------------------------------------------- |
| E09-T01 | Explicit `layout` discriminator     | ✅     | Also added `heroCtas` — see deviations               |
| E09-T02 | `HeroSection`, `stacked` layout     | ✅     |                                                      |
| E09-T03 | Hero mount reveal                   | ✅     | One acceptance criterion was unverifiable as written |
| E09-T04 | Hero `SocialLinks` below `sm`       | ✅     | Closes E08's deferred pairing criterion              |
| E09-T05 | `split` layout seam + portrait slot | ✅     | Found and fixed a real defect — see below            |
| E09-T06 | `CurrentRoleSection`                | ✅     |                                                      |
| E09-T07 | Integration verification pass       | ✅     | 33 automated browser checks                          |
| E09-T08 | Portrait treatment                  | ✅     | Unblocked 2026-08-03 by the supplied photograph      |

## How this was verified

Headless Chrome over the DevTools Protocol against a production `yarn preview`
build — real clicks, real key events, real viewport resizes, real CPU and
network throttling. **42 checks across five runs, all passing**: 26 on the
`stacked` layout, 6 on the `split` seam, 2 on a throttled mobile profile, 8 on
the portrait, and 1 re-check of `stacked` after the layout was switched to
`split` for launch.

Not covered by automation, and not claimed: screen-reader announcement, and
real touch-device behaviour.

## One defect found and fixed

**The portrait slot shrank below its specified width.** As a flex child with
`flex-shrink` at its default of 1, the slot measured **233px at `lg` against a
specified 280px**, and 296px against 320px at `xl`. A slot that reserves less
space than the image will fill is exactly the CLS the aspect-ratio lock exists
to prevent — the lock held the ratio while the width silently gave way. Fixed
with `shrink-0`, then re-measured: 200 / 280 / 320 at mobile / `lg` / `xl`,
ratio 0.75.

This is the criterion "the slot occupies its full box" doing its job. A visual
check would have passed it — 233px looks fine.

## A gate that was not gating

The requested command `yarn tsc --noEmit` **typechecks nothing in this repo.**
The root `tsconfig.json` is a solution file (`"files": []` plus two references),
so bare `tsc` finds no inputs and exits 0 no matter what the tree contains. The
real gate is `yarn typecheck` (`tsc -b --noEmit`), which walks both project
references.

Demonstrated with a probe: a `ProfileType` literal missing `layout` produced
**no output and exit 0** under `tsc --noEmit`, and `TS2741: Property 'layout' is
missing` under `yarn typecheck`. All results below come from the latter.

## One criterion was unverifiable as written

**T03's "with JavaScript disabled, the hero … is visible and legible."** This is
a client-rendered SPA — with JS disabled _nothing_ renders, for any component,
so the check can never pass and does not distinguish a good hero from a bad one.
The ticket text is wrong.

What the criterion was protecting is real, and was verified in the form the
source doc actually states (`4-interaction-design.md` §5.1: the hero's text must
be in the DOM at first paint and never gated on JS state):

- The hero's text renders unconditionally — no mounted flag, no state variable
  gating presence. `HeroSection` holds no `useState` and no `useEffect`.
- Measured: `#home` innerText is 433 characters with `display: block` and
  `visibility: visible`; the animation writes only `opacity` and `transform`.
- Under a throttled mobile profile the hero paragraph **is** the LCP element at
  496ms, which is only possible if the text is present and painted.

Fix the ticket text, not the code.

## Deviations from the tickets

**T01/T02 — `heroCtas` added to `ProfileType` and `profile.ts`.** T02's file
list was `HeroSection.tsx` + `HomePage.tsx`, but the CTA labels ("View Resume",
"Contact") had no home in the data layer, and the Global Definition of Done says
content comes from `src/data/`, never hardcoded in JSX. `1-prd.md` §6 settles
which one they are: it lists "primary and secondary CTA labels (resume,
contact)" under required **Hero Content**. So they are content, and they live in
`profile.ts`. Label text itself is from `3-style-preference.md` §6.2.

**T02 — `RESUME_ROUTE` / `CONTACT_SECTION_ID` / `CONTACT_ANCHOR` added to
`navigation.ts`.** The hero CTAs point at the same two destinations the nav
does, and E04-T02's acceptance criterion is that nav targets exist in exactly
one place. Hardcoding `/resume` and `/#contact` in the hero would have been a
second copy to rot. `NAV_ITEMS` now consumes the same constants.

**T05 — the portrait slot ratio was not in any source document.** §6.2 and §5.1
give widths (200px capped on mobile, 280px at `lg`, 320px at `xl`) but no ratio.
Asked rather than inferred; **3:4** was chosen, giving 200×267, 280×373, and
320×427. Recorded here because the ratio is now load-bearing for T08 — the
portrait must be cropped to it.

**T02 — one punctuation literal in the JSX.** The current-position line renders
`{role} · {company}`. The separator is punctuation, not copy, and follows the
`Footer` precedent (`{PROFILE.name} · {year}`). Both values come from `PROFILE`.

## Acceptance criteria

### E09-T01

| Criterion                                       | Evidence                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `layout` is `'stacked' \| 'split'` and required | Probe without it: `TS2741: Property 'layout' is missing in type … ProfileType`           |
| `PROFILE.layout === 'stacked'`, portrait absent | `stacked` renders and no slot element exists inside `#home`                              |
| No source text claims `portrait` is the switch  | `grep -rn "portrait" src/types src/data \| grep -iE "presence\|selects\|switch"` → empty |
| `yarn typecheck` passes                         | exit 0                                                                                   |

### E09-T02

| Criterion                                     | Evidence                                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `h1` is the name alone, role framing sibling  | `h1Count=1`, `h1="Shaokh Al Mahmud Shakhlyn"`, `nextElementSibling="Full-stack Engineer — …"`         |
| Exactly one `h1` on `/`                       | `h1Count=1`                                                                                           |
| `h1` has `tabIndex -1`; Home click focuses it | `tabIndex=-1`; after click `{"active":"H1#Shaokh Al Ma","hash":"#home"}`                              |
| Both CTAs are anchors with the right targets  | `[{"tag":"A","text":"View Resume","href":"/resume"},{"tag":"A","text":"Contact","href":"/#contact"}]` |
| Contact resolves from `/` and from `/writing` | from `/writing`: `{"path":"/","hash":"#contact"}`                                                     |
| At 320px both CTAs fit and are ≥44px tall     | `heights=[48,48] rights=[168,128] scrollWidth=clientWidth=305`                                        |
| No user-facing copy literal in the component  | Only `·` (punctuation) — see deviations                                                               |

### E09-T03

| Criterion                                   | Evidence                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Hero text present at first paint, not gated | 433 chars, `display: block`, `visibility: visible`; LCP element at 496ms. See "unverifiable as written" |
| Reduced motion → final state, no transform  | emulated `prefers-reduced-motion: reduce` → `opacity: 1; transform: none;`                              |
| Only `opacity`/`transform` animate          | inline style after settle: `opacity: 1; transform: none;`                                               |
| No duration/easing/offset literal           | `grep -nE "duration\|ease\|0\.[0-9]\|400\|150\|\[0\.16" HeroSection.tsx` → empty                        |

### E09-T04

| Criterion                                | Evidence                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Row at 375px, gone at 640px and above    | `375: visible` · `640/1024/1440: display:none`                              |
| Only channels present in the data render | `[GitHub → github.com/shakhlyn, LinkedIn → …, Email → mailto:…]`, no X tile |
| Absent from the a11y tree at `sm`+       | computed `display: none` at 640px, not opacity or visibility                |

### E09-T05

| Criterion                                       | Evidence                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Flipping only `profile.layout` switches layouts | one-line `sed` on `profile.ts` → slot present at all six widths; reverted                  |
| Slot occupies its full box, no h-scroll         | 200×267 / 280×373 / 320×427, ratio 0.75; overflow 0 at 320–1920 (after the `shrink-0` fix) |
| Below `lg` the slot precedes the text           | DOM order and geometry both confirm at 320/375/768                                         |
| Under `stacked` no slot renders                 | `#home [class*="aspect-"]` count = 0                                                       |
| Content stack identical between layouts         | same `h1`, both CTAs present at every width in both layouts                                |

### E09-T06

| Criterion                                      | Evidence                                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Renders role, company, date, 4 scope, 8 badges | `h3="Software Engineer · Penta Global Limited"`, `Mar 2024 — Present`, scope=4, badges=8 |
| E07 placeholder gone                           | `min-h-96` count in `#current-role` = 0                                                  |
| No eyebrow                                     | eyebrow element count = 0                                                                |
| Heading order `h1 → h2 → h3`                   | `["H1","H2","H3"]`, `h2="Current Role"`                                                  |
| Reveals once, no re-animation                  | opacity 1 after reveal; re-entering view → opacity 1 immediately                         |
| Badges do not stagger                          | 0 badges carry an inline style; all badge opacities identical                            |
| Reduced motion → visible without scrolling     | `opacity=1 transform=none` under emulation                                               |

### E09-T07 and epic-level

| Criterion                                                             | Evidence                                                                      |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Rail and hero row never both visible (**closes E08**)                 | 375: row=true rail=false · 640/1024/1440: row=false rail=false                |
| Next Tab after the Home anchor lands inside `#home` (**E07 re-test**) | `{"tag":"A","text":"View Resume","inHero":true}`                              |
| No horizontal scroll at 320/375/768/1024/1440/1920                    | overflow 0 at every width, in both layouts                                    |
| Correct in both themes                                                | toggle flips `fg`, `bg`, `surface`, `accent-soft` on hero and card            |
| LCP under 2.5s on a throttled mobile profile                          | **496ms** (4× CPU, Slow 4G, 375px); LCP element is the hero value proposition |
| CLS                                                                   | 0 on the same profile                                                         |

## Files

```
src/components/sections/HeroSection.tsx         (new)
src/components/sections/CurrentRoleSection.tsx  (new)
src/types/profile.types.ts                      (mod: HeroLayout, HeroCtaLabelsType)
src/data/profile.ts                             (mod: layout, heroCtas)
src/data/navigation.ts                          (mod: shared CTA targets)
src/pages/HomePage.tsx                          (mod: scaffold replaced for two sections)
```

## E09-T08 — the portrait

Unblocked the same day by `src/assets/portfolio_img.jpg` (960×960 JPEG, 102 KB).

**Prepared without adding a dependency.** No image tooling is installed
(`cwebp`, `magick`, `ffmpeg` all absent), and `3-style-preference.md` §10
requires WebP or AVIF. The already-present verification browser did the work:
centre-crop 960×960 → 720×960 (the slot's locked 3:4), encoded to WebP at
q0.82 via `canvas.toDataURL`. Result: **36 KB against the original 102 KB**, at
twice the largest rendered box (320×427 at `xl`) so it stays sharp on a 2×
display. The subject is centred in the source, so the centred crop keeps the
face on the optical centre. The uncropped original is kept.

`PROFILE.layout` is now `'split'`.

| Criterion                                          | Evidence                                                                |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| Renders in the T05 slot, no change to grid or dims | slot and image both 200×267 / 280×373 / 320×427; overflow 0 at 320–1920 |
| Not `lazy`; `fetchpriority="high"`; explicit dims  | `{"loading":null,"fetchPriority":"high","width":"720","height":"960"}`  |
| `alt` is the person's name                         | `alt="Shaokh Al Mahmud Shakhlyn"`                                       |
| CLS contribution is 0 — measured                   | CLS 0 on a throttled mobile profile with the image loading              |
| Format is WebP or AVIF                             | `portrait-CD1OdrYV.webp`, decoded 720×960                               |
| Dark-mode frame on a light-background photo (§7)   | border 1px in dark, 0px in light                                        |
| LCP still within budget                            | **616ms** throttled; the portrait is now the LCP element                |

## Still open

- **E10–E13** still hold the E07-T03 scaffold for `#projects`, `#about`,
  `#skills`, `#resume`, and `#contact`.
- **T03's JS-disabled criterion** in `E09-tickets.md` should be reworded to the
  DOM-presence check that actually distinguishes pass from fail.
- **The invented placeholder metrics** are visible on the page now. They are
  marked (`grep -rn "INVENTED FIGURE" src/`) and gated in E18.
