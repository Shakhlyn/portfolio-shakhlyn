# E07 — Header & Navigation · Status

Tickets: [E07-tickets.md](E07-tickets.md) · Overview: [STATUS.md](STATUS.md)

**14 / 14 done.** Verified in a real browser, not by inspection.
Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                             | Status | Notes                                    |
| ------- | --------------------------------- | ------ | ---------------------------------------- |
| E07-T01 | `useScrolledPast` hook            | ✅     |                                          |
| E07-T02 | `Header` shell, wordmark, border  | ✅     | Added `wordmark` to `ProfileType`        |
| E07-T03 | Home page section anchor scaffold | ✅     | **Temporary** — E09–E13 replace it       |
| E07-T04 | `focusSection` helper             | ✅     |                                          |
| E07-T05 | Desktop `Navigation`              | ✅     |                                          |
| E07-T06 | `useActiveSection` scroll spy     | ✅     |                                          |
| E07-T07 | `useHashScroll`                   | ✅     | Uncovered two latent defects — see below |
| E07-T08 | `useMediaQuery` hook              | ✅     |                                          |
| E07-T09 | `useFocusTrap` hook               | ✅     |                                          |
| E07-T10 | `useScrollLock` hook              | ✅     |                                          |
| E07-T11 | `SocialLinks` component           | ✅     | Moved from E08                           |
| E07-T12 | `MobileNavigation` sheet          | ✅     | All five close paths verified            |
| E07-T13 | `Footer`                          | ✅     |                                          |
| E07-T14 | Integration verification pass     | ✅     | 27 automated browser checks              |

## How this was verified

Headless Chrome driven over the DevTools Protocol against a production
`yarn preview` build — real clicks, real key events, real viewport resizes.
**27 checks, all passing.** This is why the epic's criteria are marked done
rather than "should work".

Not covered by automation, and not claimed: CLS measurement via the Performance
panel, real touch-device hover behaviour, and screen-reader announcement.

### Epic acceptance criteria

| Criterion                             | Evidence                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Anchor items work from `/`            | `hash=#about`, `activeElement=#about-heading`, section top `80px` against a 64px header            |
| …and from `/writing`                  | `{"path":"/","hash":"#projects","scrollY":969,"projTop":79}`                                       |
| …and from `/resume`                   | `{"path":"/","hash":"#contact","scrollY":3585,"atMaxScroll":true}`                                 |
| External `/#contact` lands on Contact | cold load → `activeElement=contact-heading`                                                        |
| Exactly one item active, no flicker   | 5 scroll positions: `y=0:1(Home) y=700:1(Home) y=1500:1(Projects) y=2400:1(About) y=3400:1(About)` |
| Spy does not run off the home route   | patched `IntersectionObserver` constructor → `{"path":"/writing","io":0}`                          |
| Sheet closes on all five triggers     | each verified individually; every one restores `scrollY=500` and releases `body{position:fixed}`   |
| Listeners released on unmount         | all seven hooks return a cleanup function                                                          |

### One criterion verified in a weaker form

**"After clicking a nav anchor, the next Tab lands inside that section."** Focus
does land on the section heading, and the next Tab moves _forward_ from there
rather than back to the document top — which is the failure the criterion
exists to catch. But the T03 scaffold sections contain no focusable children,
so "inside" is not yet literally testable. Tab currently continues to the footer
links, which is correct behaviour for an empty section.

**Re-test this once E10–E13 put real content in the sections.**

## Three defects found and fixed

Two of these were pre-existing and would not have surfaced without E07.

**1 — Anchor offset doubled.** `scroll-padding-top: 5rem` on `html` (E06-T04)
stacked with `scroll-mt-20` on every anchor target, landing anchors 160px down
instead of 80px. §4 mandates `scroll-mt-20` on targets, which the browser also
honours for native hash resolution, so the scroll-padding was redundant as well
as wrong. Removed.

**2 — Route focus never worked.** `PageTransition`'s `mode="wait"` holds the
incoming route unmounted while the outgoing one exits (~200ms). Both
`useHashScroll` and `useRouteFocus` used a fixed two-frame wait, looked before
the target existed, and gave up silently. Added `src/lib/whenElementReady.ts`,
which polls by frame until the element appears — still after paint, still not a
`setTimeout` guess.

