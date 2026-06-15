# Design: Realign the `fresh` template as "dynamic simple"

**Date:** 2026-06-13
**Status:** Approved (pending spec review)

## Goal

Reshape `templates/fresh` so it mirrors `templates/simple` in structure and content,
differing **only** in its dynamic backend. Today `fresh` carries an elaborate,
half-drifted shell (a bespoke live-API dashboard, hero animation, extra routes) that
makes it neither lean nor a clean demonstration of "the dynamic version of the starter."

After this change:

- `simple` = lean **static** starter (adapter-static, `prerender()`).
- `fresh` = the same lean starter, served **dynamically** (adapter-node, `query()`).
- The richer showcases live elsewhere: `baked` demonstrates static data pipelines
  (DuckDB, geo, multiple stories); a separate, more-developed project (e.g. the survey
  story with a Drizzle database) will be the thing we point to for **dynamic database
  patterns**. Neither the survey story nor any database layer is added to `fresh`.

## Non-goals

- Do **not** port the survey story, Drizzle/libsql, `fingerprintjs`, or any DB layer
  into `fresh`. Fresh stays database-agnostic; users add a DB via `npx sv add drizzle`
  if/when they need one (the same pattern `@the-vcsi/openalex` already relies on).
- Do **not** bring baked's additional stories (geo, DuckDB, scrolly demos) into `fresh`.
- No changes to `simple` or `baked` beyond what is explicitly listed under "Incidental".

## Current state (verified)

The core routing structure is **already identical** between `simple` and `fresh`:

- `src/routes/[slug]/+page.ts` — byte-identical (load function resolves the story
  component via `import.meta.glob`).
- `src/routes/[slug]/+page.svelte` — byte-identical.

Several shell files are already identical too: `About.svelte`, `Member.svelte`,
`HeroText.svelte`, `Meta.svelte`, `styles/fonts.css`, and both `(app)/about` pages.

So the work is small and mostly **subtractive**.

## Changes

### A. Keep dynamic (the intended differences from `simple` — leave as-is)

| File | Fresh keeps | Simple has |
|------|-------------|-----------|
| `package.json` | `@sveltejs/adapter-node`, `"preview": "node build"` | `adapter-static`, `vite preview` |
| `svelte.config.js` | `adapter-node`, no `prerender.entries` | `adapter-static` + prerender entries |
| `src/lib/story.remote.ts` | `query()` for all four functions | `prerender()` |
| `src/routes/[slug]/+page.ts` / `+page.svelte` | unchanged (already == simple) | same |

### B. Align to `simple` (shell)

- `src/lib/components/Home.svelte` — adopt simple's version (drops the `DotsToImage`
  hero). Also remove the dead `.hero-inner > :global(DotsToImage)` CSS rule that simple
  itself still carries (it references a component name, not a selector, so it matches
  nothing).
- `src/lib/styles/app.css` — align to simple's (the diff is only comment ordering and a
  docs URL; standardize on `https://vermont-complex-systems.github.io/vcsi-starter/reference`,
  which matches the MCP server's default docs base URL).
- `src/lib/stories/example-story-1/` — copy simple's story wholesale
  (`components/Index.svelte`, `components/ScrollyPlot.svelte`, `data/copy.json`,
  `data/data.csv`).
- `src/lib/data/stories.csv` — replace with a single `example-story-1` row (matching
  simple's).

### C. Delete (fresh-only bloat that `simple` does not have)

- `src/lib/stories/dashboard-1/` — entire directory, including `academic.remote.ts`,
  `AppSidebar.svelte`, `DataTable.svelte`, `SectionCards.svelte`,
  `EmbeddingDotPlot.svelte`, `Grid.svelte`, `Legend.svelte`, `Index.svelte`,
  `data/copy.json`, `README.md`.
- `src/lib/components/DotsToImage.svelte`
- `src/lib/components/Home.RemoteFnsExplainer.svelte`
- `src/lib/data/vlog.csv`
- `src/routes/(app)/getting-started/` — entire route, and its nav link in
  `src/routes/(app)/+layout.svelte` (simple's `<Nav />` has no links prop; fresh's
  links to `/about` and `/getting-started`). After deletion, `(app)/+layout.svelte`
  matches simple's.

### D. Drop `@tanstack/svelte-query`

It is used only by the `QueryClientProvider` in `src/routes/+layout.svelte`, which
exists solely for the deleted `dashboard-1`. Remove:

- the `@tanstack/svelte-query` dependency in `package.json`,
- the `QueryClient`/`QueryClientProvider` import and wrapper in
  `src/routes/+layout.svelte` (leaving it equal to simple's clean root layout),
- the `ssr.noExternal: ['@tanstack/svelte-query']` and the corresponding
  `optimizeDeps` entry in `vite.config.ts`.

Fresh still demonstrates "dynamic" via `query()` remote functions, which need no
client-side cache library.

### E. Open item for spec review — `StoryGrid.svelte`

Fresh's `StoryGrid.svelte` is **more developed** than simple's: it groups stories by
`level` with section headings, where simple's is a flat grid. This is a harmless
superset that works fine with a single story and does not affect the "lean structure"
goal.

**Recommendation: keep fresh's `StoryGrid.svelte` as-is** (do not downgrade to simple's
flat version). Flagged here because it deviates from the strict "mirror simple" framing.
If you'd rather have exact parity with simple, we downgrade it instead.

## Incidental (optional, low-risk)

These are pre-existing issues noticed during analysis, not required by the goal:

- `simple/src/lib/components/Home.svelte` carries the same dead `:global(DotsToImage)`
  CSS rule. We could remove it there too while we're fixing it in fresh. (Out of scope
  unless desired.)

## Verification

After the change:

1. `templates/fresh` file tree equals `templates/simple`'s, except:
   - the dynamic config files (A), and
   - `StoryGrid.svelte` (if we keep fresh's enhanced version per E).
2. `npm run check` in `templates/fresh` passes with 0 errors (requires the
   `@the-vcsi/scrolly-kit` package to be built first).
3. `npm run build` in `templates/fresh` succeeds with `adapter-node`.
4. `npm run new-story <slug>` still scaffolds a working story (the script is already
   identical across all three templates).
5. No remaining import references to deleted files
   (`DotsToImage`, `Home.RemoteFnsExplainer`, `svelte-query`, `getting-started`).
