import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

// Lazy glob — each story becomes its own chunk.
const componentModules = import.meta.glob<{ default: Component }>(
  '$lib/stories/*/components/Index.svelte'
);

/**
 * Resolve a story slug to its Index.svelte component.
 *
 * Lives outside story.remote.ts because .remote.ts files may only export
 * remote functions, and Svelte components aren't serializable across that
 * boundary anyway.
 */
export async function loadStoryComponent(slug: string): Promise<Component> {
  const loader = componentModules[`/src/lib/stories/${slug}/components/Index.svelte`];
  if (!loader) error(404, `Story "${slug}" not found`);
  const mod = await loader();
  return mod.default;
}
