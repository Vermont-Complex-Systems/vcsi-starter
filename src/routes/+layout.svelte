<script>
	import { ModeWatcher } from 'mode-watcher';
	import '$styles/app.css';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="system" />

{@render children?.()}
