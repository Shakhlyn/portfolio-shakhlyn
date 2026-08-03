# E13 — Contact

Implementation tickets for `docs/5-epic-list.md` E13. One ticket, one commit.

The **Global Definition of Done** in `5-epic-list.md` applies to every ticket here and is
not repeated in any of them.

Depends on E05 (`TextInput`, `TextArea`, `FormStatus`, `Button`, `Section`), E06
(`useMotionVariants`, and the `reducedMotion` boolean `FormStatus` already accepts), E07
(`SocialLinks`, and the `#contact` anchor the nav points at), and E04 (`CONTACT_EMAIL` in
`profile.ts`, exported for exactly this section). All are done and green. E13 replaces the
last remaining E07-T03 scaffold section in `HomePage.tsx`.

---

## Decisions taken before writing these tickets

Four questions were resolved with the user before decomposition. Decision 2 **overturns a
locked architecture decision** and 3–4 fill real gaps; all are propagated into the source
documents by E13-T01.

| #   | Ambiguity                                                                          | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Which fields the form carries, and their required-ness — no document lists them    | **Three: Name (optional), Email (required), Message (required), and a submit button labelled "Send message".** User decision. `3-style-preference.md` §6.8 named the same three fields but assigned no required-ness, which is what the label asterisk and the validator both key off                                                                                                                                                                                                                                                                                                                                              |
| 2   | Which service receives the submission — `2-architecture.md` §9 locks Netlify Forms | **FormSubmit (`formsubmit.co`), replacing Netlify Forms.** Netlify Forms is not an endpoint you can call: it is a build-time HTML scan plus an edge intercept of the POST to `/`. On Vercel or Render neither happens and the POST hits the SPA fallback, returning `200 index.html` — which `fetch` cannot tell from success, so the visitor sees a confirmation for a message that went nowhere. The host is not settled, and FormSubmit works identically on all three and on `yarn dev`. It also carries the largest free tier of the candidates considered: unlimited, against Netlify 100/month, Web3Forms 250, Formspree 50 |
| 3   | How the form submits — native POST or `fetch`                                      | **`fetch` POST to FormSubmit's AJAX endpoint.** A native POST leaves the SPA and reloads, which makes the `submitting` state, the retained values on error, and the in-place success message from `4-interaction-design.md` §5.7 unimplementable. The AJAX endpoint is also the only FormSubmit path that answers with JSON rather than a redirect. The transport is isolated in `src/services/contact.service.ts`, so a later change of provider touches one file                                                                                                                                                                 |
| 4   | Whether the honeypot stays in the accessibility tree, as §6.8's wording implies    | **Open — see Open Questions.** §6.8 says "visually hidden, never `display:none`… must remain in the accessibility tree as hidden but present", which is self-contradictory and, read literally, invites a screen reader user to fill the trap and have their message silently discarded. E13-T05 is written against the standard treatment pending your call, and does not ship until it is made                                                                                                                                                                                                                                   |

**No npm package is added.** `@formspree/react` and `@emailjs/browser` exist, but every
candidate here is one POST to one URL, and `AGENTS.md` §9 requires asking whether the
platform already solves it. `fetch` does, and the initial-route JS budget stays untouched.

**The cost of decision 2, stated plainly.** FormSubmit is the least transparent operator of
the three: no dashboard, no published uptime, and messages transit a third party. What
makes that acceptable is that this form is additive — `ContactSection` renders the email
address as selectable text (T06) and the social rail carries LinkedIn and GitHub, so a
FormSubmit outage degrades to the contact paths the page already offers rather than to
nothing.

### Why the transport ships before the form

E13-T03 has a **one-time activation step**: FormSubmit emails a confirmation link on the
first submission and forwards nothing until it is clicked. Every UI check written before
that is completed passes against an endpoint that accepts requests and delivers no mail.
Isolating the transport in its own ticket puts the activation, and a real message landing
in a real inbox, ahead of the first line of form markup.

This is also the decision's main payoff: under Netlify Forms this ticket could not be
verified here at all, and E13's last acceptance criterion had to be handed to E18. Both
now close inside E13.

