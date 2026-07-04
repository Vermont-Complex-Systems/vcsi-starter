# Why SvelteKit?

If you are a scientist who wants to publish a data story, you already have tools that promise this: Quarto, Observable, or the React framework your web-developer colleague swears by. So the fair question is not "is scrolly-kit good" but "why this instead of what I know". This page is our honest answer, including the cases where you should use something else.

## The Short Version

Three reasons, in order of importance:

1. **You own the platform.** Your site is a folder of files you control, deployable anywhere static files go (GitHub Pages included). No hosted service to outgrow, no subscription, no export button.
2. **What you learn transfers.** Svelte stays close to the web's own languages: HTML, CSS, and JavaScript. Learning it means learning the web, not a walled garden.
3. **Your design decisions are encoded, not tribal.** The look, the layouts, and the craft rules live in tokens, CSS, and documentation that both your colleagues *and your AI coding assistant* can read. A scaffolded project comes with the house style built in.

## The Alternatives, Honestly

**Quarto and Closeread.** If your story is prose plus figures from R or Python, with scroll-triggered reveals, [Closeread](https://closeread.dev/) is genuinely good and meets you inside the notebook workflow you already have. Use it. You outgrow it when the visualization itself needs to be interactive (respond to clicks, filters, and scroll position at once), when you want one *site* hosting many stories with a shared design, or when the document model starts fighting you. That boundary is where scrolly-kit starts.

**Observable.** The best place to learn D3, and Observable Framework shares real DNA with our approach (markdown, static output, data loaders). Two differences matter to us: your work lives in their model rather than in standard web components you can take anywhere, and there is no design system to make story five look like story one. If you are exploring data, Observable is wonderful. If you are building your lab's publication venue, ownership wins.

**React and friends.** The industry default, and your collaborators may already know it. We chose Svelte instead for one main reason: distance from the platform. React teaches you React (its state model, its ecosystem, its build tooling). Svelte compiles away, leaving HTML and CSS you can inspect and reason about. For people whose main job is science, not front-end engineering, the shorter distance between what you write and what the browser does keeps the craft learnable. There is also a practical scrollytelling reason below.

## Why Svelte, Specifically

Scrollytelling has a simple reactive core: the reader's scroll position becomes one number (the active step), and the visualization derives its state from that number. Svelte 5 expresses this almost literally:

```svelte
let step = $state(0);                          <!-- from the scroll -->
let view = $derived(configs[step ?? 0]);       <!-- what to show -->
```

No subscriptions, no effect hooks, no re-render mental model. The [vite-minimal example](https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/examples/vite-minimal) shows the whole pattern in three small files. And d3 slots in exactly where it is strongest (scales and math) while Svelte renders the SVG declaratively, so you never write imperative DOM manipulation.

## Why SvelteKit On Top

The engine itself does not require SvelteKit. As of 0.2.0, `@the-vcsi/scrolly-kit` is a plain Svelte library that runs in a bare Vite app. SvelteKit is the **publishing layer** the templates add, and it earns its place three ways:

- **Prerendering.** Your stories become plain HTML files at build time, so hosting is free and fast (GitHub Pages), and readers without JavaScript still get content.
- **Routing that matches the mental model.** Pages (with Nav and Footer) and stories (full-viewport, no frame) are different route groups, so the separation of concerns is structural, not a convention you must remember.
- **A server when you need one.** The `fresh` template adds databases and server logic behind the same structure, so growing up does not mean starting over.

## Docs Your AI Can Read

This part is newer, and we think it matters most going forward. Coding assistants can already produce a passable scrollytelling page from scratch. What they produce is generic: default fonts, ad-hoc CSS, none of your design language, and mistakes you cannot debug because nobody understands the code.

scrolly-kit takes the opposite bet: encode the craft so agents inherit it. The design tokens, the layout contracts, and the gotchas live in documentation that is simultaneously a human website and a machine-readable feed (every page doubles as `llms.txt`). A scaffolded project wires in an [MCP server](https://modelcontextprotocol.io/) that serves those docs live, plus a skill that teaches the durable patterns. Ask your assistant to build a story and it uses *your* layout system, *your* tokens, and the correct step-index patterns, because the same source of truth that taught you teaches it.

Vanilla HTML gives an AI nothing to stand on. A design system gives it rails.

## When Not to Use This

- Your story is a document with figures and scroll reveals, and you live in R or Python: use Quarto with Closeread.
- You want zero setup and are exploring, not publishing: use Observable or the Svelte Playground.
- Your team is React-fluent and maintains other React products: the consistency may be worth more than our advantages.
- You need a CMS with editors, workflows, and previews: this is a code-first tool with a JSON escape hatch for prose, not a CMS.

If you are still here: you want a platform you own, stories that share a design language, skills that outlive this project, and an AI layer that makes both humans and machines fluent in your house style. That is the thing we are building.
