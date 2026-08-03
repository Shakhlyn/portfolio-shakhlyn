# E13 — Contact — Status

**7 of 7 tickets implemented. Verification is partial, and this file says exactly where.**

The code is written, all four gates are green, and the transport was verified against the
live endpoint — including two failure modes that would each have shipped a green
confirmation for an undelivered message. **The interactive behaviour has not been verified
in a browser**, because no browser tooling was available in the session that built it. §5
lists every unverified criterion as a checklist to run, rather than describing them as
passing.

Last updated: **2026-08-03**

---

## 1. Gates

```
yarn typecheck    ✅ exit 0
yarn lint         ✅ exit 0
yarn format:check ✅ exit 0
yarn build        ✅ exit 0
```

Entry bundle 386.72 kB raw / **123.55 kB gzip**, up from 378.89 / 121.26. The contact
section costs ~2.3 kB gzip and the initial route stays well inside the ~200 kB budget
(`1-prd.md` §5).

**`yarn tsc --noEmit` is not a gate in this repo and silently passes anything.**
`tsconfig.json` is a solution file with `"files": []` and two project references, so plain
`tsc` compiles nothing and exits 0 unconditionally. Found by writing a deliberately broken
file and watching it pass. The real command is `yarn typecheck` (`tsc -b --noEmit`), which
rejected the same file with `error TS2339`. Anyone quoting the first command as evidence is
quoting nothing.

## 2. What shipped

| Ticket | Deliverable                                                     |
| ------ | --------------------------------------------------------------- |
| T01    | Provider change written into four source docs + decision row 14 |
| T02    | `contact.types.ts`, `contact.ts` (copy), `validateContact.ts`   |
| T03    | `constants/contact.ts`, `services/contact.service.ts`           |
| T04    | `hooks/useContactForm.ts`                                       |
| T05    | `sections/ContactForm.tsx`                                      |
| T06    | `sections/ContactSection.tsx`, `HomePage.tsx` scaffold removed  |
| T07    | This file                                                       |

The home page now carries **zero scaffold sections**. E07-T03's placeholder, held open
since E07 for E09–E13, is fully discharged.

## 3. The transport, verified live

Three probes against `formsubmit.co` on 2026-08-03. Two of them found behaviour that
contradicts the obvious implementation:

| Probe                 | Result                                                       | Consequence                                                         |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Valid submission      | `{"success":"true","message":"…submitted successfully"}`     | `success` is a **string**                                           |
| Wrong token           | **HTTP 200** + `{"success":"false", …}`                      | `response.ok` proves nothing                                        |
| No `Origin`/`Referer` | `{"success":"false","message":"…open through a web server"}` | The endpoint requires a browser origin; curl alone under-reports it |

**Both of the first two are ways a naive implementation reports a delivery that never
happened.** `if (body.success)` treats the string `'false'` as success because a non-empty
string is truthy; and checking only `response.ok` accepts a dead token's 200. The service
compares against the literal `'true'` **and** requires `ok`, and each guard is now load-
bearing for a reason that was observed rather than assumed. The `2-architecture.md` §11
silent-failure rule is what both were checked against.

The third explains a confusing result rather than changing the code: the browser always
sends an `Origin`, so the app is unaffected — but a command-line probe without one gets a
refusal that reads like a dead token.

## 4. Structural verification (headless)

No browser was available, so the component tree was rendered through the project's own Vite
in SSR mode and asserted against. **18 checks, all passing** — every one a property of the
real rendered output, not of a mock:

- Name label renders **without** `*`; Email and Message **with** it.
- No `aria-invalid` and no error text on first render — nothing is announced before the
  visitor has done anything.
- An errored field carries `aria-invalid="true"` and an `aria-describedby` **that resolves
  to the message element's own generated id** (matched id-to-id, not merely present).
- The `<form>` carries no `action`, no `method`, and no provider attributes.
- The honeypot is in the DOM as `_honey`, `class="sr-only"`, `aria-hidden="true"`,
  `tabindex="-1"`, `autocomplete="off"`, and is **not** `display:none`.
- The live region is `role="status" aria-live="polite"`.
- Reduced motion removes the spinner **element** from the DOM and keeps the text "Sending…".
- The error state exposes the `mailto:` fallback and carries the invalid-field count.

## 5. Not verified — the browser pass this session could not run

Every item below is a real E13 criterion that **has not been observed**. None is known to
fail; none is known to pass.

**Form behaviour**

- [ ] Typing in any field produces no error message.
- [ ] Blurring an empty Email shows one message; blurring Name never does.
- [ ] Submitting empty focuses Email — the next keystroke lands there without a click.
- [ ] Two consecutive failed submits both move focus (the case the `onInvalid` callback
      exists for, in place of a returned field name).
- [ ] While submitting: button disabled, fields read-only, region reads "Sending…".
- [ ] Forced failure keeps all three values and shows the mailto fallback.
- [ ] Success replaces the form and moves focus to the message.
- [ ] A real submission through the built UI arrives in the inbox.

**Section and navigation**

- [ ] Contact nav item works from `/`, `/writing`, and `/resume`, and from an external
      `/#contact`.
- [ ] The next Tab after an anchor jump lands on the Name field.
- [ ] Scroll spy marks exactly one item active.
- [ ] 60/40 at `lg`; stacked below with the form first.
- [ ] No horizontal scroll at 320, 375, 768, 1024, 1440, 1920.
- [ ] Both themes; `danger` on `surface` meets §2.4.
- [ ] Reduced motion renders the section in its final state immediately.
- [ ] Full keyboard traversal: skip link → header → nav → main → three fields → submit →
      social rail → footer.

