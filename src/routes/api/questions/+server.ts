import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '$lib/db';

export const GET = (async ({ locals }) => {
    const data = await client.db("main_db").collection("QandA_collection").find(
        {},
        {
            limit: 1000,
            projection: {
                _id: 0,
            },
        }
    ).toArray();

    if (locals.wss) {
		locals.wss.clients.forEach((connected_client: WebSocket) => {
			if (connected_client.readyState === 1) {
				connected_client.send(`Hello from the GET handler at ${new Date().toLocaleString()}`);
			}
		});
	}
    
	return json(data);
}) satisfies RequestHandler;
