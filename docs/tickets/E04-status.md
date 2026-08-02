# E04 — Content Data Layer & Types · Status

Tickets: [E04-data-layer.md](E04-data-layer.md) · Overview: [STATUS.md](STATUS.md)

**5 / 5 done.** Unblocked by the CV supplied on 2026-08-02.
Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                                  | Status | Notes                                             |
| ------- | -------------------------------------- | ------ | ------------------------------------------------- |
| E04-T01 | Shared types                           | ✅     | 7 type files, no `any`                            |
| E04-T02 | `profile.ts` + `navigation.ts`         | ✅     | Real name, role, company, email, LinkedIn, GitHub |
| E04-T03 | `projects.ts`                          | ✅     | **5 projects** — 3 professional, 2 personal       |
| E04-T04 | `skills.ts` + `currentRole.ts`         | ✅     | 6 skill groups; real employer and scope           |
| E04-T05 | `resume.ts` + `writing.ts` + constants | ✅     | Except the PDF itself — see below                 |

## Content now in place

All sourced from the CV. Nothing invented.

| File                | Content                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `profile.ts`        | Shaokh Al Mahmud Shakhlyn · Software Engineer · Dhaka · Penta Global Limited · email, LinkedIn, GitHub                |
| `currentRole.ts`    | Penta Global Limited, Mar 2024 – Present, 4 scope lines, 8 stack items                                                |
| `projects.ts`       | Deal Summary & Comparison · Data Slicing · Bhoganti Web App · Meal Management System · Developer Tooling & Automation |
| `skills.ts`         | Languages · Frontend · Backend · Data · Infrastructure · Practices                                                    |
| `constants/site.ts` | Real page title and meta description                                                                                  |

## Positioning mismatch — needs your decision

**The CV contains no AI or LLM work, but `1-prd.md` is built around "full-stack and
AI engineering roles" throughout** — the personas, the value proposition, the meta
description, the recommended skills groups, and the preferred project mix ("one AI /
LLM / automation project") all assume it.

I did not invent an AI/LLM skills group to fill the gap. `skills.ts` ships the five
capability groups the CV actually supports, plus Practices, with a comment recording
why the sixth is absent.

Two honest ways forward, and this is your call:

1. **Reframe the PRD** to full-stack / product engineering, matching the CV. Touches
   `1-prd.md` §1–§3, the meta description, and the hero value proposition.
2. **Keep the AI framing** and add real AI/LLM work — a project and the corresponding
   skills — before launch. `1-prd.md` §6 already asks for one AI/LLM/automation project
   in the preferred mix, so this is the plan as written.

Until one is chosen, the site is internally consistent but positions more narrowly than
the PRD intends.

## Remaining TODO(content)

Five items, none blocking Phase 2:

```
src/data/resume.ts        the PDF itself, plus its real fileSize
src/constants/site.ts     SITE_URL (real deployed domain) — needed by E15
src/constants/site.ts     the OG image at public/og/portfolio-og.png — E15
src/data/projects.ts      project screenshots (cards omit the frame without them)
src/data/projects.ts      githubUrl for Meal Management System, once public
```

`1-prd.md` §6 permits all five as development placeholders. The resume PDF and OG image
are **not** acceptable at launch.

## Link policy applied

Client work has no public repository or demo, so `githubUrl` and `liveUrl` are
**omitted** on the three professional projects rather than pointed somewhere plausible.
Only `linux-setup-script` has a real, verified GitHub URL. Every project carries a
`caseStudySlug`, so each card still has exactly one real destination and no card
renders a dead button (`docs/2-architecture.md` §11).

**Emails differ between sources.** The CV uses `shakhlyn.sh.du@gmail.com`; the git
config uses `shakhlyn.kst@gmail.com`. The CV address is in `profile.ts` on the
assumption it is the professional one — say if that is backwards.

## Not yet written: About copy

`AboutSection` (E11) needs bio prose, and there is no `src/data/about.ts` — the file
list in `docs/2-architecture.md` §5 does not include one, and E04's tickets did not
call for it. Left for E11 rather than added as scope creep.

The CV already contains what `1-prd.md` §3 asks for: the B.Sc. in Leather Products
Engineering at University of Dhaka, and the transition into software engineering
through independent study and professional product development. That non-traditional
background is exactly the differentiator the PRD wants foregrounded.

## Files

```
src/types/profile.types.ts        ProfileType, PortraitType, SocialLinksType
src/types/project.types.ts        ProjectType, ProjectCategory, ProjectImageType
src/types/skill.types.ts          SkillGroupType
src/types/resume.types.ts         ResumeType
src/types/current-role.types.ts   CurrentRoleType
src/types/writing.types.ts        WritingPostType
src/types/navigation.types.ts     NavItemType (discriminated union)
src/data/{profile,navigation,projects,skills,currentRole,resume,writing}.ts
src/constants/site.ts             SITE_*, OG_IMAGE_PATH, scroll-spy timings
```

## Type decisions worth knowing

**Optional links are genuinely optional**, never `string | ''`. This is what makes the
no-dead-links rule enforceable by the compiler rather than by discipline.

**`ProfileType.portrait` is optional and currently absent.** Its presence is the entire
hero-layout switch (`docs/4-interaction-design.md` §5.1) — add the field when the image
exists, remove it to go back. Nothing else changes.

**`SkillGroupType` has no proficiency, level, or rating field.** Omitting it from the
type is what stops proficiency bars appearing later; they are unverifiable and read as
filler (`docs/3-style-preference.md` §6.6).

**`NavItemType` is a discriminated union on `kind: 'anchor' | 'route'`**, not
`isAnchor?: boolean`. An anchor-with-a-route-target is unrepresentable, and E07 can
pick between scroll-spy state and router-active state without guessing.

**Slugs are stored, not derived.** `ProjectType` carries both a stable `id` and a
written `slug`. Slugifying the title at runtime would silently break a shared URL the
moment a title is edited.

**Nav targets and the resume path each exist in exactly one place** —
`navigation.ts` and `resume.ts`. `NotFoundPage` already consumes `NOT_FOUND_LINKS`.

## Extra scope taken

- `src/types/navigation.types.ts` — the ticket named six type files while separately
  requiring a `NavItemType` discriminated union. Added as its own file per
  `AGENTS.md` §3 rather than smuggled into another.
- `CONTACT_EMAIL` exported from `profile.ts` as a bare address, because E13 must render
  the email as real selectable text a recruiter can copy without JavaScript, and the
  `social.email` value is a `mailto:` URL.
