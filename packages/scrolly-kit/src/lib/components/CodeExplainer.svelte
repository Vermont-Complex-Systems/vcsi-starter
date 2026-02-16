<script lang="ts">
    import Md from './MarkdownRenderer.svelte';
    import ScrollyContent from './ScrollyContent.svelte';
    import { renderCodeHtml, type ContentItem } from './ScrollySnippets.svelte';

    interface CodeExplainerData {
        code: string;
        language?: string;
        filename?: string;
        steps: (ContentItem & { highlightLines?: string })[];
    }

    interface Props {
        data: CodeExplainerData;
        reversed?: boolean;
        /** Current active step index (bindable) */
        value?: number;
    }

    let { data, reversed = false, value = $bindable(undefined) }: Props = $props();

    // Get highlight lines for current step
    let currentHighlight = $derived(
        value !== undefined ? data.steps[value]?.highlightLines || '' : ''
    );
</script>

<section class="split-layout" class:reversed>
    <div class="sticky-panel">
        <div class="code-explainer-chart">
            <div class="code-wrapper">
                {#if data.filename}
                    <div class="filename-tab">{data.filename}</div>
                {/if}
                <Md text={renderCodeHtml(data.code, data.language, currentHighlight)} />
            </div>
        </div>
    </div>
    <div class="stepContainer">
        <ScrollyContent steps={data.steps} bind:value />
    </div>
</section>

<style>
    .split-layout {
        --panel-height: 90vh;
        --panel-max-height: none; /* allow full height for code display */
    }

    .stepContainer {
        --step-height: 50vh;
        --step-max-width: 400px;
        --step-text-align: left;
    }

    .code-explainer-chart {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow: hidden;
    }

    .code-wrapper {
        position: relative;
        max-width: 100%;
        max-height: 100%;
    }

    .code-wrapper :global(pre) {
        margin: 0;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;
    }

    .filename-tab {
        position: absolute;
        top: 0;
        right: 0;
        font-family: var(--font-mono, monospace);
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background: #e1e4e8;
        color: #57606a;
        border-left: 1px solid #d1d9e0;
        border-bottom: 1px solid #d1d9e0;
        border-radius: 0 6px 0 6px;
        z-index: 1;
    }
</style>