---

### E13-T01 — Move the contact form off Netlify Forms and specify its field set in the source docs

**Depends on:** none

**Files:**

- Modify: `docs/2-architecture.md` — §9 (Contact Form), §12 (non-decisions)
- Modify: `docs/3-style-preference.md` — §6.8
- Modify: `docs/4-interaction-design.md` — §5.7, §10 (one new row)
- Modify: `docs/5-epic-list.md` — E13 deliverables and criterion 6, E18 deliverables
- Modify: `docs/tickets/README.md` — decision table

**Commit:** `docs: move the contact form to FormSubmit and specify its field rules`

**Scope**

- In: writing decisions 1–3 above into the four source documents and the ticket README's
  decision table. Documentation only.
- Out: every line of code. Types and validators are T02, the transport is T03, the form is
  T05.
- Conditional: decision 4. T01 must not encode an answer the user has not given, but it is
  already rewriting §6.8 — so if Open Question 1 is answered **before** this ticket runs,
  fold the honeypot's treatment in here. If it is answered after, it is its own docs commit
  before T05.

**Implementation notes**

`2-architecture.md` §9 is titled "Contact Form: Netlify Forms" and lists five
implementation requirements, three of which (static detection markup, the hidden
`form-name` field, Netlify-compatible markup) exist only to satisfy Netlify's build-time
scan. Retitle the subsection and replace those three with the FormSubmit AJAX endpoint and
the `_honey` honeypot. **The two that survive are the ones that were never about the
provider**: client-side validation of required fields, and the explicit
idle/submitting/success/error states with a direct-email fallback.

§12 lists Netlify Forms among the locked non-decisions; remove that line. **§10 is not
touched** — Netlify remains the recommended deploy target with its SPA redirect, and the
point of this change is that hosting and form transport are now independent choices.

`3-style-preference.md` §6.8 lists "Name, Email, Message" with no required-ness. Add it:
Name optional, Email and Message required, marked in the label text per §5.6, never by
colour. Record the submit label "Send message".

`4-interaction-design.md` §5.7's table already covers the five moments; it needs the field
set and the transport it assumes. Add one row to §10 in the existing format covering
decisions 1–3 together — they are one contract. §10 currently ends at row 18.

`5-epic-list.md` E13's deliverable list names Netlify Forms and its hidden `form-name`
field; both become FormSubmit and `_honey`, and the list gains the service module. Its
acceptance list changes in exactly one place: criterion 6's "arrives in the Netlify
dashboard (verified in E18)" becomes "arrives in the inbox", verified in E13. The other
five are unchanged — these decisions are how they are satisfied, not new criteria.

**E18 is edited too, and only by subtraction.** Its deliverable "Netlify Forms verified end
to end with a real submission" and the matching acceptance criterion both go: E13 now owns
that check. Leaving them would give the deploy epic a gate on a service the site does not
use, which is the failure mode that made this a docs ticket rather than a comment.

`docs/tickets/README.md`'s decision table ends at row 13 (E12). Add row 14 in the same
three-column shape.

The §8 animation inventory is **not** touched. The contact section takes animation 2 with
no child orchestration — the closed-list default — and the submit spinner is animation 11,
already inventoried and already implemented in `FormStatus`.

**Acceptance**

- `git show --name-only` for this commit lists five files, all under `docs/`, and zero
  files under `src/` or `public/`.
- `grep -rn "Netlify Forms" docs/ --exclude-dir=tickets` returns nothing. The ticket files
  are the historical record and keep their mentions.
- `grep -n "netlify" docs/2-architecture.md` still matches in §1 and §10 — the deploy
  target is unchanged, and a diff that removed it went too far.
- `grep -c "^| 14 " docs/tickets/README.md` returns `1`.
- `docs/4-interaction-design.md` §10 has 19 numbered rows, up from 18, and rows 1–18 are
  content-identical under `git diff HEAD~1 --ignore-all-space`.
