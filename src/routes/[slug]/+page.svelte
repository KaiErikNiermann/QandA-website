<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { mdsvex } from 'mdsvex';
	import { compile } from 'mdsvex';

	let active = false;
	let inputValue = '';
	let text = '';
	let compiledHTML = ''; // Store compiled HTML

	function currInput(event: KeyboardEvent) {
		inputValue = (event.target as HTMLInputElement).value;
		text = inputValue;
	}

	$: mode = active ? 'md' : 'text';

	export let form;
</script>

<span id="main-box">
	{@html form?.data?.code}
	<form method="POST" action="?/compile" id="usrform" use:enhance>
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
