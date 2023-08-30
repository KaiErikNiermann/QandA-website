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

{@html compiledHTML}
<span id="main-box">
	<form method="POST" action="/compile" id="usrform">
		<textarea name="markdown" cols="50" rows="10" on:keyup={currInput}></textarea>
		<button type="submit" id="md-visibility" on:click={() => (active = !active)}>
			Toggle md
		</button>
	</form>
</span>

<style lang="scss">
	#main-box {
		display: flex;
		flex-direction: column;

		button {
			border-radius: 7px;
			border: 1px solid #9e9e9e;
			width: 100px;
			height: 25px;

			&:hover {
				background-color: #e6e6e6;
			}
		}

		#input-sec {
			width: 400px;
		}

		textarea {
			margin-top: 10px;
			border-radius: 7px;
			border: 1px solid #9e9e9e;
		}
	}
</style>
