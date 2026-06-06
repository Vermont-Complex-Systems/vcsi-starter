---
title: StoryHeader - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

<div class="breadcrumb"><a href="{base}/components">Components</a> / StoryHeader</div>

# StoryHeader

<p class="subtitle">Story header with title, subtitle, authors, and date. Provides consistent styling for story introductions.</p>

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `—` | Story title (required) |
| `subtitle` | `string` | `—` | Optional subtitle |
| `authors` | `Author[]` | `—` | Array of ( name, url? ) |
| `date` | `string` | `—` | Publication date string |
