<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import MarkdownImage from '$lib/components/MarkdownImage.svelte';
	import MarkdownCode from '$lib/components/MarkdownCode.svelte';

	interface TocEntry {
		id: string;
		label: string;
	}
	interface TocSection extends TocEntry {
		children: TocEntry[];
	}

	const { data } = $props();

	let article = $state<HTMLElement>();
	let sections = $state<TocSection[]>([]);

	function slugify(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}

	/** Give a heading a stable, unique id and return it. */
	function assignId(h: Element, seen: Map<string, number>): string {
		let id = slugify(h.textContent ?? '');
		if (seen.has(id)) {
			const n = seen.get(id)! + 1;
			seen.set(id, n);
			id = `${id}-${n}`;
		} else {
			seen.set(id, 1);
		}
		h.id = id;
		return id;
	}

	/** Collect h2 (sections) + h3 (subsections) into a nested TOC tree. */
	function buildToc() {
		if (!article) return;
		const seen = new Map<string, number>();
		const tree: TocSection[] = [];
		for (const h of article.querySelectorAll('h2, h3')) {
			const node: TocEntry = { id: assignId(h, seen), label: h.textContent ?? '' };
			if (h.tagName === 'H2') {
				tree.push({ ...node, children: [] });
			} else if (tree.length) {
				tree[tree.length - 1].children.push(node);
			}
		}
		sections = tree;
	}

	// Rebuild whenever the doc changes; rAF lets the markdown finish rendering first.
	$effect(() => {
		data.content;
		requestAnimationFrame(buildToc);
	});
</script>

<article class="page" bind:this={article}>
	<SvelteMarkdown source={data.content} renderers={{ image: MarkdownImage, code: MarkdownCode }} />

	{#if sections.length > 1}
		<TableOfContents {sections} title="On this page" />
	{/if}
</article>

<style>
	.page {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 2rem 4rem;
	}
</style>
