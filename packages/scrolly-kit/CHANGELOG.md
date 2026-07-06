# Changelog

All notable changes to `@the-vcsi/scrolly-kit`. Follows [Keep a Changelog](https://keepachangelog.com/) and, from 0.1.0 on, semver.

## [Unreleased]

### Fixed

- **StoryHeader mobile title size.** A `max-width: 768px` media query forced the title to a fixed `4rem` (64px), making phone titles larger than desktop; removed so the responsive heading tokens apply everywhere (~29px on a 375px phone). Subtitle override removed for the same reason, and the component's unprefixed phantom variables (`--font-size-medium`/`--font-size-small`) replaced with real `--vcsi-font-size-*` tokens.

## [0.2.1] - 2026-07-03

### Fixed

- **`@lucide/svelte` is now a declared dependency.** It was resolving through monorepo hoisting only, so truly external consumers (and the Svelte Playground, which found the bug) could fail to resolve the icons used by Nav, Footer, ThemeToggle, and the dashboard controls. Pinned `^0.562.0`: lucide 1.x removed the brand icons Footer uses.

### Removed

- `@the-vcsi/scrolly-skills` dropped from dependencies. Nothing in the library imports it (the AI add-on is installed via `npx sv add`); it was shipping the whole add-on into every consumer's node_modules.

## [0.2.0] - 2026-07-03

The package is now **SvelteKit-free**: nothing imports `$app/*`, the only peer dependency is `svelte ^5`, and the library works in a plain Vite + Svelte app (verified). The templates remain SvelteKit apps; the engine no longer assumes it.

### Breaking

- **`Meta` removed from the package.** SEO tags are site-specific by nature, so `Meta` is template-local now (the templates ship a wrapper over [svelte-meta-tags](https://github.com/oekazuma/svelte-meta-tags) with their site defaults). Migration: replace `import { Meta } from '@the-vcsi/scrolly-kit'` with a local component — copy `src/lib/components/Meta.svelte` from any template. `MetaProps` is gone too.
- **`MarkdownRenderer` no longer auto-prefixes SvelteKit's base path.** Absolute `/links` and `/images` in markdown are left as-is unless you pass the new `base` prop (`<MarkdownRenderer {text} base={base} />` with `base` from `$app/paths`). Only affects subpath deploys (GitHub Pages under `/repo`); no known consumer sets a base path today.

### Changed

- `scrollReveal` uses a `typeof window` check instead of `$app/environment`.
- `@sveltejs/kit` removed from peer dependencies.

## [0.1.0] - 2026-07-03

### Changed (may affect existing sites)

- **Paragraphs no longer pin `font-size`/`line-height`.** Text properties are set once on `body` and inherit, so setting `font-size` on any container now cascades into its paragraphs as expected. Sites that relied on `<p>` ignoring a container's font-size will see those paragraphs resize.
- **Tables get default styling.** Bare `<table>` now renders GitHub-ish (collapsed borders, cell padding, shaded header) via the semantic tokens, at `0.875em` with `max-width: 100%` so wide tables stay inside their container, and `.story > table` joins the centered prose column. Previously tables were unstyled; override with your own rules if you had custom table CSS.
- **Step contrast fixed (WCAG AA).** Light stories: `--vcsi-story-step-fg-inactive` `#ccc` → `gray-600` (1.5:1 → 4.75:1). Dark stories: full step palette rework — box shadows are invisible on dark, so the active box is now lighter than the story background (pops) and the inactive darker (recedes): active `#43484c`/`#f2f2f2` (8.3:1), inactive `#24262a`/`#9aa0a4` (5.7:1). Override the tokens to restore the old look.
- **`--vcsi-muted` now flips with dark mode** (gray-600 light / gray-400 dark). Previously it stayed gray-600 in dark mode at a failing 3.4:1.
- **Body page layout moved** from `typography.css` to `layouts.css` ("app shell": flex column + `main { flex: 1 }`). No behavior change; import `all.css` and nothing differs.

### Fixed

- **Story theme isolation no longer leaks links.** `--vcsi-link` (and the new `--vcsi-muted` / `--vcsi-code-line-number`) were missing from the `.story` isolation and `[data-theme="dark"]` token lists, so the global dark toggle recolored links inside stories.
- **ThemeToggle** announces its state to screen readers (dynamic label: "Switch to light/dark mode").
- **NavMenu** sets `inert` on `<main>` while open (was `aria-hidden`, which still allowed keyboard focus to Tab out of the menu into the page underneath).

### Added

- **Reduced-motion support.** Under `prefers-reduced-motion: reduce`, the transition tokens collapse to `0ms` and a global rule in `reset.css` neutralizes keyframe animations, Svelte transitions, and smooth scrolling.
- **Tokens:** `--vcsi-code-line-number` (theme-aware; line numbers previously failed dark mode), `--vcsi-code-highlight-border`, and `--vcsi-nav-logo-height` / `--vcsi-nav-logo-height-mobile` (size wordmark-shaped Nav logos; defaults unchanged).
- **Dev playground.** `npm run dev` inside the package serves a kitchen sink (`/`) and story playground (`/story`) showing the raw, untweaked defaults; package CSS edits hot-reload.
- **Visual smoke tests.** `npm run test:visual` screenshots the playground (both themes, desktop + mobile) against committed baselines, including a theme-isolation check: the story page must render identically under global light and dark mode, so any future token leak fails the suite.

## [0.0.11] and earlier

Pre-changelog. See git history.
