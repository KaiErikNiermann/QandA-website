<script>
    export let data;
</script>

{#each data.links as link}
    <a href="{data.slug}/{link}">{link}</a>
{/each}