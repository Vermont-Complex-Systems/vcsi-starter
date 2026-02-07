<script>
import BackgroundPlot from './BackgroundPlot.svelte';
import StoryHeader from '$lib/components/StoryHeader.svelte';
import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';
import BackToHome from '$lib/components/helpers/BackToHome.svelte';

import { renderTextContent } from '$lib/components/helpers/ScrollySnippets.svelte';
import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';

let { story, data } = $props();
let scrollyIndex = $state(undefined);

</script>

<BackToHome />
<ScrollIndicator />


<article class="story dark" style="--story-bg: #353839; --story-fg: white;">
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
            <BackgroundPlot {scrollyIndex} />
        </div>
        <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </section>
    
    <h2 class="prose">Conclusion</h2>
    <section id="conclusion" class="prose">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
</article>

