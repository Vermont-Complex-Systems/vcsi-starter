// Components
export { default as Scrolly } from './components/Scrolly.svelte';
export { default as ScrollyContent } from './components/ScrollyContent.svelte';
export { default as MarkdownRenderer } from './components/MarkdownRenderer.svelte';
export { default as CodeBlock } from './components/CodeBlock.svelte';
export { default as SimpleToggle } from './components/bits-ui/SimpleToggle.svelte';
export { default as SimpleSelect } from './components/bits-ui/SimpleSelect.svelte';
export { default as RangeSlider } from './components/bits-ui/RangeSlider.svelte';
export { default as DashboardShell } from './components/bits-ui/DashboardShell.svelte';
export { default as ChartTooltip } from './components/bits-ui/ChartTooltip.svelte';
export { default as ThemeToggle } from './components/ThemeToggle.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
export { default as ScrollIndicator } from './components/ScrollIndicator.svelte';
export { default as CopyCodeBlock } from './components/CopyCodeBlock.svelte';
export { default as CodeExplainer } from './components/CodeExplainer.svelte';
export { default as Spinner } from './components/Spinner.svelte';
export { default as Meta } from './components/Meta.svelte';
export { default as StoryHeader } from './components/StoryHeader.svelte';
export { default as Nav } from './components/Nav.svelte';
export { default as NavMenu } from './components/NavMenu.svelte';
export { default as Footer } from './components/Footer.svelte';

// Content rendering
export { default as RenderTextContent } from './components/RenderTextContent.svelte';
export { renderCodeHtml } from './components/ScrollySnippets.svelte';

// Actions
export { scrollReveal } from './actions/scrollReveal';

// Sidebar compound components
export * as Sidebar from './components/bits-ui/sidebar/index';

// Utilities
export { useMediaQuery, useIsMobile } from './utils/media.svelte';

// Types - explicit exports for better IDE hints
export type {
  ScrollyProps,
  ScrollyContentProps,
  ContentItem,
  Author,
  StoryHeaderProps,
  MarkdownRendererProps,
  CodeBlockProps,
  CopyCodeBlockProps,
  SimpleToggleProps,
  TooltipProps,
  DashboardShellProps,
  ChartTooltipProps,
  RangeSliderProps,
  ScrollIndicatorProps,
  SpinnerProps,
  MetaProps,
  RenderTextContentProps,
  CodeStep,
  CodeExplainerData,
  CodeExplainerProps,
  NavProps,
  NavMenuProps,
  FooterProps,
} from './types';
