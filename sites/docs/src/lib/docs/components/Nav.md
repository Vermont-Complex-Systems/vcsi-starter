# Nav

Responsive navigation bar with logo, links, and mobile hamburger menu. Includes theme toggle by default.

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logoSrc | string | '/waxSealSmall.png' | Logo image source (the templates ship this asset) |
| logoAlt | string | 'Site logo' | Logo alt text |
| homeHref | string | '/' | Where the logo links |
| links | NavLink[] | `[{ href: '/about', label: 'About' }]` | Array of `{ href, label, external? }` |
| githubUrl | string | vcsi-starter repo | GitHub icon link; set to your repo (or `''` to hide) |
| showThemeToggle | boolean | true | Show dark mode toggle |
| theme | 'light' or 'dark' | — | Force a theme, ignoring global mode |
| position | 'fixed' \| 'sticky' \| 'relative' | 'fixed' | Header positioning |

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
