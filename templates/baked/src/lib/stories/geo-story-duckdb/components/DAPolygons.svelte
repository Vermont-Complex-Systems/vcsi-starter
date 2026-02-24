<script>
    let {
        features,
        colors,
        pathGenerator,
        selectedIds = new Set(),
        highlightDistricts = [],
        enableHover = false,
        hoverableIds = null,
        zoomScale = 1,
        onclick = null,
        hovered = $bindable(null),
        mouse = $bindable({ x: 0, y: 0 }),
    } = $props();

    let hasHighlights = $derived(highlightDistricts.length > 0);
    let s = $derived(1 / zoomScale);
</script>

{#each features as feature (feature.properties.geo_uid)}
    {@const baseFill = colors?.get(feature.properties.geo_uid) ?? '#e0e0e0'}
    {@const isSelected = selectedIds.has(feature.properties.geo_uid)}
    {@const isHovered = hovered?.properties.geo_uid === feature.properties.geo_uid}
    {@const canHover = enableHover && (!hoverableIds || hoverableIds.has(feature.properties.geo_uid))}
    <path
        d={pathGenerator(feature)}
        fill={isSelected ? '#d62728' : isHovered ? '#ffd700' : baseFill}
        fill-opacity={isSelected ? 0.8 : 1}
        stroke={isSelected ? '#d62728' : isHovered ? '#333' : '#666'}
        stroke-width={(isSelected ? 2 : isHovered ? 1.5 : hasHighlights ? 0.3 : 0.15) * s}
        style="transition: fill 0.3s ease; {canHover || onclick ? 'cursor: pointer;' : ''}"
        onmouseenter={() => { if (canHover) hovered = feature; }}
        onmouseleave={() => { if (canHover) hovered = null; }}
        onmousemove={(e) => { if (canHover) mouse = { x: e.offsetX, y: e.offsetY }; }}
        onclick={() => { if (onclick) onclick(feature); }}
    />
{/each}

<!-- Highlight district outlines (red) -->
{#if hasHighlights}
    {#each highlightDistricts as feature (feature.properties.id)}
        <path
            d={pathGenerator(feature)}
            fill="none"
            stroke="#d62728"
            stroke-width={2.5 * s}
            pointer-events="none"
        />
    {/each}
{/if}
