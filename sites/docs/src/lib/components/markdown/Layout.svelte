<article class="page">
	<slot />
</article>

<style>
	.page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 2rem 4rem;
	}

	.page :global(h1) {
		margin-top: 0;
	}

	.page :global(h2) {
		margin-top: 2.5rem;
	}

	.page :global(h3) {
		margin-top: 1.5rem;
	}

	.page :global(code) {
		background: var(--vcsi-gray-100);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.page :global(pre code) {
		background: none;
		padding: 0;
	}

	.page :global(pre) {
		background: var(--vcsi-gray-100);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.page :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 0.9rem;
	}

	.page :global(th),
	.page :global(td) {
		padding: 0.5rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--vcsi-border);
	}

	.page :global(th) {
		font-weight: 600;
		background: var(--vcsi-gray-50);
	}

	.page :global(ul),
	.page :global(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.page :global(li) {
		margin: 0.5rem 0;
	}

	.page :global(.tip) {
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.page :global(.breadcrumb) {
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
		color: var(--vcsi-gray-500);
	}

	.page :global(.breadcrumb a) {
		color: var(--matisse-blue);
		text-decoration: none;
	}

	.page :global(.subtitle) {
		color: var(--vcsi-gray-600);
		font-size: 1.1rem;
		margin-top: -0.5rem;
		margin-bottom: 2rem;
	}

	/* Dark mode */
	:global(.dark) .page :global(code) {
		background: var(--vcsi-gray-800);
		color: var(--vcsi-gray-200);
	}

	:global(.dark) .page :global(pre) {
		background: var(--vcsi-gray-800);
	}

	:global(.dark) .page :global(th) {
		background: var(--vcsi-gray-900);
	}

	:global(.dark) .page :global(.subtitle) {
		color: var(--vcsi-gray-400);
	}

	:global(.dark) .page :global(.breadcrumb a) {
		color: #60a5fa;
	}

	@media (max-width: 600px) {
		.page {
			padding: 1rem;
		}
	}
</style>
