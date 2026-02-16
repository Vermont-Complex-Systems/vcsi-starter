<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>scrolly-kit - Getting Started</title>
</svelte:head>

<article class="page">
  <h1>scrolly-kit</h1>
  <p class="lead">A toolkit for building scrollytelling stories with SvelteKit.</p>

  <h2>Quick Start</h2>

  <h3>1. Scaffold a new project</h3>
  <pre class="docs-code">npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install</pre>

  <h3>2. Start the dev server</h3>
  <pre class="docs-code">npm run dev</pre>

  <h3>3. Create a new story</h3>
  <pre class="docs-code">npm run new-story my-story-name</pre>

  <p>This creates a story scaffold at <code>src/lib/stories/my-story-name/</code> with:</p>
  <ul>
    <li><code>components/Index.svelte</code> - Main story component</li>
    <li><code>data/copy.json</code> - Story content data</li>
  </ul>

  <h2>Project Structure</h2>
  <pre class="docs-code">src/
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
    └── stories.csv      # Story metadata</pre>

  <h2>Customizing Styles</h2>

  <p>Override CSS variables in <code>src/lib/styles/app.css</code>:</p>

  <pre class="docs-code">{`:root {
  /* Brand colors */
  --vcsi-color-accent: #154734;

  /* Typography */
  --vcsi-font-sans: "Your Font", system-ui;
  --vcsi-font-serif: "Your Serif", Georgia;
}`}</pre>

  <p>See the <a href="{base}/reference">Reference</a> for all available CSS variables.</p>

  <h2>Next Steps</h2>
  <ul>
    <li><a href="{base}/reference">Reference</a> - Layout patterns and CSS variables</li>
    <li><a href="{base}/examples">Examples</a> - See real stories built with scrolly-kit</li>
  </ul>
</article>

<style>
  .lead {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  h2 {
    margin-top: 3rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  pre {
    margin: 1rem 0;
  }

  code {
    background: var(--vcsi-gray-100);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }
</style>
