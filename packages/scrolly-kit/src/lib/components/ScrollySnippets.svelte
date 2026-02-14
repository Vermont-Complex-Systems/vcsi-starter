<script module lang="ts">
    /**
     * Content item for scrolly steps.
     * @example { "type": "markdown", "value": "Some **bold** text" }
     */
    export interface ContentItem {
        type: 'html' | 'markdown' | 'math' | 'code';
        value: string | string[];
        language?: string;
        /** Lines to highlight, e.g. "1-3,5" or "2,4-6" */
        highlightLines?: string;
    }

    /** Escape HTML entities so code displays as text, not rendered HTML */
    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Generate HTML string for a code block with syntax highlighting.
     * Use with <Md text={renderCodeHtml(...)} /> for dynamic highlighting.
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
  Use RenderTextContent component for rendering content items.
-->