- `grep -n "formsubmit" docs/2-architecture.md` matches inside §9.
- `grep -n "Send message" docs/3-style-preference.md` matches inside §6.8.
- `grep -rn "honeypot" docs/` shows no new sentence about the accessibility tree — decision
  4 is not in this commit.
- `yarn format:check` passes; the tables reflow under Prettier and must be committed
  formatted.

**Traceability:** `2-architecture.md` §9, §12 · `3-style-preference.md` §6.8 ·
`4-interaction-design.md` §5.7, §10 · `5-epic-list.md` E13

---

### E13-T02 — Add contact types, copy data, and pure field validators

**Depends on:** E13-T01

**Files:**

- Create: `src/types/contact.types.ts`
- Create: `src/data/contact.ts`
- Create: `src/lib/validateContact.ts`

**Commit:** `feat(contact): add contact types, copy, and field validators`

**Scope**

- In: the field union, the values and errors types, every user-visible string the section
  needs, and the pure validation functions. No React, no DOM, no imports from
  `components/`.
- Out: when validation runs. Timing is the hook's job (T04) — these functions answer "is
  this value valid", never "should we ask yet".
- Out: the transport (T03) and all markup (T05, T06).

**Implementation notes**

`ContactFieldName = 'name' | 'email' | 'message'`, with `ContactValues` as
`Record<ContactFieldName, string>` and `ContactErrors` as
`Partial<Record<ContactFieldName, string>>` — an absent key is a valid field, so "no error"
is not an empty string (`AGENTS.md` §4, and the same reasoning `project.types.ts` applies
to optional links).

Two functions: `validateField(field, values)` returning `string | undefined`, and
`validateContact(values)` returning `ContactErrors`. The second is the first mapped over
the union, not a second copy of the rules.

Rules, from decision 1: Name never produces an error. Email and Message are required.
Email additionally gets a **shape** check, not an RFC-complete one — a validator strict
enough to reject a real address is worse than one that lets a typo through, because the
browser's own `type="email"` is the second line and the visitor is the third.

`src/data/contact.ts` holds every string: the section eyebrow and description if any, the
three field labels, the submit label, each validation message, the success sentence, and
the error sentence. Copy is drafted, not final — mark the block
`TODO(content)` in the same shape `about.ts` uses, since these sentences are the user's
voice and not mine (`AGENTS.md` §13).

`CONTACT_EMAIL` already exists in `profile.ts` and is **not** redefined here.

**Acceptance**

- `yarn typecheck` passes, and `ContactErrors` cannot be indexed with a key outside the
  union (add a deliberate `errors.phone` locally, confirm it fails, remove it).
- `grep -n "CONTACT_EMAIL" src/data/contact.ts` returns nothing — the address is defined
  once, in `profile.ts`.
- `grep -rn "TODO(content)" src/data/contact.ts` returns the copy block.
- `grep -rniE "'(name|email|message)'" src/lib/validateContact.ts` shows the field names
  reaching the validator from the type union, not retyped as string literals in each
  branch.
- `src/lib/validateContact.ts` imports nothing from `react`, `motion/react`, or
  `@/components` (`grep -n "^import" src/lib/validateContact.ts`).
- Behaviour is asserted through the UI in T05; see Open Questions on the absence of a test
  runner.

**Traceability:** `3-style-preference.md` §5.6, §6.8 · `4-interaction-design.md` §5.7 ·
`AGENTS.md` §3, §4

---

### E13-T03 — Add the FormSubmit transport and activate the endpoint

**Depends on:** E13-T01, E13-T02

**Files:**

- Create: `src/constants/contact.ts`
- Create: `src/services/contact.service.ts`

**Commit:** `feat(contact): add the FormSubmit submission transport`

**Scope**

- In: the endpoint constant, the single function that POSTs a submission and resolves to a
  success or failure result, and completing FormSubmit's one-time activation.
- Out: validation (T02), state (T04), markup (T05). This ticket ships no UI and renders
  nothing.
- Out: hosting. `2-architecture.md` §10's Netlify deploy config and SPA redirect are E18's
  and are unaffected — that independence is the point of decision 2.

**Implementation notes**

