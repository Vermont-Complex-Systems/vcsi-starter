import type { Snippet } from 'svelte';

// ============================================================================
// Component Props Types
// These are exported so users get better TypeScript hints
// ============================================================================

/** Props for Scrolly component */
export interface ScrollyProps {
  /** Root element for IntersectionObserver */
  root?: Element | null;
  /** Top margin for intersection */
  top?: number;
  /** Bottom margin for intersection */
  bottom?: number;
  /** Number of threshold increments */
  increments?: number;
  /** Current scroll index (bindable) */
  value?: number;
  /** Children snippet */
  children?: Snippet;
}

/** Props for ScrollyContent component */
export interface ScrollyContentProps {
  /** Array of content steps */
  steps: ContentItem[];
  /** Current step index (bindable) */
  value?: number;
  /** Add spacer at top */
  topSpacer?: boolean;
  /** Add spacer at bottom */
  bottomSpacer?: boolean;
  /** Custom content renderer snippet */
  contentRenderer?: Snippet<[{ item: ContentItem; index: number }]>;
}

/** Content item for ScrollyContent steps */
export interface ContentItem {
  /** Content type: 'html' | 'markdown' | 'math' | 'code' */
  type: 'html' | 'markdown' | 'math' | 'code';
  /** Content value */
  value: string;
}

/** Author info for StoryHeader */
export interface Author {
  /** Author name */
  name: string;
  /** Optional URL to author page */
  url?: string;
}

/** Props for StoryHeader component */
export interface StoryHeaderProps {
  /** Story title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Array of authors */
  authors?: Author[];
  /** Publication date */
  date?: string;
  /** Additional CSS class */
  class?: string;
}

/** Props for MarkdownRenderer component */
export interface MarkdownRendererProps {
  /** Markdown text to render */
  text: string;
}

/** Props for CodeBlock component */
export interface CodeBlockProps {
  /** Code to display */
  code: string;
  /** Optional filename to show */
  filename?: string;
  /** Syntax highlighting language */
  language?: string;
}

/** Props for CopyCodeBlock component */
export interface CopyCodeBlockProps {
  /** Command/code to copy */
  command: string;
  /** Optional label */
  label?: string;
}

/** Props for SimpleToggle component */
export interface SimpleToggleProps {
  /** Toggle state (bindable) */
  isTrue?: boolean;
  /** Text when on */
  onText?: string;
  /** Text when off */
  offText?: string;
}

/** Props for Tooltip component */
export interface TooltipProps {
  /** Whether tooltip is visible */
  visible?: boolean;
  /** X position */
  x?: number;
  /** Y position */
  y?: number;
  /** Tooltip content */
  content?: string;
  /** Position offset */
  offset?: { x: number; y: number };
}

/** Props for ScrollIndicator component */
export interface ScrollIndicatorProps {
  /** Scroll threshold to hide indicator */
  threshold?: number;
}

/** Props for Spinner component */
export interface SpinnerProps {
  /** Loading text */
  text?: string;
}

/** Props for Meta component */
export interface MetaProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Base URL for canonical/OG URLs */
  baseUrl?: string;
  /** Site name for OG */
  siteName?: string;
  /** Keywords for meta tag */
  keywords?: string;
  /** OG image URL */
  image?: string;
  /** Author name */
  author?: string;
}

/** Props for RenderTextContent component */
export interface RenderTextContentProps {
  /** Content item to render */
  item: ContentItem;
}

/** Code step for CodeExplainer */
export interface CodeStep {
  /** Step content (markdown) */
  content: ContentItem;
  /** Lines to highlight (e.g., "1-3,5") */
  highlightLines?: string;
}

/** Data for CodeExplainer component */
export interface CodeExplainerData {
  /** Code to display */
  code: string;
  /** Syntax highlighting language */
  language?: string;
  /** Array of explanation steps */
  steps: CodeStep[];
}

/** Props for CodeExplainer component */
export interface CodeExplainerProps {
  /** Code explainer data */
  data: CodeExplainerData;
  /** Reverse layout (code on right) */
  reversed?: boolean;
  /** Current step index (bindable) */
  value?: number;
}
