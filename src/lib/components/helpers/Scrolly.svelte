<script>
	/**
	 * This component manages which item is most in view for scroll triggering
	 * example:
	 * <Scrolly
	 * 	bind:value={scrollIndex}
	 * >
	 * **items here**
	 * </Scrolly>
	 *
	 * optional params with defaults
	 * <Scrolly root={null} top={0} bottom={0} increments={100}>
	 */

	let {
		root = null,
		top = 0,
		bottom = 0,
		increments = 100,
		value = $bindable(undefined),
		scrollProgress = $bindable(undefined),
		children
	} = $props();

	let steps = [];
	let threshold = [];
	let nodes = [];
	let intersectionObservers = [];
	let container = undefined;

	// Calculate trigger point in pixels, supporting vh units
	let triggerPointPx = $derived(() => {
		if (typeof top === 'string' && top.includes('vh')) {
			const vh = parseFloat(top);
			return (window.innerHeight * vh) / 100;
		}
		return top || window.innerHeight / 2;
	});

	function findActiveStep() {
		if (!nodes.length) return;

		const trigger = triggerPointPx();
		const triggerLine = window.scrollY + trigger;
		let activeIndex = -1;

		for (let i = 0; i < nodes.length; i++) {
			const rect = nodes[i].getBoundingClientRect();
			const elementTop = window.scrollY + rect.top;

			if (elementTop <= triggerLine) {
				activeIndex = i;
			} else {
				break;
			}
		}

		if (activeIndex >= 0) {
			value = activeIndex;

			// Calculate scroll progress for the current step
			const rect = nodes[activeIndex].getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			let prog = (viewportHeight / 2 - rect.top) / rect.height;
			prog = Math.min(1, Math.max(0, prog));
			scrollProgress = prog;
		} else {
			value = undefined;
			scrollProgress = 0;
		}
	}

	function createObserver(node, index) {
		const handleIntersect = (e) => {
			steps[index] = e[0].intersectionRatio;
			findActiveStep();
		};

		const trigger = triggerPointPx();
		const marginTop = trigger ? trigger * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	}

	function update() {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	}

	function handleScroll() {
		findActiveStep();
	}

	$effect(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			intersectionObservers.forEach(observer => observer.disconnect());
		};
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
