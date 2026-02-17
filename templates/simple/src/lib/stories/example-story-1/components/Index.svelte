<script lang="ts">
	import { Footer } from '@the-vcsi/scrolly-kit';
	import BackToHome from '$lib/components/helpers/BackToHome.svelte';
	let { story, data } = $props();
</script>

<BackToHome />

<article class="story" data-theme="dark">
	<h1>{data.title}</h1>
	<p>{data.subtitle}</p>
	
</article>

<Footer theme="dark" />
