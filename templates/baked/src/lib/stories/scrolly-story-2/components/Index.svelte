<script>
import BackgroundPlot from './BackgroundPlot.svelte';
import { ScrollIndicator, RenderContent, ScrollyContent, StoryHeader, Footer } from '@the-vcsi/scrolly-kit';
import BackToHome from '$lib/components/helpers/BackToHome.svelte';

let { story, data } = $props();
let scrollyIndex = $state(undefined);

</script>

<BackToHome />
<ScrollIndicator />

<article class="story" data-theme="dark">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        authors={data.authors}
        date={data.date}
    />

    <section id="intro">
        <RenderContent items={data.introduction} />
    </section>

    <section id="scrolly" class="fullscreen-layout">
        <div class="sticky-panel">
            <BackgroundPlot {scrollyIndex} />
        </div>
        <div class="scrolly-content">
            <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
        </div>
    </section>

    <h2>Conclusion</h2>
    <section id="conclusion">
        <RenderContent items={data.conclusion} />
    </section>
</article>

<!-- putting inside the Footer to inehrit the story-class -->
<Footer theme="dark" />

<style>
    @media (max-width: 769px) {
		.scrolly-content {
			--vcsi-step-height: 50rem;
		}
	}
</style>