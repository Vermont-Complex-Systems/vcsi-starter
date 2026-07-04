# scrolly-kit + Vite, no SvelteKit

A minimal Vite + Svelte 5 app consuming `@the-vcsi/scrolly-kit` **from npm** — no
SvelteKit, no template. It exists to prove (and keep proving) that the engine is a
plain Svelte library, and as a copy-paste starting point if you want scrollytelling
inside an existing Vite app.

```bash
npm install
npm run dev
```

This is deliberately **not a template**: no prerendering, no story registry, no SEO
tags, no AI layer. That publishing machinery is what the real templates add — see
the [Project Structure docs](https://vermont-complex-systems.github.io/vcsi-starter/docs/project-structure).

It is intentionally *outside* the monorepo's npm workspaces, so `npm install` here
resolves scrolly-kit from the registry exactly like an external user would.

## Structure

```
src/
├── App.svelte        # the "story": layout sections, step content, one index per section
├── BarChart.svelte   # visualization component: receives `step` as a read-only prop
└── PulseDot.svelte   # same contract, simplest possible visual
```

The same shape as a template story (`components/Index.svelte` + visualization
components): the story owns the scroll state, visuals derive everything from
the step index they're handed.
