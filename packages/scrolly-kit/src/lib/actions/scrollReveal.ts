interface ScrollRevealOptions {
	threshold?: number;
	rootMargin?: string;
}

interface ScrollRevealReturn {
	destroy: () => void;
}

/**
 * Svelte action for scroll-based reveal animations using Intersection Observer.
 *
 * Usage:
 * ```svelte
 * <section use:scrollReveal>Content</section>
 * ```
 *
 * CSS (add to your component):
 * ```css
 * @media (prefers-reduced-motion: no-preference) {
 *   :global(section[data-animate="true"]) {
 *     opacity: 0;
 *     transition: opacity 0.5s ease-out;
 *   }
 *   :global(section[data-animate="true"][data-revealed="true"]) {
 *     opacity: 1;
 *   }
 * }
 * ```
 *
 * @param node - The DOM element to observe
 * @param options - Configuration options
 * @returns Svelte action object with destroy method
 */
export function scrollReveal(node: HTMLElement, options: ScrollRevealOptions = {}): ScrollRevealReturn | void {
	const {
		threshold = 0.1,
		rootMargin = '0px 0px -100px 0px'
	} = options;

	// Use data attribute instead of class for scoping
	node.dataset.animate = 'true';

	// SSR: reveal immediately (no $app/environment — works outside SvelteKit)
	if (typeof window === 'undefined') {
		node.dataset.revealed = 'true';
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				// Only reveal when element is entering viewport
				if (entry.isIntersecting && entry.intersectionRatio > threshold) {
					(entry.target as HTMLElement).dataset.revealed = 'true';
				}
			});
		},
		{
			threshold,
			rootMargin
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
