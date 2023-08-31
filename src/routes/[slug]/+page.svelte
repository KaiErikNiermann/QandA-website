<script lang="ts">
	import { onMount } from 'svelte';

	let active = false;
	let inputValue = '';
	let compiledHTML = '';

	function currInput(event: KeyboardEvent) {
		inputValue = (event.target as HTMLDivElement)?.innerText; // Use innerText to get the text content of the contenteditable div
		const textarea = document.getElementById('hidden') as HTMLTextAreaElement;
		textarea.value = inputValue; // Update the textarea content
		console.log(inputValue);
		const form = document.getElementById('usrform') as HTMLFormElement;
		form.requestSubmit(); // Submit the form
	}

	onMount(() => {
		const form = document.getElementById('usrform') as HTMLFormElement;
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			console.log(`Submitting \n${inputValue}`);
			try {
				const res = await fetch('/api/compile', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(inputValue) // Send text as an object property
				});
				const data = await res.json();
				compiledHTML = data.data;
			} catch (error) {
				console.error('Error:', error);
			}
		});
	});

	export let data;
	$: mode = active ? 'md' : 'text';
</script>

<main id="main-box">
	<div id="content-container">
		<div id="input-group">
			<form method="POST" action="/compile" id="usrform">
				<button type="submit" id="md-visibility" on:click={() => (active = !active)}>
					Toggle live preview
				</button>
				<div
					role="textbox"
					id="submit-sec"
					tabindex="0"
					contenteditable="true"
					on:keyup={currInput}
				/>
				<textarea id="hidden" name="markdown" cols="50" rows="10" />
			</form>
			<div id="live-preview">
				{#if active}
					{@html compiledHTML}
				{:else}
					{@html '<p>Live preview is disabled</p>'}
				{/if}
			</div>
		</div>
		<div id="comment-group">
			<svelte:component this={data.foo} />
		</div>
	</div>
</main>

<style lang="scss">
	#main-box {
		font-size: small;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
		@include debug_border;

		#content-container {
			display: grid;
			justify-content: space-evenly;
			grid-template-columns: 1fr 1fr; 
			width: 100%; 
		}

		#input-group {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 50vw;
			height: fit-content;
		}

		#comment-group {
			@include debug_border;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 10px;
			margin: 10px;
		}

		form {
			display: flex;
			flex-direction: column;
			justify-content: center;

			button {
				@include debug_border;
				width: fit-content;
				height: 25px;
				margin: 10px;
				margin-bottom: 0px;

				&:hover {
					background-color: #e6e6e6;
				}
			}

			div[contenteditable='true'] {
				@include debug_border;
				width: 500px;
				height: 150px;
				padding: 10px;
				margin: 10px;
				overflow-y: scroll;
			}

			textarea {
				display: none;
			}
		}

		div#live-preview {
			@include debug_border;
			width: 500px;
			padding: 10px;
			margin: 10px;
		}
	}
</style>
