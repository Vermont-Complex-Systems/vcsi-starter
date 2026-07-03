# Getting Started

A minimal CSS framework for data-driven stories, built for scientists in a hurry who want to tell data stories without learning full web development. [@the-vcsi/scrolly-kit](https://www.npmjs.com/package/@the-vcsi/scrolly-kit) provides the engine (CSS tokens and reusable components), while templates give you a ready-to-customize website. Extend with [sv](https://svelte.dev/docs/cli/overview) add-ons for integrations like SharePoint or [OpenAlex](https://openalex.org/).

## Quick Start

### 1. Scaffold a new project

```bash
npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install
```

<div class="tip">

**Tip:** [degit](https://github.com/Rich-Harris/degit) copies a Git repo without its history, like cloning but faster and cleaner (needs [Node.js](https://nodejs.org/en/download)). You own the copy: the template is a **snapshot** of the project structure, yours to edit freely. The engine, the `@the-vcsi/scrolly-kit` package, stays a normal npm dependency, so you pull in fixes and new components by bumping the package rather than re-scaffolding.

</div> 

Three templates are available: 
- [baked](https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked): a static-site generator where the content is pre-rendered, or baked, at build time. This template is full of pedagogical examples to learn about the different layouts.
- [simple](https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/simple): a minimal baked project, without all the examples. 
- [fresh](https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/fresh): a web platform with server-side logic, showcasing how dynamic websites can augment visual data-driven.

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

```bash
npx sv add @the-vcsi/scrolly-skills
```

**scrolly-skills:** Set up the AI layer for your project -- installs a [Claude Code](https://claude.com/claude-code) skill for scrolly-kit into `.claude/skills/` and configures the scrolly-kit and Svelte MCP servers in `.mcp.json`, so coding agents know how to build stories with the library.

<details>
<summary>Working with Claude: skills + MCP servers</summary>

This borrows the way [Svelte](https://svelte.dev/) itself stays legible to coding agents, using an MCP server that serves live `llms.txt` docs so an agent reads current documentation rather than a stale training snapshot. `scrolly-kit` ships the same pattern for its own components (and wires in Svelte's official MCP alongside), plus a project-local skill. Concretely, it writes three things into your project:

- **`.claude/skills/scrolly-kit/`** -- a Claude Code [skill](https://docs.claude.com/en/docs/claude-code/skills) (`SKILL.md` plus a `references/` folder: `copy-json.md`, `layouts.md`, `reactive-index.md`). Claude activates it automatically when you ask it to build a scrollytelling story, so it already knows the craft: the layouts, the `copy.json` schema, scroll-index reactivity, mobile-first sizing, story theming, and the SSR gotchas. It reads exact component props and the full token list live from the MCP (below).
- **`.claude/agents/scrolly-story-editor.md`** -- a [subagent](subagent) that handles story work in its own context window. Delegate "build/edit this story" tasks to it; see the [Subagent](subagent) page.
- **`.mcp.json`** -- configures two [MCP](https://modelcontextprotocol.io/) servers:
  - `scrolly-kit` -- runs `npx @the-vcsi/scrolly-mcp` (stdio). Exposes `list-sections` and `get-documentation`, which fetch the **live** docs from this site, so the agent reads the current component/layout reference rather than a stale snapshot.
  - `svelte` -- the official Svelte server at `https://mcp.svelte.dev/mcp` (HTTP). Provides Svelte 5 / SvelteKit documentation, plus a code autofixer and Playground links.

Restart Claude Code (or approve the newly added MCP servers when prompted) so it picks up `.mcp.json`. You can confirm they connected with `/mcp` inside Claude Code, and the scrolly-kit MCP also works as a plain CLI to sanity-check it:

```bash
npx @the-vcsi/scrolly-mcp list-sections
```

Now you're ready to create a story scaffold and ask Claude to fill it in:

```bash
npm run new-story my-first-story
```

> "Build a split-layout scrolly story in `my-first-story` that walks through three steps of a bar chart."

Claude will pull layout and component details from the scrolly-kit skill and MCP, check Svelte 5 syntax against the Svelte MCP, and edit the story files directly. Run `npm run dev` to see it.

</details>

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

See the [Tokens](tokens) page for the full `--vcsi-*` catalog, and the [Styling](reference) page for the layout patterns that consume them.

## Inspiration

`scrolly-kit` is a small, **domain-specific layout vocabulary** for scrollytelling: a handful of purpose-built classes (`.story`, `.split-layout`, `.fullscreen-layout`) you apply to your markup, with a **token-first, content-first** philosophy. You style by overriding `--vcsi-*` design tokens in your own CSS, and your content lives as data (`copy.json`, markdown) rather than hardcoded in components. It borrows liberally from work we admire:

- [pico.css](https://picocss.com/) -- Minimal CSS Framework for Semantic HTML. Core inspiration for making scrolly-kit into a library.
- [Bootstrap](https://getbootstrap.com/) -- The widely-adopted component and layout framework. Inspiration for giving scrollytelling a small vocabulary of structural classes (`.split-layout`, `.fullscreen-layout`) you drop into your markup.
- [astrojs](https://astro.build/) -- The web framework for content-driven websites. Core inspiration for cool static-site templates.
- [GC Design System](https://design-system.canada.ca/en/start-to-use/) and [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) -- Governments providing accessible services, sharp in terms of accessibility.
- [Layer Cake](https://layercake.graphics/) -- Headless graphics framework for Svelte. Showcases the beauty of copy-pasting well-designed components.

## Next Steps

- [Styling](reference) -- Layout patterns and CSS-variable scoping
- [Tokens](tokens) -- The `--vcsi-*` design tokens: colors, spacing, fonts, radius
- [Components](components-overview) -- Reusable components used across templates
- [Examples](https://vcsi.cmplxsys.w3.uvm.edu/) -- See pedagogical stories built with scrolly-kit

## P.S. Who is this library for?

As of today (2026-02-18), LLMs like `Claude Sonnet 4.6` can write you professionally-looking static websites using only vanilla HTML/CSS/JS in no time. So why bother with this library?

`Scrolly-kit` has been designed to help you understand the choices you are making when building data-driven stories. These choices are reflected in the code and documentation, built and curated to be understood by people with as little technical knowledge of web design as we find possible with today's tools.

We favor [Svelte](https://svelte.dev/) over [React](https://react.dev/) because we believe Svelte's design is closer to the fundamental tools of the web (HTML/CSS). Svelte has been shown to be more approachable to newcomers, and does not require learning a whole ecosystem to get going.

The design choices that went into `scrolly-kit` and accompanying templates include making it possible for motivated users to learn why we style the website the way we do. Inspired by talks like Josh Comeau's [How to teach CSS](https://youtu.be/ZPTVr2pS0XE?si=A1vymxJE4Dsc336p), the goal is to nurture a growing mindset where styling is fun. We acknowledge that [Vibe Coding is somewhat boring](https://cassidoo.co/post/vibe-coding-yawn/), and that keeping the craft alive is vital.

So although you can use this library to just keep building cool data-driven stories, know that if you just want to show off a scrolly story, you can vibe code it with minimal effort. This library is meant to **learn and nurture a web platform that can host tailored data stories you own**; where you can learn and improve yourself to have a space to tell your stories.
