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

- [Scrolly]({base}/components/Scrolly) -- Base scroll detection using IntersectionObserver
- [ScrollyContent]({base}/components/ScrollyContent) -- Step boxes with content rendering

## Layout

Structural components for page layout.

- [StoryHeader]({base}/components/StoryHeader) -- Story header with title, authors, date
- [Nav]({base}/components/Nav) -- Responsive navigation bar
- [Footer]({base}/components/Footer) -- Site footer with social links

## Content

Components for rendering text, markdown, and code.

- [MarkdownRenderer]({base}/components/MarkdownRenderer) -- Renders markdown with KaTeX math support
- [RenderContent]({base}/components/RenderContent) -- Renders content items by type
- [CopyCodeBlock]({base}/components/CopyCodeBlock) -- Copyable code block with clipboard support
- [CodeBlock]({base}/components/CodeBlock) -- Syntax-highlighted code display

## UI Controls

Interactive UI components.

- [ThemeToggle]({base}/components/ThemeToggle) -- Dark/light mode toggle
- [SimpleSelect]({base}/components/SimpleSelect) -- Dropdown select component
- [SimpleToggle]({base}/components/SimpleToggle) -- On/off toggle switch
- [Tooltip]({base}/components/Tooltip) -- Hover tooltip

## Utilities

Helper components for common patterns.

- [Meta]({base}/components/Meta) -- SEO meta tags for social sharing
- [Spinner]({base}/components/Spinner) -- Loading indicator
- [ScrollIndicator]({base}/components/ScrollIndicator) -- Animated scroll-down arrow