**Two inbox confirmations are outstanding from the live probes.** A message titled
"E13 transport test" **should** have arrived; one titled "E13 HONEYPOT test" **must not**
have. The provider accepted both with `success: "true"` — a honeypot is designed to tell a
bot nothing — so only the inbox distinguishes them.

## 6. Cross-epic touch — E05's `TextInput` and `TextArea`

Both gained an optional `ref` prop, recorded here and in [E05-status.md](E05-status.md).

Necessary, not convenient: a failed submit must move focus to the first invalid field, the
field elements are owned by those two components, and their prop types
(`InputHTMLAttributes` / `TextareaHTMLAttributes`) do not include `ref`. React 19 passes
`ref` through props for function components, so no `forwardRef` was needed — only the type
had to say so. The alternative was querying the DOM for an id generated by `useId` inside a
component that never exposes it.

## 7. Decisions taken during implementation

| Decision                                                                         | Why                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useContactForm` takes an `onInvalid` callback instead of returning a field name | Returning it makes two consecutive failed submits on an unchanged form indistinguishable, so the second moves focus nowhere. Focus is an event, not a state                                         |
| `onBlur` validates the value from the event, not from `values`                   | On a blur caused by the same interaction that changed the field, state has not committed and would validate the previous value                                                                      |
| Typing clears that field's existing error                                        | Leaving a message up while the visitor corrects the field tells them the correction did not count                                                                                                   |
| Honeypot uses the existing `SR_ONLY` constant                                    | Clipping rather than an off-screen offset, and it avoids the arbitrary Tailwind value (`left-[-9999px]`) that `AGENTS.md` §6 forbids. `aria-hidden` removes it from the tree the class name implies |
| Max lengths (100 / 2000) adopted from the previous portfolio's form              | An unbounded textarea posted to a third-party endpoint is what a bot fills, and the provider rejects an oversized body with an error the visitor cannot act on                                      |

## 8. Corrections to E13's own ticket file

Three, all found by the criteria doing their job:

1. **T01 claimed §12 of `2-architecture.md` listed Netlify Forms.** It never did. No edit
   was made there; the claim was wrong, not the document.
2. **T01's "no `Netlify Forms` outside `docs/tickets/`" criterion was too strict.** Three
   deliberate mentions remain: two in §9's supersession paragraph and one in §10 row 19. A
   supersession note has to name what it supersedes. The criterion still earned its place —
   it caught **four genuinely stale references** in §1 and §10 that T01's file list never
   mentioned.
3. **T06's "copyable without JavaScript" criterion cannot pass in this app.** It is an SPA
   with no SSR: with JavaScript disabled the page renders nothing at all, so no element can
   satisfy it. The intent — a real text node, not a click-to-reveal or a runtime-assembled
   string — is what was built and is what should be verified.

## 9. Residual risk

FormSubmit is a third party on a conversion path, with no dashboard and no published
uptime. If it stops delivering, the form cannot tell. The page does not depend on it: the
same section renders the address as selectable text and the social links beside it, and the
transport is one function in one file, so switching provider is a single commit touching no
component.

## 10. Post-epic changes

Two changes after the eight E13 commits, each its own commit.

**Buttons had no pointer cursor, site-wide.** Reported against the contact form's submit
button, but the cause is global: Tailwind v4's Preflight sets `cursor: default` on
`button`, reverting v3's `pointer`, and the codebase carried no `cursor` rule anywhere. So
`ThemeToggle`, the mobile nav trigger, and both carousel arrows read as unclickable too.
Fixed once in `src/styles/index.css`'s base layer rather than in `Button`, because the
cause is a framework default and two of those controls are raw `<button>`s that never pass
through `Button`. `:not(:disabled)` keeps a disabled control showing the default arrow.

**The footer's social row now renders below `sm` only.** At `sm` and up the fixed rail is
on screen at the same moment the footer is, so the same four links appeared twice within
one viewport — three times on the home page, counting the contact section. Hidden by
breakpoint rather than deleted: the footer is the only social surface on every route at
every width, and deleting it would leave a phone visitor on `/projects/:slug` or `/resume`
with no visible link at all. `3-style-preference.md` §6.12 amended, and the governing rule
written down there: **the rail is the social surface at `sm` and up; every other copy
exists only below it.**

Copy counts after the change — at `sm`+: rail and the contact section, down from three.
Below `sm`: hero, contact, footer, and the nav sheet, with no rail, each serving a
different point in the scroll.

**Neither is visually verified**, for the same reason as §5: no browser tooling. The
cursor rule was confirmed to reach the built CSS as
`button:not(:disabled),[role=button]:not(:disabled){cursor:pointer}`, and `.sm\:hidden` was
confirmed to compile inside `@media (width>=40rem)` — both facts about the bundle, not
about what a pointer does on screen.

**X/Twitter link added.** `profile.ts` gained `x: 'https://x.com/Shakhlyn'` — one line, no
component touched, which is the property E04 was built for. It appears everywhere social
links render: the rail at `sm`+, and `SocialLinks` in the contact section, the mobile nav
sheet, the hero below `sm`, and the footer below `sm`. This also closes
`2-architecture.md` §9's "Direct contact links must also be present: Email, LinkedIn,
GitHub, Twitter/X", which was previously satisfied three-quarters of the way — the channel,
its icon, and the presence filter had all shipped in E08 with no URL to render.
