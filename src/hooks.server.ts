import { connect } from '$lib/db';
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import { client } from '$lib/db';

import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal } from '$lib/server/webSocketUtils';

import { auth } from '$lib/server/lucia';

// Connect to the database
connect()
	.then(() => {
		console.log('Connected to database');
	})
	.catch((err) => {
		console.error('Failed to connect to database', err);
	});

export const db = client.db('main_db').collection('QandA_collection');

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

// Handle WebSocket connections and auth
export const handle = (async ({ event, resolve }) => {
	startupWebsocketServer();
	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals.wss = wss;
		}
	}

	event.locals.auth = auth.handleRequest(event);

	return await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});;
}) satisfies Handle;
