<script>
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	const { data } = $props();
</script>

<article class="page">
	<SvelteMarkdown source={data.content} />
</article>

<style>
	.page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 2rem 4rem;
	}
</style>
