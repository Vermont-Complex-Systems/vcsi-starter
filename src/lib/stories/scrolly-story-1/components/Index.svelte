    <script>
    /**
     * Scrolly story with side-by-side layout:
     * - Text content on the left
     * - Sticky chart on the right (40% width)
     * - Responsive: stacks on mobile/tablet
     */
    import { ArrowDown } from "@lucide/svelte";

    import ScrollyPlot from './ScrollyPlot.svelte';

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

    <article id="scrolly-story-1" class="story-fullwidth">

        <div class="title">
            <h1>{data.title}</h1>
            <h2>{data.subtitle}</h2>

            <div class="article-meta">
                <p class="author">
                    By <a target=_blank rel=noreferrer href=https://vermont-complex-systems.github.io/complex-stories/author/jonathan-st-onge>Jonathan St-Onge</a> and <a target=_blank rel=noreferrer href=https://vermont-complex-systems.github.io/complex-stories/author/juniper-lisa-lovato>Juniper Lovato</a>
                </p>
                <p class="date">
                    {data.date}
                </p>
            </div>
        </div>

        <section id="intro">
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

        <h2>Conclusion</h2>
        <section id="conclusion">
            {#each data.conclusion as item}
                {@render renderTextContent(item)}
            {/each}
        </section>
    </article>


    <style>

    /* Break out of centered main container to align with Nav */
    article.story-fullwidth {
        width: 100vw;
        margin-left: calc(-50vw + 50%);
    }

    .title {
        margin: 0 auto 5rem auto;
        padding: 0 var(--margin-left);
        text-align: center;
    }

    @media (max-width: 768px) {
        .title {
            padding: 0 var(--margin-left-mobile);
        }
    }

    .title h1 {
        font-size: var(--font-size-giant);
        padding-top: 4rem;
    }

    .title h2 {
        font-size: var(--font-size-medium);
        font-weight: 400;
    }

    .article-meta {
        margin: -1rem auto 2rem auto;
        text-align: center;
    }

    .article-meta .author a {
        color: var(--color-gray-900);
    }

    .article-meta .date {
        font-size: var(--font-size-small);
        color: var(--color-tertiary-gray);
    }


    /* -----------------------------
    Conclusion Section
    ----------------------------- */
    article > h2 {
        max-width: 600px;
        margin: 4rem auto 0;
        padding: 0 1rem;
    }

    #intro {
        max-width: 600px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    #conclusion {
        max-width: 600px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    /* -----------------------------
    Scroll Indicator
    ----------------------------- */
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

    /* -----------------------------
    Responsive Adjustments
    ----------------------------- */
    /* Layout responsive behavior handled by .scrolly-with-chart class */

    @media (max-width: 768px) {
        .title h1 {
            font-size: 4rem;
        }

        .title h2 {
            font-size: 2rem;
        }
    }
    </style>
