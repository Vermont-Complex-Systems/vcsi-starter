---
name: scrolly-kit
description: Core craft for building good scrollytelling stories with @the-vcsi/scrolly-kit — the token system, scroll-index reactivity, mobile-first sizing, story theming, and SSR safety. Load this whenever writing or editing a story, a step visualization, or copy.json in a scrolly-kit project, even if the user doesn't name scrolly-kit. (Scaffolding/workflow lives in AGENTS.md; exact props and full CSS-variable lists live in the scrolly-kit MCP.)
---

## Content is data, not markup

Story prose lives in `copy.json` as an array of `{ type, value }` items (`type`: `markdown | html | math | code | component`) — not hardcoded in the component. Render plain prose with `RenderContent`:

```svelte
<RenderContent items={data.introduction} />
```

The steps of a scrolly section are content too, rendered by `ScrollyContent` — but it's never standalone. A scrolly section is a **layout** that pairs a sticky visual with the scrolling steps, bound by one index:

```svelte
<section class="split-layout">
  <div class="sticky-panel"><ScrollyPlot {step} /></div>
  <div class="scrolly-content">
    <ScrollyContent steps={data.steps} bind:value={step} />
  </div>
</section>
```

Keeping content in `copy.json` lets a non-coder edit the story without touching Svelte. Full schema, content-item types, inline-component embedding, and multi-section stories: see [copy-json.md](references/copy-json.md).

## Drive visuals from the scroll index — derive, don't react

A scrolly section exposes one number: the active step. Flow it one way and let `$derived` compute the visual state; reach for `$effect` only for genuine external side effects.

```
$state (Index.svelte) → bind:value (ScrollyContent) → prop → $derived (visual state)
```

```svelte
// Index.svelte — one $state per scrolly section
let step = $state(undefined);   // undefined = neutral default until the reader scrolls in; use 0 to start active
```

Initialize to `undefined` for a neutral state before the reader arrives (guard with `step ?? 0`), or `0` to start active.

How you turn the step into visuals depends on the story — **don't reflexively ladder thresholds** (`step >= 1`, `step >= 2`, …); that's only the simplest case. The general workhorse is a **config object per step** (a `switch` returning a full render config on fixed geometry), with array-lookup for time-steppers and threshold flags for simple reveals. Pick what fits — see [reactive-index.md](references/reactive-index.md) for the full menu and when to use each.

## Style through the token system

scrolly-kit ships `--vcsi-*` design tokens for color, font, spacing, radius, and transition. **Any custom UI you build — a home page, a card, a legend, a nav — consumes them; it never hardcodes.** Hardcoded values drift from the brand and silently break dark mode.

```css
/* ❌ hardcoded — drifts from the theme, ignores dark mode */
.card { background: #fff; color: #333; padding: 20px; border-radius: 8px; font-family: system-ui; }

/* ✅ consume the tokens */
.card {
  background: var(--vcsi-bg);
  color: var(--vcsi-fg);
  padding: var(--vcsi-space-lg);
  border: 1px solid var(--vcsi-border);
  border-radius: var(--vcsi-radius-md);
  font-family: var(--vcsi-font-sans);
}
```

To *customize*, **override** a token on a scope rather than writing a competing rule — it cascades (story root → layout section → step) and stays consistent:

```svelte
<article class="story" style="--vcsi-story-max-width: 800px;">
  <section class="split-layout" style="--vcsi-panel-width: 60%;">…</section>
</article>
```

Reach for a token before inventing a value. The full list (`--vcsi-space-*`, `--vcsi-radius-*`, fonts, colors, transitions) is in the MCP.

## Layouts own space; components fill it — design mobile-first

The layout classes (`.split-layout`, `.fullscreen-layout`, `.triple-layout`, `.dashboard-layout`) set dimensions with `vh`/`vw`/`%`. Your chart component must **not** — it fills with `100%`, `inherit`, or a bound size. A `vh`/`vw` inside a component fights the layout and breaks containment.

- `.split-layout`: bind `clientWidth` only — the panel height is capped and the SVG `viewBox` scales.
- `.fullscreen-layout`: bind `clientWidth` **and** `clientHeight` — the panel fills the viewport.

Most readers are on a phone, so design for mobile first: below 768px every layout collapses to one column and the sticky panel becomes a full-viewport background with the steps overlaid. Make the SVG square on mobile, keep step boxes legible, and check the small screen before the wide one. Markup for each layout, the component-fill CSS recipes, and the containment rules: see [layouts.md](references/layouts.md).

## A story owns its theme

Stories are isolated from the site's dark-mode toggle by default. Opt into dark **explicitly** on the root and match the footer — don't rely on the global toggle, because a story's look shouldn't flip when the reader toggles the rest of the site.

```svelte
<article class="story" data-theme="dark">…</article>
<Footer theme="dark" />
```

For custom colors, set `--vcsi-story-bg` / `--vcsi-story-fg` rather than restyling.

## Guard browser-only code on static builds

The `baked`/`simple` templates prerender every page (`adapter-static`). A module that touches `window`/`document`/WebGL at import time (DuckDB-wasm, some d3 measurement code) crashes `npm run build`. Guard the component:

```svelte
<script>import { browser } from '$app/environment';</script>
{#if browser}<MyWebGLChart {data} />{/if}
```

Never reach for `export const ssr = false` globally — in `adapter-static` it stops remote functions from being crawled and 404s at runtime. (The `fresh`/adapter-node template is exempt.)
