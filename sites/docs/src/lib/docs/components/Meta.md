# Meta

SEO meta tags for social sharing (Open Graph, Twitter cards). The canonical/OG URL is derived from the current page path; pass `baseUrl` to make it absolute. SvelteKit-only (reads page state).

**Category:** Utilities

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | — | Page title |
| description | string | — | Page description |
| baseUrl | string | '' | Site origin prepended to the current path for canonical/OG URLs |
| siteName | string | '' | Open Graph site name |
| image | string | '/default-og-image.jpg' | Social sharing image URL |
| keywords | string | '' | Meta keywords |
| author | string | '' | Author meta tag |

## Usage

```svelte
<script>
  import { Meta } from '@the-vcsi/scrolly-kit';
</script>

<Meta
  title="My Story"
  description="An interactive exploration of data"
  image="/og-image.png"
  baseUrl="https://example.com"
  siteName="Complex Stories"
/>
```