This is the ordering hazard flagged in [E06-status.md](E06-status.md), and it
means **E03-T06's route-change focus had never actually worked**. It was marked
"needs manual browser check" and never checked. `activeElement` after navigating
to `/writing` was `BODY`; it is now `H1`.

**3 — Outgoing heading captured.** Fixing (2) exposed a second layer: `main h1`
matches the _old_ page's heading during the exit animation. Focusing it and then
watching it unmount drops focus to `<body>`. `useRouteFocus` now waits for an
`h1` that differs from the outgoing one, and skips entirely on first load where
the browser has already positioned the document.

## Design decisions worth knowing

**Scroll-spy suppression keys off `location.hash`, not a callback.** §4 states
every nav click updates the hash, so the hash change _is_ the nav-click signal.
No shared refs, no prop threading between `Navigation` and the spy. Suppression
_overrides_ rather than pauses the observer, so `spyId` is already correct when
the 700ms window expires — no catch-up frame lighting the wrong item.

**Anchor items are plain links to `/#section`.** One form covers both the
same-page hash change and the cross-route navigation; `useHashScroll` resolves
either. A separate onClick scroll handler would be a second code path that can
disagree with the URL.

**The sheet's route-change and `lg`-crossing closes are derived, not effects.**
State holds the pathname the sheet was opened on; `isOpen` is derived from it.
The React Compiler lint rule rejects synchronous `setState` in effects, and
deriving also makes it impossible for either path to skip releasing the focus
trap or scroll lock — both are driven by the same `isOpen`.

**`ThemeToggle` is not a sheet row.** It stays in the header at every width, so
theme works without opening the menu.

## Deviations from the tickets

**T02 — `useScrolledPast` does not read synchronously on mount.** The ticket
asked for a synchronous initial read inside the effect; the React Compiler lint
rule rejects that. The `useState` initializer covers mount and produces the same
result with no cascading render.

**T14 — 16 commits became 6.** `RootLayout.tsx` is touched by three tickets, and
several intermediate states would not have built (`Header` before `Navigation`
exists). Grouped into six commits that are each one logical change.

## Files

```
src/hooks/useScrolledPast.ts       src/lib/focusSection.ts
src/hooks/useMediaQuery.ts         src/lib/whenElementReady.ts
src/hooks/useFocusTrap.ts
src/hooks/useScrollLock.ts         src/components/layout/Header.tsx
src/hooks/useActiveSection.ts      src/components/layout/Navigation.tsx
src/hooks/useHashScroll.ts         src/components/layout/MobileNavigation.tsx
src/hooks/useRouteFocus.ts   (mod) src/components/layout/SocialLinks.tsx
                                   src/components/layout/Footer.tsx
src/data/navigation.ts       (mod) src/components/layout/RootLayout.tsx (mod)
src/data/profile.ts          (mod) src/pages/HomePage.tsx               (mod)
src/types/profile.types.ts   (mod) src/styles/index.css                 (mod)
```

---

## Later edit by E10 (cross-epic, deliberate)

**E10-T05 modified `src/data/navigation.ts`**, which this epic owns.
`4-interaction-design.md` §5.3 requires the Projects nav item to disappear when both
project categories are empty, and the nav is data — there is no way to satisfy that from
inside `components/sections/`. `NAV_ITEMS` and `NOT_FOUND_LINKS` now pass through a
`withoutEmptyProjects()` predicate evaluated once at import; `ANCHOR_SECTION_IDS` follows
for free because it already derives from `NAV_ITEMS`.

No file under `src/components/layout/` or `src/hooks/` changed — `Navigation`,
`MobileNavigation`, and `useActiveSection` consume the same exports they always did, just
with one fewer entry when there is nothing to link to. Verified against a temporarily
emptied `PROJECTS`: the desktop nav and the mobile sheet drop to 5 items, the spy never
reports `projects`, and the 404 link row omits it. Detail in
[E10-status.md](E10-status.md) §4.
