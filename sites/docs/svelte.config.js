import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      layout: {
        _: join(__dirname, 'src/lib/components/markdown/Layout.svelte')
      },
      rehypePlugins: [rehypeSlug]
    })
  ],
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/vcsi-starter' : ''
    },
    experimental: {
      remoteFunctions: true,
    }
  },
  compilerOptions: {
    experimental: {
      async: true,
    }
  }
};

export default config;
