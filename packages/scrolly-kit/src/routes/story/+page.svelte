<script lang="ts">
	// Story playground: the .story container + a split-layout scrolly section,
	// straight from $lib with dummy steps. One $state per scrolly section;
	// the visual derives from the index (array lookup — see the skill).
	import { ScrollyContent, Footer, ThemeToggle, type ContentItem } from '$lib';

	let step: number | undefined = $state(undefined);

	// A story owns its theme: global dark mode never reaches .story, you opt in
	// with data-theme="dark". This toggle exercises exactly that mechanism.
	let storyTheme: 'light' | 'dark' = $state('light');

	const steps: ContentItem[] = [
		{ type: 'markdown', value: 'A **sticky panel** on the right, steps scrolling on the left.' },
		{ type: 'markdown', value: 'The circle derives its look from the step index.' },
		{ type: 'markdown', value: 'Step boxes use the `--vcsi-step-*` tokens.' },
		{ type: 'markdown', value: 'Steps here are compressed (`--vcsi-step-height`) so you can see **active vs inactive** states together.' },
		{ type: 'markdown', value: 'The last step. Scroll back up to watch states flip.' }
	];

	const looks = [
		{ r: 40, fill: '#154734' },
		{ r: 70, fill: '#2c5aa0' },
		{ r: 100, fill: '#e0843c' },
		{ r: 70, fill: '#7a3e9d' },
		{ r: 40, fill: '#b3403c' }
	];
	let look = $derived(looks[step ?? 0] ?? looks[0]);
</script>

<!-- Stories have no Nav (matching the templates' [slug] routes); the floating
     global toggle is here so you can verify the story ignores it. -->
<div class="playground-theme-toggle">
	<ThemeToggle />
</div>

<article class="story" data-theme={storyTheme}>
	<h1>Story defaults</h1>
	<p>
		Prose in a story is centered at <code>--vcsi-story-max-width</code>. The section below
		breaks out to full width. Back to the <a href="/">kitchen sink</a>.
	</p>
	<p>
		<button onclick={() => (storyTheme = storyTheme === 'light' ? 'dark' : 'light')}>
			Story theme: {storyTheme} (click to flip)
		</button>
		— stories are isolated from the global toggle (top right); this flips
		<code>data-theme</code> on the story root.
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
		<!-- Compressed steps (default is 90vh: one step per viewport) so
		     active/inactive step states are visible side by side. -->
		<div class="scrolly-content" style="--vcsi-step-height: 35vh; --vcsi-spacer-height: 20vh;">
			<ScrollyContent {steps} bind:value={step} />
		</div>
	</section>

	<p>And prose resumes, centered, after the scrolly section.</p>
</article>

<!-- The documented pattern: a story owns its theme, and the footer matches it
     explicitly (theme prop) rather than following the global toggle. Flip the
     story button and the footer follows; flip the global toggle and it doesn't. -->
<Footer theme={storyTheme} />

<style>
	.playground-theme-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
	}
</style>
