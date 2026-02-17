<script>
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<svelte:head>
  <title>scrolly-kit - Getting Started</title>
</svelte:head>

<article class="page">
  <h1 class="tagline">Minimal CSS Framework<br />for visual data essays</h1>
  <p class="subheader">Built for scientists in a hurry who want to tell data stories without learning full web development. <a href="https://www.npmjs.com/package/@the-vcsi/scrolly-kit">@the-vcsi/scrolly-kit</a> provides the engine—CSS tokens and reusable components—while templates give you a ready-to-customize website. Extend with <code>sv</code> add-ons for integrations like SharePoint or <a href="https://openalex.org/">OpenAlex</a>.</p>

  <h2>Quick Start</h2>

  <h3>1. Scaffold a new project</h3>
  <CopyCodeBlock command={`npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install`} />

  
  <p class="tip"><strong>Tip:</strong> <a href="https://github.com/Rich-Harris/degit" target="_blank" rel="noopener">degit</a> copies a Git repo without its history—like cloning, but faster and cleaner. Requires <a href="https://nodejs.org/en/download" target="_blank" rel="noopener">Node.js</a>.</p>

  <h3>2. Start the dev server</h3>
  <CopyCodeBlock command={`npm run dev`} />

  <h3>3. Create a new story</h3>
  <CopyCodeBlock command={`npm run new-story my-story-name`} />

  <p>This creates a story scaffold at <code>src/lib/stories/my-story-name/</code> with:</p>
  <ul>
    <li><code>components/Index.svelte</code> - Main story component</li>
    <li><code>data/copy.json</code> - Story content data</li>
  </ul>

  <h3>4. Add optional integrations (optional)</h3>
  
  <CopyCodeBlock command={`npx sv add @the-vcsi/msgraph`} />
  <p class="tip"><strong>msgraph:</strong> Sync your <code>copy.json</code> story content from an Excel sheet on SharePoint—great for collaborative editing with non-technical teammates.</p>

  <CopyCodeBlock command={`npx sv add @the-vcsi/openalex`} />
  <p class="tip"><strong>openalex:</strong> Provide a list of researcher identifiers and build a local database with metadata about their papers and co-authors from <a href="https://openalex.org/" target="_blank" rel="noopener">OpenAlex</a>.</p>

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

  <p>See the <a href="{base}/reference">Styling</a> for all available CSS variables.</p>

  <h2>Inspiration</h2>
  <ul>
    <li><a href="https://picocss.com/" target="_blank" rel="noopener">pico.css</a> - Minimal CSS Framework for Semantic HTML. This is our core inspiration for making scrolly-kit into a library.</li>
    <li><a href="https://astro.build//" target="_blank" rel="noopener">astrojs</a> - The web framework for content-driven websites. This is our core inspiration for making cool static-site templates.</li>
    <li><a href="https://design-system.canada.ca/en/start-to-use/" target="_blank" rel="noopener">GC Design System</a> and  <a href="https://frontend.design-system.service.gov.uk/" target="_blank" rel="noopener">GOV.UK Frontend</a> - Governments have to provide services to everybody, forcing them to be super sharp in terms of accessibility. The value of this should not be overlooked.</li>
    <li><a href="https://layercake.graphics/" target="_blank" rel="noopener">Layer Cake</a> - Headless graphics framework for Svelte. On top of being awesome charting library, they showcase the beauty of simply copy-pasting well-designed components.</li>
  </ul>

  <h2>Next Steps</h2>
  <ul>
    <li><a href="{base}/reference">Styling</a> - Layout patterns and CSS variables</li>
    <li><a href="{base}/components">Components</a> - Reusable components used across templates </li>
    <li><a href="https://vcsi.cmplxsys.w3.uvm.edu/" target="_blank" rel="noopener">Examples</a> - See pedagogical stories built with scrolly-kit</li>
  </ul>
  
</article>

<style>
  .tagline {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .subheader {
    text-align: center;
    font-size: 1.1rem;
    opacity: 0.7;
    margin-bottom: 3rem;
  }

  @media (max-width: 600px) {
    .tagline {
      text-align: left;
      font-size: 1.75rem;
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .subheader {
      text-align: left;
      margin-bottom: 2rem;
    }
  }

  pre {
    margin: 1rem 0;
  }


  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }

  .tip {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.5rem;
  }
</style>
