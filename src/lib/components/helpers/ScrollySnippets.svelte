<script module>
    import '$styles/scrolly.css';
    import Scrolly from '$lib/components/helpers/Scrolly.svelte';
    import Md from '$lib/components/helpers/MarkdownRenderer.svelte';

    export { scrollyContent, renderTextContent };
</script>

<!-- Shared snippet for rendering common text content types (html, markdown, math, code) -->
{#snippet renderTextContent(item)}
    {#if item.type === "html"}
        {@html item.value}
    {:else if item.type === "markdown"}
        <Md text={item.value}/>
    {:else if item.type === "math"}
        <div class="plot-container">
            <Md text={item.value}/>
        </div>
    {:else if item.type === "code"}
        {@const codeValue = Array.isArray(item.value) ? item.value.join('\n') : item.value}
        <div class="code-block">
            {#if item.language}
                <div class="code-language">{item.language}</div>
            {/if}
            <Md text={`\`\`\`${item.language || ''}\n${codeValue}\n\`\`\``}/>
        </div>
    {/if}
{/snippet}

<!-- Generic scrolly wrapper for story content
     scrollyIndex should be wrapped in an object so we can bind to it -->
{#snippet scrollyContent(steps, scrollyIndexObj, contentRenderer = renderTextContent)}
    <div class="scrolly-content">
        <div class="spacer"></div>
        <Scrolly bind:value={scrollyIndexObj.value}>
            {#each steps as step, i}
                {@const active = scrollyIndexObj.value === i}
                <div class="step" class:active>
                    <div class="step-content">
                        {@render contentRenderer(step)}
                    </div>
                </div>
            {/each}
        </Scrolly>
        <div class="spacer"></div>
    </div>
{/snippet}

<style>
    /* Component-specific styles only */
    .plot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    /* Code block with language label */
    .code-block {
        position: relative;
    }

    .code-language {
        position: absolute;
        top: 0;
        right: 0;
        background: #e1e4e8;
        color: #57606a;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0 6px 0 6px;
        border-left: 1px solid #d1d9e0;
        border-bottom: 1px solid #d1d9e0;
        z-index: 1;
    }

    :global(.dark) .code-language {
        background: #30363d;
        color: #8b949e;
        border-color: #30363d;
    }
</style>