`src/constants/contact.ts` holds `CONTACT_ENDPOINT` in `SCREAMING_SNAKE_CASE`
(`AGENTS.md` §3), pointing at `https://formsubmit.co/ajax/{token}`.

**Use the random-token endpoint, never `formsubmit.co/ajax/{your-email}`.** The
plain-address form ships `CONTACT_EMAIL` into the JS bundle a second time, in a URL, where
an address harvester finds it without parsing anything. The token is not a secret either —
it reaches the bundle on any static host — so it is a plain constant, not a `VITE_` env
var, which would only keep it out of git history and not out of the deployed JS. Say that
in a comment, so the next reader does not "fix" it into an env var believing it hides
something.

`submitContact(values)` in `src/services/contact.service.ts` POSTs a JSON body to that
endpoint and resolves to a discriminated result rather than throwing. Alongside the three
field values it sends `_subject`, `_captcha: 'false'`, the `_honey` honeypot, and
`_replyto` set from the **visitor's** email — without it, replying to the notification
replies to yourself.

**Parse the response deliberately.** FormSubmit's AJAX endpoint returns `success` as a
_string_, so a truthiness check treats `"false"` as success — the exact silent failure
`2-architecture.md` §11 forbids. Confirm the live response shape during this ticket rather
than trusting this note; that confirmation is now possible, which is the whole reason the
provider changed.

A non-`ok` response, a body that does not confirm success, and a rejected `fetch` are the
same outcome to the caller and must all produce the failure branch.

The function takes values and returns a result. It does not touch React state, does not
know about `FormStatus`, and does not read the DOM.

**Acceptance**

- **Activation completed:** the first submission triggers FormSubmit's confirmation email;
  the link is clicked before any check below is treated as meaningful.
- With `yarn dev` running, a hand-issued `fetch` with the real body resolves to the success
  branch **and the message arrives in the inbox** — the delivery confirmed, not inferred
  from a status code.
- A submission with `_honey` filled resolves without error and **does not** arrive in the
  inbox.
- A submission to a deliberately corrupted endpoint returns the failure branch and does not
  throw past the caller.
- `grep -rn "shakhlyn" src/constants/contact.ts` returns nothing — the endpoint is the
  token form, not the address form.
- `src/services/contact.service.ts` exports one function; `grep -n "useState\|useEffect"`
  on it returns nothing.

**Traceability:** `2-architecture.md` §9, §11 · `4-interaction-design.md` §5.7 ·
`AGENTS.md` §3, §5

**Risk: low**, and it was high before decision 2. Under Netlify Forms every local check
would have passed against a form submitting into nothing; here the acceptance list ends at
a message in an inbox. The one trap left is the activation step, which is why it is the
first criterion rather than a footnote.

---

### E13-T04 — Add `useContactForm` for validation timing and the submission state machine

**Depends on:** E13-T02, E13-T03

**Files:**

- Create: `src/hooks/useContactForm.ts`

**Commit:** `feat(contact): add useContactForm for validation timing and submit state`

**Scope**

- In: field values, touched tracking, the error map, the `idle → submitting →
success | error` machine, the blur/submit timing rules, and the identity of the first
  invalid field so the caller can focus it.
- Out: rendering, labels, and layout (T05). The hook returns state and handlers; it
  contains no JSX and no class strings.
- Out: the validation rules themselves (T02) and the network call's construction (T03) —
  it calls both.

**Implementation notes**

Timing is the whole reason this is a hook and not four `useState` calls in the component
(`4-interaction-design.md` §5.7):

- Typing: values update, **no validation**. Validating a keystroke punishes someone
  mid-word.
- Blur: validate that field only, and only if it has been touched.
- Submit: validate all fields; on failure set every error, mark every field touched, and
  expose which field is first-invalid **in DOM order**, not in object-key order.

The state is one discriminated union, reusing `FormState` already exported by
`FormStatus.tsx` rather than declaring a parallel one — a second union that drifts from the
component's is how a `submitting` state stops disabling the button.

**Values are never cleared on the error branch**, which is an explicit E13 criterion, and
they are not cleared on the success branch either: the success branch replaces the form,
so there is no field left to clear and resetting them is state written for nobody.

