// Component documentation data for the docs site

export interface PropDoc {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface CssVarDoc {
  name: string;
  default: string;
  description: string;
}

export interface ComponentDoc {
  name: string;
  description: string;
  category: 'Scrolling' | 'Layout' | 'Content' | 'UI Controls' | 'Utilities';
  props: PropDoc[];
  cssVars?: CssVarDoc[];
  types?: string[];
  usage: string;
  hasLiveExample?: boolean;
}

export const components: Record<string, ComponentDoc> = {
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

// Helper to get component names for route generation
export const componentNames = Object.keys(components);
