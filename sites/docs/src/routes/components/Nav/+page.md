---
title: Nav - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

<div class="breadcrumb"><a href="{base}/components">Components</a> / Nav</div>

# Nav

<p class="subtitle">Responsive navigation bar with logo, links, and mobile hamburger menu. Includes theme toggle by default.</p>

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoSrc` | `string` | `VCSI logo` | Logo image source |
| `links` | `NavLink[]` | `—` | Array of ( href, label ) |
| `showThemeToggle` | `boolean` | `true` | Show dark mode toggle |
