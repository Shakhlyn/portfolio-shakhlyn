# E08 — Social Rail · Status

Tickets: [E08-tickets.md](E08-tickets.md) · Overview: [STATUS.md](STATUS.md)

**8 / 8 done, with one criterion explicitly deferred to E09.** Verified in a real
browser, not by inspection. Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                                    | Status | Notes                                                     |
| ------- | ---------------------------------------- | ------ | --------------------------------------------------------- |
| E08-T01 | Amend the design docs for four decisions | ✅     | One decision recorded here turned out to be wrong — below |
| E08-T02 | Shared social channel definitions        | ✅     | `SocialLinks` refactored onto it, output unchanged        |
| E08-T03 | `SocialRailTile` at rest                 | ✅     | 48×48 fixed mid-verification, it was 49                   |
| E08-T04 | Hover and focus expansion                | ✅     | Sibling-widening defect fixed with `items-start`          |
| E08-T05 | `SocialRail` container, `sm` gating      | ✅     | Overlap defect fixed by widening the container gutter     |
| E08-T06 | Mount after `<main>`                     | ✅     |                                                           |
| E08-T07 | Profile the `width` animation            | ✅     | No `scaleX` fallback needed — see method caveat           |
| E08-T08 | Integration verification pass            | ✅     | Hero pairing check **deferred to E09**, not passed        |

## How this was verified

Headless Chrome driven over the DevTools Protocol against a production `yarn preview`
build — real mouse movement, real key events, real viewport resizes. **26 checks, all
passing** (23 in the main suite, 3 in a follow-up covering the sheet, reduced motion,
and tab order).

Not covered by automation, and not claimed: a DevTools flame chart (see T07), real
touch-device behaviour, and screen-reader announcement.

### Epic acceptance criteria

| Criterion                                        | Evidence                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Focus expansion works identically to hover       | `hover {w:111, bg:rgb(167,139,250), fg:rgb(10,14,26)}` byte-identical to `focus`                           |
| Every tile has an `aria-label`                   | `["GitHub (opens in a new tab)","LinkedIn (opens in a new tab)","Email"]`; every icon `aria-hidden="true"` |
| The rail does not overlap the container          | 640/768/1024: rail ends 48px, content starts 56px · 1440: 185px · 1920: 345px                              |
| Rail and hero social links never both visible    | **Deferred to E09** — the hero does not exist yet. See below.                                              |
| `width` animation recalculates no layout outside | tile 48→111px; 15 sampled boxes outside the rail unchanged; `LayoutCount` delta 8                          |

### Two criteria verified in a weaker form

**T07 profiling.** I did not capture a DevTools flame chart. I asserted geometric
invariance of 15 boxes outside the rail across the expansion, plus the `LayoutCount`
performance counter. That tests the same property the criterion cares about — no
reflow outside the rail — but it is not literally "read the profiler", and §7's
instruction says to check in DevTools. Stated plainly rather than implied.

**T08 tab order.** The rail is at focus index 9, the footer at 12, so the rail sits
between page content and the footer as §9 requires. But the last focusable inside
`<main>` is index −1: the T03 scaffold sections contain no focusable children yet.
**Re-test once E10–E13 put real content in the sections.**

### Deferred, not passed

**"Rail and hero social links are never both visible."** The hero is E09's. E08 proves
its own half — the rail is hidden at 320 and 375, visible at 640 through 1920 — and
T01 amended §5.1 and 3-style §6.2 so the hero's row is specified as `below sm`. The
paired check belongs to **E09** and is listed there. It is not ticked here.

## Three defects found and fixed

**1 — The tile was 49px, not 48.** The 1px right border sat outside the `w-12` icon
well. The well is now `w-[47px]`, because no token expresses "one token minus a
hairline".

**2 — Expanding one tile widened all three.** `flex-col` stretches `<li>` children to
the widest item, so the collapsed tiles rendered at expanded width with no label —
directly against §6.11's "one tile at a time". Fixed with `items-start` on the `<ul>`.

**3 — The rail sat on top of real page content.** Decision 2 in
[E08-tickets.md](E08-tickets.md) claimed the rail would overlay only the container's
left gutter. Measured, that was false: the gutter is _narrower_ than the rail.

| Width  | Rail ends | Content started | Overlap |
| ------ | --------- | --------------- | ------- |
| 640px  | 48px      | 24px            | 24px    |
| 768px  | 48px      | 24px            | 24px    |
| 1024px | 48px      | 32px            | 16px    |

Text sat under the rail from 640px to roughly 1280px — exactly what §7's constraint
existed to prevent, and made worse by moving the rail from `lg` to `sm` on a wrong
premise. Fixed by widening `Container`'s **left** padding to 56px from `sm` through
`lg`, dropping back to the normal gutter at `xl` where the centred container already
clears 48px. §7 and the `SocialRail` comment were corrected to match.

**Cost, recorded so nobody rediscovers it as a bug:** between 640px and 1279px the
content box is not centred — it sits ~16px right of centre.

**This touched `Container.tsx`, which is E05's component**, outside E08's declared
scope. Done on your explicit instruction after the measurement above.

## A harness fact worth keeping

Headless Chrome reports `(hover: none)`. Tailwind v4 compiles `hover:` behind
`@media (hover: hover)`, so **no hover rule in the app can match under default
headless** — every hover assertion passes by omission. The suite now launches Chrome
with `--blink-settings=primaryHoverType=2,availableHoverTypes=2,...`.

This means **E07's `Card` hover behaviour was never actually exercised**. It was
flagged as unverifiable at the time, correctly, but it is now verifiable and should be
re-run.

## Gate status

```
yarn tsc --noEmit  ✅ clean
yarn lint          ✅ zero errors
yarn build         ✅ 455.61 kB / 145.96 kB gzip
```
