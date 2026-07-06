<!--
@component
Story header with title, subtitle, authors, and date.

## Props
- `title` - Story title (required)
- `subtitle` - Optional subtitle
- `authors` - Array of `{ name: string, url?: string }`
- `date` - Publication date string
- `warning` - Optional warning/disclaimer shown inline after author names
- `class` - Additional CSS classes

## Usage
```svelte
<StoryHeader
  title="My Story"
  subtitle="A deep dive into data"
  authors={[{ name: "Alice", url: "https://..." }]}
  date="February 2025"
/>
```
-->
<script lang="ts">

  interface Author {
    name: string;
    url?: string;
  }

  let {
    title,
    subtitle,
    authors,
    date,
    warning,
    class: className = ''
  }: {
    title: string;
    subtitle?: string;
    authors?: Author[];
    date?: string;
    warning?: string;
    class?: string;
  } = $props();
  
</script>

<header class={`story-header ${className}`}>
  <h1>{title}</h1>

  {#if subtitle}
    <h2>{subtitle}</h2>
  {/if}

  <div class="article-meta">
    {#if authors}
      <p class="author">
        By
        {#each authors as author, i}
          <a
            target="_blank"
            rel="noreferrer"
            href={author.url}
          >
            {author.name}
          </a>
          {#if i < authors.length - 1}
            {i === authors.length - 2 ? ' and ' : ', '}
          {/if}
        {/each}
      </p>
    {/if}

    {#if date}
      <p class="date">{date}</p>
    {/if}

    {#if warning}
      <p class="warning-banner">&#9888; {warning}</p>
    {/if}
  </div>
</header>

<style>
.story-header {
  margin-bottom: 5rem;
  text-align: center;
}

.story-header h1 {
  padding-top: 4rem;
}

.story-header h2 {
  font-size: var(--vcsi-font-size-md, 1.5rem);
  font-weight: 400;
}

.article-meta {
  margin: -1rem auto 2rem auto;
  text-align: center;
}

.article-meta .author a {
  color: inherit;
  text-decoration: underline;
}

.article-meta .date {
  font-size: var(--vcsi-font-size-small, 1rem);
  opacity: 0.7;
}

.warning-banner {
  display: inline-block;
  margin: 0;
  padding: 0.25rem 0.6rem;
  font-size: var(--vcsi-font-size-xs, 0.85rem);
  color: #000000ff;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
}

/* No mobile font-size overrides: the heading tokens (--vcsi-font-h1/h2)
   are responsive clamp()s and already scale down on phones. A fixed 4rem
   here once made mobile titles LARGER than desktop. */
</style>
