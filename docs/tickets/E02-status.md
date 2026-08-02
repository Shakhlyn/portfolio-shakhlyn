# E02 — Design Tokens & Theming · Status

Tickets: [E02-tokens-theming.md](E02-tokens-theming.md) · Overview: [STATUS.md](STATUS.md)

**5 / 5 written. 2 need manual browser verification.** Legend in [STATUS.md](STATUS.md).

| Ticket  | Title                  | Status | Notes                                                             |
| ------- | ---------------------- | ------ | ----------------------------------------------------------------- |
| E02-T01 | Semantic colour tokens | ✅     | All 13 tokens, both themes. Dark theme revised to navy 2026-08-02 |
| E02-T02 | `@theme` mapping       | ✅     | Opacity modifier verified against built CSS                       |
| E02-T03 | Pre-paint theme script | 🔍     | Needs the throttled-reload flash check                            |
| E02-T04 | `useTheme` hook        | 🔍     | Needs the OS-preference and restart checks                        |
| E02-T05 | `ThemeToggle`          | ✅     |                                                                   |

## Files

```
src/styles/index.css              tokens + @theme + @custom-variant + base layer
src/constants/theme.ts            THEME_STORAGE_KEY, DARK_CLASS, PREFERS_DARK_QUERY
src/types/theme.types.ts          Theme = 'light' | 'dark'
src/hooks/useTheme.ts
src/components/layout/ThemeToggle.tsx
index.html                        pre-paint inline script
```

## Verified mechanically

The two details most likely to be subtly wrong were both checked against real build
output rather than assumed:

- **`@theme inline` swaps at runtime.** Built CSS contains
  `--color-accent:rgb(var(--accent))`, not a resolved literal. Plain `@theme` would
  have inlined the value and silently broken dark mode.
- **Opacity modifiers resolve through the runtime variable.** A temporary
  `bg-accent/30` produced
  `color-mix(in oklab, rgb(var(--accent)) 30%, transparent)` — confirming the
  space-separated RGB channel storage works as intended. Probe reverted.

## Still to verify manually (needs a browser)

These are the acceptance criteria I cannot check from a terminal. All are in E02-T03
and E02-T04:

- [ ] Dark mode + hard reload on **Slow 3G** → no white flash. This is the reason the
      inline script is non-optional, and the single most visible polish failure on a
      portfolio.
- [ ] Light mode reload → no dark flash.
- [ ] Preference survives a full browser restart.
- [ ] With **no** stored preference, changing the OS theme live-updates the page.
- [ ] With a stored preference, changing the OS theme does **not** override it.
- [ ] Visual check of the navy dark theme at real size — the ratios are computed and
      pass, but "passes AA" and "looks right" are different questions.

**Contrast is no longer a pending item.** When the dark theme moved from zinc to navy
(2026-08-02), all 12 pairs in §2.4 were **recomputed** against the WCAG 2.1
relative-luminance formula rather than transcribed. Every pair passes, and the two
tightest improved: `fg-subtle` on `bg` 5.79 → 6.49, `border-strong` on `bg`
3.10 → 3.65. The §2.4 dark column now holds the computed values.

## Implementation notes

**`useTheme` initialises from the DOM, not `localStorage`.** The pre-paint script has
already resolved the theme; re-resolving invites the two to disagree.

**The `matchMedia` listener only follows the OS while no explicit preference is
stored.** Following it after the visitor has chosen would override them, which is
worse than not following it at all. Listener is removed on unmount.

**`localStorage` access is wrapped in `try/catch` in both places** — it throws in
Safari private mode and some embedded webviews. In the inline script an unhandled
throw would blank the page before React ever loads.

**`ThemeToggle` lives in `components/layout/`, not `components/ui/`.** It owns theme
behaviour and calls a hook, which fails the `ui/` bar of "dumb, reusable, no business
logic" (`AGENTS.md` §3). The sun/moon icons are in `ui/icons/` and are content-agnostic.

**The storage key is duplicated** between `src/constants/theme.ts` and the inline
script, because the script runs before any module loads and cannot import. The
coupling is commented in both files.
