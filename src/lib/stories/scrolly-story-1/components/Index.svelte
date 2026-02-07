    <script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import ScrollyPlot from './ScrollyPlot.svelte';
    import StoryHeader from '$lib/components/StoryHeader.svelte';
    import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';

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
    <section id="intro" class="prose">
        {#each data.introduction as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
    
    <section id="scrolly" class="scrolly-with-chart">
        
        <div class="scrolly-chart">
            <ScrollyPlot {scrollyIndex} />
        </div>
        
        <div class="stepContainer">
            <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
        </div>

    </section>

    <h2 class="prose">Markdown Renderer</h2>
    <section id="markdown" class="prose">
        {#each data.markdownRenderer as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
    
    <h2 class="prose">Conclusion</h2>
    <section id="conclusion" class="prose">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>

</article>

<style>
    /* Overwritting the step-height */
    .stepContainer {
        --step-height: 60vh;
        --story-step-bg: transparent;
        --story-step-bg-inactive: transparent;
        --step-box-shadow: none;
    }
</style>