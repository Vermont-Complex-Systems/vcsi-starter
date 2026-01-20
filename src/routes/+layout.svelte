<script>
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '$styles/app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.jpg" />
	<script async defer src="https://cloud.umami.is/script.js" data-website-id="44b340b0-d307-4438-8fb4-4e17f1767354"></script>
</svelte:head>

<Nav />

<ModeWatcher defaultMode="light" />

<main id="content">
	{@render children?.()}
</main>

<Footer />

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		padding: 5rem 0; /* space for fixed nav */
	}
	
	@media (max-width: 768px) {
		main {
			padding: 6rem 0 3rem;
		}
	}
</style>
