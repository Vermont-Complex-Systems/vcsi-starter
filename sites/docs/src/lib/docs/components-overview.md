# Components Overview

Reusable Svelte components for scrollytelling and data-driven stories.

## Scrolling

Core components for scroll-driven storytelling.

- [Scrolly](components/Scrolly) -- Base scroll detection using IntersectionObserver
- [ScrollyContent](components/ScrollyContent) -- Step boxes with content rendering

## Layout

Structural components for page layout.

- [StoryHeader](components/StoryHeader) -- Story header with title, authors, date
- [Nav](components/Nav) -- Responsive navigation bar (renders NavMenu on mobile)
- NavMenu -- Full-screen mobile menu overlay; used by Nav, importable standalone for custom navbars
- [Footer](components/Footer) -- Site footer with social links

## Content

Components for rendering text, markdown, and code.

- [MarkdownRenderer](components/MarkdownRenderer) -- Renders markdown with KaTeX math support
- [RenderContent](components/RenderContent) -- Renders content items (markdown/html/math/code/component), single or array
- [CodeBlock](components/CodeBlock) -- Syntax-highlighted code display
- [CopyCodeBlock](components/CopyCodeBlock) -- Copyable code block with clipboard support
- [CodeExplainer](components/CodeExplainer) -- Scroll-driven code walkthrough with per-step line highlighting

## UI Controls

Interactive UI components.

- [ThemeToggle](components/ThemeToggle) -- Dark/light mode toggle
- [SimpleSelect](components/SimpleSelect) -- Dropdown select component
- [SimpleToggle](components/SimpleToggle) -- On/off toggle switch
- [Tooltip](components/Tooltip) -- Positioned chart annotation box (parent-driven, no hover behavior)
- [RangeSlider](components/RangeSlider) -- Dual-thumb range slider
- [ChartTooltip](components/ChartTooltip) -- Popover tooltip anchored to chart elements

## Dashboard

Components for interactive data explorers.

- [DashboardShell](components/DashboardShell) -- Dashboard wrapper with collapsible sidebar
- `Sidebar.*` -- Compound sidebar components (Root/Trigger/Content, bits-ui Dialog drawer on mobile); see [DashboardShell](components/DashboardShell)

## Utilities

Helper components for common patterns.

- [Spinner](components/Spinner) -- Loading indicator
- [ScrollIndicator](components/ScrollIndicator) -- Animated scroll-down arrow

## Non-component exports

Actions and helpers that aren't components — see [Utilities & actions](utilities).

- `scrollReveal` -- Svelte action that reveals elements on scroll
- `useIsMobile` / `useMediaQuery` -- reactive media-query helpers
- `renderCodeHtml` -- build highlighted code HTML for MarkdownRenderer
