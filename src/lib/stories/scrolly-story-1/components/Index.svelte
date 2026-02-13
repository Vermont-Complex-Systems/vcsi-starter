    <script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import ScrollyPlot from './ScrollyPlot.svelte';
    import StoryHeader from '$lib/components/StoryHeader.svelte';
    import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';
    import Footer from '$lib/components/Footer.svelte';

    import { renderTextContent } from '$lib/components/helpers/ScrollySnippets.svelte';
    import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
</script>


<BackToHome colored />
<ScrollIndicator />

<article class="story">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        authors={data.authors}
        date={data.date}
    />

    <section id="intro">
        {#each data.introduction as item}
            {@render renderTextContent(item)}
        {/each}
    </section>

    <section id="scrolly" class="split-layout">
        <div class="sticky-panel">
            <ScrollyPlot {scrollyIndex} />
        </div>

        <div class="scrolly-content">
            <ScrollyContent steps={data.steps} bind:value={scrollyIndex} topSpacer={false}/>
        </div>
    </section>

    <h2>Markdown Renderer</h2>
    <section id="markdown">
        {#each data.markdownRenderer as item}
            {@render renderTextContent(item)}
        {/each}
    </section>

    <h2>Conclusion</h2>
    <section id="conclusion">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>

</article>

<Footer theme="light" />

<style>
    @media (min-width: 769px) {
        .scrolly-content {
            --story-step-bg: transparent;
            --story-step-bg-inactive: transparent;
            --step-box-shadow: none;
            --step-height: 40vh;
        }
    }
</style>