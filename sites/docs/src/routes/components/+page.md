---
title: Components - scrolly-kit
---

<script>
  import { base } from '$app/paths';
</script>

# Components

Reusable Svelte components for scrollytelling and data-driven stories.

## Scrolling

Core components for scroll-driven storytelling.

- [Scrolly]({base}/docs/components/Scrolly) -- Base scroll detection using IntersectionObserver
- [ScrollyContent]({base}/docs/components/ScrollyContent) -- Step boxes with content rendering

## Layout

Structural components for page layout.

- [StoryHeader]({base}/docs/components/StoryHeader) -- Story header with title, authors, date
- [Nav]({base}/docs/components/Nav) -- Responsive navigation bar
- [Footer]({base}/docs/components/Footer) -- Site footer with social links

## Content

Components for rendering text, markdown, and code.

- [MarkdownRenderer]({base}/docs/components/MarkdownRenderer) -- Renders markdown with KaTeX math support
- [RenderContent]({base}/docs/components/RenderContent) -- Renders content items by type
- [CopyCodeBlock]({base}/docs/components/CopyCodeBlock) -- Copyable code block with clipboard support
- [CodeBlock]({base}/docs/components/CodeBlock) -- Syntax-highlighted code display

## UI Controls

Interactive UI components.

- [ThemeToggle]({base}/docs/components/ThemeToggle) -- Dark/light mode toggle
- [SimpleSelect]({base}/docs/components/SimpleSelect) -- Dropdown select component
- [SimpleToggle]({base}/docs/components/SimpleToggle) -- On/off toggle switch
- [Tooltip]({base}/docs/components/Tooltip) -- Hover tooltip

## Utilities

Helper components for common patterns.

- [Meta]({base}/docs/components/Meta) -- SEO meta tags for social sharing
- [Spinner]({base}/docs/components/Spinner) -- Loading indicator
- [ScrollIndicator]({base}/docs/components/ScrollIndicator) -- Animated scroll-down arrow
