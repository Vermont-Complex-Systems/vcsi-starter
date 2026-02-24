<script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import GeoScrollyPlot from './GeoScrollyPlot.svelte';
    import { ScrollIndicator, RenderTextContent, ScrollyContent, StoryHeader, Footer } from '@the-vcsi/scrolly-kit';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
</script>

<BackToHome />
<ScrollIndicator threshold={50} />

<article class="story" id="geo-story-duckdb">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        authors={data.authors}
        date={data.date}
        warning="Content is currently boilerplate and co-written with Claude"
    />

    <section id="intro">
        {#each data.introduction as item}
            <RenderTextContent {item} />
        {/each}
    </section>

    <section id="geo-duckdb-scrolly" class="fullscreen-layout">
        <div class="sticky-panel">
            <GeoScrollyPlot {scrollyIndex} />
        </div>
        <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </section>

    <h2>Conclusion</h2>
    <section id="conclusion">
        {#each data.conclusion as item}
            <RenderTextContent {item} />
        {/each}
    </section>

    <h2>Appendix</h2>
    <section id="appendix">
        {#each data.appendix as item}
            <RenderTextContent {item} />
        {/each}
    </section>
</article>

<Footer theme="light" />

<style>
    #geo-duckdb-scrolly { --step-height: 70rem; }
</style>
