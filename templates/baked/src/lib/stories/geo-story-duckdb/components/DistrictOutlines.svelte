<script>
    let {
        districts,
        pathGenerator,
        interactive = false,
        hasHighlights = false,
        zoomScale = 1,
        onclick = null,
        hovered = $bindable(null),
        mouse = $bindable({ x: 0, y: 0 }),
    } = $props();
</script>

{#each districts as feature (feature.properties.id)}
    <path
        d={pathGenerator(feature)}
        fill={interactive && hovered === feature ? 'rgba(179,212,252,0.4)' : 'transparent'}
        stroke="#333"
        stroke-width={(hasHighlights ? 0.5 : 1) / zoomScale}
        style={interactive ? 'cursor: pointer;' : ''}
        pointer-events={interactive ? 'auto' : 'none'}
        role={interactive ? 'button' : undefined}
        tabindex={interactive ? 0 : undefined}
        onmouseenter={() => { if (interactive) hovered = feature; }}
        onmouseleave={() => { if (interactive) hovered = null; }}
        onmousemove={(e) => { if (interactive) mouse = { x: e.offsetX, y: e.offsetY }; }}
        onclick={() => { if (interactive) { hovered = null; onclick?.(feature); } }}
        onkeydown={(e) => { if (interactive && e.key === 'Enter') onclick?.(feature); }}
    />
{/each}

<!-- District labels (when interactive) -->
{#if interactive}
    {#each districts as feature (feature.properties.id)}
        {@const centroid = pathGenerator.centroid(feature)}
        {#if centroid && !isNaN(centroid[0])}
            <text
                x={centroid[0]} y={centroid[1]}
                text-anchor="middle"
                font-size={8 / zoomScale} fill="#333"
                stroke="white" stroke-width={2.5 / zoomScale}
                stroke-linejoin="round" paint-order="stroke"
                pointer-events="none"
            >
                {feature.properties.nom}
            </text>
        {/if}
    {/each}
{/if}
