<script module lang="ts">
    import Md from '$lib/components/helpers/MarkdownRenderer.svelte';

    /**
     * Content item for scrolly steps.
     * @example { "type": "markdown", "value": "Some **bold** text" }
     */
    export interface ContentItem {
        type: 'html' | 'markdown' | 'math' | 'code';
        value: string | string[];
        language?: string;
    }

    const VALID_TYPES = ['html', 'markdown', 'math', 'code'] as const;

    export { renderTextContent };
</script>

<!-- Renders a content item based on its type: html, markdown, math, code -->
{#snippet renderTextContent(item: ContentItem)}
    {#if item.type === "html"}
        {@html item.value}
    {:else if item.type === "markdown"}
        <Md text={item.value as string}/>
    {:else if item.type === "math"}
        <div class="math-container">
            <Md text={item.value as string}/>
        </div>
    {:else if item.type === "code"}
        {@const codeValue = Array.isArray(item.value) ? item.value.join('\n') : item.value}
        <div class="code-block">
            {#if item.language}
                <div class="code-language">{item.language}</div>
            {/if}
            <Md text={`\`\`\`${item.language || ''}\n${codeValue}\n\`\`\``}/>
        </div>
    {:else}
        {@const _ = console.warn(`[ScrollySnippets] Unknown type: "${(item as any).type}". Valid: ${VALID_TYPES.join(', ')}`)}
    {/if}
{/snippet}

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
    }

    .code-language {
        position: absolute;
        top: 0;
        right: 0;
        background: light-dark(#e1e4e8, #30363d);
        color: light-dark(#57606a, #8b949e);
        border-color: light-dark(#d1d9e0, #30363d);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0 6px 0 6px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        z-index: 1;
    }
</style>
