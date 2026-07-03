# Nav

Responsive navigation bar with logo, links, and mobile hamburger menu. Includes theme toggle by default.

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logoSrc | string | VCSI logo | Logo image source |
| logoAlt | string | 'VCSI Logo' | Logo alt text |
| links | NavLink[] | — | Array of { href, label } |
| showThemeToggle | boolean | true | Show dark mode toggle |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-nav-logo-height` | 5rem | Rendered logo height. The default suits squarish icon logos; set ~2.25rem on any ancestor for wide wordmark logos. |
| `--vcsi-nav-logo-height-mobile` | 3.5rem | Logo height below 768px (width stays auto, so wordmarks aren't squeezed into a square). |

## Usage

```svelte
<script>
  import { Nav } from '@the-vcsi/scrolly-kit';
</script>

<Nav
  links={[
    { href: '/about', label: 'About' },
    { href: '/stories', label: 'Stories' }
  ]}
/>
```
