# Design Tokens

The global `--vcsi-*` design tokens — the palette, type scale, spacing, radius, and transitions every story and custom UI draws from. **Consume these in custom CSS instead of hardcoding values, and override them on a scope to customize.** Hardcoded colors and spacing drift from the brand and silently break dark mode.

Layout- and component-specific tokens (panel width, step colors, sidebar width, story background…) are documented beside the layout they tune — see the [Styling reference](reference).

## Using tokens in custom CSS

**When you write custom CSS — a home page, a card, a nav, a legend — consume these tokens instead of hardcoding values.** The semantic colors below auto-switch with the theme; a hardcoded `#fff` will not.

```css
/* ❌ hardcoded — drifts from the theme, ignores dark mode */
.card { background: #fff; color: #333; padding: 20px; border-radius: 8px; font-family: system-ui; }

/* ✅ consume the tokens */
.card {
  background: var(--vcsi-bg);
  color: var(--vcsi-fg);
  padding: var(--vcsi-space-lg);
  border: 1px solid var(--vcsi-border);
  border-radius: var(--vcsi-radius-md);
  font-family: var(--vcsi-font-sans);
}
```

To customize, override a token on a scope (see [CSS Variable Scoping](reference#css-variable-scoping)) rather than writing a competing rule.

## Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--vcsi-color-accent` | #154734 | Brand accent (UVM Green) |
| `--vcsi-color-uvm-green` | #154734 | UVM Green |
| `--vcsi-color-uvm-gold` | rgb(255, 209, 0) | UVM Gold |
| `--vcsi-color-beige` | #f4efea | Warm beige |
| `--vcsi-gray-100` to `900` | scale | Gray scale (100, 200, 300, 400, 600, 700, 800, 900) |

### Semantic Colors (auto-switch with dark mode)

| Variable | Description |
|----------|-------------|
| `--vcsi-bg` | Background color |
| `--vcsi-fg` | Text color |
| `--vcsi-border` | Border color |
| `--vcsi-hover` | Hover state |
| `--vcsi-link` | Link color |
| `--vcsi-muted` | Muted/secondary text |
| `--vcsi-code-bg` | Code block background |
| `--vcsi-code-fg` | Code text color |

## Typography

| Variable | Default |
|----------|---------|
| `--vcsi-font-sans` | "Atlas Grotesk", system-ui, sans-serif |
| `--vcsi-font-serif` | "Baskerville", Georgia, serif |
| `--vcsi-font-mono` | "Atlas Typewriter", "SF Mono", monospace |
| `--vcsi-font-heading` | var(--vcsi-font-serif) |

### Font Sizes (responsive clamp)

| Variable | Range |
|----------|-------|
| `--vcsi-font-size-giant` | 3rem &rarr; 4rem |
| `--vcsi-font-size-xl` | 1.8rem &rarr; 3rem |
| `--vcsi-font-size-lg` | 1.5rem &rarr; 2.5rem |
| `--vcsi-font-size-md` | 1.25rem &rarr; 1.75rem |
| `--vcsi-font-size-base` | 1.125rem &rarr; 1.25rem |
| `--vcsi-font-size-small` | 1rem &rarr; 1.125rem |
| `--vcsi-font-size-xs` | 0.875rem &rarr; 1rem |

### Font Weights & Line Heights

| Variable | Value |
|----------|-------|
| `--vcsi-font-weight-light` | 300 |
| `--vcsi-font-weight-regular` | 400 |
| `--vcsi-font-weight-medium` | 500 |
| `--vcsi-font-weight-semibold` | 600 |
| `--vcsi-font-weight-bold` | 700 |
| `--vcsi-line-height-tight` | 1.17 (headings) |
| `--vcsi-line-height-snug` | 1.33 (subheadings) |
| `--vcsi-line-height-normal` | 1.5 (body) |
| `--vcsi-line-height-relaxed` | 1.6 (long-form) |

## Spacing

| Variable | Value |
|----------|-------|
| `--vcsi-space-xs` | 0.25rem |
| `--vcsi-space-sm` | 0.5rem |
| `--vcsi-space-md` | 1rem |
| `--vcsi-space-lg` | 1.5rem |
| `--vcsi-space-xl` | 2rem |
| `--vcsi-space-2xl` | 3rem |

## Border Radius

| Variable | Value |
|----------|-------|
| `--vcsi-radius-sm` | 3px |
| `--vcsi-radius-md` | 6px |
| `--vcsi-radius-lg` | 8px |
| `--vcsi-radius-full` | 9999px |

## Transitions

| Variable | Value |
|----------|-------|
| `--vcsi-transition-fast` | 150ms ease |
| `--vcsi-transition-base` | 200ms ease |
| `--vcsi-transition-slow` | 300ms ease |
