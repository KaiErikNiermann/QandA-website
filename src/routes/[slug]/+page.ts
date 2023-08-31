import { error } from '@sveltejs/kit'
import type Module from 'module';

export async function load({ params }) {
    const post = await import("./placeholder.md");
    console.log(post);

    return {
        foo: post.default
    }
}
