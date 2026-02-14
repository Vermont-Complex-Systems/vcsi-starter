<script lang="ts">
import { base } from '$app/paths';
import Menu from "./Nav.Menu.svelte";

let { theme }: { theme?: 'light' | 'dark' } = $props();

import { ThemeToggle } from "@vcsi/scrolly-kit";
import { Menu as MenuIcon } from "@lucide/svelte";

let isMenuOpen = $state(false);
let menuButtonRef: HTMLButtonElement | undefined;
let scrollY = $state(0);
let isScrolled = $derived(scrollY > 0);

function closeMenu(skipFocus = false) {
  isMenuOpen = false;
  if (!skipFocus) menuButtonRef?.focus();
}
</script>

<svelte:window bind:scrollY />

<header
  class={[
    'header',
    isScrolled && 'scrolled',
    {
      'theme-light': theme === 'light',
      'theme-dark': theme === 'dark'
    }
  ]}
>

<div class="header-inner">
  <div class="header-left">
    <a href="{base}/" class="title-link">
       <img src="/waxSealSmall.png" alt="Verso seal" class="site-logo"/>
    </a>
  </div>

  <div class="header-right">
    <a href="{base}/about" class="about-button">About</a>
    <a href="{base}/getting-started" class="about-button">Videos & Tutorials</a>

    <ThemeToggle />

    <a href="https://github.com/Vermont-Complex-Systems/website-template" target="_blank" rel="noopener noreferrer" class="github-button" aria-label="View on GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>

    <button
      onclick={() => isMenuOpen = !isMenuOpen}
      bind:this={menuButtonRef}
      class="icon-button mobile-menu-button"
    >
      <MenuIcon size={28} />
      <span class="sr-only">Open menu</span>
    </button>
  </div>
</div>
</header>

<Menu visible={isMenuOpen} close={closeMenu} />

<style>
.header {
  position: var(--header-position, fixed);
  top: 0;
  left: 0;
  width: 100%;
  background: var(--nav-bg);
  border-bottom: 2px solid transparent;
  z-index: 100;
  transition: border-color 200ms ease;
}

.header.scrolled {
  border-bottom-color: var(--nav-border);
}

/* theme="light" - forces light theme, ignores global dark mode */
.header.theme-light {
  --nav-bg: var(--color-bg-light);
  --nav-fg: var(--color-fg-light);
  --nav-hover: var(--color-hover-light);
  --nav-border: var(--color-border-light);
}

/* theme="dark" - forces dark theme, ignores global dark mode */
.header.theme-dark {
  --nav-bg: var(--color-bg-dark);
  --nav-fg: var(--color-fg-dark);
  --nav-hover: var(--color-hover-dark);
  --nav-border: var(--color-border-dark);
}

/* Inner container aligns nav content with page */
.header-inner {
  width: 100%;
  max-width: var(--page-max-width);
  margin-inline: auto;
  padding-inline: var(--page-inline-padding);

  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--nav-height);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.header-left {
  margin-left: -0.5rem; /* compensate for logo whitespace */
  margin-top: 0.1rem; /* compensate for logo whitespace */
}


.title-link {
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-medium);
}

.title-link:hover {
  transform: translateY(-0.125rem);
}

.site-logo {
  height: 5rem;
  width: auto;
  display: block;
  object-fit: contain;
  object-position: center;
}

.about-button {
  padding: 0.5rem 0.75rem;
  font-family: var(--sans);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--nav-fg);
  text-decoration: none;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  transition: all var(--transition-medium);
}

.about-button:hover {
  background: var(--nav-hover);
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--nav-fg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-medium);
}

.icon-button:hover {
  transform: rotate(var(--right-tilt)) scale(1.05);
  background: var(--nav-hover);
}

.mobile-menu-button {
  display: none;
}

.github-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--nav-fg);
  transition: all var(--transition-medium);
}

.github-button:hover {
  transform: scale(1.1);
  background: var(--nav-hover);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: flex;
  }

  .header-inner {
    padding-inline: var(--page-inline-padding);
    min-height: 0;
  }

  .header-left {
    gap: 0;
  }

  .about-button {
    display: none;
  }

  .icon-button {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .site-logo {
    width: 3.5rem;
    height: 3.5rem;
  }

  .header-left {
    margin-top: 0.25rem; /* smaller compensation... */
  }
}
</style>
