<!--
@component
Renders ContentItem(s) from a story's copy.json.

Accepts a single item or an array of items. Supports:
- `markdown` — Markdown text (via MarkdownRenderer)
- `html` — Raw HTML
- `math` — Centered math (KaTeX)
- `code` — Syntax-highlighted code block
- `component` — Svelte component by name from the `components` map
-->
<script lang="ts">
    import Md from './MarkdownRenderer.svelte';
    import { renderCodeHtml, type ContentItem } from './ScrollySnippets.svelte';
    import type { Component } from 'svelte';

    let { items, components }: {
        items: ContentItem | ContentItem[];
        components?: Record<string, Component>;
    } = $props();

    let itemList = $derived(
        !items ? [] : Array.isArray(items) ? items : [items]
    );

    /** Ensure math value is wrapped as display math ($$...$$ on own lines) */
    function asDisplayMath(value: string): string {
        const stripped = value.replace(/^\$\$|\$\$$/g, '').trim();
        return `\n$$\n${stripped}\n$$\n`;
    }
</script>

{#each itemList as item}
    {#if item.type === 'component' && components?.[item.value]}
        {@const Comp = components[item.value]}
        <Comp />
    {:else if item.type === 'markdown'}
        <Md text={item.value} />
    {:else if item.type === 'html'}
        {@html item.value}
    {:else if item.type === 'math'}
        <div class="math-container">
            <Md text={asDisplayMath(item.value)} />
        </div>
    {:else if item.type === 'code'}
        <div class="code-block">
            {#if item.language}
                <div class="code-language">{item.language}</div>
            {/if}
            <Md text={renderCodeHtml(item.value, item.language, item.highlightLines)} />
        </div>
    {/if}
{/each}

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
