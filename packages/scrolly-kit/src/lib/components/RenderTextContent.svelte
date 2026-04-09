<!--
@component
Renders a single `ContentItem` from a story's `copy.json`.

Supports four content types:
- `markdown` — Markdown text (via MarkdownRenderer)
- `html` — Raw HTML (escape hatch for anything markdown can't express)
- `math` — Markdown text with math, rendered centered (KaTeX)
- `code` — Code block with optional `language` and `highlightLines`

## Props
- `item` — A `ContentItem` object

## Usage
```svelte
<RenderTextContent item={{ type: 'markdown', value: '## Hello' }} />

<RenderTextContent item={{
  type: 'code',
  value: 'const x = 1;',
  language: 'javascript',
  highlightLines: '1'
}} />
```
-->
<script lang="ts">
    import Md from './MarkdownRenderer.svelte';
    import { renderCodeHtml, type ContentItem } from './ScrollySnippets.svelte';

    let { item }: { item: ContentItem } = $props();
</script>

{#if item.type === 'markdown'}
    <Md text={item.value} />
{:else if item.type === 'html'}
    {@html item.value}
{:else if item.type === 'math'}
    <div class="math-container">
        <Md text={item.value} />
    </div>
{:else if item.type === 'code'}
    <div class="code-block">
        {#if item.language}
            <div class="code-language">{item.language}</div>
        {/if}
        <Md text={renderCodeHtml(item.value, item.language, item.highlightLines)} />
    </div>
{/if}

<style>
    .math-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .code-block {
        position: relative;
        max-width: 100%;
        overflow-x: auto;
    }

    /* Reset pre margin inside code-block so the language badge aligns with the box */
    .code-block :global(pre) {
        margin: 0;
    }

    .code-language {
        position: absolute;
        top: 0;
        right: 0;
        background: #e1e4e8;
        color: #57606a;
        border-color: #d1d9e0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0 6px 0 6px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        z-index: 1;
    }
</style>
