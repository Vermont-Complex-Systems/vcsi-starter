<script>
    import BreakdownChart from './BreakdownChart.svelte';

    let { features, metric, onclear } = $props();

    let totalPop = $derived(features.reduce((s, f) => s + (f.properties.population ?? 0), 0));
</script>

<div class="da-info">
    <div class="da-info-header">
        <strong>{features.length} DA{features.length > 1 ? 's' : ''}</strong>
        &middot; Pop: {totalPop.toLocaleString()}
        <button class="clear-btn" onclick={onclear}>✕</button>
    </div>
    <BreakdownChart {features} {metric} />
</div>

<style>
    .da-info {
        position: absolute;
        top: 10px;
        right: 20px;
        max-width: 320px;
        font-size: 0.8rem;
        color: #333;
        padding: 0.5rem 0.75rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        z-index: 10;
    }

    .da-info-header {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .clear-btn {
        margin-left: auto;
        font-size: 0.7rem;
        padding: 0.1rem 0.3rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: white;
        cursor: pointer;
        color: #666;
    }
    .clear-btn:hover { background: #eee; }
</style>
