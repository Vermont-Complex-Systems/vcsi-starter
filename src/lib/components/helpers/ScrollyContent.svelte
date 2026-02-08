<script lang="ts">
    import Scrolly from './Scrolly.svelte';
    import { renderTextContent, type ContentItem } from './ScrollySnippets.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        /** Array of content items from copy.json */
        steps: ContentItem[];
        /** Current active step index (bindable) */
        value?: number;
        /** Show spacer before content */
        topSpacer?: boolean;
        /** Show spacer after content */
        bottomSpacer?: boolean;
        /** Custom content renderer snippet */
        contentRenderer?: Snippet<[ContentItem]>;
    }

    let {
        steps,
        value = $bindable(undefined),
        contentRenderer = renderTextContent
    }: Props = $props();
</script>

<div class="scrolly-content">
    <div class="spacer"></div>
    <Scrolly bind:value>
        {#each steps as step, i (i)}
            {@const active = value === i}
            <div class="step" class:active>
                <div class="step-content">
                    {@render contentRenderer(step)}
                </div>
            </div>
        {/each}
    </Scrolly>
    <div class="spacer"></div>
</div>

<style>
    /*
     * ScrollyContent component styles
     *
     * Configurable via CSS custom properties (set on parent container):
     *
     * Layout:
     *   --scrolly-max-width: Max width of scrolly container (default: 800px)
     *   --scrolly-pointer-events: Pointer events on container (default: auto)
     *   --spacer-height: Height of top/bottom spacers (default: 65vh)
     *   --step-height: Min height of each step (default: 90vh)
     *
     * Step styling:
     *   --step-max-width: Max width of step content (default: 600px)
     *   --step-padding: Padding inside step boxes (default: 1rem)
     *   --step-border-radius: Border radius of step boxes (default: 5px)
     *   --step-box-shadow: Box shadow on step boxes (default: 1px 1px 10px rgba(0,0,0,0.2))
     *
     * Colors (usually set globally in app.css):
     *   --story-step-bg: Active step background
     *   --story-step-fg: Active step text color
     *   --story-step-bg-inactive: Inactive step background
     *   --story-step-fg-inactive: Inactive step text color
     */

    /* Use :global() so layout patterns can target this class */
    :global(.scrolly-content) {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: var(--scrolly-max-width, 800px);
        margin: 0 auto;
        pointer-events: var(--scrolly-pointer-events, auto);
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
        margin: 0 auto;
    }

    /* Step box styling */
    .step > :global(*) {
        padding: var(--step-padding, 1rem);
        background-color: var(--story-step-bg-inactive);
        color: var(--story-step-fg-inactive);
        border-radius: var(--step-border-radius, 5px);
        box-shadow: var(--step-box-shadow, 1px 1px 10px rgba(0, 0, 0, 0.2));
        transition: background-color 500ms ease, color 500ms ease;
        text-align: center;
        max-width: var(--step-max-width, 600px);
        margin: 0 auto;
        pointer-events: auto; /* Always receive events on step content */
    }

    /* Active step */
    .step.active > :global(*) {
        background-color: var(--story-step-bg);
        color: var(--story-step-fg);
    }

    /* Nested elements inherit step colors */
    .step > :global(* *) {
        color: inherit;
    }

    .step-content {
        width: 100%;
        max-width: var(--step-max-width, 600px);
        margin: 0 auto;
    }
</style>
