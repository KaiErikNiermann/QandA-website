<script lang="ts">
	import { onMount } from 'svelte';

	let webSocketEstablished = false;
	let ws: WebSocket | null = null;

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
				get_links();
			}
		});
	}

	async function get_links() {
		const res = await fetch('/api/questions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data.slug)
		});

		const ret_data = await res.json();
		const ret_obj = Object.keys(ret_data).map((key) => ret_data[key]);
		data.links = ret_obj.map((obj) => obj.message_id);
	}

	onMount(() => {
		enable_ws();
	});

	export let data;
</script>

{#each data.links as link}
	<a href="{data.slug}/{link}">{link}</a>
	<br />
{/each}
