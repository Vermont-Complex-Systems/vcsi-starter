<script lang="ts">
	// Story playground: the .story container + a split-layout scrolly section,
	// straight from $lib with dummy steps. One $state per scrolly section;
	// the visual derives from the index (array lookup — see the skill).
	import { ScrollyContent, type ContentItem } from '$lib';

	let step: number | undefined = $state(undefined);

	const steps: ContentItem[] = [
		{ type: 'markdown', value: 'A **sticky panel** on the right, steps scrolling on the left.' },
		{ type: 'markdown', value: 'The circle derives its look from the step index.' },
		{ type: 'markdown', value: 'Step boxes use the `--vcsi-step-*` tokens.' }
	];

	const looks = [
		{ r: 40, fill: '#154734' },
		{ r: 80, fill: '#2c5aa0' },
		{ r: 120, fill: '#e0843c' }
	];
	let look = $derived(looks[step ?? 0] ?? looks[0]);
</script>

<article class="story">
	<h1>Story defaults</h1>
	<p>
		Prose in a story is centered at <code>--vcsi-story-max-width</code>. The section below
		breaks out to full width. Back to the <a href="/">kitchen sink</a>.
	</p>

	<table>
		<tbody>
			<tr><td>bare table in a story</td><td>joins the prose column</td></tr>
		</tbody>
	</table>

	<section class="split-layout">
		<div class="sticky-panel">
			<svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
				<circle cx="150" cy="150" r={look.r} fill={look.fill} style="transition: all 0.5s ease;" />
			</svg>
		</div>
		<div class="scrolly-content">
			<ScrollyContent {steps} bind:value={step} />
		</div>
	</section>

	<p>And prose resumes, centered, after the scrolly section.</p>
</article>
