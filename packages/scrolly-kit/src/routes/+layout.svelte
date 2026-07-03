<script>
	// The package's own dev playground: imports the SOURCE styles, so editing
	// src/lib/styles/*.css hot-reloads here with no rebuild. Deliberately zero
	// custom CSS — this app shows what scrolly-kit looks like untweaked.
	// Chrome mirrors the templates: Nav on pages (kitchen sink), none on stories.
	import '$lib/styles/all.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="system" />

<main>
	{@render children()}
</main>
