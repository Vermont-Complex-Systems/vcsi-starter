# @vcsi/scrolly-kit

Scrollytelling components and layouts for SvelteKit.

## Installation

```bash
npm install @vcsi/scrolly-kit
```

## Usage

```svelte
<script>
  import { Scrolly, ScrollyContent, type ContentItem } from '@vcsi/scrolly-kit';

  let scrollIndex = $state(0);

  const steps: ContentItem[] = [
    { type: 'markdown', value: '## Step 1\n\nContent here.' },
    { type: 'markdown', value: '## Step 2\n\nMore content.' }
  ];
</script>

<article class="story">
  <section class="split-layout">
    <div class="sticky-panel">
      <!-- Your visualization, responds to scrollIndex -->
    </div>
    <ScrollyContent {steps} bind:value={scrollIndex} />
  </section>
</article>
```

## CSS

```css
@import '@vcsi/scrolly-kit/styles/all.css';
```

## Components

| Component | Description |
|-----------|-------------|
| `Scrolly` | Base scroll detector |
| `ScrollyContent` | Scroll steps with content rendering |
| `MarkdownRenderer` | Markdown + math + code |
| `CodeBlock` | Syntax-highlighted code |
| `SimpleToggle` | Toggle switch |
| `SimpleSelect` | Dropdown select |
| `ThemeToggle` | Dark/light mode |
| `Tooltip` | Hover tooltips |
| `ScrollIndicator` | Bouncing scroll arrow |
| `CopyCodeBlock` | Code with copy button |
| `CodeExplainer` | Code walkthrough |
| `Spinner` | Loading spinner |

## CSS Variables

See [tokens.css](./src/lib/styles/tokens.css) for all customizable variables.

## License

MIT
