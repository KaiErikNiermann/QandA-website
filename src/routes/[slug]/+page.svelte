<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { mdsvex } from 'mdsvex';
	import { compile } from 'mdsvex';
	import { onMount } from 'svelte';

	let active = false;
	let inputValue = '';
	let text = '';
	let compiledHTML = '';

	function currInput(event: KeyboardEvent) {
		inputValue = (event.target as HTMLInputElement).value;
		text = inputValue;
		console.log(text);
		let form = document.getElementById('usrform') as HTMLFormElement;
		form.requestSubmit(
			document.getElementById('md-visibility') as HTMLButtonElement
		);
	}

	onMount(() => {
		let form = document.getElementById('usrform') as HTMLFormElement;
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			console.log(`Submitting \n${text}`);

			// POST to /compile
			const res = fetch('/api/compile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(text)
			}).then((res) => {
				return res.json();
			}).then((data) => {
				compiledHTML = data.data;
			});
		});
	})

	$: mode = active ? 'md' : 'text';
</script>

<span id="main-box">
	<form method="POST" action="/compile" id="usrform">
		<button type="submit" id="md-visibility" on:click={() => (active = !active)}>
			Toggle live preview
		</button>
		<textarea name="markdown" cols="50" rows="10" on:keyup={currInput}></textarea>
		{#if active}
			<div id="live-preview">
				{@html compiledHTML}
			</div>	
		{:else}
			<div id="live-preview">
				<p>Live preview is disabled</p>
			</div>
		{/if}
	</form>
</span>

<style lang="scss">
	#main-box {
		form {
			display: flex;
			flex-direction: column;
			align-items: center;

			button {
				border-radius: 7px;
				border: 1px solid #9e9e9e;
				width: fit-content;
				height: 25px;

				&:hover {
					background-color: #e6e6e6;
				}
			}

			textarea {
				margin-top: 10px;
				border-radius: 7px;
				border: 1px solid #9e9e9e;
			}

			div#live-preview {
				width: 350px;
				
			}
		}
	}
</style>
