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
