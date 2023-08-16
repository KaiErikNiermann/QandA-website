<script>
    import { enhance } from "$app/forms";

    export let form;
</script>

<form method="POST" action="?/login" use:enhance>
    <input type="text" name="username" placeholder="Username" required/>
    <!-- <input type="email" name="email" placeholder="Email" required/> -->
    <input type="password" name="password" placeholder="Password" required/>
    <input type="password" name="password2" placeholder="Repeat Password" required/>
    <button type="submit">Login</button>
    <button type="submit" formaction="?/register">Register</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input {
        margin: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
    }

    button {
        margin: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
    }
</style>