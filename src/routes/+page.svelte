<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { mdsvex } from 'mdsvex';
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
		data.questions = Object.keys(ret_data).map((key) => ret_data[key]);
	};
</script>

<main>
	<div id="auth-sec">
		<p>{data.userId} : {data.username}</p>
		<form method="post" action="?/logout" use:enhance>
			<input type="submit" value="Sign out" />
		</form>
		<form method="post" action="?/signin" use:enhance>
			<input type="submit" value="Sign in" />
		</form>
	</div>

	<button on:click={() => requestData()}> Request Data from GET endpoint </button>

	<ul class='event_list'>
		{#each log as event}
			<li>{event}</li>
		{/each}
	</ul>

	Server guild id
	<input bind:value={guildId} id="guild_id_input"/>
	<ul id="main_list">
		{#each data.questions as question}
			{#if question.guild_id === guildId}
				<li>
					<h3>Q: {question.question}</h3>
					<h3>A: {question.answer}</h3>
				</li>

				<form method="POST" action="?/add_answer" use:enhance>
					<label>
						your answer
						<InputBox />
						<input type="hidden" name="question" value={question.question} />
					</label>
					<button type="submit">Submit</button>
				</form>
			{/if}
		{/each}
	</ul>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: sans-serif;
	}

	input#guild_id_input {
		width: 200px; 	
		height: 20px;
		padding: 5px 10px;
		font-weight: 500;
	}

	input[name="answer"] {
		width: 200px; 	
		height: 20px;
		margin: 5px;
	}

	ul#main_list {
		list-style-type: none;
		padding: 0;
	}

	form, label {
		display: flex; 
		align-items: center;
		flex-direction: column;
	}

	button[type="submit"] {
		margin-top: 10px;
		border-radius: 7px;
		border: 1px solid #9e9e9e;
		width: 75px;
		height: 25px;

		&:hover {
			background-color: #e6e6e6;
		}
	}

	#auth-sec {
		display: flex;
		flex-direction: row;
		align-items: center;

		input[type="submit"] {
			margin-left: 10px;
			border-radius: 7px;
			border: 1px solid #9e9e9e;
			width: 75px;
			height: 25px;

			&:hover {
				background-color: #e6e6e6;
			}
		}
	}
</style>
