# StoryHeader

Story header with title, subtitle, authors, and date. Provides consistent styling for story introductions.

**Category:** Layout

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | — | Story title (required) |
| subtitle | string | — | Optional subtitle |
| authors | Author[] | — | Array of { name, url? } |
| date | string | — | Publication date string |
| class | string | '' | Additional CSS classes |

## Usage

```svelte
<script>
  import { StoryHeader } from '@the-vcsi/scrolly-kit';
</script>

<StoryHeader
  title="Climate Change in Vermont"
  subtitle="A data-driven exploration"
  authors={[
    { name: "Alice Smith", url: "https://..." },
    { name: "Bob Jones" }
  ]}
  date="February 2025"
/>
```
