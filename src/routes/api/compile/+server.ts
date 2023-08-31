import { compile, type MdsvexCompileOptions } from 'mdsvex';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const options: MdsvexCompileOptions = {
		extensions: ['.svelte.md', '.md', '.svx'],
		smartypants: {
			dashes: 'oldschool'
		},
		remarkPlugins: [],
		rehypePlugins: [],
		layout: {}
	};

	const markdown: string = JSON.parse(await request.text()).replace('\\n', '\n');

	console.log(`markdown: \n${markdown}`);
	const compiled = await compile(`${markdown}`, options);

    /**
     * Compile surrounds code blocks with {@html ""} so this has to be removed prior
     * See - https://github.com/pngwn/MDsveX/issues/392
     */
	const html = compiled?.code
		.replace(/>{@html `<code class="language-/g, '><code class="language-')
		.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	return json({ data: html }, { status: 201 });
};
