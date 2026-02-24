import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte()
  ],
  resolve: {
    alias: {
      '$app/environment': new URL('./tests/__mocks__/app-environment.ts', import.meta.url).pathname,
    }
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
