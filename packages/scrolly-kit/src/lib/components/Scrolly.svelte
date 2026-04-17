<!--
@component
Base scroll detection using IntersectionObserver.

Tracks which child element is most in view and updates the `value` binding.
Used internally by ScrollyContent, but can be used directly for custom layouts.

## Props
- `value` - Index of most visible child (bindable)
- `scrollProgress` - Progress through the active step, 0 to 1 (bindable)
- `root` - IntersectionObserver root element (default: null = viewport)
- `top` - Top margin offset in pixels (default: 0)
- `bottom` - Bottom margin offset in pixels (default: 0)
- `increments` - Number of threshold steps (default: 100)

## Usage
Wrap step elements and bind to track active index:
`<Scrolly bind:value={index}>...steps...</Scrolly>`
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		root?: Element | null;
		top?: number;
		bottom?: number;
		increments?: number;
		value?: number;
		scrollProgress?: number;
		children?: Snippet;
	}

	let {
		root = null,
		top = 0,
		bottom = 0,
		increments = 100,
		value = $bindable<number | undefined>(undefined),
		scrollProgress = $bindable<number>(0),
		children
	}: Props = $props();

	let steps: number[] = [];
	let threshold: number[] = [];
	let nodes: NodeListOf<Element> | Element[] = [];
	let intersectionObservers: IntersectionObserver[] = [];
	let container: HTMLDivElement | undefined = $state(undefined);

	function mostInView(): void {
		let maxRatio = 0;
		let maxIndex = 0;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > maxRatio) {
				maxRatio = steps[i];
				maxIndex = i;
			}
		}

		if (maxRatio > 0) {
			value = maxIndex;
			const node = nodes[maxIndex] as HTMLElement | undefined;
			if (node) {
				const rect = node.getBoundingClientRect();
				const prog = (window.innerHeight / 2 - rect.top) / rect.height;
				scrollProgress = Math.min(1, Math.max(0, prog));
			} else {
				scrollProgress = 0;
			}
		} else {
			value = undefined;
			scrollProgress = 0;
		}
	}

	function createObserver(node: Element, index: number): void {
		const handleIntersect = (e: IntersectionObserverEntry[]): void => {
			const ratio = e[0].intersectionRatio;
			steps[index] = ratio;
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	}

	function update(): void {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	}

	$effect(() => {
		if (!container) return;

		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();
	});

	$effect(() => {
		top;
		bottom;
		update();
	});

</script>

<div bind:this={container}>
	{@render children?.()}
</div>