No `useEffect` at all. Everything here is event-driven; an effect synchronising state to
state is the anti-pattern `AGENTS.md` §5 names directly. If a later change does add a
subscription, it returns a cleanup function.

The hook returns the first-invalid field name; it does **not** call `.focus()`. Focusing is
a DOM concern owned by the component that holds the refs (T05).

**Acceptance**

- Typing into a field with the form mounted (verified in T05's browser pass) produces no
  error message; the hook exposes an empty error map until a blur or a submit.
- Blurring an empty Email after touching it sets exactly one error key; blurring Name
  never sets one.
- Submitting an empty form sets errors for Email and Message only, and reports `email` as
  the first invalid field.
- Submitting a valid form moves the state to `submitting` before the promise settles, and
  to `success` or `error` after — never straight from `idle`.
- On the error branch, the values object is referentially unchanged from before the
  submit.
- `grep -n "useEffect" src/hooks/useContactForm.ts` returns nothing.
- `grep -n "FormState" src/hooks/useContactForm.ts` shows it imported from
  `@/components/ui/FormStatus`, not redeclared.

**Traceability:** `4-interaction-design.md` §5.7 · `2-architecture.md` §4, §11 ·
`3-style-preference.md` §5.7 · `AGENTS.md` §5

---

### E13-T05 — Build `ContactForm` on the primitives, with honeypot and live status

**Depends on:** E13-T04

**Files:**

- Create: `src/components/sections/ContactForm.tsx`

**Commit:** `feat(contact): build the contact form with validation and submit states`

**Scope**

- In: the form markup, the three fields wired to the hook, the `_honey` honeypot,
  `FormStatus`, the submit button, focus movement to the first invalid field on a failed
  submit, and the success branch replacing the form.
- Out: the section layout, the direct-links column, and the reveal animation — all T06.
- Out: the state machine (T04) and the network call (T03).

**Implementation notes**

Fields are `TextInput` (Name, Email) and `TextArea` (Message) from E05, unchanged. Both
already own their label, the `*` for required, `aria-invalid`, and the `aria-describedby`
wiring to the message — this component passes `label`, `required`, `value`, `onChange`,
`onBlur`, and `error`, and adds no ARIA of its own.

The submit is a `primary` Button carrying the label from `contact.ts`, full width below
`lg` (`3-style-preference.md` §6.8), disabled while `submitting`.

`FormStatus` sits **above** the submit button (§5.7), takes `CONTACT_EMAIL` as
`fallbackEmail`, and takes `reducedMotion` from `useMotionVariants` so animation 11 becomes
a static "Sending…" label. Both props already exist; neither needs a change to E05.

On a failed submit, focus moves to the first invalid field using a ref map keyed by field
name. `4-interaction-design.md` §5.7 also asks that the count be announced — the live
region is `FormStatus`, which currently renders nothing in the `idle` state, so the count
needs a message and a state to carry it. See Open Questions; do not invent the sentence.

On success the form is **replaced** by the success message and focus moves to it
(§5.7) — not the form left standing with a green note beneath it.

The honeypot is a hidden `_honey` input, FormSubmit's reserved field name. **Its
accessibility treatment is Open Question 1 and this ticket does not ship until that is
answered** — the two candidate treatments differ in whether a screen reader user can fill
the trap and have their message discarded, which is not a detail to guess at.

The `<form>` carries no `action`, no `method`, and no provider attributes. There is no
no-JS submission path to fall back to, and attributes describing a mechanism that is not
in use are the kind of decoration a later reader will try to make load-bearing. Submission
is `onSubmit` with `preventDefault`, routed through `submitContact`; the service is the
only thing that knows the endpoint exists.

**Acceptance**

- Typing in any field produces no error message.
- Blurring Email with an empty value shows one error beneath it, the input carries
  `aria-invalid="true"`, and its `aria-describedby` resolves to that message's `id`
  (checked in the accessibility tree, not just the DOM).
- The Name label renders without `*`; Email and Message render with it.
- Submitting an empty form focuses Email — the next keystroke lands there without a click.
- While `submitting`, the submit button is `disabled` and the status region reads
  "Sending…".
- With OS reduced-motion enabled, the status region shows "Sending…" with no spinner
  element in the DOM.
- On a forced failure (offline, or the service stubbed to reject), the three field values
  are still present, the status region shows the failure message, and it contains a
  `mailto:` link to `CONTACT_EMAIL`.
- On success the three inputs are gone from the DOM and focus is on the success message.
- `yarn lint` passes with zero `jsx-a11y` errors.

**Traceability:** `3-style-preference.md` §5.6, §5.7, §6.8 · `4-interaction-design.md` §5.7
· `2-architecture.md` §9, §11

**Risk: high.** Four behaviours — focus movement, the success replacement, value retention
on error, and the live region — are individually simple and interact through one component.
The E07 precedent applies: verify each separately before combining.

---

### E13-T06 — Build `ContactSection` and replace the home page scaffold

**Depends on:** E13-T05

**Files:**

- Create: `src/components/sections/ContactSection.tsx`
- Modify: `src/pages/HomePage.tsx` — replace the E07-T03 `#contact` scaffold

**Commit:** `feat(contact): build the contact section and replace the home scaffold`

**Scope**

- In: the two-column layout, the direct-links column, the selectable email address, the
  animation-2 reveal, and deleting the last scaffold section from `HomePage`.
- Out: everything inside the form (T05).
- Out: the `PLACEHOLDER` constant in `HomePage.tsx` — it goes with the last scaffold that
  used it, in this same commit, since leaving it behind is dead code
  (`AGENTS.md` §11).

**Implementation notes**

`Section id="contact" title="Contact"` from E05 — it already owns the anchor,
`scroll-mt-20`, the `h2`, and the `Container`. Do not wrap the children in a second
`Container`.

Two columns at `lg` (form 60% / links 40%), stacked below
(`3-style-preference.md` §6.8). Form left, links right.

The right column is `SocialLinks` plus `CONTACT_EMAIL` **rendered as real, selectable
text** — an E13 criterion. Not an icon, not a `mailto:` label reading "Email me", not
JavaScript-revealed: a recruiter must be able to select and copy it. It may additionally be
a `mailto:` anchor; the selectable characters are the requirement.

One `whileInView` reveal on the section content with `VIEWPORT_ONCE`, matching
`AboutSection`'s shape exactly. Animation 2 and nothing more — the form fields are not
named in the §8 inventory, so they take the closed-list default and receive no child
orchestration.

`HomePage.tsx`'s comment block describes Contact as "still the E07-T03 anchor scaffold" and
must be updated in the same commit; a stale comment claiming a placeholder that no longer
exists is worse than none.

**Acceptance**

- `grep -n "PLACEHOLDER" src/pages/HomePage.tsx` returns nothing.
- `grep -n "E07-T03" src/pages/HomePage.tsx` returns nothing.
- Clicking **Contact** in the header from `/` scrolls to the section, and the next Tab
  press lands on the Name field — not at the document top.
- Clicking **Contact** from `/writing` and from `/resume` navigates to `/#contact` and
  lands on the same section.
- An external hit on `/#contact` lands on the section.
- The scroll spy marks exactly one nav item active while Contact is in view.
- At `lg` and above the form and links sit side by side; below, they stack with the form
  first.
- The email address can be selected with the mouse and copied — verified with JavaScript
  disabled.
- No horizontal page scroll at 320, 375, 768, 1024, 1440, 1920.
- With OS reduced-motion enabled the section renders in its final state immediately, fully
  visible.

**Traceability:** `3-style-preference.md` §6.8 · `4-interaction-design.md` §1, §5.7, §8 ·
`5-epic-list.md` E13

---

### E13-T07 — Verify E13 end to end and record `E13-status.md`

**Depends on:** E13-T06

**Files:**

- Create: `docs/tickets/E13-status.md`
- Modify: `docs/tickets/STATUS.md` — E13 row
- Modify: `docs/tickets/README.md` — the E13 row's Status cell, plus the progress summary
- Modify: `docs/tickets/E07-status.md` — the scaffold note, now fully discharged

**Commit:** `docs: record E13 status and close the home page scaffold`

**Scope**

- In: the full-page verification pass, both themes, both motion preferences, the six
  responsive widths, an end-to-end submission through the built UI, and the written record.
- Out: any code change. A defect found here is its own ticket, T08 onward — the E12
  precedent, where four defects reached real viewports and each got its own commit.

**Implementation notes**

`E07-status.md` says the section scaffold is "**Temporary** — E09–E13 replace it" and asks
for a re-test once real content lands. E13 is the last of those, so that line closes here
and the re-test is this ticket's keyboard pass, not a future one.

**E13 hands nothing to E18.** Under Netlify Forms this file would have recorded a deferred
criterion in the shape `E12-status.md` used for iOS Safari; FormSubmit is verifiable here,
so criterion 6 closes with a real message in a real inbox. Record the submission that
proves it — timestamp and delivery — rather than asserting it.

Record the residual, which is not a deferral: FormSubmit is a third party with no uptime
guarantee, and the section's other two contact paths (the selectable address, the social
links) are what the page falls back to.

