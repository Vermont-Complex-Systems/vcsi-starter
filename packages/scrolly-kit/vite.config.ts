import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // Dev playground only: lucide ships .svelte files without a top-level
    // "svelte" field, so SSR must bundle it rather than externalize it.
    noExternal: ['@lucide/svelte']
  }
});
