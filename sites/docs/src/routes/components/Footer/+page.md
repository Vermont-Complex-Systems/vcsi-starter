---
title: Footer - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

<div class="breadcrumb"><a href="{base}/components">Components</a> / Footer</div>

# Footer

<p class="subtitle">Site footer with logo, social links, and copyright. Supports light/dark theme forcing for stories.</p>

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoSrc` | `string` | `UVM logo` | Logo image source |
| `socialLinks` | `SocialLink[]` | `VCSI socials` | Social media links |
| `bottomLinks` | `BottomLink[]` | `—` | Footer bottom row links |
| `copyright` | `string` | `VCSI copyright` | Copyright text |
