import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@duckdb/duckdb-wasm']
	},
	plugins: [sveltekit()]
});
