<script>
    export let data;
</script>

{#each data.links as link}
    <a href="{data.slug}/asd">{link}</a>
{/each}