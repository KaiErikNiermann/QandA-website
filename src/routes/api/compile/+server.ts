import { compile } from 'mdsvex';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const markdown: string = JSON.parse(await request.text())
        .replace('\\n', '\n');

    console.log(`markdown: \n${markdown}`);
	const compiled = await compile(`${markdown}`);
	const html = compiled?.code;
	return json({ data: html }, { status: 201 });
};
