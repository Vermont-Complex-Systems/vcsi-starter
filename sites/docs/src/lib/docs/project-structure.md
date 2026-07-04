# Project Structure

What `degit` hands you, and why it's shaped that way. The `baked` template is the reference; `simple` is the same skeleton minus the example stories, and `fresh` adds a server (adapter-node, database) behind the same structure.

## The Map

```
my-project/
├── svelte.config.js         # reads the CSVs below to know what to prerender
├── scripts/new-story.js     # `npm run new-story my-slug` scaffolds a story
└── src/
    ├── routes/
    │   ├── +layout.svelte   # root: ModeWatcher + app.css, nothing else
    │   ├── (app)/           # pages WITH Nav + Footer (home, about, ...)
    │   └── [slug]/          # stories, WITHOUT Nav/Footer (full freedom)
    └── lib/
        ├── data/
        │   ├── stories.csv  # one row per story: slug, title, author, date, tags...
        │   └── members.csv  # drives /about pages
        ├── stories/         # one folder per story (see below)
        ├── components/      # shared components (template helpers like BackToHome)
        ├── styles/          # app.css: your brand's --vcsi-* token overrides
        ├── story.remote.ts  # loads a story's metadata + copy.json
        └── story-loader.ts  # resolves a slug to its Index.svelte
```

## Pages vs Stories

The route split is the structural version of the [two containers](reference). `(app)` is a SvelteKit [layout group](https://svelte.dev/docs/kit/advanced-routing#Advanced-layouts-group): the parentheses keep it out of the URL, and it exists purely to give a subset of routes a shared layout, here `Nav` and `Footer`. The `[slug]` route sits outside the group, so a story page renders with **no Nav and no Footer** — a story gets the full viewport to itself. Add back what fits: a theme-matched `<Footer theme="dark" />` at the end, the floating `BackToHome` helper as the way home.

## Anatomy of a Story

Each story is a self-contained folder in `src/lib/stories/{slug}/`:

```
scrolly-story-1/
├── components/
│   ├── Index.svelte         # the story: markup, layouts, scroll state
│   └── ScrollyPlot.svelte   # visualization components, driven by the step index
└── data/
    ├── copy.json            # the prose: {type, value} items and steps
    └── ...                  # anything that produced the data (even a Python pipeline)
```

`Index.svelte` is the contract: the `[slug]` route finds it by convention (a lazy `import.meta.glob` in `story-loader.ts`), so **adding a story is adding a folder** — no route edits. `copy.json` keeps the words out of the markup so non-coders can edit them (or sync them from SharePoint via the msgraph add-on). The `data/` folder is also the honest home for the analysis that produced the story's numbers; shipping the pipeline next to the prose is encouraged, not tolerated.

## How Data Flows

1. **`stories.csv` is the registry.** One row per story (slug, title, author, date, tags). The home page renders its cards from it.
2. **`svelte.config.js` reads the CSVs at build time** to generate the prerender entry list — that's how `adapter-static` knows `/my-story` exists without a server.
3. **`story.remote.ts`** (a SvelteKit remote function, prerendered) hands the `[slug]` page its metadata row and `copy.json`; `story-loader.ts` hands it the component. The page renders whatever the pair returns.

So publishing a story is: `npm run new-story my-slug`, fill in `Index.svelte` and `copy.json`, add the row to `stories.csv`. Everything else follows by convention.
