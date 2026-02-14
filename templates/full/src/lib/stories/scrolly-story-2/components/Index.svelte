<script>
import BackgroundPlot from './BackgroundPlot.svelte';
import { ScrollIndicator, RenderTextContent, ScrollyContent, StoryHeader } from '@vcsi/scrolly-kit';
import BackToHome from '$lib/components/helpers/BackToHome.svelte';
import Footer from '$lib/components/Footer.svelte';

let { story, data } = $props();
let scrollyIndex = $state(undefined);

</script>

<BackToHome />
<ScrollIndicator />

<article class="story dark">
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
            <BackgroundPlot {scrollyIndex} />
        </div>
        <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </section>

    <h2>Conclusion</h2>
    <section id="conclusion">
        {#each data.conclusion as item}
            <RenderTextContent {item} />
        {/each}
    </section>
</article>

<!-- putting inside the Footer to inehrit the story-class -->
<Footer theme="dark" />