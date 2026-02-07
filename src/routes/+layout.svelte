<script>
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$lib/components/Footer.svelte';
	import '$styles/app.css';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="system" />

{@render children?.()}

<Footer />
