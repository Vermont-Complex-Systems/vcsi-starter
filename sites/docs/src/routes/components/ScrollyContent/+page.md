---
title: ScrollyContent - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

<div class="breadcrumb"><a href="{base}/components">Components</a> / ScrollyContent</div>

# ScrollyContent

<p class="subtitle">Scrollytelling content container with styled step boxes. Renders an array of content steps as scrollable boxes that trigger index changes as they enter the viewport.</p>

**Category:** Scrolling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `ContentItem[]` | `—` | Array of content items with type and value |
| `value` | `number` | `—` | Current step index (bindable) |
| `topSpacer` | `boolean` | `true` | Add spacer before first step |
| `bottomSpacer` | `boolean` | `true` | Add spacer after last step |
| `contentRenderer` | `Snippet` | `—` | Custom snippet for rendering step content |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--spacer-height` | `65vh` | Height of top/bottom spacers |
| `--step-height` | `90vh` | Vertical space per step |
| `--step-max-width` | `600px` | Max width of step box |
| `--step-padding` | `1rem` | Padding inside step box |
