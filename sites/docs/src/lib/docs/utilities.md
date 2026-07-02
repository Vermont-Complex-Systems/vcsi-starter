# Utilities & actions

Non-component exports from `@the-vcsi/scrolly-kit` — a Svelte action, reactive media-query helpers, and a code-HTML builder.

## scrollReveal — action

Reveals an element as it enters the viewport. The action sets `data-revealed="true"` on the element when it scrolls into view; you supply the transition in CSS (so it degrades gracefully and respects `prefers-reduced-motion` if you scope it).

```svelte
<script>
  import { scrollReveal } from '@the-vcsi/scrolly-kit';
</script>

<section use:scrollReveal>…</section>

<style>
  section { opacity: 0; transition: opacity 0.5s ease; }
  section[data-revealed="true"] { opacity: 1; }
</style>
```

Options: `use:scrollReveal={{ threshold, rootMargin }}` — defaults `threshold: 0.1`, `rootMargin: '0px 0px -100px 0px'`.

## useIsMobile() / useMediaQuery(query) — reactive helpers

Svelte 5 reactive helpers that track a media query. Each returns an object with a reactive `current` boolean; read `.current` in markup or a `$derived`.

```svelte
<script>
  import { useIsMobile, useMediaQuery } from '@the-vcsi/scrolly-kit';

  const isMobile = useIsMobile();                  // (max-width: 768px)
  const isWide = useMediaQuery('(min-width: 1200px)');
</script>

{#if isMobile.current}
  <MobileControls />
{:else}
  <DesktopControls />
{/if}
```

`useIsMobile()` is a convenience wrapper for `useMediaQuery('(max-width: 768px)')` — the kit's mobile breakpoint.

## renderCodeHtml(code, language?, highlightLines?)

Builds a syntax-highlight-ready HTML string for `MarkdownRenderer` — the same code-block rendering that `RenderContent` and `CodeExplainer` use internally. Reach for it only when you need a custom code display outside those components.

```svelte
<script>
  import { MarkdownRenderer, renderCodeHtml } from '@the-vcsi/scrolly-kit';
</script>

<MarkdownRenderer text={renderCodeHtml('const x = 1;', 'js', '1')} />
```

`highlightLines` accepts the same format as elsewhere, e.g. `"1-3,5"`.
