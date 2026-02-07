<script>
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<Nav />

<main id="content">
	{@render children?.()}
</main>