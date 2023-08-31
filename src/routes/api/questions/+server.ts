import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '$lib/db';
import { db } from '../../../hooks.server';

export const POST = (async ({ request }) => {
	const data = JSON.parse(await request.text());
	const server_questions = db.find({
		guild_id: data.guild_id
	}, {
		limit: 100, 
		projection: {
			_id: 0
		}
	}).toArray();

	return json(server_questions);
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
	const data = await db.find(
			{},
			{
				limit: 1000,
				projection: {
					_id: 0
				}
			}
		)
		.toArray();

	if (locals.wss) {
		locals.wss.clients.forEach((connected_client: WebSocket) => {
			if (connected_client.readyState === 1) {
				connected_client.send(`Hello from the GET handler at ${new Date().toLocaleString()}`);
			}
		});
	}

	return json(data);
}) satisfies RequestHandler;
