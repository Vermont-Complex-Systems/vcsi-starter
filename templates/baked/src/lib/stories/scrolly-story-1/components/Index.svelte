<script lang="ts">
	import BackToHome from '$lib/components/helpers/BackToHome.svelte';
	import ScrollyPlot from './ScrollyPlot.svelte';
	import RankPlot from './RankPlot.svelte';
	import SlopeChart from './SlopeChart.svelte';
	import {
		ScrollIndicator,
		RenderContent,
		ScrollyContent,
		StoryHeader,
		Footer
	} from '@the-vcsi/scrolly-kit';

	let { story, data } = $props();

	let barIndex = $state(undefined);
	let rankIndex = $state(0);

	/** Components that copy.json can reference via { "type": "component", "value": "Name" } */
	const components = { SlopeChart };
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

	<!-- Section 1: Introduction -->
	<section id="intro">
		<RenderContent items={data.introduction}/>
	</section>

	<!-- Section 2: Bar chart scrolly -->
	<section id="scrolly" class="split-layout">
		<div class="sticky-panel">
			<ScrollyPlot scrollyIndex={barIndex} />
		</div>
		<div class="scrolly-content">
			<ScrollyContent steps={data.steps} bind:value={barIndex} topSpacer={false} />
		</div>
	</section>

	<!-- Section 3: Interlude with inline SlopeChart -->
	<section id="interlude">
		<RenderContent items={data.interlude} {components} />
	</section>

	<!-- Section 4: Rank-frequency scrolly (reversed layout, tighter gap) -->
	<section class="split-layout reversed rank-section">
		<div class="sticky-panel">
			<RankPlot scrollyIndex={rankIndex} />
		</div>
		<div class="scrolly-content">
			<ScrollyContent steps={data.rankSteps} bind:value={rankIndex} />
		</div>
	</section>

	<!-- Section 5: Markdown renderer showcase -->
	<h2>Markdown Renderer</h2>
	<section id="markdown">
		<RenderContent items={data.markdownRenderer} />
	</section>

	<!-- Section 6: Conclusion -->
	<h2>Conclusion</h2>
	<section id="conclusion">
		<RenderContent items={data.conclusion} />
	</section>
</article>

<Footer theme="light" />

<style>
	@media (min-width: 769px) {
		/* Layout variables — must be on .split-layout (the element that reads them) */
		.split-layout {
			--vcsi-panel-width: 65%;
		}
		
		/* Step variables — cascade down to children inside .scrolly-content */
		.scrolly-content {
			--vcsi-story-step-bg: transparent;
			--vcsi-story-step-bg-inactive: transparent;
			--vcsi-step-box-shadow: none;
			--vcsi-step-height: 90vh;
			--vcsi-step-max-width: 400px;
		}
	}

	#interlude {
		margin-block: 4rem;
	}

</style>