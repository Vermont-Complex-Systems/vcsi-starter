# Custom Research Website Template

This is an experimental static site template to scaffold web applications with data-driven stories. It aims to demonstrate techniques we do at the VCSI to do visual essays.

## Installation

You will need [nodejs](https://nodejs.org/en/about) and [npm](https://docs.npmjs.com/about-npm) installed to get things going. The easiest way to install node is by following the instructions [here](https://nodejs.org/en/download). If you are familiar with the CLI, you can simply copy paste this code snippet in your terminal: 

```zsh
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.13.0".

# Verify npm version:
npm -v # Should print "11.6.2".
```

Once this is done, you should be able to simply run:

```zsh
npx degit Vermont-Complex-Systems/website-template example
```

#### Install dependencies

Make sure you're in the project directory that you just created (`example` in our case) before trying the following commands.

```
cd example
```

Then, install dependencies

```
npm i
```

#### Start the development server

```
npm run dev
```

## Learning

We use specific branch to teach about web design and interactive data viz. For example, on the branch `annotated-boxes` we show what the website looks like using colored divs. You can scaffold that project directly using:

```zsh
npx degit Vermont-Complex-Systems/website-template#annotated-boxes example
```

Similarly, we use branches with specific tags to showcase stories at differnet point in time. From example, to see the vanilla version of `scrolly-story-2`, you can do

```
npx degit Vermont-Complex-Systems/website-template#scrolly-story-2-v1.0.1 example
```

## Project structure

```zsh
├── src/
│   ├── routes/            # Pages & layouts
│   │   ├── (app)
|   |   |   ├── +layout.svelte
│   │   |   ├── +page.svelte   # Home page
│   │   |   └── about/
|   |   ├── +layout.svelte
│   │   └── [story]/       # Dynamic story routes
│   ├── lib/
│   │   ├── components/    # Reusable UI components
│   │   ├── stories/       # Your scrollytelling content
│   │   │   └── story-1
│   │   │       ├── components/Index.svelte
│   │   │       └── data/copy.json
│   │   └── story.remote.ts
│   ├── data/              # CSV data for routes
│   └── styles/            # Global CSS
├── static/                # Images, fonts, assets
└── svelte.config.js       # Route generation
```

styling flow 

```zsh
┌─────────────────────────────────────────────────────────────┐
│  app.css (Global Layouts)                                   │
│  Defines: grid structures, --panel-height, --step-max-width │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ split-layout │  │ fullscreen-    │  │ triple-layout   │  │
│  │  2-col grid  │  │  layout        │  │   3-col grid    │  │
│  └──────┬───────┘  └───────┬────────┘  └────────┬────────┘  │
└─────────┼──────────────────┼───────────────────┼────────────┘
          └──────────────────┼───────────────────┘
                  constrains │ (provides container bounds)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  ScrollyContent.svelte                                      │
│  Reads CSS variables, fills available space                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ .scrolly-content                                       │ │
│  │   .step   min-height: var(--step-height)               │ │
│  │     .step-box max-width: var(--step-max-width)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                   overrides  │ (story-specific customization)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Index.svelte   (local style)                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ .live-demo                                             │ │
│  │   --step-height: 40vh;      /* override defaults */    │ │
│  │   --step-max-width: 350px;                             │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  Composes layouts + overrides CSS variables per section     │
└─────────────────────────────┬───────────────────────────────┘
                     content  │ (data drives rendering)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  copy.json                                                  │
│       steps: [...], code: "...", highlightLines: "..."      │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Global

Particular settings provide some rough edges of the website, as put by [Josh Comeau](https://www.joshwcomeau.com/css/custom-css-reset/). 

 - Minimalist global styling in `src/styles/` directory: `app.css`, `variables.css`, `fonts.css` and `reset.css`. 
  - `Dark mode`: we favor users' preference using `ModeWatcher`, then use variables in our styling sheets to handle dark/light mode.
 - `Mobile-first philosophy:` we try as much as we can to make the webb app enjoyable on mobile, as most traffic comes from there.
 - Shared svelte components can be found in `src/lib/components`:
  - In `helpers/`, we have helper components:
    - `MarkdownRenderer.svelte` works in concert with copy.json to parse content as markdown, html, or maths.
    - `Scrolly.svelte` is the base component from The Pudding to do scrollytelling
    - `ScrollySnippets.svelte` combines the MarkdownRenderer and Scrolly components in [snippets](https://svelte.dev/docs/svelte/snippet) to facilitate reuse of established scrolly layout, i.e. content left-plot right, content top-plot underneath.

### Local

Inspired by The Pudding, each story lives in `src/lib/stories/story`:
  - Content is stored in a `data/copy.json`: when creating scrolly, key is the section name and values are list. Each entry in the list is a dictionary contains at least `type` (i.e. markdown, html, math) and `value`.
  - Stories can be found in `components/Index.svelte`. Each story contain local styling, which can sometimes need to overwrite the global styling.

## Sharepoint Site integration

You will need to setup the relevant secrets in a `.env` file. 

```zsh
mv .env.example .env
```

Then, the `.env` needs to contain the following

```
tenantId=
clientId=
clientSecret=
siteID=https://uvmoffice.sharepoint.com/sites/{sitename}/_api/site/id
```

The `tenanId`, `clientId`, `clientSecret` can be obtained by registring your Sharepoint Site via [https://entra.microsoft.com/](https://entra.microsoft.com/#home). 

## Dependencies:

 - [mode-watcher](https://github.com/svecosystem/mode-watcher): Simple utilities to manage light & dark mode in your SvelteKit app.
 - [@rollup/plugin-dsv](https://www.npmjs.com/package/@rollup/plugin-dsv?activeTab=dependents): loading CSVs, requires to be passed as argument in `vite.config.ts`.
 - [lucide](https://lucide.dev/): Beautiful & consistent icons
 - [svelte-plot](https://svelteplot.dev/): A Svelte-native visualization framework based on the layered grammar of graphics principles.
 - [svelte-exmarkdown](https://github.com/ssssota/svelte-exmarkdown): Svelte component to render markdown. 
    - [katex](https://katex.org/): for math rendering in our markdown renderer
    - [rehype](https://github.com/rehypejs/rehype): rehype is an ecosystem of plugins that work with HTML as structured data, specifically ASTs (abstract syntax trees)
