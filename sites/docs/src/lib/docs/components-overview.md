# Components Overview

Reusable Svelte components for scrollytelling and data-driven stories.

## Scrolling

Core components for scroll-driven storytelling.

- [Scrolly](components/Scrolly) -- Base scroll detection using IntersectionObserver
- [ScrollyContent](components/ScrollyContent) -- Step boxes with content rendering

## Layout

Structural components for page layout.

- [StoryHeader](components/StoryHeader) -- Story header with title, authors, date
- [Nav](components/Nav) -- Responsive navigation bar
- [Footer](components/Footer) -- Site footer with social links

## Content

Components for rendering text, markdown, and code.

- [MarkdownRenderer](components/MarkdownRenderer) -- Renders markdown with KaTeX math support
- [RenderContent](components/RenderContent) -- Renders content items by type
- [CopyCodeBlock](components/CopyCodeBlock) -- Copyable code block with clipboard support
- [CodeBlock](components/CodeBlock) -- Syntax-highlighted code display

## UI Controls

Interactive UI components.

- [ThemeToggle](components/ThemeToggle) -- Dark/light mode toggle
- [SimpleSelect](components/SimpleSelect) -- Dropdown select component
- [SimpleToggle](components/SimpleToggle) -- On/off toggle switch
- [Tooltip](components/Tooltip) -- Hover tooltip
- [RangeSlider](components/RangeSlider) -- Dual-thumb range slider
- [ChartTooltip](components/ChartTooltip) -- Popover tooltip anchored to chart elements

## Dashboard

Components for interactive data explorers.

- [DashboardShell](components/DashboardShell) -- Dashboard wrapper with collapsible sidebar

## Utilities

Helper components for common patterns.

- [Meta](components/Meta) -- SEO meta tags for social sharing
- [Spinner](components/Spinner) -- Loading indicator
- [ScrollIndicator](components/ScrollIndicator) -- Animated scroll-down arrow
