import { error } from '@sveltejs/kit';
import { db } from '../../hooks.server.js';
import { writeFile } from 'fs';

export async function load({ params: params }) {
	const guild_id = params.slug;

	const questions = await db
		.find(
			{
				guild_id: guild_id
			},
			{
				limit: 100,
				projection: {
					_id: 0
				}
			}
		)
		.toArray();

	const links = questions.map((question) => {
		return question.message_id;
	});

	return {
		slug: params.slug,
		data: links
	};
}
