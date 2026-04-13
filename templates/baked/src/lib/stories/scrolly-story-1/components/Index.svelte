<script lang="ts">
	import BackToHome from '$lib/components/helpers/BackToHome.svelte';
	import ScrollyPlot from './ScrollyPlot.svelte';
	import {
		ScrollIndicator,
		RenderTextContent,
		ScrollyContent,
		StoryHeader,
		Footer
	} from '@the-vcsi/scrolly-kit';

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
			<RenderTextContent {item} />
		{/each}
	</section>

	<section id="scrolly" class="split-layout">
		<div class="sticky-panel">
			<ScrollyPlot {scrollyIndex} />
		</div>

		<div class="scrolly-content">
			<ScrollyContent steps={data.steps} bind:value={scrollyIndex} topSpacer={false} />
		</div>
	</section>

	<h2>Markdown Renderer</h2>
	<section id="markdown">
		{#each data.markdownRenderer as item}
			<RenderTextContent {item} />
		{/each}
	</section>

	<h2>Conclusion</h2>
	<section id="conclusion">
		{#each data.conclusion as item}
			<RenderTextContent {item} />
		{/each}
	</section>
</article>

<Footer theme="light" />

<style>
	/* desktop only */
	@media (min-width: 769px) {
		.scrolly-content {
			--vcsi-story-step-bg: transparent;
			--vcsi-story-step-bg-inactive: transparent;
			--vcsi-step-box-shadow: none;
			--vcsi-step-height: 90vh;
			--vcsi-step-max-width: 400px;
		}
	}
</style>
