import { parse } from 'url';
import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';

import type { Server, WebSocket as WebSocketBase } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

// This is a symbol that is used to store the WebSocketServer instance on the global object.
export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocketBase {
	socketId: string;
}

// @ts-ignore
export type ExtendedWebSocketServer = Server<ExtendedWebSocket>;

export type ExtendedGlobal = typeof globalThis & {
	[GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => {
	console.log(`Incoming request - ${req.url}`);
	const pathname = req.url ? parse(req.url).pathname : null;
	if (pathname !== '/websocket') return;

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	wss.handleUpgrade(req, socket, head, (ws) => {
		console.log('Upgrading to WebSocket...');
		wss.emit('connection', ws, req);
	});
};

export const createWSSGlobalInstance = () => {
	// @ts-ignore
	const wss = new WebSocketServer({ noServer: true }) as ExtendedWebSocketServer;

    // store the WebSocketServer instance on the global object
	(globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

	wss.on('connection', (ws) => {
		ws.socketId = nanoid();
		console.log(`WebSocket connection established - ${ws.socketId}`);

		ws.on('close', () => {
			console.log(`WebSocket connection closed - ${ws.socketId}`);
		});
	});

    return wss;
};
