<script>
  import hljs from 'highlight.js/lib/core';
  import typescript from 'highlight.js/lib/languages/typescript';
  import javascript from 'highlight.js/lib/languages/javascript';
  import r from 'highlight.js/lib/languages/r';
  import bash from 'highlight.js/lib/languages/bash';
  import xml from 'highlight.js/lib/languages/xml';
  import 'highlight.js/styles/github.css';

  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('r', r);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('svelte', xml);

  let { code, filename = '', language = 'typescript' } = $props();

  function dedent(s) {
    const lines = s.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return lines.map(l => l.slice(indent)).join('\n');
  }

  const highlightedCode = $derived(
    hljs.highlight(dedent(code), { language }).value
  );
</script>

<div class="code-block-wrapper">
  {#if filename}
    <span class="code-filename">{filename}</span>
  {/if}
  <pre class="code-view hljs"><code>{@html highlightedCode}</code></pre>
</div>

<style>
.code-block-wrapper {
  position: relative;
  min-width: 0;
  max-width: 100%;
  margin-block: var(--vcsi-space-md, 1rem);
}

.code-filename {
  position: absolute;
  top: 0;
  right: 0;
  background: #e1e4e8;
  color: #57606a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  padding: 0.35rem 0.75rem;
  border-radius: 0 8px 0 6px;
  border-left: 1px solid #d1d9e0;
  border-bottom: 1px solid #d1d9e0;
  z-index: 1;
}

:global(.dark) .code-filename {
  background: #21262d;
  color: #8b949e;
  border-color: #30363d;
}

.code-view {
  background: #f6f8fa;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1f2328;
}

.code-view code {
  background: none;
  padding: 0;
  white-space: pre;
}

:global(.dark) .code-view {
  background: #161b22;
  border-color: #30363d;
  color: #e6edf3;
}

/* Dark mode syntax highlighting */
:global(.dark) .code-view :global(.hljs-keyword) {
  color: #ff7b72;
}
:global(.dark) .code-view :global(.hljs-string) {
  color: #a5d6ff;
}
:global(.dark) .code-view :global(.hljs-title),
:global(.dark) .code-view :global(.hljs-title.function_) {
  color: #d2a8ff;
}
:global(.dark) .code-view :global(.hljs-comment) {
  color: #8b949e;
}
:global(.dark) .code-view :global(.hljs-built_in) {
  color: #ffa657;
}
:global(.dark) .code-view :global(.hljs-number) {
  color: #79c0ff;
}
:global(.dark) .code-view :global(.hljs-attr),
:global(.dark) .code-view :global(.hljs-property) {
  color: #79c0ff;
}
:global(.dark) .code-view :global(.hljs-type) {
  color: #ffa657;
}
:global(.dark) .code-view :global(.hljs-subst) {
  color: #e6edf3;
}
:global(.dark) .code-view :global(.hljs-variable) {
  color: #ffa657;
}

@media (max-width: 768px) {
  .code-filename {
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
  }

  .code-view {
    padding: 0.75rem;
    /* padding-top: 2rem; */
    font-size: 0.8rem;
    border-radius: 6px;
  }
}
</style>
