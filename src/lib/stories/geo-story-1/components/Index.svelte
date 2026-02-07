<script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import GeoScrollyPlot from './GeoScrollyPlot.svelte';
    import StoryHeader from '$lib/components/StoryHeader.svelte';
    import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';

    import { renderTextContent } from '$lib/components/helpers/ScrollySnippets.svelte';
    import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
    
</script>

<BackToHome />
<ScrollIndicator threshold={50} />

<article class="story" id="geo-story-1">
    <div class="prose">
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
    </div>

    <section id="scrolly" class="scrolly-fullscreen">
        <div class="scrolly-chart">
            <GeoScrollyPlot {scrollyIndex} />
        </div>
        <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </section>

    <h2 class="prose">Conclusion</h2>
    <section id="conclusion" class="prose">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
    
    <h2 class="prose">Appendix</h2>
    <section id="appendix" class="prose">
        {#each data.appendix as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
</article>