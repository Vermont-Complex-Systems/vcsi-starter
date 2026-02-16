<script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import GeoScrollyPlot from './GeoScrollyPlot.svelte';
    import { ScrollIndicator, RenderTextContent, ScrollyContent, StoryHeader, Footer } from '@the-vcsi/scrolly-kit';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
    
</script>

<BackToHome />
<ScrollIndicator threshold={50} />

<article class="story" id="geo-story-1">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        authors={data.authors}
        date={data.date}
    />

    <section id="intro">
        {#each data.introduction as item}
            <RenderTextContent {item} />
        {/each}
    </section>

    <section id="scrolly" class="fullscreen-layout">
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