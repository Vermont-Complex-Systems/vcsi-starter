<script>
	import { Nav, Footer } from '@the-vcsi/scrolly-kit';

	let { children } = $props();
</script>

<Nav
  links={[
    { href: '/about', label: 'About' },
    { href: '/getting-started', label: 'Videos & Tutorials' }
  ]}
/>

<main id="content">
	{@render children?.()}
</main>

<Footer />