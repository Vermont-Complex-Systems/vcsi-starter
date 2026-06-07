# Meta

SEO meta tags for social sharing (Open Graph, Twitter cards).

**Category:** Utilities

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | — | Page title |
| description | string | — | Page description |
| image | string | — | Social sharing image URL |
| url | string | — | Canonical URL |

## Usage

```svelte
<script>
  import { Meta } from '@the-vcsi/scrolly-kit';
</script>

<Meta
  title="My Story"
  description="An interactive exploration of data"
  image="/og-image.png"
  url="https://example.com/story"
/>
```
