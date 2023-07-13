import { connect } from '$lib/db';
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import { client } from '$lib/db';

import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal } from '$lib/server/webSocketUtils';

// Connect to the database
connect()
	.then(() => {
		console.log('Connected to database');
	})
	.catch((err) => {
		console.error('Failed to connect to database', err);
	});

// Initialize WebSocket server
let wssInitialized = false;

const startupWebsocketServer = () => {
	if (wssInitialized) return;

	console.log('Initializing WebSocket server...');
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	if (wss !== undefined) {
		wss.on('connection', (ws) => {
			console.log(`WebSocket client connection established - ${ws.socketId}`);
			ws.send(`Hello from SvelteKit!`);
			
            client
				.db('main_db')
				.collection('QandA_collection')
				.watch([], { fullDocument: 'updateLookup' })
				.on('change', (change) => {
                    ws.send('invalidate')
                });

			ws.on('close', () => {
				console.log(`WebSocket client connection closed - ${ws.socketId}`);
			});
		});
		wssInitialized = true;
	}
};

// Handle WebSocket connections
export const handle = (async ({ event, resolve }) => {
	startupWebsocketServer();
	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals.wss = wss;
		}
	}
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
	return response;
}) satisfies Handle;
