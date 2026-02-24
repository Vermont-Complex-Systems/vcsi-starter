import type { ComponentProps } from 'svelte';

// Import components to extract their prop types
import type Scrolly from './components/Scrolly.svelte';
import type ScrollyContent from './components/ScrollyContent.svelte';
import type MarkdownRenderer from './components/MarkdownRenderer.svelte';
import type CodeBlock from './components/CodeBlock.svelte';
import type SimpleToggle from './components/bits-ui/SimpleToggle.svelte';
import type Tooltip from './components/Tooltip.svelte';
import type ScrollIndicator from './components/ScrollIndicator.svelte';
import type CopyCodeBlock from './components/CopyCodeBlock.svelte';
import type CodeExplainer from './components/CodeExplainer.svelte';
import type Spinner from './components/Spinner.svelte';
import type Meta from './components/Meta.svelte';
import type StoryHeader from './components/StoryHeader.svelte';
import type RenderTextContent from './components/RenderTextContent.svelte';
import type Nav from './components/Nav.svelte';
import type NavMenu from './components/NavMenu.svelte';
import type Footer from './components/Footer.svelte';
import type DashboardShell from './components/bits-ui/DashboardShell.svelte';
import type ChartTooltip from './components/bits-ui/ChartTooltip.svelte';
import type RangeSlider from './components/bits-ui/RangeSlider.svelte';

// ============================================================================
// Component Props - extracted using ComponentProps<typeof Component>
// ============================================================================

/** Props for Scrolly component */
export type ScrollyProps = ComponentProps<typeof Scrolly>;

/** Props for ScrollyContent component */
export type ScrollyContentProps = ComponentProps<typeof ScrollyContent>;

/** Props for MarkdownRenderer component */
export type MarkdownRendererProps = ComponentProps<typeof MarkdownRenderer>;

/** Props for CodeBlock component */
export type CodeBlockProps = ComponentProps<typeof CodeBlock>;

/** Props for SimpleToggle component */
export type SimpleToggleProps = ComponentProps<typeof SimpleToggle>;

/** Props for Tooltip component */
export type TooltipProps = ComponentProps<typeof Tooltip>;

/** Props for ScrollIndicator component */
export type ScrollIndicatorProps = ComponentProps<typeof ScrollIndicator>;

/** Props for CopyCodeBlock component */
export type CopyCodeBlockProps = ComponentProps<typeof CopyCodeBlock>;

/** Props for CodeExplainer component */
export type CodeExplainerProps = ComponentProps<typeof CodeExplainer>;

/** Props for Spinner component */
export type SpinnerProps = ComponentProps<typeof Spinner>;

/** Props for Meta component */
export type MetaProps = ComponentProps<typeof Meta>;

/** Props for StoryHeader component */
export type StoryHeaderProps = ComponentProps<typeof StoryHeader>;

/** Props for RenderTextContent component */
export type RenderTextContentProps = ComponentProps<typeof RenderTextContent>;

/** Props for Nav component */
export type NavProps = ComponentProps<typeof Nav>;

/** Props for NavMenu component */
export type NavMenuProps = ComponentProps<typeof NavMenu>;

/** Props for Footer component */
export type FooterProps = ComponentProps<typeof Footer>;

/** Props for DashboardShell component */
export type DashboardShellProps = ComponentProps<typeof DashboardShell>;

/** Props for ChartTooltip component */
export type ChartTooltipProps = ComponentProps<typeof ChartTooltip>;

/** Props for RangeSlider component */
export type RangeSliderProps = ComponentProps<typeof RangeSlider>;

// ============================================================================
// Sidebar state (re-exported for advanced usage)
// ============================================================================

export { SidebarState } from './components/bits-ui/sidebar/sidebar-state.svelte';

// ============================================================================
// Data types used by components (not component props)
// ============================================================================

/** Content item for ScrollyContent steps */
export interface ContentItem {
  /** Content type */
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
