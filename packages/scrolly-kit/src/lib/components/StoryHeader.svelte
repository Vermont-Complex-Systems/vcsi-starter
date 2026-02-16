<!--
@component
Story header with title, subtitle, authors, and date.

## Props
- `title` - Story title (required)
- `subtitle` - Optional subtitle
- `authors` - Array of `{ name: string, url?: string }`
- `date` - Publication date string
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
    class: className = ''
  }: {
    title: string;
    subtitle?: string;
    authors?: Author[];
    date?: string;
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
  font-size: var(--font-size-medium);
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
  font-size: var(--font-size-small);
  opacity: 0.7;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .story-header h1 {
    font-size: 4rem;
  }

  .story-header h2 {
    font-size: 2rem;
  }
}
</style>
