<script lang="ts">
    import Md from './MarkdownRenderer.svelte';
    import type { ContentItem } from './ScrollySnippets.svelte';

    let { item }: { item: ContentItem } = $props();

    const VALID_TYPES = ['html', 'markdown', 'math', 'code'] as const;

    /** Escape HTML entities so code displays as text, not rendered HTML */
    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
</script>

{#if item.type === "html"}
    <span>{@html item.value}</span>
{:else if item.type === "markdown"}
    <Md text={item.value as string}/>
{:else if item.type === "math"}
    <div class="math-container">
        <Md text={item.value as string}/>
    </div>
{:else if item.type === "code"}
    {@const rawCode = Array.isArray(item.value) ? item.value.join('\n') : item.value}
    {@const codeValue = escapeHtml(rawCode)}
    {@const langClass = item.language ? `language-${item.language}` : ''}
    {@const highlightAttr = item.highlightLines ? `data-highlight-lines="${item.highlightLines}"` : ''}
    <div class="code-block">
        {#if item.language}
            <div class="code-language">{item.language}</div>
        {/if}
        <Md text={`<pre><code class="${langClass} show-line-numbers" ${highlightAttr}>${codeValue}</code></pre>`}/>
    </div>
{:else}
    {@const _ = console.warn(`[RenderTextContent] Unknown type: "${(item as any).type}". Valid: ${VALID_TYPES.join(', ')}`)}
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

    /* Reset pre margin inside code-block so language badge aligns with the box */
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
