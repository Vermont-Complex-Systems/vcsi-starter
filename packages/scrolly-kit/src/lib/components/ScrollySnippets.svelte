<script module lang="ts">
    /**
     * Content item for scrolly steps.
     * @example { "type": "markdown", "value": "Some **bold** text" }
     */
    export interface ContentItem {
        /** For `component`, `value` names a key in the `components` map passed to RenderContent */
        type: 'markdown' | 'html' | 'math' | 'code' | 'component';
        value: string;
        /** Language hint for code blocks, e.g. "js", "python" */
        language?: string;
        /** Lines to highlight in a code block, e.g. "1-3,5" or "2,4-6" */
        highlightLines?: string;
    }

    /** Escape HTML entities so code displays as text, not rendered HTML. */
    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Build the HTML string for a code block with syntax-highlighting hints.
     * Pass the result to <MarkdownRenderer> to render a styled code block.
     * @example <Md text={renderCodeHtml(code, 'js', '1-3,5')} />
     */
    export function renderCodeHtml(code: string, language?: string, highlightLines?: string): string {
        const escaped = escapeHtml(code);
        const langClass = language ? `language-${language}` : '';
        const highlightAttr = highlightLines ? `data-highlight-lines="${highlightLines}"` : '';
        return `<pre><code class="${langClass} show-line-numbers" ${highlightAttr}>${escaped}</code></pre>`;
    }
</script>

<!--
  This file exports types and utilities for scrolly content.
  Use RenderContent component for rendering content items.
-->
