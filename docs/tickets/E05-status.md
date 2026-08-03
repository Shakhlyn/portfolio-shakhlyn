# E05 — UI Primitives · Status

Tickets: [E05-ui-primitives.md](E05-ui-primitives.md) · Overview: [STATUS.md](STATUS.md)

**9 / 9 written. 3 need manual browser verification.** Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                          | Status | Notes                                            |
| ------- | ------------------------------ | ------ | ------------------------------------------------ |
| E05-T01 | Focus ring constant + icon set | ✅     | 14 inline SVGs, no icon package                  |
| E05-T02 | `Container`                    | ✅     |                                                  |
| E05-T03 | `Section`                      | ✅     | Owns `scroll-mt-20` and the `h2`                 |
| E05-T04 | `Button`                       | 🔍     | Type exclusivity verified; visual check pending  |
| E05-T05 | `Card`                         | ✅     |                                                  |
| E05-T06 | `Badge`                        | 🔍     | Needs the AA contrast spot-check                 |
| E05-T07 | `IconLink`                     | ✅     |                                                  |
| E05-T08 | `TextInput` / `TextArea`       | 🔍     | Needs the screen-reader error-announcement check |
| E05-T09 | `FormStatus`                   | ✅     |                                                  |

## Files

```
src/constants/styles.ts              FOCUS_RING, SR_ONLY, NEW_TAB_LABEL
src/components/ui/icons/iconBase.ts  shared SVG attrs
src/components/ui/icons/*.tsx        14 icons, one per file
src/components/ui/{Container,Section,Button,Card,Badge,IconLink,TextInput,TextArea,FormStatus}.tsx
```

Icons: Sun, Moon, ChevronLeft, ChevronRight, Menu, Close, ExternalLink, Check, Alert,
Spinner, GitHub, LinkedIn, Email, X.

## Verified mechanically

- **`FOCUS_RING` has exactly one definition.** Every interactive primitive imports it;
  grep finds no second copy of the ring classes.
- **No `focus:` variant anywhere in `src/`** — `focus-visible:` only (`AGENTS.md` §10).
- **`Button`'s discriminated union holds.** Passing both `href` and `onClick` is a
  compile error, so a `<button>` that navigates is unrepresentable rather than merely
  discouraged.
- **No component exceeds ~200 lines**; the largest is `Button` at ~100.
- No icon dependency in `package.json`.

## Still to verify manually (needs a browser)

- [ ] All nine `Button` variant × size combinations render correctly in both themes,
      including the `ghost` focus ring against `surface`.
- [ ] `Badge` accent variant meets AA in both themes (§2.4 lists `accent-strong` on
      `accent-soft` at 6.48 / 9.30 — transcribed, not recomputed).
- [ ] `TextInput` error state is announced by a screen reader on focus, via
      `aria-invalid` + `aria-describedby`.
- [ ] Required marking survives with colour disabled.
- [ ] Touch targets ≥ 44×44px at mobile widths for `md`/`lg` buttons and `IconLink`.
- [ ] `Card`'s hover transform does not fire on a real touch device.
- [ ] `Container` gutters correct at 320 / 640 / 1024, capping at 1120px then 1280px
      at `2xl`.

## Implementation notes

**`Card` relies on Tailwind v4's `hover:` semantics.** In v4 `hover:` already resolves
to `@media (hover: hover)`, so hover styles do not fire on touch — where they would
otherwise trigger on tap and stick until the next tap elsewhere. No explicit media
wrapper was needed; this is a behavioural difference from v3 worth remembering.

**`Section` renders its own `Container`.** Callers must not wrap children in a second
one. Documented in the component so sections do not double-wrap.

**`Section`'s `h2` and every page `h1` carry `tabIndex={-1}`** so E07's anchor
navigation and E03's route focus can target them without adding tab stops.

**`IconLink` distinguishes `mailto:`.** Mail opens in the same tab and gets a plain
label; everything else opens in a new tab with `rel="noreferrer"` and the
"(opens in a new tab)" suffix folded into `aria-label`.

**`FormStatus`'s live region is always mounted and merely empty while idle.** Mounting
it at the same moment its message appears means assistive tech never announces the
change — a common and invisible bug.

**`FormStatus` error always exposes the mailto fallback**, as
`docs/2-architecture.md` §9 requires. It takes the address as a prop; the component
holds no content.

**`Badge` has no `onClick` or `href` on its props type.** There is no filtering in v1
(`docs/2-architecture.md` §12), and a badge that looks clickable and is not is a small
credibility leak.

**`TextInput`/`TextArea` use `border-border-strong`, not `border`.** The decorative
`border` token is 1.27:1 and fails the 3:1 non-text contrast requirement for an
interactive control boundary (§2.4). Ids come from `useId`, so two instances on one
page cannot collide.

## Deviations from the ticket

**`Button` does not declare `href?: never` on its button variant.** That produced
unused-variable lint errors when destructuring. Exclusivity is instead enforced by
union narrowing with `'href' in props`, which gives the same compile-time guarantee —
an object with both `href` and `onClick` matches neither member.

---

## Extended by E12-T02 (2026-08-03)

`Button`'s link branch gained a **`download?: string`** case on `ButtonAsLinkProps`,
rendering a plain same-origin `<a href download>` instead of a router `Link` or an
external new-tab anchor.

This is a cross-epic touch into an E05 primitive, declared rather than done quietly
(`AGENTS.md` §13). It was necessary, not convenient: `/resume`'s download points at
`public/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf`, and `<Link to="/resume/Shaokh_Al_Mahmud_Shakhlyn-resume.pdf">` is
intercepted by React Router and resolves to the catch-all 404, because the path looks
like a route. Neither existing branch produces a working download.

The value is a filename rather than a boolean so the saved file is named deliberately;
`download` with no value defers to the server's `Content-Disposition`, which a static
host does not set. The case is checked **before** `external` in the render body, since
a download is same-origin and must not open a new tab.

All four pre-existing call-site shapes still type-check unchanged.