**Acceptance**

- `yarn typecheck`, `yarn lint`, `yarn format:check`, `yarn build` all exit 0 on the final
  tree.
- Full keyboard traversal of `/`: skip link → header → nav → main → **the three fields and
  the submit button in DOM order** → social rail → footer, with a visible focus ring at
  every stop and no trap.
- The section is correct in both themes; the error message meets the `danger`-on-`surface`
  ratio in `3-style-preference.md` §2.4.
- A submission made through the built form arrives in the inbox, and its values match what
  was typed — the criterion closed here, not deferred.
- Every E13 acceptance criterion in `5-epic-list.md` is marked pass in `E13-status.md`,
  with no criterion unaddressed and none carried to another epic.
- `docs/tickets/STATUS.md` shows E13 complete and the home page carrying zero scaffold
  sections.
- `grep -n "E09–E13\|E10–E13" docs/tickets/E07-status.md` shows the note resolved rather
  than still pending.

**Traceability:** `5-epic-list.md` E13 · `4-interaction-design.md` §11 · `AGENTS.md` §11

---

## Coverage

Every E13 deliverable and acceptance criterion from `docs/5-epic-list.md`, mapped to the
tickets that satisfy it.

### Deliverables

| Deliverable                                                                                     | Tickets            |
| ----------------------------------------------------------------------------------------------- | ------------------ |
| `ContactSection` — form 60% / links 40% at `lg`, stacked below                                  | T06                |
| `ContactForm` — provider submission, honeypot, client validation                                | T01, T02, T03, T05 |
| State machine: idle → submitting → success \| error                                             | T04, T05           |
| Validation timing: none typing, on blur once touched, all on submit with focus to first invalid | T02, T04, T05      |
| `FormStatus` — `role="status" aria-live="polite"`                                               | T05 (built in E05) |
| Email address rendered as real, selectable text — copyable without JavaScript                   | T06                |

