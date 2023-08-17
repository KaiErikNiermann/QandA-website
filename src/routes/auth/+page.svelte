<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
	import { redirect } from '@sveltejs/kit';

	let active = false;

	$: type = active ? 'text' : 'password';

	export let form;

</script>

<main>
	<div id="error-sec">
		{#if form?.errors}
			{#each form.errors as error}
				<p>
					{error.field}: {error.message}
				</p>
			{/each}
		{/if}
	</div>
	<form method="POST" action="?/login" use:enhance>
		<input type="text" name="username" placeholder="Username" />
		<input type="email" name="email" placeholder="Email" />
		<label for="password" class="password-label">
			<input {type} name="password" placeholder="Password" />
			<button type="button" class="visbility-btn" on:click={() => (active = !active)}>
				<Fa icon={active ? faEyeSlash : faEye} size="1.2x" color="#ccc" />
			</button>
		</label>
		<div id="button-sec">
			<button type="submit">Login</button>
			<button type="submit" formaction="?/register">Register</button>
		</div>
	</form>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: right;
	}

	input {
		margin: 0.5rem;
		padding: 0.5rem;
		width: fit-content;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}

	button {
		margin: 0.5rem;
		padding: 0.5rem;
		width: fit-content;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}

	#button-sec {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-right: 3rem;
	}

	.visbility-btn {
		border: none;
		width: 40px;
	}
</style>
