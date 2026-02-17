<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';

  const sourceBase = 'https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/components';

  // Component documentation data
  const components = {
    Scrolly: {
      name: 'Scrolly',
      description: 'Base scroll detection using IntersectionObserver. Tracks which child element is most in view and updates the `value` binding. Used internally by ScrollyContent, but can be used directly for custom layouts.',
      category: 'Scrolling',
      props: [
        { name: 'value', type: 'number', default: '—', description: 'Index of most visible child (bindable)' },
        { name: 'root', type: 'Element | null', default: 'null', description: 'IntersectionObserver root element' },
        { name: 'top', type: 'number', default: '0', description: 'Top margin offset in pixels' },
        { name: 'bottom', type: 'number', default: '0', description: 'Bottom margin offset in pixels' },
        { name: 'increments', type: 'number', default: '100', description: 'Number of threshold steps' }
      ],
      usage: `<script>
  import { Scrolly } from '@the-vcsi/scrolly-kit';
  let index = $state(0);
<\/script>

<Scrolly bind:value={index}>
  <div>Step 1</div>
  <div>Step 2</div>
  <div>Step 3</div>
</Scrolly>

<p>Current step: {index}</p>`
    },

    ScrollyContent: {
      name: 'ScrollyContent',
      description: 'Scrollytelling content container with styled step boxes. Renders an array of content steps as scrollable boxes that trigger index changes as they enter the viewport.',
      category: 'Scrolling',
      props: [
        { name: 'steps', type: 'ContentItem[]', default: '—', description: 'Array of content items with type and value' },
        { name: 'value', type: 'number', default: '—', description: 'Current step index (bindable)' },
        { name: 'topSpacer', type: 'boolean', default: 'true', description: 'Add spacer before first step' },
        { name: 'bottomSpacer', type: 'boolean', default: 'true', description: 'Add spacer after last step' },
        { name: 'contentRenderer', type: 'Snippet', default: '—', description: 'Custom snippet for rendering step content' }
      ],
      cssVars: [
        { name: '--spacer-height', default: '65vh', description: 'Height of top/bottom spacers' },
        { name: '--step-height', default: '90vh', description: 'Vertical space per step' },
        { name: '--step-max-width', default: '600px', description: 'Max width of step box' },
        { name: '--step-padding', default: '1rem', description: 'Padding inside step box' }
      ],
      usage: `<script>
  import { ScrollyContent } from '@the-vcsi/scrolly-kit';

  let index = $state(0);
  const steps = [
    { type: 'markdown', value: '## Introduction' },
    { type: 'markdown', value: 'Step **two** with emphasis' },
    { type: 'math', value: '$E = mc^2$' }
  ];
<\/script>

<section class="split-layout">
  <div class="sticky-panel">
    <MyVisualization {index} />
  </div>
  <ScrollyContent {steps} bind:value={index} />
</section>`
    },

    StoryHeader: {
      name: 'StoryHeader',
      description: 'Story header with title, subtitle, authors, and date. Provides consistent styling for story introductions.',
      category: 'Layout',
      props: [
        { name: 'title', type: 'string', default: '—', description: 'Story title (required)' },
        { name: 'subtitle', type: 'string', default: '—', description: 'Optional subtitle' },
        { name: 'authors', type: 'Author[]', default: '—', description: 'Array of { name, url? }' },
        { name: 'date', type: 'string', default: '—', description: 'Publication date string' },
        { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
      ],
      usage: `<script>
  import { StoryHeader } from '@the-vcsi/scrolly-kit';
<\/script>

<StoryHeader
  title="Climate Change in Vermont"
  subtitle="A data-driven exploration"
  authors={[
    { name: "Alice Smith", url: "https://..." },
    { name: "Bob Jones" }
  ]}
  date="February 2025"
/>`
    },

    Nav: {
      name: 'Nav',
      description: 'Responsive navigation bar with logo, links, and mobile hamburger menu. Includes theme toggle by default.',
      category: 'Layout',
      props: [
        { name: 'logoSrc', type: 'string', default: 'VCSI logo', description: 'Logo image source' },
        { name: 'logoAlt', type: 'string', default: "'VCSI Logo'", description: 'Logo alt text' },
        { name: 'links', type: 'NavLink[]', default: '—', description: 'Array of { href, label }' },
        { name: 'showThemeToggle', type: 'boolean', default: 'true', description: 'Show dark mode toggle' }
      ],
      usage: `<script>
  import { Nav } from '@the-vcsi/scrolly-kit';
<\/script>

<Nav
  links={[
    { href: '/about', label: 'About' },
    { href: '/stories', label: 'Stories' }
  ]}
/>`
    },

    Footer: {
      name: 'Footer',
      description: 'Site footer with logo, social links, and copyright. Supports light/dark theme forcing for stories.',
      category: 'Layout',
      props: [
        { name: 'theme', type: "'light' | 'dark'", default: '—', description: 'Force light (UVM green) or dark theme' },
        { name: 'logoSrc', type: 'string', default: 'UVM logo', description: 'Logo image source' },
        { name: 'socialLinks', type: 'SocialLink[]', default: 'VCSI socials', description: 'Social media links' },
        { name: 'bottomLinks', type: 'BottomLink[]', default: '—', description: 'Footer bottom row links' },
        { name: 'copyright', type: 'string', default: 'VCSI copyright', description: 'Copyright text' }
      ],
      usage: `<script>
  import { Footer } from '@the-vcsi/scrolly-kit';
<\/script>

<!-- Respects global dark mode -->
<Footer />

<!-- Force light theme (UVM green) -->
<Footer theme="light" />

<!-- Force dark theme -->
<Footer theme="dark" />`
    },

    MarkdownRenderer: {
      name: 'MarkdownRenderer',
      description: 'Renders markdown text with KaTeX math support and syntax highlighting. Supports inline and block math expressions.',
      category: 'Content',
      props: [
        { name: 'text', type: 'string', default: '—', description: 'Markdown text to render' }
      ],
      usage: `<script>
  import { MarkdownRenderer } from '@the-vcsi/scrolly-kit';
<\/script>

<MarkdownRenderer text="## Hello **World**" />

<!-- With math -->
<MarkdownRenderer text="The equation $E = mc^2$ shows..." />`
    },

    RenderTextContent: {
      name: 'RenderTextContent',
      description: 'Renders a single content item based on its type. Supports html, markdown, math, and code types.',
      category: 'Content',
      props: [
        { name: 'item', type: 'ContentItem', default: '—', description: 'Content item with type and value' }
      ],
      types: ['html - Raw HTML', 'markdown - Markdown text', 'math - Math expressions (centered, KaTeX)', 'code - Code blocks with syntax highlighting'],
      usage: `<script>
  import { RenderTextContent } from '@the-vcsi/scrolly-kit';
<\/script>

<RenderTextContent item={{ type: 'markdown', value: '## Hello' }} />

<RenderTextContent item={{
  type: 'code',
  value: 'const x = 1;',
  language: 'javascript'
}} />`
    },

    CopyCodeBlock: {
      name: 'CopyCodeBlock',
      description: 'Copyable code block with one-click clipboard support. Shows a checkmark when successfully copied.',
      category: 'Content',
      props: [
        { name: 'command', type: 'string', default: '—', description: 'The text to display and copy (required)' },
        { name: 'label', type: 'string', default: "''", description: 'Optional label above the code block' }
      ],
      usage: `<script>
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
<\/script>

<CopyCodeBlock command="npm install @the-vcsi/scrolly-kit" />

<CopyCodeBlock
  command="npx degit Vermont-Complex-Systems/vcsi-starter my-project"
  label="Scaffold a new project"
/>`,
      hasLiveExample: true
    },

    CodeBlock: {
      name: 'CodeBlock',
      description: 'Syntax-highlighted code display with optional line numbers and language badge.',
      category: 'Content',
      props: [
        { name: 'code', type: 'string', default: '—', description: 'Code content to display' },
        { name: 'language', type: 'string', default: '—', description: 'Language for syntax highlighting' },
        { name: 'showLineNumbers', type: 'boolean', default: 'false', description: 'Show line numbers' }
      ],
      usage: `<script>
  import { CodeBlock } from '@the-vcsi/scrolly-kit';
<\/script>

<CodeBlock
  code="const x = 1;"
  language="javascript"
  showLineNumbers
/>`
    },

    ThemeToggle: {
      name: 'ThemeToggle',
      description: 'Dark/light mode toggle button. Works with mode-watcher for persistent theme preference.',
      category: 'UI Controls',
      props: [],
      usage: `<script>
  import { ThemeToggle } from '@the-vcsi/scrolly-kit';
<\/script>

<ThemeToggle />`
    },

    SimpleSelect: {
      name: 'SimpleSelect',
      description: 'Minimal dropdown select component with clean styling.',
      category: 'UI Controls',
      props: [
        { name: 'options', type: 'string[]', default: '—', description: 'Array of option values' },
        { name: 'value', type: 'string', default: '—', description: 'Selected value (bindable)' },
        { name: 'label', type: 'string', default: '—', description: 'Optional label' }
      ],
      usage: `<script>
  import { SimpleSelect } from '@the-vcsi/scrolly-kit';
  let selected = $state('option1');
<\/script>

<SimpleSelect
  options={['option1', 'option2', 'option3']}
  bind:value={selected}
  label="Choose an option"
/>`
    },

    SimpleToggle: {
      name: 'SimpleToggle',
      description: 'Simple on/off toggle switch with label support.',
      category: 'UI Controls',
      props: [
        { name: 'checked', type: 'boolean', default: 'false', description: 'Toggle state (bindable)' },
        { name: 'label', type: 'string', default: '—', description: 'Optional label' }
      ],
      usage: `<script>
  import { SimpleToggle } from '@the-vcsi/scrolly-kit';
  let enabled = $state(false);
<\/script>

<SimpleToggle bind:checked={enabled} label="Enable feature" />`
    },

    Tooltip: {
      name: 'Tooltip',
      description: 'Hover tooltip for providing additional context on elements.',
      category: 'UI Controls',
      props: [
        { name: 'text', type: 'string', default: '—', description: 'Tooltip text content' },
        { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tooltip position' }
      ],
      usage: `<script>
  import { Tooltip } from '@the-vcsi/scrolly-kit';
<\/script>

<Tooltip text="More information here">
  <button>Hover me</button>
</Tooltip>`
    },

    Meta: {
      name: 'Meta',
      description: 'SEO meta tags for social sharing (Open Graph, Twitter cards).',
      category: 'Utilities',
      props: [
        { name: 'title', type: 'string', default: '—', description: 'Page title' },
        { name: 'description', type: 'string', default: '—', description: 'Page description' },
        { name: 'image', type: 'string', default: '—', description: 'Social sharing image URL' },
        { name: 'url', type: 'string', default: '—', description: 'Canonical URL' }
      ],
      usage: `<script>
  import { Meta } from '@the-vcsi/scrolly-kit';
<\/script>

<Meta
  title="My Story"
  description="An interactive exploration of data"
  image="/og-image.png"
  url="https://example.com/story"
/>`
    },

    Spinner: {
      name: 'Spinner',
      description: 'Loading spinner indicator for async operations.',
      category: 'Utilities',
      props: [
        { name: 'size', type: 'number', default: '24', description: 'Spinner size in pixels' },
        { name: 'color', type: 'string', default: "'currentColor'", description: 'Spinner color' }
      ],
      usage: `<script>
  import { Spinner } from '@the-vcsi/scrolly-kit';
<\/script>

{#if loading}
  <Spinner size={32} />
{/if}`
    },

    ScrollIndicator: {
      name: 'ScrollIndicator',
      description: 'Animated scroll-down indicator arrow for prompting users to scroll.',
      category: 'Utilities',
      props: [],
      usage: `<script>
  import { ScrollIndicator } from '@the-vcsi/scrolly-kit';
<\/script>

<ScrollIndicator />`
    }
  };

  let slug = $derived($page.params.slug);
  let component = $derived(components[slug]);
</script>

<svelte:head>
  <title>{component?.name ?? 'Component'} - scrolly-kit</title>
</svelte:head>

{#if component}
  <div class="component-page">
    <nav class="breadcrumb">
      <a href="{base}/components">Components</a>
      <span class="separator">/</span>
      <span class="current">{component.name}</span>
    </nav>

    <header>
      <span class="category-badge">{component.category}</span>
      <h1>{component.name}</h1>
      <p class="description">{component.description}</p>
    </header>

    {#if component.props && component.props.length > 0}
      <section>
        <h2>Props</h2>
        <table class="props-table">
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            {#each component.props as prop}
              <tr>
                <td><code>{prop.name}</code></td>
                <td><code class="type">{prop.type}</code></td>
                <td><code>{prop.default}</code></td>
                <td>{prop.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {:else}
      <section>
        <h2>Props</h2>
        <p class="no-props">No props - uses internal state.</p>
      </section>
    {/if}

    {#if component.types}
      <section>
        <h2>Supported Types</h2>
        <ul class="types-list">
          {#each component.types as type}
            <li><code>{type}</code></li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if component.cssVars}
      <section>
        <h2>CSS Variables</h2>
        <table class="props-table">
          <thead>
            <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            {#each component.cssVars as cssVar}
              <tr>
                <td><code>{cssVar.name}</code></td>
                <td><code>{cssVar.default}</code></td>
                <td>{cssVar.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/if}

    <section>
      <h2>Usage</h2>
      <pre class="docs-code">{component.usage}</pre>
    </section>

    {#if component.hasLiveExample}
      <section>
        <h2>Live Example</h2>
        <CopyCodeBlock command="npm install @the-vcsi/scrolly-kit" label="Try copying this" />
      </section>
    {/if}

    <a href="{sourceBase}/{component.name}.svelte" target="_blank" rel="noopener" class="source-link">
      View source on GitHub
    </a>
  </div>
{:else}
  <div class="not-found">
    <h1>Component not found</h1>
    <p>The component "{slug}" doesn't exist.</p>
    <a href="{base}/components">Back to Components</a>
  </div>
{/if}

<style>
  .component-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  .breadcrumb a {
    color: #6b7280;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb .separator {
    color: var(--vcsi-gray-400);
  }

  .breadcrumb .current {
    color: var(--vcsi-gray-600);
  }

  header {
    margin-bottom: 2rem;
  }

  .category-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  header h1 {
    margin: 0 0 0.75rem;
    font-family: var(--vcsi-font-mono);
  }

  .description {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  section {
    margin: 2.5rem 0;
  }

  section h2 {
    font-size: 1.1rem;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--vcsi-border);
  }

  /* Props table */
  .props-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .props-table th,
  .props-table td {
    padding: 0.625rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .props-table th {
    font-weight: 600;
    background: var(--vcsi-gray-50);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .props-table code {
    background: var(--vcsi-gray-100);
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    font-size: 0.8rem;
  }

  .props-table code.type {
    color: #3b82f6;
  }

  .no-props {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }

  .types-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .types-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .types-list li:last-child {
    border-bottom: none;
  }

  .types-list code {
    background: var(--vcsi-gray-100);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.875rem;
  }

  .source-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 0.75rem 1.25rem;
    background: var(--vcsi-gray-100);
    border-radius: 6px;
    color: #6b7280;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .source-link:hover {
    background: var(--vcsi-gray-200);
  }

  /* Not found */
  .not-found {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    text-align: center;
  }

  .not-found h1 {
    margin: 0 0 0.5rem;
  }

  .not-found p {
    color: var(--vcsi-gray-600);
    margin: 0 0 1.5rem;
  }

  .not-found a {
    color: #6b7280;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .component-page {
      padding: 1rem;
    }

    .props-table {
      font-size: 0.8rem;
    }

    .props-table th,
    .props-table td {
      padding: 0.5rem;
    }
  }

  /* Dark mode */
  :global(.dark) .category-badge {
    background: rgba(96, 165, 250, 0.15);
    color: #60a5fa;
  }

  :global(.dark) .description {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .breadcrumb a {
    color: #60a5fa;
  }

  :global(.dark) .breadcrumb .current {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .props-table th {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .props-table code {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .props-table code.type {
    color: #60a5fa;
  }

  :global(.dark) .types-list code {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .source-link {
    background: var(--vcsi-gray-800);
    color: #60a5fa;
  }

  :global(.dark) .source-link:hover {
    background: var(--vcsi-gray-700);
  }
</style>
