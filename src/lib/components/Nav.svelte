<script lang="ts">
  import { base } from '$app/paths';
  import Menu from "./Nav.Menu.svelte";
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

<header class="header" class:scrolled={isScrolled}>
  <div class="header-inner">
    <div class="header-left">
      <a href="{base}/" class="title-link">
        <h1 class="site-title">Site logo</h1>
      </a>
    </div>

    <div class="header-right">
      <a href="{base}/about" class="about-button">About</a>

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
  /* Header container */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* background: var(--color-bg); */
    background: rgba(140, 0, 255, 0.15);
    border-bottom: 2px solid transparent;
    z-index: 100;
    transition: border-color 200ms ease;
  }

  .header.scrolled {
    border-bottom-color: var(--color-gray-400);
  }

  /* Inner container aligns nav content with page */
  .header-inner {
    background: rgba(255, 0, 0, 0.15);
    width: 100%;
    max-width: var(--page-max-width);
    margin-inline: auto;
    padding-inline: var(--page-padding);

    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--nav-height);
  }

  .header-left,
  .header-right {
    background: rgba(0, 255, 123, 0.15);
    display: flex;
    align-items: center;
  }

  .title-link {
    text-decoration: none;
    color: inherit;
    transition: transform var(--transition-medium);
  }

  .title-link:hover {
    transform: translateY(-0.125rem);
  }

  .site-title {
    font-family: var(--sans);
    font-weight: var(--font-weight-bold);
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin: 0;
    line-height: 1.1;
    color: var(--color-fg);
  }

  .about-button {
    padding: 0.5rem 1rem;
    font-family: var(--serif);
    font-size: 1rem;
    color: var(--color-fg);
    text-decoration: none;
    background: transparent;
    border: none;
    transition: color 200ms ease;
  }

  .about-button:hover {
    color: var(--color-gray-600);
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--color-fg);
    border: none;
    cursor: pointer;
    transition: all var(--transition-medium);
  }

  .icon-button:hover {
    transform: rotate(var(--right-tilt)) scale(1.05);
    background: rgba(0, 0, 0, 0.05);
  }

  .mobile-menu-button {
    display: none;
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

  /* Mobile adjustments */
  @media (max-width: 960px) {
    .mobile-menu-button {
      display: flex;
    }
  }

  @media (max-width: 768px) {
    .header-inner {
      padding-inline: var(--page-padding);
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
  }
</style>
