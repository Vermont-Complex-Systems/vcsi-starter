<script>
    import Meta from "$lib/components/Meta.svelte";
    import Spinner from "$lib/components/helpers/Spinner.svelte";
    import About from "$lib/components/About.svelte";

    import { getMembers } from '$lib/data.remote'

     const preloadFont = [
        "/assets/fonts/tiempos/TiemposTextWeb-Regular.woff2",
        "/assets/fonts/tiempos/TiemposTextWeb-Bold.woff2",
        "/assets/fonts/atlas/AtlasGrotesk-Regular-Web.woff2",
        "/assets/fonts/atlas/AtlasGrotesk-Bold-Web.woff2",
        "/assets/fonts/atlas/AtlasTypewriter-Medium-Web.woff2"
    ];
</script>


<Meta
  title="About"
  description="Description of the group."
  {preloadFont}
/>

<div class="page">
    <div class="page-header no-logo">
        <div class="page-header-text">
            <h1>Who We Are</h1>
        </div>
    </div>

    {#await getMembers()}
        <Spinner text="Loading members..." />
    {:then members}
        <About {members} />
    {:catch error}
        <div>
            <p>Error loading members: {error.message}</p>
        </div>
    {/await}
</div>

<style>
    h1 {
        margin-bottom: 3rem;
    }
</style>
