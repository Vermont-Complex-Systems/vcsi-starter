<!--
@component
Copyable code block with one-click clipboard support and optional syntax highlighting.

Displays a command or code snippet with a copy button. Shows a checkmark
when successfully copied, reverting after 2 seconds.

## Props
- `command` - The text to display and copy (required)
- `label` - Optional label shown above the code block
- `language` - Optional language for syntax highlighting (e.g., 'svelte', 'javascript', 'bash')

## Usage
```svelte
<CopyCodeBlock command="npm install @the-vcsi/scrolly-kit" />

<CopyCodeBlock
  command="npx degit Vermont-Complex-Systems/vcsi-starter my-project"
  label="Scaffold a new project"
/>

<CopyCodeBlock
  command={`<script>
  let count = $state(0);
<\/script>`}
  language="svelte"
/>
```
-->
<script lang="ts">
    import Md from './MarkdownRenderer.svelte';

    interface Props {
        command: string;
        label?: string;
        language?: string;
    }

    let { command, label = '', language = '' }: Props = $props();
    let copied = $state(false);

    async function copyCommand(): Promise<void> {
        await navigator.clipboard.writeText(command);
        copied = true;
        setTimeout(() => copied = false, 2000);
    }

    /** Escape HTML entities so code displays as text, not rendered HTML */
    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
</script>

<div class="code-block-wrapper">
    {#if label}
        <span class="code-label">{label}</span>
    {/if}
    <div class="code-block" class:has-highlight={language}>
        {#if language}
            <div class="highlighted-code">
                <Md text={`<pre><code class="language-${language}">${escapeHtml(command)}</code></pre>`} />
            </div>
        {:else}
            <code>{command}</code>
        {/if}
        <button class="copy-btn" onclick={copyCommand} aria-label="Copy code">
            {#if copied}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            {/if}
        </button>
    </div>
</div>

<style>
    .code-block-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--vcsi-space-xs);
        margin-block: var(--vcsi-space-md, 1rem);
    }

    .code-label {
        font-size: 0.8rem;
        font-family: var(--vcsi-font-sans);
        color: var(--vcsi-gray-700);
        font-weight: 500;
    }

    .code-block {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: var(--vcsi-space-sm);
        background: rgba(0, 0, 0, 0.06);
        border-radius: var(--vcsi-radius-md);
        padding: 0.75rem 1rem;
        font-family: var(--vcsi-font-mono);
        font-size: 0.875rem;
        max-width: 100%;
        overflow-x: auto;
        transition: background-color var(--vcsi-transition-base);
    }

    /* When using syntax highlighting, let the pre/code handle background */
    .code-block.has-highlight {
        background: transparent;
        padding: 0;
    }

    :global(.dark) .code-block:not(.has-highlight) {
        background: rgba(255, 255, 255, 0.1);
    }

    .code-block > code {
        color: var(--vcsi-fg);
        white-space: pre;
        background: transparent;
        flex: 1;
    }

    /* Highlighted code container */
    .highlighted-code {
        flex: 1;
        min-width: 0;
        overflow-x: auto;
    }

    /* Reset any wrapper margins from Markdown component */
    .highlighted-code :global(> *) {
        margin: 0;
    }

    .highlighted-code :global(pre) {
        margin: 0;
        padding: 0.75rem 1rem;
        padding-right: 3rem; /* Space for copy button */
        border-radius: var(--vcsi-radius-md);
    }

    .highlighted-code :global(code) {
        background: transparent;
        padding-left: 0;
    }

    /* Hide line numbers in CopyCodeBlock */
    .highlighted-code :global([data-line-number]::before) {
        display: none;
    }

    .highlighted-code :global(.code-line) {
        padding-left: 0;
    }

    .copy-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: none;
        border: none;
        padding: var(--vcsi-space-xs);
        cursor: pointer;
        color: var(--vcsi-fg);
        opacity: 0.6;
        transition: opacity var(--vcsi-transition-base);
    }

    /* Position copy button absolutely when using highlighting */
    .code-block.has-highlight .copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 1;
    }

    .code-block:not(.has-highlight) .copy-btn {
        margin-left: auto;
    }

    .copy-btn:hover {
        opacity: 1;
    }
</style>
