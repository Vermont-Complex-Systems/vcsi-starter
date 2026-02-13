<script>
    let { isMobile, sidebarOpen, sidebarCollapsed, toggleSidebar } = $props();
</script>

<!-- Toggle button outside sidebar so it's not affected by sidebar transform -->
    <button
        class="sidebar-toggle"
        onclick={toggleSidebar}
        aria-label={sidebarOpen || !sidebarCollapsed ? 'Close menu' : 'Open menu'}
    >
        {#if isMobile}
            {#if sidebarOpen}
                <!-- X icon when open on mobile -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            {:else}
                <!-- Hamburger icon when closed on mobile -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            {/if}
        {:else}
            <!-- Chevron for desktop -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        {/if}
</button>