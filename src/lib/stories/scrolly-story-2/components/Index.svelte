<!-- Inspired by https://visualrambling.space/tracing-kpop-wave/ -->

<script>
/**
 * Scrolly story with fullscreen layout:
 * - Full-viewport chart fixed in background
 * - Text content overlaid on top, centered
 */
import { ArrowDown } from "@lucide/svelte";

import BackgroundPlot from './BackgroundPlot.svelte';
import StoryHeader from '$lib/components/StoryHeader.svelte';

import { renderTextContent, scrollyContent } from '$lib/components/helpers/ScrollySnippets.svelte';

const authors = [
    { name: 'Jonathan St-Onge', url: 'https://vermont-complex-systems.github.io/complex-stories/author/jonathan-st-onge' },
    { name: 'Juniper Lovato', url: 'https://vermont-complex-systems.github.io/complex-stories/author/juniper-lisa-lovato' }
];

let { story, data } = $props();

let scrollyIndex = $state({ value: undefined });

// Scroll indicator visibility
let showScrollIndicator = $state(true);

// Hide scroll indicator when user scrolls
$effect(() => {
    if (typeof window !== 'undefined') {
        const handleScroll = () => {
            showScrollIndicator = window.scrollY < 100;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }
});

</script>

<!-- Scroll indicator -->
{#if showScrollIndicator}
    <div class="scroll-indicator">
        <ArrowDown size={32} strokeWidth={2} />
    </div>
{/if}

<article id="scrolly-story-2" class="story">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        {authors}
        date={data.date}
    />

    <section id="intro" class="scrolly-fullscreen">
        <div class="scrolly-chart">
            <BackgroundPlot scrollyIndex={scrollyIndex.value} />
        </div>

        <div class="stepContainer">
            {@render scrollyContent(data.steps, scrollyIndex)}
        </div>
    </section>

    <h2 class="prose">Conclusion</h2>
    <section id="conclusion" class="prose">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
</article>


<style>
/* Story-specific text box styling */
:global(#scrolly-story-2 .scrolly-content .step > *) {
    padding: 1.5rem;
    background: #f5f5f5;
    color: #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    transition: opacity 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
                transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
                background-color 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
                color 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
                box-shadow 600ms cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    opacity: 0.3;
    transform: scale(0.95) translateZ(0);
    max-width: 400px !important;
    will-change: opacity, transform;
    backface-visibility: hidden;
}

:global(#scrolly-story-2 .scrolly-content .step.active > *) {
    background: white;
    color: black;
    opacity: 1;
    transform: scale(1) translateZ(0);
}

/* Scroll Indicator */
.scroll-indicator {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    opacity: 0.7;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-10px); }
}
</style>
