# Pages — the non-story content

Pages are everything with Nav and Footer: home, about, and whatever the site grows. They live in the `(app)` route group and use the `.page` container (centered, width-constrained). Stories deliberately have neither — that split is structural (MCP section `project-structure`).

Pages are **site-shaping work**: adding or restructuring one changes what the site *is*, not just what it shows. So the intake rule applies with extra force — propose the page and its content source, get a yes, then build.

## Start with the home page

The simplest customization, and where to start. The home page is template-local code the user owns (`src/routes/(app)/+page.svelte` delegating to components in `$lib/components/`, e.g. `Home.svelte` with a `StoryGrid`). Editing copy, reordering sections, or removing the demo material is ordinary Svelte editing — no new patterns needed. Style with the `.page` container and `--vcsi-*` tokens (MCP sections `reference` and `tokens`); never hardcode theme values.

## The CSV + grid pattern

When the user wants a page listing *things* — team members, publications, datasets, talks — the templates already model the shape twice, and it generalizes:

```
$lib/data/things.csv          the registry: one row per thing, first column is the id
      │
$lib/story.remote.ts          a remote function imports the CSV (vite's dsv plugin
      │                       parses it) and returns rows
      │
(app)/things/+page.svelte     a grid of cards, {#each} over the rows
      │
(app)/things/[id]/+page.svelte   optional detail page per row
      │
svelte.config.js              reads the CSV at build time and adds /things/{id}
                              to prerender entries, so static builds know the routes
```

Concretely in the templates: `stories.csv` → `StoryGrid` on the home page, and `members.csv` → the about page's `members-grid` → `/about/{name}` detail pages. To add a new listing, copy the members chain and rename; the craft is in keeping the CSV the single source of truth (edit a row, the site follows) rather than hardcoding cards in markup.

Two cautions carried over from the docs: CSV fields containing commas must be double-quoted, and every new `[param]` route needs its prerender entries wired in `svelte.config.js` or the static build won't know the pages exist.

## Keep the user in the loop

Whether a site needs a members page, and what belongs in it, is the user's call, not an inference. "We are a lab" does not imply "build /about/members". Propose the page, name its registry (a CSV they will maintain), show one card's worth of layout, and get a yes — the same propose/confirm/build loop as stories. Content for these pages (bios, titles) comes from the user; do not fabricate placeholder people beyond what the template ships.
