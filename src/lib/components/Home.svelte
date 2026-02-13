<script>
  import DotsToImage from '$lib/components/DotsToImage.svelte';
  import StoryGrid from '$lib/components/StoryGrid.svelte';
  import CopyCodeBlock from '$lib/components/helpers/CopyCodeBlock.svelte';
  import RemoteFunctionsSection from '$lib/components/RemoteFnsExplainer.svelte';
  import { getStories } from '$lib/story.remote';
  import { ArrowRight } from '@lucide/svelte';
</script>

<!-- Hero Section -->
<section class="hero page">
  <div class="hero-inner">
    <div class="hero-text">
      <h1>Custom Research Website</h1>
      <p>A maintainable, reusable and extensible website template to tell your stories.</p>
      <div class="code-blocks">
        <CopyCodeBlock
        command="npx degit Vermont-Complex-Systems/website-template example"
        label="Main branch"
        />
        <CopyCodeBlock
          command="npx degit Vermont-Complex-Systems/website-template#annotated-boxes example"
          label="Annotated branch"
        />
        <span class="github-row">For installation details, features, and more visit <a href="https://github.com/Vermont-Complex-Systems/website-template" target="_blank" rel="noopener noreferrer" class="github-link">GitHub <ArrowRight size={16} /></a></span>
      </div>
      <div class="tip-row">
        <p>P.S. Here we provide templates for building <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/Introduction#static_site_generators">static website</a>. For a sister project providing similar templates but with <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side">server-side logic</a>, visit <a href="https://jso.cool/">jso.cool/</a>.</p>
      </div>
    </div>
    <DotsToImage imgFilePath='/octopus-swim-right.png' />
  </div>
</section>

<!-- Stories Section -->
<section class="stories page">
  {#await getStories()}
    <div class="loading">Loading stories...</div>
  {:then stories}
    <StoryGrid {stories} />
  {/await}
</section>

<!-- Why Svelte Section -->
<section class="why-svelte page">
  <h2>Why Svelte and Sveltekit?</h2>
  <div class="reasons-grid">
    <div class="reason">
      <h3>Use Any JS Library Directly</h3>
      <p>Svelte compiles to vanilla JavaScript, so you can use D3, Three.js, Observable Plot, or any library without wrappers. No React-specific ports needed.</p>
    </div>
    <div class="reason">
      <h3>Perfect for Data Visualization</h3>
      <p>Fine-grained reactivity means smooth transitions and efficient updates. Used by <a href="https://github.com/the-pudding/svelte-starter" target="_blank" rel="noopener noreferrer">The Pudding</a> and data journalism teams for interactive charts, maps, and scrollytelling, e.g. how to <a href="https://youtu.be/5IcY0biPhoQ?si=K0OobYpBgwtFcgR3" target="_blank" rel="noopener noreferrer">build a Beeswarm Chart with Svelte and D3</a>.</p>
    </div>
    <div class="reason">
      <h3>Readable Code for Collaborators</h3>
      <p>Svelte components look like HTML with superpowers. Graduate students and collaborators can contribute without deep framework knowledge.</p>
    </div>
    <div class="reason">
      <h3>As Simple as Possible, but No Simpler</h3>
      <p>The Svelte team believes in removing unnecessary complexity without sacrificing power. <a href="https://www.smashingmagazine.com/2025/01/svelte-5-future-frameworks-chat-rich-harris/" target="_blank" rel="noopener noreferrer">Read more</a> or watch <a href="https://gitnation.com/contents/svelte-5-improvements" target="_blank" rel="noopener noreferrer">Rich Harris talking about Svelte 5's North Star</a>.</p>
    </div>
    <div class="reason">
      <h3>Minimal Boilerplate</h3>
      <p>No useState, useEffect, or dependency arrays. Reactivity is built into the language. Spend time on your research, not fighting the framework.</p>
    </div>
    <div class="reason">
      <h3>Progressive Enhancement</h3>
      <p>Forms and links work without JavaScript, then get enhanced when it's available. Your app stays <a href="https://www.gov.uk/service-manual/technology/using-progressive-enhancement" target="_blank" rel="noopener noreferrer">resilient</a> while still feeling modern when JS loads.</p>
    </div>
  </div>
  <p class="svelte-cta">Learn more at <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">svelte.dev</a> or follow their <a href="https://svelte.dev/tutorial/svelte/welcome-to-svelte" target="_blank" rel="noopener noreferrer">tutorial</a></p>
</section>

<!-- Project Structure Section -->
<section class="project-structure page">
  <h2>Project Structure</h2>
  <div class="structure-layout">
    <pre class="tree-view"><code>.
└── src
    ├── data                    # CSV data for routes
    ├── lib                 
    │   ├── components/         # Reusable UI components
    │   │   ├── About.svelte
    │   │   ├── Nav.svelte
    │   │   ... 
    │   │   └── Home.svelte
    │   ├── server
    │   ├── stories             # Your scrollytelling content
    │   │   └── story-1
    │   │       ├── components/Index.svelte
    │   │       └── data/copy.json
    │   ├── story.remote.ts
    │   └── utils
    │       └── scrollReveal.ts  # Reusable javscript modules
    ├── routes                   # Pages & layouts
    │   ├── (app)
    │   │   ├── +layout.svelte   # Non-story default layouts 
    │   │   ├── +page.svelte     # Home page
    │   │   ├── about
    │   │   │   ├── [name]
    │   │   │   │   └── +page.svelte
    │   │   │   └── +page.svelte
    │   │   └── getting-started
    │   │       └── +page.svelte
    │   ├── [story]             # Dynamic story routes
    │   │   └── +page.svelte
    │   └── +layout.svelte      # Minimal layouts
    └── styles                  # Global CSS
  </code></pre>
    <div class="structure-explanations">
      <div class="explanation">
        <h3>Adding Stories</h3>
        <p>Create a folder in <code>src/lib/stories/</code> with your story name. Add an entry to <code>src/data/stories.csv</code> and your story appears in the grid and gets its own route.</p>
      </div>
      <div class="explanation">
        <h3>Story Content</h3>
        <p>Each story has a <code>data/copy.json</code> for text content and <code>components/</code> for visualizations. The scrollytelling logic is handled by shared helpers.</p>
      </div>
      <div class="explanation">
        <h3>Dynamic Routes</h3>
        <p>SvelteKit generates routes from CSV data at build time. The <code>[story]</code> folder creates pages like <code>/geo-story-1</code> automatically.</p>
      </div>
      <div class="explanation">
        <h3>Styling</h3>
        <p>Global styles in <code>src/styles/</code> define CSS variables. Components use scoped styles. Check <code>variables.css</code> for theme customization.</p>
      </div>
    </div>
  </div>
</section>

<RemoteFunctionsSection />

<style>
/* ---------------- Hero Section ---------------- */



/* 
Centering vertically the hero
Fills the full viewport (100dvh)
Uses padding-top: var(--nav-height) to create space for the fixed nav
Uses padding-bottom: 0 to make the centering symmetric 
*/
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding-top: var(--nav-height);
  padding-bottom: 0;
  box-sizing: border-box;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  width: 100%;
  max-width: var(--page-max-width);
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 55%;
}

