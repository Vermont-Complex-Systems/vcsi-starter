<script>
	import { base } from '$app/paths';
	import { redirect } from '@sveltejs/kit';

	redirect(302, `${base}/docs/getting-started`);
</script>
