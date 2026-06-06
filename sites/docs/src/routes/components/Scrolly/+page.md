---
title: Scrolly - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

<div class="breadcrumb"><a href="{base}/components">Components</a> / Scrolly</div>

# Scrolly

<p class="subtitle">Base scroll detection using IntersectionObserver. Tracks which child element is most in view and updates the `value` binding. Used internally by ScrollyContent, but can be used directly for custom layouts.</p>

**Category:** Scrolling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `—` | Index of most visible child (bindable) |
| `root` | `Element | null` | `null` | IntersectionObserver root element |
| `top` | `number` | `0` | Top margin offset in pixels |
| `bottom` | `number` | `0` | Bottom margin offset in pixels |
| `increments` | `number` | `100` | Number of threshold steps |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--spacer-height` | `65vh` | Height of top/bottom spacers |
| `--step-height` | `90vh` | Vertical space per step |
| `--step-max-width` | `600px` | Max width of step box |
| `--step-padding` | `1rem` | Padding inside step box |
