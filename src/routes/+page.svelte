<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	export let data;

	let webSocketEstablished = false;
	let ws: WebSocket | null = null;
	let log: string[] = [];
	let guildId: string = '';

	const logEvent = (str: string) => {
		log = [...log, str];
	};

	const establishWebSocket = () => {
		if (webSocketEstablished) return;
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
		ws.addEventListener('open', (event) => {
			webSocketEstablished = true;
			console.log('[websocket] connection open', event);
			logEvent('[websocket] connection open');
		});
		ws.addEventListener('close', (event) => {
			console.log('[websocket] connection closed', event);
			logEvent('[websocket] connection closed');
		});
		ws.addEventListener('message', (event) => {
			console.log('[websocket] message received', event);
			logEvent(`[websocket] message received: ${event.data}`);
			if (event.data === 'invalidate') {
				console.log('invalidating');
				requestData();
			}
		});
	};

	onMount(() => {
		establishWebSocket();
	});

	const requestData = async () => {
		const res = await fetch('/api/questions');
		const ret_data = await res.json();
		// convert ret_data to iterable array
		data = { questions: Object.keys(ret_data).map((key) => ret_data[key]) };
	};
</script>

<main>
	<button on:click={() => requestData()}> Request Data from GET endpoint </button>

	<ul class='event_list'>
		{#each log as event}
			<li>{event}</li>
		{/each}
	</ul>

	<input bind:value={guildId} />
	<ul>
		{#each data.questions as question}
			{#if question.guild_id === guildId}
				<li>
					<h3>Q: {question.question}</h3>
					<h3>A: {question.answer}</h3>
				</li>

				<form method="POST" action="?/add_answer" use:enhance>
					<label>
						your answer:
						<input name="answer" />
						<input type="hidden" name="question" value={question.question} />
					</label>
					<button type="submit">Submit</button>
				</form>
			{/if}
		{/each}
	</ul>
</main>

<style>
	main {
		font-family: sans-serif;
	}
</style>
