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

	/**
	 * Alternative approach, might be good to use if other options are needed
	 */
	// const stuff = await mdsvex(options).markup({ content: markdown, filename: 'test.md' });

	const compiled = await compile(`${markdown}`, options);

	/**
	 * compile() still surrounds code blocks with {@html ""} so this has to be removed prior
	 * See - https://github.com/pngwn/MDsveX/issues/392
	 */
	const html = compiled?.code
		.replace(/>{@html `<code class="language-/g, '><code class="language-')
		.replace(/<\/code>`}<\/pre>/g, '</code></pre>')
		.concat(
			`<style>
				div#live-preview {
					border: 1px solid black;
					width: 500px;
					padding: 10px;
					margin: 10px;
				}
			</style>`
		);
	return json({ data: html }, { status: 201 });
};
