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
