---
title: scrolly-kit - Getting Started
---

<script>
  import { base } from '$app/paths';
</script>

# Minimal CSS Framework for data-driven stories

Built for scientists in a hurry who want to tell data stories without learning full web development. [@the-vcsi/scrolly-kit](https://www.npmjs.com/package/@the-vcsi/scrolly-kit) provides the engine -- CSS tokens and reusable components -- while templates give you a ready-to-customize website. Extend with `sv` add-ons for integrations like SharePoint or [OpenAlex](https://openalex.org/).

## Quick Start

### 1. Scaffold a new project

```bash
npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install
```

**Tip:** [degit](https://github.com/Rich-Harris/degit) copies a Git repo without its history -- like cloning, but faster and cleaner. Requires [Node.js](https://nodejs.org/en/download). We currently have a single static-site generator template (the `baked` template). It is "baked" in that content is baked-in when building, or pre-rendered. We are planning to provide a `fresh` template soon, where we showcase how dynamic websites can augment visual data-driven stories with backend capabilities.

### 2. Start the dev server

```bash
npm run dev
```

### 3. Create a new story

```bash
npm run new-story my-story-name
```

This creates a story scaffold at `src/lib/stories/my-story-name/` with:

- `components/Index.svelte` -- Main story component
- `data/copy.json` -- Story content data

### 4. Add optional integrations

With any template scaffolded using `degit`, you can use Svelte's `sv` CLI to install additional extensions:

```bash
npx sv add @the-vcsi/msgraph
```

**msgraph:** Sync your `copy.json` story content from an Excel sheet on SharePoint -- great for collaborative editing with non-technical teammates.

```bash
npx sv add @the-vcsi/openalex
```

**openalex:** Provide a list of researcher identifiers and build a local database with metadata about their papers and co-authors from [OpenAlex](https://openalex.org/).

## Project Structure

```
src/
├── routes/
│   ├── (app)/           # Pages with Nav + Footer
│   │   ├── +page.svelte # Home
│   │   └── about/       # About pages
│   └── [slug]/          # Stories (no Nav/Footer)
├── lib/
│   ├── stories/         # Story components
│   ├── components/      # Shared components
│   └── styles/
│       └── app.css      # Your customizations
└── data/
    └── stories.csv      # Story metadata
```

## Customizing Styles

Override CSS variables in `src/lib/styles/app.css`:

```css
:root {
  /* Brand colors */
  --vcsi-color-accent: #154734;

  /* Typography */
  --vcsi-font-sans: "Your Font", system-ui;
  --vcsi-font-serif: "Your Serif", Georgia;
}
```

See the [Styling]({base}/reference) for all available CSS variables.

## Inspiration

- [pico.css](https://picocss.com/) -- Minimal CSS Framework for Semantic HTML. Core inspiration for making scrolly-kit into a library.
- [astrojs](https://astro.build/) -- The web framework for content-driven websites. Core inspiration for cool static-site templates.
- [GC Design System](https://design-system.canada.ca/en/start-to-use/) and [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) -- Governments providing accessible services, sharp in terms of accessibility.
- [Layer Cake](https://layercake.graphics/) -- Headless graphics framework for Svelte. Showcases the beauty of copy-pasting well-designed components.

## Next Steps

- [Styling]({base}/reference) -- Layout patterns and CSS variables
- [Components]({base}/components) -- Reusable components used across templates
- [Examples](https://vcsi.cmplxsys.w3.uvm.edu/) -- See pedagogical stories built with scrolly-kit

## P.S. Who is this library for?

As of today (2026-02-18), LLMs like `Claude Sonnet 4.6` can write you professionally-looking static websites using only vanilla HTML/CSS/JS in no time. So why bother with this library?

`Scrolly-kit` has been designed to help you understand the choices you are making when building data-driven stories. These choices are reflected in the code and documentation, built and curated to be understood by people with as little technical knowledge of web design as we find possible with today's tools.

We favor [Svelte](https://svelte.dev/) over [React](https://react.dev/) because we believe Svelte's design is closer to the fundamental tools of the web (HTML/CSS). Svelte has been shown to be more approachable to newcomers, and does not require learning a whole ecosystem to get going.

The design choices that went into `scrolly-kit` and accompanying templates include making it possible for motivated users to learn why we style the website the way we do. Inspired by talks like Josh Comeau's [How to teach CSS](https://youtu.be/ZPTVr2pS0XE?si=A1vymxJE4Dsc336p), the goal is to nurture a growing mindset where styling is fun. We acknowledge that [Vibe Coding is somewhat boring](https://cassidoo.co/post/vibe-coding-yawn/), and that keeping the craft alive is vital.

So although you can use this library to just keep building cool data-driven stories, know that if you just want to show off a scrolly story, you can vibe code it with minimal effort. This library is meant to **learn and nurture a web platform that can host tailored data stories you own**; where you can learn and improve yourself to have a space to tell your stories.
