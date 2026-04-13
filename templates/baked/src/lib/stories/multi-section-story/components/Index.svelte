<script lang="ts">
	import { Footer, StoryHeader, ScrollyContent, RenderTextContent } from '@the-vcsi/scrolly-kit';
	import BackToHome from '$lib/components/helpers/BackToHome.svelte';
	import ScrollyPlot from './ScrollyPlot.svelte';
	import ScatterPlot from './ScatterPlot.svelte';
	import SlopeChart from './SlopeChart.svelte';

	let { story, data } = $props();

	let barIndex = $state(0);
	let scatterIndex = $state(0);

	/** Map of component names used in copy.json markers */
	const components = { SlopeChart };
</script>

<!-- Renders a content array that may contain text items or { type: "component", name: "..." } markers -->
{#snippet renderContent(items)}
	{#each items as item}
		{#if item.type === "component" && components[item.name]}
			{@const Comp = components[item.name]}
			<Comp />
		{:else}
			<RenderTextContent {item} />
		{/if}
	{/each}
{/snippet}

<BackToHome colored />

<article class="story">

	<!-- Section 1: Introduction (text from copy.json) -->
	<StoryHeader
		title={data.title}
		subtitle={data.subtitle}
		authors={data.authors}
		date={data.date}
	/>

	<section id="intro">
		{@render renderContent(data.introduction)}
	</section>

	<!-- Section 2: Bar chart scrolly -->
	<section class="split-layout">
		<div class="sticky-panel">
			<ScrollyPlot scrollyIndex={barIndex} />
		</div>
		<div class="scrolly-content">
			<ScrollyContent steps={data.barSteps} bind:value={barIndex} />
		</div>
	</section>

	<!-- Section 3: Interlude — text + static chart -->
	<section id="interlude">
		{@render renderContent(data.interlude)}
	</section>

	<!-- Section 4: Scatter plot scrolly -->
	<section class="split-layout reversed">
		<div class="sticky-panel">
			<ScatterPlot scrollyIndex={scatterIndex} />
		</div>
		<div class="scrolly-content">
			<ScrollyContent steps={data.scatterSteps} bind:value={scatterIndex} />
		</div>
	</section>

	<!-- Section 5: Conclusion (text from copy.json) -->
	<h2>Takeaway</h2>
	<section id="conclusion">
		{@render renderContent(data.conclusion)}
	</section>

</article>

<Footer theme="light" />

<style>
	#interlude {
		margin-block: 4rem;
	}
</style>