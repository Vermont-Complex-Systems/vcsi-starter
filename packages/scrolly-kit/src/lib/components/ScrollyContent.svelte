<!--
@component
Scrollytelling content container with step boxes.

Renders an array of content steps as scrollable boxes that trigger
index changes as they enter the viewport.

## Props
- `steps` - Array of `ContentItem` objects with `type` and `value`
- `value` - Current step index (bindable)
- `topSpacer` - Add spacer before first step (default: true)
- `bottomSpacer` - Add spacer after last step (default: true)
- `contentRenderer` - Custom snippet for rendering step content

## Usage
```ts
let index = $state(0);
const steps = [
  { type: 'markdown', value: '## Step 1' },
  { type: 'markdown', value: '## Step 2' }
];
// Use with: <ScrollyContent {steps} bind:value={index} />
```
-->
<script lang="ts">
    import Scrolly from './Scrolly.svelte';
    import Md from './MarkdownRenderer.svelte';
    import type { ContentItem } from './ScrollySnippets.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        /** Array of content items from copy.json */
        steps: ContentItem[];
        /** Current active step index (bindable) */
        value?: number;
        /** Show spacer before first step (default: true) */
        topSpacer?: boolean;
        /** Show spacer after last step (default: true) */
        bottomSpacer?: boolean;
        /** Custom content renderer snippet */
        contentRenderer?: Snippet<[ContentItem]>;
    }

    let {
        steps,
        value = $bindable(undefined),
        topSpacer = true,
        bottomSpacer = true,
        contentRenderer
    }: Props = $props();

    /** Escape HTML entities so code displays as text, not rendered HTML */
    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
</script>

{#snippet defaultContentRenderer(item: ContentItem)}
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
        {@const _ = console.warn(`[ScrollyContent] Unknown type: "${(item as any).type}". Valid: html, markdown, math, code`)}
    {/if}
{/snippet}

<div class="scrolly-content">
    {#if topSpacer}<div class="spacer"></div>{/if}
    <Scrolly bind:value>
        {#each steps as step, i}
            {@const active = value === i}
            <div class="step" class:active>
                <div class="step-box">
                    {@render (contentRenderer ?? defaultContentRenderer)(step)}
                </div>
            </div>
        {/each}
    </Scrolly>
    {#if bottomSpacer}<div class="spacer"></div>{/if}
</div>

<style>
    /*
     * ScrollyContent - Opinionated scrollytelling component
     *
     * CSS variables (set on parent like .scrolly-with-chart):
     *   --spacer-height: 65vh      Top/bottom spacer height
     *   --step-height: 90vh        Vertical space per step
     *   --step-max-width: 600px    Max width of step box
     *   --step-padding: 1rem       Padding inside step box
     *   --step-border-radius: 5px  Corner rounding
     *   --step-text-align: center  Text alignment (left, center, right)
     *
     * Colors (set globally in app.css):
     *   --story-step-bg / --story-step-fg           Active step
     *   --story-step-bg-inactive / --story-step-fg-inactive  Inactive step
     */

    .scrolly-content {
        position: relative;
        z-index: 2;
        pointer-events: none;
    }

    .spacer {
        height: var(--spacer-height, 65vh);
    }

    .step {
        min-height: var(--step-height, 90vh);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .step-box {
        width: 100%;
        max-width: var(--step-max-width, 600px);
        padding: var(--step-padding, 1rem);
        background-color: var(--story-step-bg-inactive, #f5f5f5);
        color: var(--story-step-fg-inactive, #ccc);
        border-radius: var(--step-border-radius, 5px);
        box-shadow: var(--step-box-shadow, 1px 1px 10px rgba(0, 0, 0, 0.2));
        transition: background-color 400ms ease, color 400ms ease;
        text-align: var(--step-text-align, center);
        pointer-events: auto;
    }

    .step.active .step-box {
        background-color: var(--story-step-bg, #fff);
        color: var(--story-step-fg, #333);
    }

    /* Links and nested elements inherit step text color */
    .step-box :global(*) {
        color: inherit;
    }

    /* Content type styles */
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

    /* Mobile: step boxes take most of the screen width */
    @media (max-width: 768px) {
        .step {
            padding: 0.25rem;
        }

        .step-box {
            max-width: 100%;
            border-radius: 0; /* Full-bleed edges */
        }
    }
</style>
