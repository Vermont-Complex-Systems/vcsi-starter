import { readFileSync } from 'fs';
import { join } from 'path';

const componentsDir = '../../packages/scrolly-kit/src/lib/components';

/** Extract local component imports from source code */
function extractDependencies(source: string): string[] {
  const importRegex = /import\s+\w+\s+from\s+['"]\.\/(\w+)\.svelte['"]/g;
  const deps: string[] = [];
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    deps.push(match[1]);
  }
  return deps;
}

/** Read a component file, returns null if not found */
function readComponent(name: string): string | null {
  try {
    const filePath = join(process.cwd(), componentsDir, `${name}.svelte`);
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export function load({ params }) {
  const { slug } = params;

  const source = readComponent(slug);
  if (!source) {
    return { source: null, dependencies: {} };
  }

  // Find and load dependencies
  const depNames = extractDependencies(source);
  const dependencies: Record<string, string> = {};

  for (const depName of depNames) {
    const depSource = readComponent(depName);
    if (depSource) {
      dependencies[depName] = depSource;
    }
  }

  return { source, dependencies };
}
