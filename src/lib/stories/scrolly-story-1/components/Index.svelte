    <script>
    import { ArrowDown } from "@lucide/svelte";

    import ScrollyPlot from './ScrollyPlot.svelte';
    import StoryHeader from '$lib/components/StoryHeader.svelte';

    import { renderTextContent, scrollyContent } from '$lib/components/helpers/ScrollySnippets.svelte';

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

    <article class="story">
        <StoryHeader
            title={data.title}
            subtitle={data.subtitle}
            authors={data.authors}
            date={data.date}
        />

        <section id="intro" class="prose">
            {#each data.introduction as item}
                {@render renderTextContent(item)}
            {/each}
        </section>

        <section id="scrolly" class="scrolly-with-chart">
            <div class="scrolly-chart">
                <ScrollyPlot scrollyIndex={scrollyIndex.value} />
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
