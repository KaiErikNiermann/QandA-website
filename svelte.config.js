import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-auto";
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkToc from 'remark-toc'
import remarkMath from "remark-math";
import rehypeSlug from 'rehype-slug'
import rehypeKatexSvelte from "rehype-katex-svelte";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
  remarkPlugins: [
    remarkMath,
    remarkUnwrapImages, 
    [remarkToc, { tight: true }],
  ],
  // Render katex components inside @html blocks, aka {@html "<katex output html>"}
  rehypePlugins: [
    rehypeKatexSvelte,
    rehypeSlug    
  ],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ...mdsvexOptions.extensions],
  preprocess: [
    vitePreprocess(),
    mdsvex(mdsvexOptions),
    preprocess({
      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    })
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;