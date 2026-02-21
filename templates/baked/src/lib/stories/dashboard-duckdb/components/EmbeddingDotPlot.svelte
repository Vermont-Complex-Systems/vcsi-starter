<script>
    let {
        data,
        xScale,
        yScale,
        colorScale,
        width,
        height,
        hoveredId = $bindable(),
        hoveredElement = $bindable(null),
        isMobile = false,
        ondotclick = () => {}
    } = $props();

    let canvas;
    let anchorDiv;
    const RADIUS = 4;
    const HIT_RADIUS = 8;
    const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Resize canvas only when dimensions change (expensive — resets context)
    let prevW = 0;
    let prevH = 0;

    $effect(() => {
        if (!canvas) return;
        const w = width * DPR;
        const h = height * DPR;
        if (prevW !== w || prevH !== h) {
            canvas.width = w;
            canvas.height = h;
            prevW = w;
            prevH = h;
        }
    });

    // Draw dots — runs when data, scales, or hover changes (cheap — just clearRect + redraw)
    $effect(() => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, width, height);

        for (const d of data) {
            const cx = xScale(d.umap_1);
            const cy = yScale(d.umap_2);
            ctx.beginPath();
            ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
            ctx.globalAlpha = d.id === hoveredId ? 1 : 0.6;
            ctx.fillStyle = colorScale(d.college);
            ctx.fill();
            if (d.id === hoveredId) {
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 0.5;
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    });

    function findNearest(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let closest = null;
        let minDist = HIT_RADIUS * HIT_RADIUS;

        for (const d of data) {
            const cx = xScale(d.umap_1);
            const cy = yScale(d.umap_2);
            const dx = mx - cx;
            const dy = my - cy;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                closest = d;
            }
        }
        return closest;
    }

    function onMouseMove(e) {
        if (isMobile) return;
        const hit = findNearest(e);
        if (hit) {
            hoveredId = hit.id;
            // Position the invisible anchor div at the dot's screen position
            const rect = canvas.getBoundingClientRect();
            const cx = xScale(hit.umap_1);
            const cy = yScale(hit.umap_2);
            anchorDiv.style.left = `${cx}px`;
            anchorDiv.style.top = `${cy}px`;
            hoveredElement = anchorDiv;
        } else {
            hoveredId = null;
            hoveredElement = null;
        }
    }

    function onMouseLeave() {
        if (!isMobile) {
            hoveredId = null;
            hoveredElement = null;
        }
    }

    function onClick(e) {
        const hit = findNearest(e);
        if (hit) {
            hoveredId = hit.id;
            const cx = xScale(hit.umap_1);
            const cy = yScale(hit.umap_2);
            anchorDiv.style.left = `${cx}px`;
            anchorDiv.style.top = `${cy}px`;
            hoveredElement = anchorDiv;
            ondotclick(hit.id);
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<canvas
    bind:this={canvas}
    style="width: {width}px; height: {height}px; cursor: pointer;"
    onmousemove={onMouseMove}
    onmouseleave={onMouseLeave}
    onclick={onClick}
></canvas>
<!-- Invisible anchor for tooltip positioning -->
<div bind:this={anchorDiv} class="tooltip-anchor"></div>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
    .tooltip-anchor {
        position: absolute;
        width: 1px;
        height: 1px;
        pointer-events: none;
    }
</style>
