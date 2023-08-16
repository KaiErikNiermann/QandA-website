<script>
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

    let active = false;
</script>

<button on:click="{() => active = !active}">
        <Fa icon={active ? faEyeSlash : faEye } size="1.2x" color="#ccc"/>
</button>

<style>
    button {
        border: none;
        border-radius: 0.5rem;
        width: 0.7rem;
    }
</style>