# Footer

Site footer with logo, social links, and copyright. Supports light/dark theme forcing for stories.

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| theme | 'light' or 'dark' | — | Force light (UVM green) or dark theme |
| logoSrc | string | UVM logo | Logo image source |
| socialLinks | SocialLink[] | VCSI socials | Social media links |
| bottomLinks | BottomLink[] | — | Footer bottom row links |
| copyright | string | VCSI copyright | Copyright text |

## Usage

```svelte
<script>
  import { Footer } from '@the-vcsi/scrolly-kit';
</script>

<!-- Respects global dark mode -->
<Footer />

<!-- Force light theme (UVM green) -->
<Footer theme="light" />

<!-- Force dark theme -->
<Footer theme="dark" />
```
