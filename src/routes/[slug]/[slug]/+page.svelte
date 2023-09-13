<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements.js';
	import * as querystring from 'querystring';

	// change type of contenteditable to string 
	type ContentEditable = HTMLAttributes<HTMLDivElement> & {
		contenteditable?: string | 'inherit' | undefined | null;
	};

	let active = false;
	let inputValue = '';
	let compiledHTML = '';
	let webSocketEstablished = false;
	let ws: WebSocket | null = null;

	function currInput(event: KeyboardEvent) {
		inputValue = (event.target as HTMLDivElement)?.innerText; // Use innerText to get the text content of the contenteditable div
		const textarea = document.getElementById('hidden') as HTMLTextAreaElement;
		textarea.value = inputValue; // Update the textarea content
		console.log(inputValue);
		const form = document.getElementById('usrform') as HTMLFormElement;
		form.requestSubmit(); // Submit the form
	}

	function enable_ws() {
		if (webSocketEstablished) {
			console.log('websocket already established');
			return;
		}
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);

		ws.addEventListener('message', (event) => {
			console.log('[websocket] message received', event);
			if (event.data === 'invalidate') {
				console.log('invalidating');
				get_question();
			}
		});
	}

	async function get_question() {
		
	}

	onMount(() => {
		enable_ws();
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
	console.log(data.data);
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
					contenteditable='plaintext-only'
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
			<svelte:component this={data.data} />
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

			div#submit-sec {
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

		@media screen and (max-width: 1070px) {
			#content-container {
				grid-template-columns: 1fr;
			}

			#input-group {
				width: 100%;
			}

			@media screen and (max-width: 600px) {
				#content-container {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				#usrform {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					margin: 0;
					border: 0;
					padding: 0; 
				}

				#submit-sec {
					width: 100% !important;
				}

				#live-preview {
					margin: 0 !important;
					padding: 0 !important;
					border: 0 !important;
					width: 100% !important;
				}

				#input-group {
					width: 100%;
				}

				#comment-group {
					width: 100%;
				}
			}
		}
	}
</style>
