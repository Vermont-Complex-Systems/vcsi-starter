# ScrollyContent

Scrollytelling content container with styled step boxes. Renders an array of content steps as scrollable boxes that trigger index changes as they enter the viewport.

**Category:** Scrolling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `ContentItem[]` | — | Array of content items with type and value |
| `value` | `number` | — | Current step index (bindable) |
| `scrollProgress` | `number` | `0` | Progress through the active step, 0 to 1 (bindable) |
| `topSpacer` | `boolean` | `true` | Add spacer before first step |
| `bottomSpacer` | `boolean` | `true` | Add spacer after last step |
| `contentRenderer` | `Snippet` | — | Custom snippet for rendering step content |

## CSS Variables

Set these on `.scrolly-content` or any ancestor (see [CSS Variable Scoping](../reference#css-variable-scoping)).

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-spacer-height` | `65vh` | Height of top/bottom spacers |
| `--vcsi-step-height` | `90vh` | Vertical space per step |
| `--vcsi-step-max-width` | `600px` | Max width of step box |
| `--vcsi-step-padding` | `1rem` | Padding inside step box |
| `--vcsi-step-border-radius` | `5px` | Step box corner radius |
| `--vcsi-step-box-shadow` | `1px 1px 10px rgba(0,0,0,0.2)` | Step box shadow |
| `--vcsi-step-text-align` | `center` | Text alignment in steps |
| `--vcsi-story-step-bg` / `-fg` | `#fff` / `#333` | Active step colors |
| `--vcsi-story-step-bg-inactive` / `-fg-inactive` | `#f5f5f5` / `gray-600` | Inactive step colors |

## Usage

```svelte
<script>
  import { ScrollyContent } from '@the-vcsi/scrolly-kit';

  let index = $state(0);
  const steps = [
    { type: 'markdown', value: '## Introduction' },
    { type: 'markdown', value: 'Step **two** with emphasis' },
    { type: 'math', value: '$E = mc^2$' }
  ];
</script>

<section class="split-layout">
  <div class="sticky-panel">
    <MyVisualization {index} />
  </div>
  <ScrollyContent {steps} bind:value={index} />
</section>
```