.hero-text h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.3;
  margin: 0;
  font-family: var(--serif);
}

.hero-text p {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  margin: 0;
  color: var(--color-muted);
}

.code-blocks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.github-row {
  display: inline-flex;
  align-items: center;
  font-family: var(--sans);
  font-size: 0.9rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: var(--color-fg);
  text-decoration: none;
  margin-left: 0.25rem;
  transition: gap 0.2s ease;
}

.github-link:hover {
  gap: 0.5rem;
}

.tip-row {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  color: var(--color-muted);
}

.tip-row p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

/* Make DotsToImage grow to fill space */
.hero-inner > :global(DotsToImage) {
  flex: 1;
  height: 50%;
}

/* ---------------- Stories Section ---------------- */
.stories {
  padding: 4rem var(--page-inline-padding);
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-fg);
  opacity: 0.7;
}

/* ---------------- Why Svelte Section ---------------- */
.why-svelte {
  padding: 4rem var(--page-inline-padding);
  background: var(--color-hover);
}

.why-svelte h2 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-family: var(--serif);
  margin: 0 0 2rem 0;
  text-align: center;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.reason {
  padding: 1.5rem;
  background: var(--color-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.reason h3 {
  font-family: var(--sans);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--color-fg);
}

.reason p {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  color: var(--color-muted);
}

.svelte-cta {
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--color-muted);
}

.svelte-cta a {
  color: var(--color-fg);
  font-weight: 500;
}

/* ---------------- Project Structure Section ---------------- */
.project-structure {
  padding: 4rem var(--page-inline-padding);
}

.project-structure h2 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-family: var(--serif);
  margin: 0 0 2rem 0;
  text-align: center;
}

.structure-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: start;
}

.tree-view {
  background: #f6f8fa;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #1f2328;
}

:global(.dark) .tree-view {
  background: #161b22;
  border-color: #30363d;
  color: #e6edf3;
}

.tree-view code {
  background: none;
  padding: 0;
}

.structure-explanations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.explanation {
  padding: 1.25rem;
  background: var(--color-bg);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.explanation h3 {
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-fg);
}

.explanation p {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  color: var(--color-muted);
}

.explanation code {
  font-family: var(--mono);
  font-size: 0.8em;
  background: var(--color-hover);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  .hero-text {
    max-width: 90%;
  }
  .hero-text h1 {
    font-size: 2.5rem;
  }
  .hero-text p {
    font-size: 1.2rem;
  }
  .structure-layout {
    grid-template-columns: 1fr;
  }
  .structure-explanations {
    grid-template-columns: 1fr;
  }
}
</style>