### Acceptance criteria

| #   | Criterion                                                                        | Tickets            |
| --- | -------------------------------------------------------------------------------- | ------------------ |
| 1   | Values are never cleared on error, and the error state always exposes the mailto | T04, T05           |
| 2   | No silent failures                                                               | T03, T05           |
| 3   | Errors announced, associated via `aria-describedby`, carrying `aria-invalid`     | T05, T07           |
| 4   | Required fields marked in the label text, not by colour alone                    | T01, T02, T05      |
| 5   | The honeypot is visually hidden but present, and traps a bot submission          | T03, T05 (blocked) |
| 6   | A real submission arrives — inbox, not dashboard, after T01's amendment          | T03, T07           |

Every row has at least one ticket, and every ticket appears in at least one row.

Criteria 5 and 6 are the two the epic worded around Netlify. T01 amends both in
`5-epic-list.md`; the substance of each is unchanged — a honeypot that catches bots, and a
message that actually arrives. Criterion 5 keeps its `(blocked)` marker until Open
Question 1 is answered.

---

## Risk

**E13-T05 is the highest-risk ticket, for the E07 reason:** focus movement, the success
replacement, value retention on error, and a live region are four behaviours that are easy
to get individually right and collectively wrong. The `4-interaction-design.md` §5.7 table
is written as five independent moments and will read as five independent implementations
unless they are verified separately first.

