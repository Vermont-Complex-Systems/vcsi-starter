<script>
	// The package's own dev playground: imports the SOURCE styles, so editing
	// src/lib/styles/*.css hot-reloads here with no rebuild. Deliberately zero
	// custom CSS — this app shows what scrolly-kit looks like untweaked.
	import '$lib/styles/all.css';

	let { children } = $props();
</script>

<main>
	{@render children()}
</main>
