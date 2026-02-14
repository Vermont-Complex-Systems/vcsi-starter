# VCSI Scrollytelling

A scrollytelling framework for data-driven visual essays built with SvelteKit.

## Quick Start

### Full Template (with examples)

```bash
npx degit Vermont-Complex-Systems/vcsi-scrollytelling/templates/full my-project
cd my-project
npm install
npm run dev
```

### Minimal Template (clean slate)

```bash
npx degit Vermont-Complex-Systems/vcsi-scrollytelling/templates/minimal my-project
cd my-project
npm install
npm run dev
```

## Package

The core components are available as an npm package:

```bash
npm install @vcsi/scrolly-kit
```

### Components

- `Scrolly` - Core scroll detector using IntersectionObserver
- `ScrollyContent` - Opinionated scroll step container with content rendering
- `MarkdownRenderer` - Markdown + KaTeX math + syntax highlighting
- `CodeBlock`, `CopyCodeBlock`, `CodeExplainer` - Code display components
- `SimpleToggle`, `SimpleSelect` - Form controls
- `ThemeToggle` - Dark/light mode toggle
- `Tooltip`, `Spinner`, `ScrollIndicator` - UI helpers

### CSS

Import the styles you need:

```css
@import '@vcsi/scrolly-kit/styles/all.css';  /* Everything */

/* Or individually: */
@import '@vcsi/scrolly-kit/styles/reset.css';
@import '@vcsi/scrolly-kit/styles/tokens.css';
@import '@vcsi/scrolly-kit/styles/typography.css';
@import '@vcsi/scrolly-kit/styles/layouts.css';
```

### Layouts

- `.story` - Story container with theme isolation
- `.split-layout` - Two-column with sticky panel (add `.reversed` to flip)
- `.fullscreen-layout` - Full-viewport immersive backgrounds
- `.triple-layout` - Three-column (steps, code, chart)
- `.dashboard-layout` - Collapsible sidebar

## Customization

Override CSS variables in your `app.css`:

```css
:root {
  --scrolly-color-accent: #your-brand;
  --scrolly-serif: "Your Font", Georgia, serif;
  --story-bg: #your-background;
}
```

## Documentation

Full documentation coming soon.

## License

MIT
