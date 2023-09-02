import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export async function load({ params, parent, data }) {
	await parent();

	let { slug: slug, data: links } = data;

	return {
        slug: slug,
		links: links
	};
}
