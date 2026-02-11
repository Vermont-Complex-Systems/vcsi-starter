<script>
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<Nav />

<main id="content">
	{@render children?.()}
</main>

<Footer />