**The transport risk is gone, and it is worth recording why.** As specced against Netlify
Forms, T03's success and failure signals were identical in this environment: nothing here
scans a detection file, and the dev server answers a POST to `/` with the SPA shell at
status 200, which the service would read as success. Every local check could have passed
against a form submitting into nothing, and the real check had to wait for E18. FormSubmit
is callable from anywhere, so the same ticket now ends at a message in an inbox. **The
mechanism that made a bug invisible was the choice of provider, not the code** — a form
this small has nowhere to hide a defect except in what it cannot observe.

**Residual: a third party on a conversion path.** FormSubmit has no dashboard, no published
uptime, and no contractual guarantee. If it disappears, the form silently stops delivering
and nothing in the UI can tell. Two mitigations, both already in the plan: the section
renders the email address as selectable text and the social links beside it (T06), so the
page never depends on the form; and the transport is one function in one file, so switching
provider is a single commit that touches no component.

**The remaining unknown is the response contract**, not the integration. T03 codes against
FormSubmit's documented AJAX shape — including `success` arriving as a string rather than a
boolean — and verifies it live in the same ticket rather than trusting the note. A
truthiness check here would turn a rejected submission into a green confirmation.

Everything else in E13 is low risk: the primitives, the live region, the reduced-motion
boolean, the social links, and the email constant all exist and are verified green by E04,
E05, E06, and E07.

---

## Open Questions

**1. The honeypot's accessibility treatment — blocks T05.**
`3-style-preference.md` §6.8 says the honeypot is "visually hidden, never `display:none`…
it must remain in the accessibility tree as hidden but present per Netlify's detection".
That sentence contradicts itself, and read literally it produces a trap a screen reader
user can fall into: they hear a labelled field, fill it, and their message is silently
discarded — the exact silent failure `2-architecture.md` §11 forbids. The standard
treatment is off-screen CSS positioning plus `tabindex="-1"`, `aria-hidden="true"`, and
`autocomplete="off"`, which keeps the field in the DOM and in the submitted body while
removing it from both the tab order and the accessibility tree. The clause's stated
justification ("per Netlify's detection") no longer applies at all after decision 2 —
FormSubmit reads `_honey` from the request body and never inspects the page. **Do you want
the standard treatment?** If yes it is a §6.8 amendment; fold it into T01 rather than
taking a second docs commit, since T01 is already rewriting that section.

**2. Copy — blocks the launch content gate, not the tickets.**
No document specifies the three validation messages, the success sentence, or the failure
sentence. T02 drafts them into `src/data/contact.ts` marked `TODO(content)`, the same
treatment `about.ts` carries, so the section is buildable now and the words are yours to
replace. Do you want to supply them instead?

**3. The announced invalid-field count.**
`4-interaction-design.md` §5.7 says a failed submit should "announce the count". That needs
a sentence and a state to carry it — `FormStatus` renders nothing while `idle`, so the
count has nowhere to go today. Options: fold it into the error state's message, or add a
fourth `FormState` variant. This is unspecified, so I have not chosen; T05 flags it and
T02's copy file leaves the string out.

**4. Email validation strictness.**
Unspecified. T02 proposes a shape check only, on the reasoning that a validator strict
enough to reject a real address costs more than one that lets a typo through. Confirm, or
name the pattern you want.

**5. No test runner is installed.**
T02's validators are pure functions and the natural thing to assert directly, but this
project has no runner — E09 through E12 were verified entirely through browser checks. Do
you want `vitest` added for `src/lib/`? It is a new dev dependency, which `AGENTS.md` §13
says is your call and not mine. Until then T02's acceptance is structural and its behaviour
is asserted through the form in T05.
