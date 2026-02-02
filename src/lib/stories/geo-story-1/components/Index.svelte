<script>
    import GeoScrollyPlot from './GeoScrollyPlot.svelte';
    import StoryHeader from '$lib/components/StoryHeader.svelte';
    import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';

    import { renderTextContent, scrollyContent } from '$lib/components/helpers/ScrollySnippets.svelte';

    let { story, data } = $props();

    let scrollyIndex = $state({ value: undefined });

</script>

<ScrollIndicator threshold={50} />

<!-- Here we overwrite --header-position to prevent its stickiness  -->
<svelte:head>
  <style>
    :root {
      --header-position: relative;
    }
  </style>
</svelte:head>


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
            <GeoScrollyPlot scrollyIndex={scrollyIndex.value} />
        </div>
        {@render scrollyContent(data.steps, scrollyIndex)}
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

<style>    
    :global(#geo-story-1 #intro) {
        margin-bottom: 10rem;
    }

</style>